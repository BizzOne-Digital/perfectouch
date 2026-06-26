import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

const PIE_COLORS = ['#3b82f6','#6366f1','#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/dashboard/stats').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { label:'Total Bookings', value:stats?.totalBookings||0, sub:`${stats?.monthlyBookings||0} this month`, icon:Icons.Booking, color:'blue' },
    { label:'Pending', value:stats?.pendingBookings||0, sub:'Need attention', icon:Icons.Clock, color:'yellow' },
    { label:'Total Revenue', value:`$${(stats?.totalRevenue||0).toFixed(2)}`, sub:`$${(stats?.monthlyRevenue||0).toFixed(2)} this month`, icon:Icons.Dollar, color:'green' },
    { label:'Invoices Due', value:stats?.pendingInvoices||0, sub:`${stats?.paidInvoices||0} paid`, icon:Icons.Invoice, color:'purple' }
  ];

  const colorMap = { blue:'bg-blue-500/20 text-blue-400', yellow:'bg-yellow-500/20 text-yellow-400', green:'bg-green-500/20 text-green-400', purple:'bg-purple-500/20 text-purple-400' };

  const chartData = (stats?.monthlyTrend||[]).map(d => ({ name:`${d._id.month}/${d._id.year.toString().slice(2)}`, Bookings:d.count, Revenue:d.revenue }));
  const pieData = (stats?.serviceBreakdown||[]).map(s => ({ name:s._id, value:s.count }));

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map(p => <p key={p.name} style={{color:p.color}} className="font-bold">{p.name}: {p.value}</p>)}
      </div>
    );
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, Joshua. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon:Icon, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[color]}`}><Icon /></div>
            <div className="font-display text-3xl font-bold text-white">{value}</div>
            <div className="text-gray-400 text-sm font-medium mt-1">{label}</div>
            <div className="text-gray-600 text-xs mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="font-display text-lg font-bold text-white mb-4">Monthly Performance</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fontSize:12, fill:'#6b7280' }} />
                <YAxis tick={{ fontSize:12, fill:'#6b7280' }} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="Bookings" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-gray-600">No data yet</div>}
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="font-display text-lg font-bold text-white mb-4">Services Breakdown</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d,i) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{background:PIE_COLORS[i%PIE_COLORS.length]}} />
                      <span className="text-gray-400">{d.name}</span>
                    </div>
                    <span className="font-medium text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="h-40 flex items-center justify-center text-gray-600">No bookings yet</div>}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="font-display text-lg font-bold text-white">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-brand-blue text-sm font-medium hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-800">
          {(stats?.recentBookings||[]).length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-600">No bookings yet</div>
          ) : (stats?.recentBookings||[]).map(b => (
            <div key={b._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
              <div>
                <div className="font-medium text-white">{b.customerName}</div>
                <div className="text-sm text-gray-500">{b.service} · {new Date(b.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-brand-blue">${b.finalPrice}</span>
                <span className={`badge-status-${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
