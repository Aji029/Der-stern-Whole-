import React from 'react';
import { Input } from '../../../../components/ui/Input';
import { vatRates, countries, productGroups } from '../../constants/productForm';
import type { Supplier } from '../../../../context/SupplierContext';

interface ProductFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  suppliers: Supplier[];
}

export function ProductFormFields({ formData, setFormData, suppliers }: ProductFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Input
          label="Artikel Nr."
          value={formData.artikelNr}
          onChange={(e) => setFormData(prev => ({ ...prev, artikelNr: e.target.value }))}
          placeholder="35XXX"
          required
        />

        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="VK-Preis €"
            type="number"
            step="0.01"
            value={formData.vkPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, vkPrice: e.target.value }))}
            required
          />

          <Input
            label="EK-Preis €"
            type="number"
            step="0.01"
            value={formData.ekPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, ekPrice: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MwSt %
          </label>
          <select
            value={formData.mwst}
            onChange={(e) => setFormData(prev => ({ ...prev, mwst: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {vatRates.map(rate => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={formData.supplierId}
            onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.companyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <Input
          label="Packung Art Colli"
          value={formData.packungArt}
          onChange={(e) => setFormData(prev => ({ ...prev, packungArt: e.target.value }))}
          required
        />

        <Input
          label="Packung Gebinde Inhalt"
          value={formData.packungInhalt}
          onChange={(e) => setFormData(prev => ({ ...prev, packungInhalt: e.target.value }))}
          placeholder="e.g., 12 x 250 g"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Herkunftsland
          </label>
          <select
            value={formData.herkunftsland}
            onChange={(e) => setFormData(prev => ({ ...prev, herkunftsland: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produktgruppe
          </label>
          <select
            value={formData.produktgruppe}
            onChange={(e) => setFormData(prev => ({ ...prev, produktgruppe: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {productGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.id} - {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}