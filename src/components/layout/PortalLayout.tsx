import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart, Package, ClipboardList, LogOut } from 'lucide-react';
import { usePortalAuth as useAuth } from '../../context/PortalAuthContext';
import { usePortal } from '../../features/portal/context/PortalContext';

export function PortalLayout() {
  const { logout, user } = useAuth();
  const { cartCount, profile } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/portal/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/portal" className="flex items-center gap-2">
              <Star className="h-7 w-7 text-yellow-500" />
              <span className="text-lg font-bold text-gray-900">Der Stern</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Link
                to="/portal/products"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/portal/products')
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                to="/portal/orders"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/portal/orders')
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                My Orders
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/portal/cart"
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                <span className="hidden sm:inline">Cart</span>
              </Link>

              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 pl-3 border-l border-gray-200">
                <span className="font-medium">{profile?.companyName || user?.name || user?.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>

        <nav className="sm:hidden flex border-t border-gray-200">
          <Link
            to="/portal/products"
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium ${
              isActive('/portal/products') ? 'text-yellow-600' : 'text-gray-500'
            }`}
          >
            <Package className="h-5 w-5 mb-0.5" />
            Products
          </Link>
          <Link
            to="/portal/orders"
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium ${
              isActive('/portal/orders') ? 'text-yellow-600' : 'text-gray-500'
            }`}
          >
            <ClipboardList className="h-5 w-5 mb-0.5" />
            Orders
          </Link>
          <Link
            to="/portal/cart"
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium relative ${
              isActive('/portal/cart') ? 'text-yellow-600' : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 mb-0.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
