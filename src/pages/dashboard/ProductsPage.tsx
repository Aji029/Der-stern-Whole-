import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProductList } from '../../features/products/components/ProductList';
import { ProductFilters } from '../../features/products/components/ProductFilters';
import { BackButton } from '../../components/navigation/BackButton';
import { useProductFilters } from '../../features/products/hooks/useProductFilters';

export function ProductsPage() {
  const navigate = useNavigate();
  const { filters, setFilters, filteredProducts } = useProductFilters();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => navigate('/dashboard/products/new')}>
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductFilters filters={filters} onFilterChange={setFilters} />
      <ProductList products={filteredProducts} />
    </div>
  );
}