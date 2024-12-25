import React from 'react';
import { useSuppliers } from '../../context/SupplierContext';

interface SupplierSelectProps {
  value: string;
  onChange: (supplierId: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export function SupplierSelect({ 
  value, 
  onChange, 
  error,
  required = false,
  className = ''
}: SupplierSelectProps) {
  const { suppliers, isLoading } = useSuppliers();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Supplier
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        required={required}
        disabled={isLoading}
      >
        <option value="">Select a supplier</option>
        {suppliers.map(supplier => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.companyName}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}