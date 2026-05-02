import { useState, useEffect } from 'react';
import { useOrders } from '../../../context/OrderContext';
import { useSuppliers } from '../../../context/SupplierContext';
import { isSameDay } from '../../../utils/dateFormatting';
import type { OrderItem } from '../../../types/order';

export interface GroupedOrders {
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
}

export function useTodaysPick(selectedDate: string) {
  // Derive loading state from data source — avoids stale isLoading when
  // OrderContext is still fetching.
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { suppliers } = useSuppliers();
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrders[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setError(null);

      const dateOrders = orders.filter(order =>
        isSameDay(order.orderDate, selectedDate) &&
        order.status !== 'Completed' &&
        order.status !== 'Cancelled'
      );

      const supplierGroups = new Map<string, GroupedOrders>();

      dateOrders.forEach(order => {
        order.items.forEach(item => {
          if (!item.product?.supplierId) return;

          const supplier = suppliers.find(s => s.id === item.product.supplierId);
          if (!supplier) return;

          const existingGroup = supplierGroups.get(supplier.id);

          if (existingGroup) {
            const existingItem = existingGroup.items.find(
              existing => existing.product?.artikelNr === item.product?.artikelNr
            );
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              existingGroup.items.push({ ...item });
            }
          } else {
            supplierGroups.set(supplier.id, {
              supplierId: supplier.id,
              supplierName: supplier.companyName,
              items: [{ ...item }],
            });
          }
        });
      });

      const sortedGroups = Array.from(supplierGroups.values())
        .sort((a, b) => (a.supplierName ?? '').localeCompare(b.supplierName ?? ''))
        .map(group => ({
          ...group,
          items: group.items.sort((a, b) =>
            (a.product?.name ?? '').localeCompare(b.product?.name ?? '')
          ),
        }));

      setGroupedOrders(sortedGroups);
    } catch (err: any) {
      console.error('Error processing orders:', err);
      setError(err.message);
    }
  }, [orders, suppliers, selectedDate]);

  return {
    groupedOrders,
    isLoading: ordersLoading,
    error: ordersError || error,
  };
}
