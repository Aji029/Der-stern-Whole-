import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart,
  Bell,
  LogOut,
  Star,
  Factory,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard',     href: '/dashboard',              icon: LayoutDashboard },
  { name: 'Products',      href: '/dashboard/products',     icon: Package },
  { name: 'Customers',     href: '/dashboard/customers',    icon: Users },
  { name: 'Suppliers',     href: '/dashboard/suppliers',    icon: Factory },
  { name: 'Orders',        href: '/dashboard/orders',       icon: ShoppingCart },
  { name: "Today's Pick",  href: '/dashboard/todays-pick',  icon: Calendar },
  { name: 'Reports',       href: '/dashboard/reports',      icon: BarChart },
];

export function DashboardLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); }
    catch (e) { console.error(e); }
  };

  const getCurrentPageName = () =>
    navigation.find(item => item.href === location.pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">

        {/* ── Desktop Sidebar ─────────────────────────────────────── */}
        <div className="hidden lg:relative lg:flex lg:flex-col">
          <div
            className={`flex flex-col h-full transition-all duration-300 ease-in-out group ${
              isCollapsed ? 'w-16 hover:w-64' : 'w-64'
            }`}
            style={{ background: '#2e3c0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: '#8cb918' }}>
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div className={`ml-2.5 transition-all duration-300 overflow-hidden ${
                  isCollapsed ? 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto' : 'opacity-100 w-auto'
                }`}>
                  <div className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-white/50 text-xs font-medium tracking-wider uppercase">Der</span>
                    <span className="text-white text-lg font-extrabold tracking-wider uppercase">Stern</span>
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <nav className="flex-1 px-2 space-y-0.5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                      style={{
                        background: isActive ? 'rgba(140,185,24,0.2)' : 'transparent',
                        color: isActive ? '#8cb918' : 'rgba(255,255,255,0.55)',
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; } }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                        isCollapsed ? 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto' : 'opacity-100 w-auto'
                      }`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sign out */}
            <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto' : 'opacity-100 w-auto'
                }`}>
                  Sign out
                </span>
              </button>
            </div>

            {/* Collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-colors"
              style={{ background: '#3d5010', border: '1px solid rgba(255,255,255,0.12)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#4e6314')}
              onMouseLeave={e => (e.currentTarget.style.background = '#3d5010')}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed
                ? <ChevronRight className="h-3.5 w-3.5 text-white/70" />
                : <ChevronLeft  className="h-3.5 w-3.5 text-white/70" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile slide-out ────────────────────────────────────── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="relative flex flex-col w-64 h-full shadow-xl"
                 style={{ background: '#2e3c0a' }}>
              <div className="flex items-center justify-between px-4 py-5"
                   style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ background: '#8cb918' }}>
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white/50 text-xs font-medium tracking-wider uppercase">Der</span>
                    <span className="text-white text-lg font-extrabold tracking-wider uppercase">Stern</span>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)}
                        className="text-white/40 hover:text-white/80 p-1">✕</button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg"
                      style={{
                        background: isActive ? 'rgba(140,185,24,0.2)' : 'transparent',
                        color: isActive ? '#8cb918' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-lg"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          {/* Top header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center">
                <button
                  className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
                  {getCurrentPageName()}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Bell className="w-6 h-6" />
                </button>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
