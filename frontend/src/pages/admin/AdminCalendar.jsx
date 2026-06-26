import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

const STATUS_COLORS = { Pending:'bg-yellow-500', Confirmed:'bg-blue-500', 'In Progress':'bg-purple-500', Completed:'bg-green-500', Cancelled:'bg-red-500' };

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (date) => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/calendar?month=${date.getMonth()+1}&year=${date.getFullYear()}`);
      setEvents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(currentDate); }, [currentDate]);

  const days = eachDayOfInterval({ start:startOfMonth(currentDate), end:endOfMonth(currentDate) });
  const firstDayOfWeek = startOfMonth(currentDate).getDay();
  const getEventsForDay = (day) => events.filter(e => isSameDay(new Date(e.date), day));
  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-white">Calendar</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <button onClick={() => setCurrentDate(d => subMonths(d,1))} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"><Icons.ChevronLeft /></button>
            <h2 className="font-display text-xl font-bold text-white">{format(currentDate,'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentDate(d => addMonths(d,1))} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"><Icons.ChevronRight /></button>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-800">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-600 py-3">{d}</div>
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-7">
              {Array.from({ length:firstDayOfWeek }).map((_,i) => <div key={`e${i}`} className="h-24 border-b border-r border-gray-800 bg-gray-800/20" />)}
              {days.map(day => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const today = isToday(day);
                return (
                  <div key={day.toString()} onClick={() => setSelectedDay(day)}
                    className={`h-24 border-b border-r border-gray-800 p-1.5 cursor-pointer transition-colors overflow-hidden
                      ${isSelected ? 'bg-brand-blue/10 ring-2 ring-brand-blue ring-inset' : 'hover:bg-gray-800/50'}
                      ${!isSameMonth(day,currentDate) ? 'opacity-30' : ''}`}>
                    <div className={`text-sm font-semibold mb-1 w-7 h-7 flex items-center justify-center rounded-full
                      ${today ? 'bg-brand-blue text-white' : 'text-gray-400'}`}>
                      {format(day,'d')}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0,2).map((e,i) => (
                        <div key={i} className={`text-white text-xs px-1.5 py-0.5 rounded truncate ${STATUS_COLORS[e.status]||'bg-gray-600'}`}>
                          {e.time} {e.title.split(' - ')[0]}
                        </div>
                      ))}
                      {dayEvents.length > 2 && <div className="text-xs text-gray-600 pl-1">+{dayEvents.length-2} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 className="font-display font-bold text-white mb-3">Status Legend</h3>
            <div className="space-y-2">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm text-gray-400">{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <h3 className="font-display font-bold text-white mb-3">
              {selectedDay ? format(selectedDay,'MMM d, yyyy') : 'Select a Day'}
            </h3>
            {selectedDayEvents.length === 0 ? (
              <p className="text-gray-600 text-sm">{selectedDay ? 'No bookings on this day' : 'Click a day to see bookings'}</p>
            ) : (
              <div className="space-y-3">
                {selectedDayEvents.map((e,i) => (
                  <div key={i} className="border border-gray-800 rounded-xl p-3 bg-gray-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[e.status]||'bg-gray-500'}`} />
                      <span className="font-semibold text-sm text-white truncate">{e.title}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1"><Icons.Clock />{e.time}</div>
                    <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      e.status==='Completed'?'bg-green-500/20 text-green-400':e.status==='Confirmed'?'bg-blue-500/20 text-blue-400':'bg-yellow-500/20 text-yellow-400'
                    }`}>{e.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-2xl p-5 text-white border border-brand-blue/30">
            <h3 className="font-display font-bold mb-1">Today</h3>
            <p className="text-blue-200 text-sm mb-3">{format(new Date(),'EEEE, MMM d')}</p>
            {(() => {
              const todayEvents = getEventsForDay(new Date());
              return todayEvents.length===0 ? <p className="text-blue-300 text-sm">No bookings today</p> : (
                <div className="space-y-2">
                  {todayEvents.map((e,i) => (
                    <div key={i} className="bg-black/20 rounded-lg px-3 py-2 text-sm border border-white/10">
                      <div className="font-medium">{e.time}</div>
                      <div className="text-blue-200 text-xs truncate">{e.title}</div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
