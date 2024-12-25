export const calculateOrderTotal = (items: Array<{ quantity: number; vkPrice: number }> = []): number => {
  return items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.vkPrice) || 0;
    return sum + (quantity * price);
  }, 0);
};

export const validateOrderTotal = (total: number): boolean => {
  return typeof total === 'number' && !isNaN(total) && total >= 0;
};