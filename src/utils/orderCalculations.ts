import type { OrderItem } from '../types/order';

export function calculateItemTotal(quantity: number, price: number): number {
  if (!quantity || !price || isNaN(quantity) || isNaN(price)) {
    return 0;
  }
  return quantity * price;
}

export function validateOrderItem(item: Partial<OrderItem>): string | null {
  if (!item.quantity || item.quantity <= 0) {
    return 'Quantity must be greater than 0';
  }
  if (!item.ekPrice || item.ekPrice <= 0) {
    return 'Purchase price must be greater than 0';
  }
  if (!item.vkPrice || item.vkPrice <= 0) {
    return 'Selling price must be greater than 0';
  }
  if (item.vkPrice < item.ekPrice) {
    return 'Selling price cannot be less than purchase price';
  }
  return null;
}

export function calculateOrderTotals(items: OrderItem[] = []) {
  return items.reduce((acc, item) => {
    const total = calculateItemTotal(item.quantity, item.vkPrice);
    return {
      totalAmount: acc.totalAmount + total,
      totalItems: acc.totalItems + item.quantity,
    };
  }, {
    totalAmount: 0,
    totalItems: 0,
  });
}