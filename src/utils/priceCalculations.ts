export const calculateProfitMargin = (ekPrice: number | undefined, vkPrice: number | undefined, mwst: 'A' | 'B'): number => {
  if (!ekPrice || !vkPrice || ekPrice <= 0) return 0;
  
  const taxRate = mwst === 'A' ? 0.07 : 0.19;
  const vkPriceBeforeTax = vkPrice / (1 + taxRate);
  
  return ((vkPriceBeforeTax - ekPrice) / ekPrice) * 100;
};

export const formatPrice = (price: number | undefined): string => {
  if (typeof price !== 'number') return '€0.00';
  return `€${price.toFixed(2)}`;
};

export const formatProfitMargin = (margin: number): string => {
  return `${margin.toFixed(1)}%`;
};

export const validatePrices = (ekPrice: number | undefined, vkPrice: number | undefined): string | null => {
  if (!ekPrice || !vkPrice) {
    return 'Both prices must be set';
  }
  
  if (ekPrice < 0 || vkPrice < 0) {
    return 'Prices cannot be negative';
  }
  
  if (vkPrice < ekPrice) {
    return 'Selling price cannot be lower than purchase price';
  }
  
  return null;
};

export const calculateOrderTotal = (items: Array<{ quantity: number; vkPrice: number }>): number => {
  return items.reduce((total, item) => total + (item.quantity * item.vkPrice), 0);
};