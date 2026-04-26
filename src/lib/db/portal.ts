import { supabasePortal as supabase } from '../supabasePortal';
import type { PortalProduct, PortalOrder, PortalOrderDetail, PortalCartItem } from '../../types/portal';

export async function fetchCustomerOrderedProducts(customerId: string): Promise<PortalProduct[]> {
  const { data: orders } = await supabase
    .from('orders')
    .select('id')
    .eq('customer_id', customerId);

  if (!orders || orders.length === 0) return [];

  const orderIds = orders.map(o => o.id as string);

  const { data: items } = await supabase
    .from('order_items')
    .select('product_id')
    .in('order_id', orderIds);

  if (!items || items.length === 0) return [];

  const uniqueProductIds = [...new Set(items.map(i => i.product_id).filter(Boolean))];

  const { data: products, error } = await supabase
    .from('products')
    .select('artikel_nr, name, mwst, supplier_id, ist_bestand')
    .in('artikel_nr', uniqueProductIds)
    .order('name');

  if (error) throw error;

  return (products || []).map(p => ({
    artikelNr: p.artikel_nr,
    name: p.name,
    mwst: p.mwst as 'A' | 'B',
    supplierId: p.supplier_id,
    istBestand: p.ist_bestand,
  }));
}

export async function fetchPortalOrders(customerId: string): Promise<PortalOrder[]> {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status, order_date, delivery_date')
    .eq('customer_id', customerId)
    .order('order_date', { ascending: false });

  if (error) throw error;

  const orderIds = (orders || []).map(o => o.id as string);
  let itemCountMap: Record<string, number> = {};

  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from('order_items')
      .select('order_id')
      .in('order_id', orderIds);

    for (const item of items || []) {
      itemCountMap[item.order_id] = (itemCountMap[item.order_id] || 0) + 1;
    }
  }

  return (orders || []).map(o => ({
    id: o.id,
    status: o.status as PortalOrder['status'],
    orderDate: new Date(o.order_date),
    deliveryDate: o.delivery_date ? new Date(o.delivery_date) : undefined,
    itemCount: itemCountMap[o.id] || 0,
  }));
}

export async function fetchPortalOrderDetail(orderId: string, customerId: string): Promise<PortalOrderDetail | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, status, order_date, delivery_date, shipping_address, notes')
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .single();

  if (error || !order) return null;

  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, product_name, quantity')
    .eq('order_id', orderId);

  return {
    id: order.id,
    status: order.status as PortalOrderDetail['status'],
    orderDate: new Date(order.order_date),
    deliveryDate: order.delivery_date ? new Date(order.delivery_date) : undefined,
    shippingAddress: order.shipping_address || '',
    notes: order.notes || undefined,
    itemCount: (items || []).length,
    items: (items || []).map(item => ({
      artikelNr: item.product_id,
      name: item.product_name || item.product_id,
      quantity: item.quantity,
    })),
  };
}

export async function createPortalOrder(params: {
  customerId: string;
  userId: string;
  cart: PortalCartItem[];
  shippingAddress: string;
  notes?: string;
}): Promise<string> {
  const { customerId, userId, cart, shippingAddress, notes } = params;

  const resolvedItems = await Promise.all(
    cart.map(async item => {
      let vkPrice = 0;
      try {
        const { data } = await supabase.rpc('get_customer_product_price', {
          p_customer_id: customerId,
          p_product_id: item.artikelNr,
        });
        if (data !== null && data !== undefined) {
          vkPrice = data;
        } else {
          const { data: product } = await supabase
            .from('products')
            .select('vk_price')
            .eq('artikel_nr', item.artikelNr)
            .single();
          vkPrice = product?.vk_price || 0;
        }
      } catch {
        // default remains 0
      }
      return { ...item, vkPrice };
    })
  );

  const totalAmount = resolvedItems.reduce((sum, item) => sum + item.quantity * item.vkPrice, 0);

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([{
      customer_id: customerId,
      status: 'Pending',
      total_amount: totalAmount,
      final_amount: totalAmount,
      order_date: new Date().toISOString(),
      payment_status: 'Pending',
      shipping_address: shippingAddress,
      notes: notes || null,
      user_id: userId,
    }])
    .select('id')
    .single();

  if (orderError || !orderData) throw orderError || new Error('Failed to create order');

  const orderItems = resolvedItems.map(item => ({
    order_id: orderData.id,
    product_id: item.artikelNr,
    product_name: item.name,
    quantity: item.quantity,
    ek_price: 0,
    vk_price: item.vkPrice,
    total: item.quantity * item.vkPrice,
    supplier_id: item.supplierId || null,
    user_id: userId,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return orderData.id;
}
