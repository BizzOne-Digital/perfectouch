import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

const STATUSES = ['Draft', 'Sent', 'Paid', 'Overdue'];

const statusBadge = (status) => {
  const map = { Draft:'bg-gray-700 text-gray-300', Sent:'bg-blue-500/20 text-blue-400', Paid:'bg-green-500/20 text-green-400', Overdue:'bg-red-500/20 text-red-400' };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-current/20 ${map[status]||'bg-gray-700 text-gray-300'}`}>{status}</span>;
};

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [sending, setSending] = useState(null);

  const fetchInvoices = () => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    api.get(`/invoices${params}`).then(r => setInvoices(r.data.invoices||[])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, [filter]);

  const updateStatus = async (id, status) => {
    try { await api.put(`/invoices/${id}/status`, { status }); toast.success('Status updated'); fetchInvoices(); }
    catch { toast.error('Failed to update'); }
  };

  const sendInvoice = async (id) => {
    setSending(id);
    try { await api.post(`/invoices/${id}/send`); toast.success('Invoice sent to customer!'); fetchInvoices(); }
    catch { toast.error('Failed to send invoice'); }
    finally { setSending(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-white">Invoices</h1>
        <div className="flex gap-2 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter===s?'bg-brand-blue text-white':'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center text-gray-600">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-600"><Icons.Invoice /></div>
            <p>No invoices found. Generate them from Bookings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  {['Invoice #','Customer','Service','Amount','Due Date','Status','Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {invoices.map(inv => (
                  <tr key={inv._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-blue">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{inv.customerName}</div>
                      <div className="text-xs text-gray-500">{inv.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{inv.service}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">${inv.totalAmount}</div>
                      {inv.discount > 0 && <div className="text-xs text-green-500">-${inv.discount} discount</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4">
                      <select value={inv.status} onChange={e => updateStatus(inv._id, e.target.value)}
                        className="text-xs bg-gray-800 border border-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-blue">
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(inv)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg"><Icons.Eye /></button>
                        <button onClick={() => sendInvoice(inv._id)} disabled={sending===inv._id} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg disabled:opacity-50"><Icons.Send /></button>
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
          <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-blue to-blue-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-200 text-sm">Invoice</div>
                  <div className="font-display text-2xl font-bold">{selected.invoiceNumber}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white"><Icons.Close /></button>
              </div>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-800">
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Bill To</div>
                  <div className="font-semibold text-white">{selected.customerName}</div>
                  <div className="text-gray-500">{selected.email}</div>
                  <div className="text-gray-500">{selected.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Details</div>
                  <div className="text-gray-400">Date: {selected.serviceDate ? new Date(selected.serviceDate).toLocaleDateString() : '—'}</div>
                  <div className="text-gray-400">Due: {selected.dueDate ? new Date(selected.dueDate).toLocaleDateString() : '—'}</div>
                </div>
              </div>
              <div className="py-3 border-b border-gray-800">
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">{selected.service}</span>
                  <span className="font-medium text-white">${selected.basePrice}</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between py-1 text-green-400">
                    <span>First-Time Discount ({selected.discountPercent}%)</span>
                    <span>-${selected.discount}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg text-white">Total Due</span>
                <span className="font-bold text-2xl text-brand-blue">${selected.totalAmount}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">{statusBadge(selected.status)}</div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { sendInvoice(selected._id); setSelected(null); }}
                  className="btn-primary flex-1 text-sm py-3 flex items-center justify-center gap-2">
                  <Icons.Send /> Send to Customer
                </button>
                <button onClick={() => setSelected(null)} className="btn-outline flex-1 text-sm py-3">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
