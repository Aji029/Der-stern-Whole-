import React from 'react';
import { formatDateForInput, formatDateForDisplay } from '../../../../utils/dateFormatting';
import { formatPrice } from '../../../../utils/priceCalculations';
import { QRCodeSVG } from 'qrcode.react';

interface OrderDetailsProps {
  order: any;
  onStatusChange: (status: string) => void;
  onPaymentStatusChange: (status: string) => void;
  onDateChange: (date: string) => void;
}

export function OrderDetails({ 
  order, 
  onStatusChange, 
  onPaymentStatusChange,
  onDateChange 
}: OrderDetailsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details */}
        <div>
          <h3 className="text-lg font-medium mb-4">Customer Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="text-sm">{order.customer.companyName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact Person</p>
              <p className="text-sm">{order.customer.contactPerson}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Number</p>
              <p className="text-sm">{order.customer.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Outstanding Payment</p>
              <p className="text-sm text-red-600">{formatPrice(order.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div>
          <h3 className="text-lg font-medium mb-4">Order Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Order Date
              </label>
              <input
                type="date"
                value={formatDateForInput(order.orderDate)}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Order Status
              </label>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Payment Status
              </label>
              <select
                value={order.paymentStatus}
                onChange={(e) => onPaymentStatusChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Last Updated: {formatDateForDisplay(order.updated_at || order.orderDate)}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code and Additional Info */}
        <div>
          <h3 className="text-lg font-medium mb-4">Quick Access</h3>
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG
              value={`${window.location.origin}/orders/${order.id}`}
              size={128}
              level="M"
              includeMargin={true}
            />
            <p className="text-sm text-gray-500">Scan to view order details</p>
          </div>
        </div>
      </div>
    </div>
  );
}