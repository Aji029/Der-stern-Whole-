import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { EditablePrice } from '../../../../components/ui/EditablePrice';
import { ProfitMarginDisplay } from '../../../../components/ProfitMarginDisplay';
import { SupplierSelect } from '../../../../components/orders/SupplierSelect';
import { formatPrice } from '../../../../utils/priceCalculations';
import type { OrderItem } from '../../../../types/order';

interface OrderItemsProps {
  items: OrderItem[];
  products: any[];
  suppliers: any[];
  onUpdateItem: (index: number, updates: Partial<OrderItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export function OrderItems({
  items,
  products,
  suppliers,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
}: OrderItemsProps) {
  const handleProductChange = (index: number, artikelNr: string) => {
    const product = products.find(p => p.artikelNr === artikelNr);
    if (product) {
      onUpdateItem(index, {
        product: {
          artikelNr: product.artikelNr,
          name: product.name,
          mwst: product.mwst,
          supplierId: product.supplierId,
        },
        ekPrice: product.ekPrice,
        vkPrice: product.vkPrice,
        total: product.vkPrice,
      });
    }
  };

  const handleSupplierChange = (index: number, supplierId: string) => {
    onUpdateItem(index, {
      product: {
        ...items[index].product,
        supplierId,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
        <Button onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={item.product.artikelNr || ''}
                  onChange={(e) => handleProductChange(index, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.artikelNr} value={product.artikelNr}>
                      {product.name} ({product.artikelNr})
                    </option>
                  ))}
                </select>
              </div>

              <SupplierSelect
                value={item.product.supplierId || ''}
                onChange={(supplierId) => handleSupplierChange(index, supplierId)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, { 
                    quantity: parseInt(e.target.value),
                    total: parseInt(e.target.value) * item.vkPrice,
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  EK Price
                </label>
                <EditablePrice
                  value={item.ekPrice}
                  onChange={(value) => onUpdateItem(index, { ekPrice: value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VK Price
                </label>
                <EditablePrice
                  value={item.vkPrice}
                  onChange={(value) => onUpdateItem(index, { 
                    vkPrice: value,
                    total: item.quantity * value,
                  })}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <ProfitMarginDisplay
                ekPrice={item.ekPrice}
                vkPrice={item.vkPrice}
                mwst={item.product.mwst}
              />
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-700">
                  Total: {formatPrice(item.total || (item.quantity * item.vkPrice))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}