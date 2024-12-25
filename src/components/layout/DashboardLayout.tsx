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
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: Factory },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: "Today's Pick", href: '/dashboard/todays-pick', icon: Calendar },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="relative hidden md:block">
          <div 
            className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
              isCollapsed ? 'w-16' : 'w-64'
            }`}
          >
            <div className="flex flex-col flex-grow pt-5 pb-4">
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <Star className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <span className={`ml-2 text-xl font-semibold text-gray-900 transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}>
                  der Stern
                </span>
              </div>

              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                        isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                      }`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}>
                  Sign out
                </span>
              </button>
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-50 focus:outline-none transition-transform duration-200"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top header */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">
                {getCurrentPageName()}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors duration-200">
                  <Bell className="w-6 h-6" />
                </button>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function getCurrentPageName() {
    const path = location.pathname;
    if (path.includes('/suppliers/') && path.includes('/products')) {
      return 'Supplier Products';
    }
    return navigation.find(item => item.href === path)?.name || 'Dashboard';
  }
}