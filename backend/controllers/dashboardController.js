const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBookings, pendingBookings, confirmedBookings, completedBookings,
      monthlyBookings, totalRevenue, monthlyRevenue,
      pendingInvoices, paidInvoices, recentBookings
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Confirmed' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$finalPrice' } } }]),
      Booking.aggregate([{ $match: { status: 'Completed', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$finalPrice' } } }]),
      Invoice.countDocuments({ status: { $in: ['Sent', 'Draft'] } }),
      Invoice.countDocuments({ status: 'Paid' }),
      Booking.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Bookings by service
    const serviceBreakdown = await Booking.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$finalPrice' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totalBookings, pendingBookings, confirmedBookings, completedBookings,
      monthlyBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      pendingInvoices, paidInvoices,
      recentBookings, serviceBreakdown, monthlyTrend
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
