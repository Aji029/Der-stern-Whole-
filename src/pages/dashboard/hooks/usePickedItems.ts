import { useState, useCallback, useEffect } from 'react';
import type { OrderItem } from '../../../types/order';

export function usePickedItems(selectedDate: string) {
  const storageKey = `der-stern-picked-${selectedDate}`;

  const [pickedItems, setPickedItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...pickedItems]));
    } catch { /* quota exceeded — ignore */ }
  }, [pickedItems, storageKey]);

  // Reload when date changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setPickedItems(stored ? new Set<string>(JSON.parse(stored)) : new Set<string>());
    } catch {
      setPickedItems(new Set<string>());
    }
  }, [storageKey]);

  const toggleItem = useCallback((artikelNr: string) => {
    setPickedItems(prev => {
      const next = new Set(prev);
      if (next.has(artikelNr)) next.delete(artikelNr);
      else next.add(artikelNr);
      return next;
    });
  }, []);

  const markAllForSupplier = useCallback((items: OrderItem[]) => {
    setPickedItems(prev => {
      const next = new Set(prev);
      items.forEach(item => { if (item.product?.artikelNr) next.add(item.product.artikelNr); });
      return next;
    });
  }, []);

  const unmarkAllForSupplier = useCallback((items: OrderItem[]) => {
    setPickedItems(prev => {
      const next = new Set(prev);
      items.forEach(item => { if (item.product?.artikelNr) next.delete(item.product.artikelNr); });
      return next;
    });
  }, []);

  const clearAll = useCallback(() => setPickedItems(new Set()), []);

  return { pickedItems, toggleItem, markAllForSupplier, unmarkAllForSupplier, clearAll };
}
