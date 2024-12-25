import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatDateForDisplay } from '../../../../utils/dateFormatting';
import type { Order } from '../../../../context/OrderContext';

interface OrderHeaderProps {
  order: Order;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order {order.id}
          </h1>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Order Received: {formatDateForDisplay(order.orderDate)}
              </span>
            </div>
            <div className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${
              order.status === 'Completed'
                ? 'bg-green-100 text-green-800'
                : order.status === 'Processing'
                ? 'bg-blue-100 text-blue-800'
                : order.status === 'Cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              Status: {order.status}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900">{order.customer.companyName}</p>
              <p className="text-sm text-gray-500">{order.customer.contactPerson}</p>
              <p className="text-sm text-gray-500">{order.customer.email}</p>
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
            <p className="mt-1 text-sm text-gray-900">{order.shippingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}