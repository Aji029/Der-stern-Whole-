import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, LayoutDashboard, ShoppingBag, ChevronRight, Package, ClipboardList, BarChart3 } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center pt-12 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-2.5 rounded-xl shadow-lg shadow-yellow-500/30">
            <Star className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Der Stern</h1>
            <p className="text-yellow-400 text-sm font-medium tracking-widest uppercase">Food Distribution</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <p className="text-gray-400 text-lg mb-10 text-center">
          Choose how you'd like to sign in
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Admin Card */}
          <button
            onClick={() => navigate('/login')}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="bg-yellow-500/20 group-hover:bg-yellow-500/30 p-3 rounded-xl transition-colors">
                <LayoutDashboard className="h-7 w-7 text-yellow-400" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Admin Dashboard</h2>
            <p className="text-gray-400 text-sm mb-6">Manage orders, customers, products and reports</p>

            <div className="space-y-2">
              {[
                { icon: ClipboardList, label: 'Orders & Fulfillment' },
                { icon: Package, label: 'Products & Inventory' },
                { icon: BarChart3, label: 'Reports & Analytics' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon className="h-3.5 w-3.5 text-yellow-500/60" />
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 group-hover:gap-3 transition-all">
                Sign in as Admin
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </button>

          {/* Customer Card */}
          <button
            onClick={() => navigate('/portal/login')}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="bg-blue-500/20 group-hover:bg-blue-500/30 p-3 rounded-xl transition-colors">
                <ShoppingBag className="h-7 w-7 text-blue-400" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Customer Portal</h2>
            <p className="text-gray-400 text-sm mb-6">Browse your products and place orders online</p>

            <div className="space-y-2">
              {[
                { icon: Package, label: 'Browse Your Products' },
                { icon: ShoppingBag, label: 'Place Orders Easily' },
                { icon: ClipboardList, label: 'Track Order Status' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon className="h-3.5 w-3.5 text-blue-500/60" />
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:gap-3 transition-all">
                Sign in as Customer
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 text-gray-600 text-sm">
        © {new Date().getFullYear()} Der Stern · Food Distribution
      </footer>
    </div>
  );
}
