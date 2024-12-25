import React from 'react';
import { calculateOrderTotal } from '../../utils/orderTotalCalculations';
import { formatPrice } from '../../utils/priceCalculations';
import type { OrderItem } from '../../types/order';

interface OrderSummaryProps {
  items: OrderItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const totalAmount = calculateOrderTotal(items);
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-gray-600">Total Items:</span>
          <span className="ml-2 font-medium">{totalItems}</span>
        </div>
        
        <div className="col-span-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="ml-2 font-semibold text-lg">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}