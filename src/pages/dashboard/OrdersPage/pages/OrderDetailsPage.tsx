import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import { useProducts } from '../../../../context/ProductContext';
import { useSuppliers } from '../../../../context/SupplierContext';
import { useOrders as useOrdersData } from '../../../../context/OrderContext';
import { Button } from '../../../../components/ui/Button';
import { EditablePrice } from '../../../../components/ui/EditablePrice';
import { ProfitMarginDisplay } from '../../../../components/ProfitMarginDisplay';

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateOrder } = useOrders();
  // getOrder must come from the global OrderContext — the local OrdersContext does not expose it
  const { isLoading: ordersLoading, getOrder } = useOrdersData();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const [order, setOrder] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Skip while the user is actively editing — fetchOrders() runs after every
    // mutation and would overwrite the local edits before Save is clicked.
    if (isEditing) return;
    if (id && !ordersLoading) {
      const orderData = getOrder(id);
      if (orderData) {
        setOrder(orderData);
      } else {
        navigate('/dashboard/orders');
      }
    }
  }, [id, getOrder, navigate, ordersLoading, isEditing]);

  if (ordersLoading || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const recalcTotal = (items: any[]) =>
    items.reduce((sum, i) => sum + (i.quantity * i.vkPrice), 0);

  const handleSave = async () => {
    setSaveError(null);
    try {
      await updateOrder(id!, order);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating order:', error);
      setSaveError(error?.message || 'Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Order
            </Button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {saveError}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Order Details</h2>

        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Company</label>
                <div className="mt-1 text-sm">{order.customer?.companyName ?? 'Unknown Customer'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Contact</label>
                <div className="mt-1 text-sm">{order.customer?.contactPerson ?? '—'}</div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-medium mb-3">Products</h3>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={item.product?.artikelNr || index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium">{item.product?.name ?? 'Unknown Product'}</div>
                      <div className="text-sm text-gray-500">
                        Quantity: {isEditing ? (
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 1;
                              const newItems = [...order.items];
                              newItems[index] = { ...item, quantity: qty, total: qty * item.vkPrice };
                              setOrder({ ...order, items: newItems, totalAmount: recalcTotal(newItems) });
                            }}
                            className="w-20 px-2 py-1 border rounded"
                          />
                        ) : item.quantity}
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = order.items.filter((_: any, i: number) => i !== index);
                          setOrder({ ...order, items: newItems, totalAmount: recalcTotal(newItems) });
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">EK Price</label>
                      {isEditing ? (
                        <EditablePrice
                          value={item.ekPrice}
                          onChange={(value) => {
                            const newItems = [...order.items];
                            newItems[index] = { ...item, ekPrice: value };
                            setOrder({ ...order, items: newItems });
                          }}
                        />
                      ) : (
                        <div className="mt-1">€{item.ekPrice.toFixed(2)}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">VK Price</label>
                      {isEditing ? (
                        <EditablePrice
                          value={item.vkPrice}
                          onChange={(value) => {
                            const newItems = [...order.items];
                            newItems[index] = { ...item, vkPrice: value, total: item.quantity * value };
                            setOrder({ ...order, items: newItems, totalAmount: recalcTotal(newItems) });
                          }}
                        />
                      ) : (
                        <div className="mt-1">€{item.vkPrice.toFixed(2)}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Profit Margin</label>
                      <div className="mt-1">
                        <ProfitMarginDisplay
                          ekPrice={item.ekPrice}
                          vkPrice={item.vkPrice}
                          mwst={item.product?.mwst ?? 'A'}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Supplier
                      </label>
                      <select
                        value={item.product?.supplierId || ''}
                        onChange={(e) => {
                          const newItems = [...order.items];
                          newItems[index] = {
                            ...item,
                            product: {
                              ...item.product,
                              supplierId: e.target.value,
                            },
                          };
                          setOrder({ ...order, items: newItems });
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select supplier</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  disabled={products.length === 0}
                  onClick={() => {
                    if (products.length === 0) return;
                    setOrder({
                      ...order,
                      items: [
                        ...order.items,
                        {
                          product: { artikelNr: '', name: '', mwst: 'A', supplierId: '' },
                          quantity: 1,
                          ekPrice: 0,
                          vkPrice: 0,
                          total: 0,
                        },
                      ],
                    });
                  }}
                >
                  Add Product
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-medium mb-3">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-semibold">
                  €{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
