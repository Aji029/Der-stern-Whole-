import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../../context/OrderContext';
import { useOrderState } from './useOrderState';
import { useOrderValidation } from './useOrderValidation';
import type { Order, OrderItem } from '../../../types/order';

export function useOrderEdit(initialOrder: Order) {
  const navigate = useNavigate();
  const { updateOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    order,
    setOrder,
    updateOrderItem,
    removeOrderItem,
    addOrderItem
  } = useOrderState(initialOrder);

  const { validationErrors, validateOrder } = useOrderValidation();

  const handleUpdateItem = useCallback((index: number, updates: Partial<OrderItem>) => {
    updateOrderItem(index, updates);
  }, [updateOrderItem]);

  const handleRemoveItem = useCallback((index: number) => {
    removeOrderItem(index);
  }, [removeOrderItem]);

  const handleAddItem = useCallback(() => {
    // Only add if there's no empty item already
    const hasEmptyItem = order.items.some(item => !item.product.artikelNr);
    if (!hasEmptyItem) {
      addOrderItem();
    }
  }, [order.items, addOrderItem]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Filter out invalid items before saving
      const validItems = order.items.filter(item => 
        item.product.artikelNr && 
        item.quantity > 0 && 
        item.ekPrice > 0 && 
        item.vkPrice > 0
      );

      const orderToSave = {
        ...order,
        items: validItems
      };

      // Validate order
      const isValid = validateOrder(orderToSave);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      await updateOrder(order.id, orderToSave);
      navigate('/dashboard/orders');
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to save order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    order,
    isSubmitting,
    error,
    validationErrors,
    updateOrderItem: handleUpdateItem,
    removeOrderItem: handleRemoveItem,
    addOrderItem: handleAddItem,
    handleSave
  };
}