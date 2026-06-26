# PerfectTouch Auto Detailing — Full Stack MERN App

Professional mobile auto detailing website for Sullivan County, NY.

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite + TailwindCSS + React Router
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Auth:** JWT
- **Images/Video:** Cloudinary
- **Email:** Nodemailer (Gmail SMTP)
- **Charts:** Recharts
- **Deployment:** Vercel (frontend) + Railway/Render (backend)

---

## 📁 Folder Structure

```
perfecttouch/
├── backend/
│   ├── config/         # Cloudinary config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Public + Admin pages
│   │   └── utils/      # API utility
│   └── vercel.json     # SPA routing for Vercel
└── package.json        # Root scripts
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install

```bash
cd perfecttouch
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Backend `.env` Setup

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=perfecttouch.autodetailing29@gmail.com
EMAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
```

### 3. Frontend `.env` Setup

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Locally

```bash
# From root directory
cd backend && npm run dev    # Backend on :5000
cd frontend && npm run dev   # Frontend on :5173
```

Or both at once from root:
```bash
npm install concurrently  # one-time
npm run dev
```

### 5. Create Admin Account

Visit: `http://localhost:5000/api/auth/seed`

Default credentials:
- Email: `admin@perfecttouch.com`
- Password: `PerfectTouch@2024`

**Change these after first login!**

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push `frontend/` folder to GitHub
2. Import to Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
4. Deploy

### Backend (Railway or Render)

1. Push `backend/` folder to GitHub
2. Connect to Railway or Render
3. Set all `.env` variables in dashboard
4. Deploy

---

## 🔑 Admin Panel

Access at: `yoursite.com/admin`

Features:
- **Dashboard** — Stats, revenue charts, recent bookings
- **Bookings** — View, filter, update status, generate invoices
- **Invoices** — View, update status, email to customers
- **Calendar** — Visual calendar of all bookings
- **Gallery** — Upload photos, before/after sliders, videos
- **Services** — Edit prices, descriptions, features

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on Gmail
2. Go to Security → App Passwords
3. Generate password for "Mail"
4. Use that as `EMAIL_PASS` in `.env`

---

## ☁️ Cloudinary Setup

1. Create free account at cloudinary.com
2. Get Cloud Name, API Key, API Secret from Dashboard
3. Add to `.env`

---

## 📞 Contact

- **Phone:** 845-866-2430
- **Email:** perfecttouch.autodetailing29@gmail.com
- **Facebook:** https://www.facebook.com/share/1981d6bG45/
