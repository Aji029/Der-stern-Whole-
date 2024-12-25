import { useState, useCallback } from 'react';
import type { OrderItem } from '../../../types/order';

export function useOrderSupplier() {
  const [supplierErrors, setSupplierErrors] = useState<Record<string, string>>({});

  const validateSupplier = useCallback((item: OrderItem): string | null => {
    if (!item.product.supplierId) {
      return 'Supplier is required';
    }
    return null;
  }, []);

  const validateAllSuppliers = useCallback((items: OrderItem[]): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    items.forEach((item, index) => {
      const error = validateSupplier(item);
      if (error) {
        newErrors[`supplier-${index}`] = error;
        hasErrors = true;
      }
    });

    setSupplierErrors(newErrors);
    return !hasErrors;
  }, [validateSupplier]);

  return {
    supplierErrors,
    validateSupplier,
    validateAllSuppliers
  };
}