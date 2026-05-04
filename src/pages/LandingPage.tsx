import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, LayoutDashboard, ShoppingBag, ChevronRight, Package, ClipboardList, BarChart3 } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #2e3c0a 0%, #3d5010 45%, #2e3c0a 100%)' }}>
      {/* Watermark star */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="w-[600px] h-[600px]">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                   fill="#8cb918" />
        </svg>
      </div>

      {/* Header */}
      <header className="flex items-center justify-center pt-14 pb-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
               style={{ background: '#8cb918' }}>
            <Star className="h-8 w-8 text-white fill-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white/50 text-lg font-medium tracking-widest uppercase">Der</span>
            <span className="text-white text-4xl font-extrabold tracking-wider uppercase">Stern</span>
          </div>
          <p className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase">
            Vom Grossmarkt Berlin
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <p className="text-white/50 text-base mb-10 text-center">
          Choose how you'd like to sign in
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Admin Card */}
          <button
            onClick={() => navigate('/login')}
            className="group relative rounded-2xl p-7 text-left transition-all duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(140,185,24,0.12)';
              e.currentTarget.style.border = '1px solid rgba(140,185,24,0.35)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(140,185,24,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(140,185,24,0.15)' }}>
                <LayoutDashboard className="h-6 w-6" style={{ color: '#8cb918' }} />
              </div>
              <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Admin Dashboard</h2>
            <p className="text-white/40 text-sm mb-5">Manage orders, customers, products and reports</p>

            <div className="space-y-2">
              {[
                { icon: ClipboardList, label: "Orders & Fulfillment" },
                { icon: Package,       label: "Products & Inventory" },
                { icon: BarChart3,     label: "Reports & Analytics" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(140,185,24,0.55)' }}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                    style={{ color: '#8cb918' }}>
                Sign in as Admin
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => navigate('/portal/login')}
            className="group relative rounded-2xl p-7 text-left transition-all duration-200 hover:-translate-y-1"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(140,185,24,0.12)';
              e.currentTarget.style.border = '1px solid rgba(140,185,24,0.35)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(140,185,24,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(140,185,24,0.15)' }}>
                <ShoppingBag className="h-6 w-6" style={{ color: '#a3d420' }} />
              </div>
              <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Customer Portal</h2>
            <p className="text-white/40 text-sm mb-5">Browse your products and place orders online</p>

            <div className="space-y-2">
              {[
                { icon: Package,       label: "Browse Your Products" },
                { icon: ShoppingBag,   label: "Place Orders Easily" },
                { icon: ClipboardList, label: "Track Order Status" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(140,185,24,0.55)' }}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                    style={{ color: '#8cb918' }}>
                Sign in as Customer
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
        <p className="text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Der Stern · Grossmarkt Berlin
        </p>
      </footer>
    </div>
  );
}
