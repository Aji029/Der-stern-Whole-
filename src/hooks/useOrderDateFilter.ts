import { useState, useMemo } from 'react';
import { Order } from '../types/order';
import { startOfDay, parseISO, isValid } from 'date-fns';

export function useOrderDateFilter(orders: Order[]) {
  const [selectedDate, setSelectedDate] = useState('');

  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;

    try {
      // Parse and validate the selected date
      const parsedDate = parseISO(selectedDate);
      if (!isValid(parsedDate)) return orders;

      // Convert selected date to start of day for comparison
      const filterDate = startOfDay(parsedDate).getTime();
      
      return orders.filter(order => {
        // Convert order date to start of day for comparison
        const orderDate = startOfDay(order.orderDate).getTime();
        return orderDate === filterDate;
      });
    } catch (error) {
      console.error('Date filtering error:', error);
      return orders;
    }
  }, [orders, selectedDate]);

  const clearDate = () => {
    setSelectedDate('');
  };

  return {
    selectedDate,
    setSelectedDate,
    clearDate,
    filteredOrders,
    hasFilter: !!selectedDate
  };
}