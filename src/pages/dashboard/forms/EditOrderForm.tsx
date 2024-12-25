import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../../context/ProductContext';
import { useSuppliers } from '../../../context/SupplierContext';
import { useOrderForm } from './EditOrder/useOrderForm';
import { OrderForm } from './EditOrder/OrderForm';

export function EditOrderForm() {
  const { id } = useParams();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const {
    order,
    isSubmitting,
    error,
    handleUpdateOrder,
    handleUpdateItem,
    handleSubmit,
  } = useOrderForm(id!);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Loading order...</h2>
        </div>
      </div>
    );
  }

  const handleAddItem = () => {
    const newItem = {
      product: { artikelNr: '', name: '', mwst: 'A' },
      quantity: 1,
      ekPrice: 0,
      vkPrice: 0,
      total: 0,
    };
    handleUpdateOrder({ items: [...order.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    handleUpdateOrder({ items: updatedItems });
  };

  return (
    <OrderForm
      order={order}
      products={products}
      suppliers={suppliers}
      isSubmitting={isSubmitting}
      error={error}
      onUpdateOrder={handleUpdateOrder}
      onUpdateItem={handleUpdateItem}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      onSubmit={handleSubmit}
    />
  );
}