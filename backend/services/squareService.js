const crypto = require('crypto');

// ---------------------------------------------------------------
// Square REST API helper (bina SDK ke — direct fetch)
// Card data kabhi hamare server pe nahi aata. Customer Square ke
// hosted checkout page pe pay karta hai. PCI-safe.
// ---------------------------------------------------------------

// sandbox testing ke liye SQUARE_ENV=sandbox, live ke liye 'production'
const BASE_URL = (process.env.SQUARE_ENV || 'production') === 'sandbox'
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';

const SQUARE_VERSION = '2025-01-23';

// Square ko phone E.164 format chahiye (+1XXXXXXXXXX). Invalid ho to null.
const toE164 = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
};

// Deposit link banata hai fixed dollar amount ka aur uska URL wapas deta hai.
// Return: { paymentLinkId, url, orderId }
const createDepositPaymentLink = async ({ booking, amount }) => {
  const cents = Math.round(Number(amount) * 100);
  if (!cents || cents <= 0) throw new Error('Invalid deposit amount');

  const phoneE164 = toE164(booking.phone);

  const body = {
    idempotency_key: `dep-${booking._id}-${Date.now()}`,
    quick_pay: {
      name: `Deposit - ${booking.service}`,
      price_money: { amount: cents, currency: 'USD' },
      location_id: process.env.SQUARE_LOCATION_ID
    },
    checkout_options: {
      ask_for_shipping_address: false,
      // payment ke baad customer ko yahan bheja jaayega (optional)
      redirect_url: process.env.SQUARE_REDIRECT_URL || undefined
    },
    pre_populated_data: {
      buyer_email: booking.email || undefined,
      buyer_phone_number: phoneE164 || undefined
    },
    payment_note: `Deposit for booking ${booking._id} - ${booking.customerName}`
  };

  const res = await fetch(`${BASE_URL}/v2/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Square-Version': SQUARE_VERSION,
      'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    const detail = data?.errors?.[0]?.detail || JSON.stringify(data);
    throw new Error(`Square payment link failed: ${detail}`);
  }

  const link = data.payment_link;
  return {
    paymentLinkId: link.id,
    url: link.url,
    orderId: link.order_id
  };
};

// Webhook signature verify karta hai (spoof requests rok ne ke liye).
// Square: base64( HMAC-SHA256( signatureKey, notificationUrl + rawBody ) )
const verifyWebhookSignature = ({ rawBody, signature, notificationUrl }) => {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key || !signature) return false;

  const hmac = crypto.createHmac('sha256', key);
  hmac.update(notificationUrl + rawBody);
  const expected = hmac.digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
};

module.exports = { createDepositPaymentLink, verifyWebhookSignature };
