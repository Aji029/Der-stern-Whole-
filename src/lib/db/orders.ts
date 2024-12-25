import { supabase } from '../supabase';
import { calculateOrderTotal } from '../../utils/orderTotalCalculations';
import { formatOrderDates } from '../utils/dateFormatting';
import type { Order } from '../../types/order';
import { parseISO, format } from 'date-fns';

export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
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

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Parse dates and format data
    return data.map(order => ({
      id: order.id,
      customer: {
        id: order.customer.id,
        companyName: order.customer.company_name,
        contactPerson: order.customer.contact_person,
        email: order.customer.email,
        phone: order.customer.phone,
        address: order.customer.address,
        taxId: order.customer.tax_id,
      },
      items: order.items.map((item: any) => ({
        id: item.id,
        product: {
          artikelNr: item.product.artikel_nr,
          name: item.product.name,
          supplierId: item.product.supplier_id,
          mwst: item.product.mwst,
        },
        quantity: item.quantity,
        ekPrice: item.ek_price,
        vkPrice: item.vk_price,
        total: item.total,
      })),
      status: order.status,
      totalAmount: order.total_amount,
      orderDate: parseISO(order.order_date),
      deliveryDate: order.delivery_date ? parseISO(order.delivery_date) : undefined,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      notes: order.notes,
      created_at: order.created_at ? parseISO(order.created_at) : undefined,
      updated_at: order.updated_at ? parseISO(order.updated_at) : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

// Re-export other functions
export { createOrder } from './orderCreate';
export { updateOrder } from './orderUpdate';
export { deleteOrder } from './orderDelete';