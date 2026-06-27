import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

const STATUSES = ['Pending','Confirmed','In Progress','Completed','Cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    api.get(`/bookings${params}`).then(r => setBookings(r.data.bookings||[])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchBookings();
      if (selected?._id === id) setSelected(s => ({ ...s, status }));
    } catch { toast.error('Failed to update'); }
  };

  const generateInvoice = async (bookingId) => {
    try {
      await api.post(`/invoices/generate/${bookingId}`);
      toast.success('Invoice generated!');
      fetchBookings();
    } catch (err) { toast.error(err.response?.data?.message||'Failed to generate invoice'); }
  };

  const deleteBooking = async (id) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking deleted');
      setSelected(null);
      fetchBookings();
    } catch { toast.error('Failed to delete'); }
  };

  const selectCls = "text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-blue";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-white">Bookings</h1>
        <div className="flex gap-2 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === s ? 'bg-brand-blue text-white' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-gray-600">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Customer','Service','Date & Time','Price','Status','Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {bookings.map(b => (
                  <tr key={b._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{b.customerName}</div>
                      <div className="text-xs text-gray-500">{b.email}</div>
                      <div className="text-xs text-gray-500">{b.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{b.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      <div className="text-white">{new Date(b.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{b.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-blue">${b.finalPrice}</div>
                      {b.discountApplied && <div className="text-xs text-green-500">15% discount</div>}
                    </td>
                    <td className="px-6 py-4">
                      <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)} className={selectCls}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(b)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Icons.Eye /></button>
                        {!b.invoiceGenerated && (
                          <button onClick={() => generateInvoice(b._id)} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg"><Icons.Invoice /></button>
                        )}
                        <button onClick={() => deleteBooking(b._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Icons.Trash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-white">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><Icons.Close /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[['Customer',selected.customerName],['Email',selected.email],['Phone',selected.phone],['Service',selected.service],['Vehicle',`${selected.vehicleYear||''} ${selected.vehicleMake||''} ${selected.vehicleModel||''} ${selected.vehicleType}`.trim()],['Date',new Date(selected.date).toLocaleDateString()],['Time',selected.timeSlot],['Address',selected.address],['Base Price',`$${selected.price}`],['Discount',selected.discountApplied?'Yes - 15% First Time':'None'],['Final Price',`$${selected.finalPrice}`],['Invoice Generated',selected.invoiceGenerated?'Yes':'No'],selected.notes?['Notes',selected.notes]:null].filter(Boolean).map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-white">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              {!selected.invoiceGenerated && (
                <button onClick={() => { generateInvoice(selected._id); setSelected(null); }}
                  className="btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2">
                  <Icons.Invoice /> Generate Invoice
                </button>
              )}
              <button onClick={() => setSelected(null)} className="btn-outline flex-1 text-sm py-2.5">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}