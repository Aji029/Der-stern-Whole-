import React from 'react';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';

interface OrderDateFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onClear: () => void;
}

export function OrderDateFilter({
  selectedDate,
  onDateChange,
  onClear
}: OrderDateFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filter by Date:</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />

            {selectedDate && (
              <div className="text-sm text-gray-600">
                Showing orders for: {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </div>
            )}
          </div>
        </div>

        {selectedDate && (
          <button
            onClick={onClear}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}