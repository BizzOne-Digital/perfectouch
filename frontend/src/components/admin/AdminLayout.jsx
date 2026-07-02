import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Icons } from '../public/Icons';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: Icons.Dashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: Icons.Booking },
  { to: '/admin/invoices', label: 'Invoices', icon: Icons.Invoice },
  { to: '/admin/calendar', label: 'Calendar', icon: Icons.Calendar },
  { to: '/admin/gallery', label: 'Gallery', icon: Icons.Image },
  { to: '/admin/services', label: 'Services', icon: Icons.Settings },
  { to: '/admin/addons', label: 'Add-ons', icon: Icons.Plus }
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center">
            <span className="text-white font-display font-bold">PT</span>
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm">PerfectTouch</div>
            <div className="text-blue-400 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold text-sm">
            {admin?.name?.[0] || 'A'}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{admin?.name}</div>
            <div className="text-gray-400 text-xs">Administrator</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm">
          <Icons.Logout />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-gray-900 flex-col fixed h-full z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600">
            <Icons.Menu />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <a href="/" target="_blank" rel="noreferrer"
              className="text-sm text-brand-blue hover:underline flex items-center gap-1">
              <Icons.Eye /> View Website
            </a>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
