import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { OrderFormHeader } from '../../../features/orders/components/OrderForm/OrderFormHeader';
import { CustomerSelect } from '../../../features/orders/components/OrderForm/CustomerSelect';
import { OrderItems } from '../../../features/orders/components/OrderForm/OrderItems';
import { OrderDetails } from '../../../features/orders/components/OrderForm/OrderDetails';
import { useOrderForm } from '../../../features/orders/hooks/useOrderForm';

export function AddOrderForm() {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    isSubmitting,
    errors,
    handleSubmit,
  } = useOrderForm();

  const handleItemsChange = (items: any[]) => {
    setFormData(prev => ({ ...prev, items }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <OrderFormHeader />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <CustomerSelect
            value={formData.customerId}
            onChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
            error={errors.customerId}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <OrderItems
            items={formData.items}
            onChange={handleItemsChange}
            errors={errors}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <OrderDetails
            deliveryDate={formData.deliveryDate}
            shippingAddress={formData.shippingAddress}
            notes={formData.notes}
            onDeliveryDateChange={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
            onShippingAddressChange={(address) => setFormData(prev => ({ ...prev, shippingAddress: address }))}
            onNotesChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
            errors={errors}
          />
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/dashboard/orders')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}