import React from 'react';
import { Package, Loader } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { TodaysPickPDF } from './TodaysPickPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { formatDateForDisplay } from '../../../../utils/dateFormatting';
import type { GroupedOrders } from '../../hooks/useTodaysPick';

interface TodaysPickListProps {
  groupedOrders: GroupedOrders[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
}

export function TodaysPickList({ groupedOrders, selectedDate, isLoading, error }: TodaysPickListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (groupedOrders.length === 0) {
    return (
      <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
        <p className="text-gray-500">No orders to pick for today ({formatDateForDisplay(selectedDate)}).</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Picking list for {formatDateForDisplay(selectedDate)}
        </p>
        <PDFDownloadLink
          document={<TodaysPickPDF groupedOrders={groupedOrders} selectedDate={selectedDate} />}
          fileName={`picking-list-${selectedDate}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? 'Generating PDF...' : 'Download Picking List'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {groupedOrders.map((group) => (
        <div key={group.supplierId} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{group.supplierName}</h2>
            <span className="text-sm text-gray-500">{group.items.length} items</span>
          </div>

          <div className="space-y-4">
            {group.items.map((item, index) => (
              <div
                key={`${item.product.artikelNr}-${index}`}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Art. Nr: {item.product.artikelNr}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}