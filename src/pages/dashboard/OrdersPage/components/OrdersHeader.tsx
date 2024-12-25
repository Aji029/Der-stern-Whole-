import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Calendar } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { useOrders } from '../context/OrdersContext';

export function OrdersHeader() {
  const navigate = useNavigate();
  const { selectedOrders, filters, setFilters } = useOrders();
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        {selectedOrders.length > 0 && (
          <p className="text-sm text-gray-500">
            {selectedOrders.length} orders selected
          </p>
        )}
      </div>
      <div className="flex space-x-3 items-center">
        {selectedOrders.length > 0 && (
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        )}
        
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
          
          {showDatePicker && (
            <div className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Button onClick={() => navigate('/dashboard/orders/new')}>
          <Plus className="h-5 w-5 mr-2" />
          Add Order
        </Button>
      </div>
    </div>
  );
}