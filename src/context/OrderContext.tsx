import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';
import type { Order } from '../types/order';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, order: Order) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedOrders = (data || [])
        .filter(order => order.customer !== null)
        .map(order => ({
        id: order.id,
        customer: {
          id: order.customer.id,
          companyName: order.customer.company_name,
          contactPerson: order.customer.contact_person,
          email: order.customer.email
        },
        items: (order.items || []).map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          ekPrice: Number(item.ek_price),
          vkPrice: Number(item.vk_price),
          total: Number(item.total),
          product: item.product ? {
            artikelNr: item.product.artikel_nr,
            name: item.product.name,
            mwst: item.product.mwst,
            supplierId: item.supplier_id || item.product.supplier_id
          } : {
            artikelNr: item.product_id || '',
            name: item.product_name || 'Unknown Product',
            mwst: 'A' as const,
            supplierId: item.supplier_id || undefined
          }
        })),
        status: order.status,
        totalAmount: Number(order.total_amount),
        orderDate: parseISO(order.order_date),
        deliveryDate: order.delivery_date ? new Date(order.delivery_date) : undefined,
        paymentStatus: order.payment_status,
        shippingAddress: order.shipping_address,
        notes: order.notes,
        created_at: order.created_at ? new Date(order.created_at) : undefined,
        updated_at: order.updated_at ? new Date(order.updated_at) : undefined
      }));

      setOrders(transformedOrders);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id'>) => {
    try {
      // Insert order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: orderData.customer.id,
          status: orderData.status,
          total_amount: orderData.totalAmount,
          order_date: format(orderData.orderDate, 'yyyy-MM-dd'),
          delivery_date: orderData.deliveryDate ? format(orderData.deliveryDate, 'yyyy-MM-dd') : null,
          payment_status: orderData.paymentStatus,
          shipping_address: orderData.shippingAddress,
          notes: orderData.notes
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items with supplier_id
      const orderItems = orderData.items.map(item => ({
        order_id: orderResult.id,
        product_id: item.product.artikelNr,
        quantity: item.quantity,
        ek_price: item.ekPrice,
        vk_price: item.vkPrice,
        total: item.quantity * item.vkPrice,
        supplier_id: item.product.supplierId
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const updateOrder = async (id: string, order: Order) => {
    try {
      // Update order details
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          customer_id: order.customer.id,
          status: order.status,
          total_amount: order.totalAmount,
          order_date: format(order.orderDate, 'yyyy-MM-dd'),
          delivery_date: order.deliveryDate ? format(order.deliveryDate, 'yyyy-MM-dd') : null,
          payment_status: order.paymentStatus,
          shipping_address: order.shippingAddress,
          notes: order.notes
        })
        .eq('id', id);

      if (orderError) throw orderError;

      // DELETE first to avoid unique constraint violation on (order_id, product_id)
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);

      if (deleteError) throw deleteError;

      const orderItems = order.items.map(item => ({
        order_id: id,
        product_id: item.product.artikelNr,
        quantity: item.quantity,
        ek_price: item.ekPrice,
        vk_price: item.vkPrice,
        total: item.quantity * item.vkPrice,
        supplier_id: item.product?.supplierId || null,
      }));

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      isLoading,
      error,
      addOrder,
      updateOrder,
      deleteOrder,
      getOrder: (id) => orders.find(order => order.id === id),
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}