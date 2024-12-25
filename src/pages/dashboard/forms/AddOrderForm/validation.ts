import type { OrderFormData } from './types';

export function validateOrderForm(data: OrderFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.customerId) {
    errors.customerId = 'Please select a customer';
  }

  if (data.items.length === 0) {
    errors.items = 'Please add at least one item';
  }

  data.items.forEach((item, index) => {
    if (!item.product.artikelNr) {
      errors[`items.${index}.product`] = 'Please select a product';
    }
    if (!item.quantity || item.quantity <= 0) {
      errors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
    }
    if (!item.vkPrice || item.vkPrice <= 0) {
      errors[`items.${index}.vkPrice`] = 'Selling price must be greater than 0';
    }
  });

  if (data.deliveryDate) {
    const deliveryDate = new Date(data.deliveryDate);
    if (isNaN(deliveryDate.getTime())) {
      errors.deliveryDate = 'Please enter a valid delivery date';
    }
  }

  return errors;
}