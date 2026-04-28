import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { usePortal } from '../../features/portal/context/PortalContext';
import { fetchPortalOrders } from '../../lib/db/portal';
import type { PortalOrder } from '../../types/portal';

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export function PortalOrderHistoryPage() {
  const { profile } = usePortal();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profile?.customerId) return;
    fetchPortalOrders(profile.customerId)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [profile?.customerId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <ClipboardList className="h-14 w-14 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Your orders will appear here once placed.</p>
          <Link
            to="/portal/products"
            className="inline-flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Start ordering
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Order</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Items</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/portal/orders/${order.id}`)}
                >
                  <td className="px-5 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-5 py-4 text-gray-500">{format(order.orderDate, 'MMM d, yyyy')}</td>
                  <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                    {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <Link to={`/portal/orders/${order.id}`} onClick={e => e.stopPropagation()}>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
