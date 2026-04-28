import React, { useState, useMemo } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { TodaysPickList } from './components/TodaysPick/TodaysPickList';
import { useTodaysPick } from './hooks/useTodaysPick';
import { usePickedItems } from './hooks/usePickedItems';
import { formatDateForInput } from '../../utils/dateFormatting';

export function TodaysPickPage() {
  const today = formatDateForInput(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  const { groupedOrders, isLoading, error } = useTodaysPick(selectedDate);
  const { pickedItems, toggleItem, markAllForSupplier, unmarkAllForSupplier, clearAll } =
    usePickedItems(selectedDate);

  const filteredOrders = useMemo(() => {
    if (selectedSuppliers.length === 0) return groupedOrders;
    return groupedOrders.filter(o => selectedSuppliers.includes(o.supplierId));
  }, [groupedOrders, selectedSuppliers]);

  const toggleSupplierFilter = (id: string) => {
    setSelectedSuppliers(prev =>
      prev.length === 1 && prev[0] === id ? [] : [id]
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Today's Pick</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={e => { if (e.target.value) setSelectedDate(e.target.value); }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 text-sm"
          />
        </div>
      </div>

      {/* Supplier filter chips */}
      {groupedOrders.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Filter by Supplier</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSuppliers([])}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedSuppliers.length === 0
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedSuppliers.length === 0 ? { background: '#8cb918' } : {}}
            >
              All Suppliers
            </button>
            {groupedOrders.map(order => {
              const isSelected  = selectedSuppliers.includes(order.supplierId);
              const pickedCount = order.items.filter(
                i => i.product?.artikelNr && pickedItems.has(i.product.artikelNr)
              ).length;
              const isComplete  = pickedCount === order.items.length && order.items.length > 0;
              return (
                <button
                  key={order.supplierId}
                  onClick={() => toggleSupplierFilter(order.supplierId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'text-white shadow-sm'
                      : isComplete
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={isSelected ? { background: '#8cb918' } : {}}
                >
                  {isComplete && '✓ '}
                  {order.supplierName}
                  <span className="ml-1.5 opacity-60">
                    {pickedCount > 0 ? `(${pickedCount}/${order.items.length})` : `(${order.items.length})`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <TodaysPickList
        groupedOrders={filteredOrders}
        selectedDate={selectedDate}
        isLoading={isLoading}
        error={error}
        pickedItems={pickedItems}
        onToggleItem={toggleItem}
        onMarkAllForSupplier={markAllForSupplier}
        onUnmarkAllForSupplier={unmarkAllForSupplier}
        onClearAll={clearAll}
      />
    </div>
  );
}
