import React, { useState } from 'react';
import { Package, Loader, ChevronDown, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { TodaysPickPDF } from './TodaysPickPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { formatDateForDisplay } from '../../../../utils/dateFormatting';
import type { GroupedOrders } from '../../hooks/useTodaysPick';

interface TodaysPickListProps {
  groupedOrders: GroupedOrders[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
  pickedItems: Set<string>;
  onToggleItem: (artikelNr: string) => void;
  onMarkAllForSupplier: (items: any[]) => void;
  onUnmarkAllForSupplier: (items: any[]) => void;
  onClearAll: () => void;
}

const supplierColors = [
  { bg: 'bg-blue-50',    border: 'border-blue-200',    header: 'bg-blue-600',    text: 'text-blue-700'    },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', header: 'bg-emerald-600', text: 'text-emerald-700' },
  { bg: 'bg-amber-50',   border: 'border-amber-200',   header: 'bg-amber-600',   text: 'text-amber-700'   },
  { bg: 'bg-purple-50',  border: 'border-purple-200',  header: 'bg-purple-600',  text: 'text-purple-700'  },
  { bg: 'bg-rose-50',    border: 'border-rose-200',    header: 'bg-rose-600',    text: 'text-rose-700'    },
  { bg: 'bg-cyan-50',    border: 'border-cyan-200',    header: 'bg-cyan-600',    text: 'text-cyan-700'    },
  { bg: 'bg-orange-50',  border: 'border-orange-200',  header: 'bg-orange-600',  text: 'text-orange-700'  },
  { bg: 'bg-teal-50',    border: 'border-teal-200',    header: 'bg-teal-600',    text: 'text-teal-700'    },
];

export function TodaysPickList({
  groupedOrders,
  selectedDate,
  isLoading,
  error,
  pickedItems,
  onToggleItem,
  onMarkAllForSupplier,
  onUnmarkAllForSupplier,
  onClearAll,
}: TodaysPickListProps) {
  // Only the currently-expanded supplier group renders its items, preventing
  // the browser from freezing when there are 100+ items across many suppliers.
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
    );
  }

  if (groupedOrders.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-xl border border-gray-200">
        <p className="text-gray-500">No orders to pick for {formatDateForDisplay(selectedDate)}.</p>
      </div>
    );
  }

  const totalItems  = groupedOrders.reduce((s, g) => s + g.items.length, 0);
  const totalPicked = groupedOrders.reduce(
    (s, g) => s + g.items.filter(i => i.product?.artikelNr && pickedItems.has(i.product.artikelNr)).length,
    0
  );
  const pickPct = totalItems > 0 ? Math.round((totalPicked / totalItems) * 100) : 0;
  const allDone = totalItems > 0 && totalPicked === totalItems;

  return (
    <div className="space-y-4">
      {/* ── Progress summary ──────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-gray-700">
              Picking list · {formatDateForDisplay(selectedDate)} · {groupedOrders.length} supplier{groupedOrders.length !== 1 ? 's' : ''}
            </p>
            {allDone && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                <CheckCircle2 className="h-3 w-3" /> All done!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {pickedItems.size > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
            <PDFDownloadLink
              document={<TodaysPickPDF groupedOrders={groupedOrders} selectedDate={selectedDate} />}
              fileName={`picking-list-${selectedDate}.pdf`}
              className="px-3 py-1.5 text-xs font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              {({ loading }) => loading ? 'Building…' : 'Export PDF'}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{totalPicked} / {totalItems} items picked{totalPicked > 0 ? ` (${pickPct}%)` : ''}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${pickPct}%`, background: allDone ? '#16a34a' : '#8cb918' }}
            />
          </div>
        </div>
      </div>

      {/* ── Supplier groups — collapsible ─────────────────────── */}
      {groupedOrders.map((group, index) => {
        const colors     = supplierColors[index % supplierColors.length];
        const isExpanded = expandedSupplier === group.supplierId;
        const pickedCount = group.items.filter(
          i => i.product?.artikelNr && pickedItems.has(i.product.artikelNr)
        ).length;
        const totalCount     = group.items.length;
        const isComplete     = pickedCount === totalCount && totalCount > 0;
        const allMarked      = pickedCount === totalCount;

        return (
          <div
            key={group.supplierId}
            className={`rounded-xl border-2 overflow-hidden shadow-sm transition-all ${
              isComplete ? 'border-green-300' : colors.border
            }`}
          >
            {/* Clickable header — toggles item list */}
            <button
              onClick={() => setExpandedSupplier(isExpanded ? null : group.supplierId)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                isComplete ? 'bg-green-50 hover:bg-green-100' : `${colors.bg} hover:brightness-95`
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {isExpanded
                  ? <ChevronDown className={`h-5 w-5 flex-shrink-0 ${isComplete ? 'text-green-600' : colors.text}`} />
                  : <ChevronRight className={`h-5 w-5 flex-shrink-0 ${isComplete ? 'text-green-600' : colors.text}`} />
                }
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-base ${isComplete ? 'text-green-700' : colors.text}`}>
                      {group.supplierName}
                    </span>
                    {isComplete && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {totalCount} item{totalCount !== 1 ? 's' : ''}
                    {pickedCount > 0 && ` · ${pickedCount}/${totalCount} picked`}
                  </p>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <div className="hidden sm:block w-24 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: totalCount > 0 ? `${Math.round((pickedCount / totalCount) * 100)}%` : '0%',
                      background: isComplete ? '#16a34a' : '#8cb918',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 tabular-nums">
                  {pickedCount}/{totalCount}
                </span>
              </div>
            </button>

            {/* Item list — only rendered when expanded */}
            {isExpanded && (
              <div className="bg-white">
                {/* Mark-all / Unmark-all row */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-500">
                    {pickedCount} of {totalCount} picked
                  </span>
                  <button
                    onClick={() => allMarked ? onUnmarkAllForSupplier(group.items) : onMarkAllForSupplier(group.items)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      allMarked
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {allMarked ? 'Unmark All' : 'Mark All'}
                  </button>
                </div>

                <div className="divide-y divide-gray-50">
                  {group.items.map((item, i) => {
                    const isPicked = !!(item.product?.artikelNr && pickedItems.has(item.product.artikelNr));
                    return (
                      <div
                        key={`${item.product?.artikelNr}-${i}`}
                        onClick={() => item.product?.artikelNr && onToggleItem(item.product.artikelNr)}
                        className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer select-none transition-colors ${
                          isPicked ? 'bg-green-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isPicked}
                          onChange={() => item.product?.artikelNr && onToggleItem(item.product.artikelNr)}
                          onClick={e => e.stopPropagation()}
                          className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400 flex-shrink-0"
                        />
                        <div className={`p-1.5 rounded-md flex-shrink-0 ${isPicked ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Package className={`h-4 w-4 ${isPicked ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isPicked ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-400">Art. {item.product?.artikelNr}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold text-sm tabular-nums ${isPicked ? 'text-gray-400' : 'text-gray-900'}`}>
                            ×{item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
