import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { OrderHeader } from './OrderHeader';
import { OrderDetails } from './OrderDetails';
import { OrderItems } from './OrderItems';
import { OrderNotes } from './OrderNotes';
import { useOrderEdit } from '../../hooks/useOrderEdit';
import type { Order } from '../../../../types/order';

interface OrderFormProps {
  order: Order;
  products: any[];
  suppliers: any[];
}

export function OrderForm({ order: initialOrder, products, suppliers }: OrderFormProps) {
  const navigate = useNavigate();
  const {
    order,
    isSubmitting,
    error,
    validationErrors,
    updateOrderItem,
    removeOrderItem,
    addOrderItem,
    handleSave
  } = useOrderEdit(initialOrder);

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <OrderHeader order={order} />
      
      <OrderDetails
        order={order}
        onStatusChange={(status) => updateOrderItem(-1, { status })}
        onPaymentStatusChange={(paymentStatus) => updateOrderItem(-1, { paymentStatus })}
        onDateChange={(date) => updateOrderItem(-1, { orderDate: new Date(date) })}
      />

      <OrderItems
        items={order.items}
        products={products}
        suppliers={suppliers}
        onUpdateItem={updateOrderItem}
        onAddItem={addOrderItem}
        onRemoveItem={removeOrderItem}
        errors={validationErrors}
      />

      <OrderNotes
        notes={order.notes || ''}
        onChange={(notes) => updateOrderItem(-1, { notes })}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/orders')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          isLoading={isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}