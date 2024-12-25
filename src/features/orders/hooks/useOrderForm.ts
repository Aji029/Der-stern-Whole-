import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../../context/OrderContext';
import { validateOrderForm } from '../utils/validation';
import type { OrderFormData } from '../types/orderForm';

const initialFormData: OrderFormData = {
  customerId: '',
  items: [],
  deliveryDate: '',
  shippingAddress: '',
  notes: '',
  status: 'Pending',
  paymentStatus: 'Pending',
};

export function useOrderForm() {
  const navigate = useNavigate();
  const { addOrder } = useOrders();
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateOrderForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      const validItems = formData.items.filter(item => 
        item.product.artikelNr && 
        item.quantity > 0 && 
        item.ekPrice > 0 && 
        item.vkPrice > 0
      );

      await addOrder({
        customer: { id: formData.customerId } as any,
        items: validItems,
        status: formData.status,
        totalAmount: validItems.reduce((sum, item) => sum + (item.quantity * item.vkPrice), 0),
        orderDate: new Date(),
        deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
        paymentStatus: formData.paymentStatus,
        shippingAddress: formData.shippingAddress,
        notes: formData.notes,
      });

      navigate('/dashboard/orders');
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    errors,
    handleSubmit,
  };
}