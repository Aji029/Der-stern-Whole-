import { supabase } from '../supabase';
import { calculateOrderTotal } from '../../utils/orderTotalCalculations';
import type { Order } from '../../types/order';
import { format } from 'date-fns';

export async function updateOrder(id: string, order: Order): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    // First update the order details
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        status: order.status,
        total_amount: calculateOrderTotal(order.items),
        delivery_date: order.deliveryDate ? format(order.deliveryDate, 'yyyy-MM-dd\'T\'HH:mm:ssXXX') : null,
        payment_status: order.paymentStatus,
        shipping_address: order.shippingAddress,
        notes: order.notes,
        updated_at: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ssXXX')
      })
      .eq('id', id);

    if (orderError) throw orderError;

    // Then delete existing items
    const { error: deleteError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (deleteError) throw deleteError;

    // Finally insert new items if there are any
    if (order.items && order.items.length > 0) {
      const validItems = order.items
        .filter(item => item.product?.artikelNr && item.quantity > 0)
        .map(item => ({
          order_id: id,
          product_id: item.product.artikelNr,
          quantity: item.quantity,
          ek_price: item.ekPrice,
          vk_price: item.vkPrice,
          total: item.quantity * item.vkPrice
        }));

      if (validItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(validItems);

        if (itemsError) throw itemsError;
      }
    }
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
}