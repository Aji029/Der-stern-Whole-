import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { OrderList } from './components/OrderList';
import { BackButton } from '../../components/navigation/BackButton';
import { OrderDateFilter } from '../../components/OrderDateFilter';
import { useOrders } from '../../context/OrderContext';
import { useOrderDateFilter } from '../../hooks/useOrderDateFilter';

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const {
    selectedDate,
    setSelectedDate,
    clearDate,
    filteredOrders,
    hasFilter
  } = useOrderDateFilter(orders);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          {hasFilter && (
            <p className="text-sm text-gray-500 mt-1">
              {filteredOrders.length} order(s) found
            </p>
          )}
        </div>
        <Button onClick={() => navigate('/dashboard/orders/new')}>
          <Plus className="h-5 w-5 mr-2" />
          Create Order
        </Button>
      </div>

      <OrderDateFilter
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClear={clearDate}
      />

      <OrderList orders={filteredOrders} />
    </div>
  );
}