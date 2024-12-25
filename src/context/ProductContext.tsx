import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../lib/db/products';
import type { Product } from '../types/product';

interface ProductContextType {
  products: Product[];
  getProduct: (artikelNr: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'image'> & { image: File | null }) => Promise<void>;
  updateProduct: (artikelNr: string, product: Omit<Product, 'image'> & { image: File | null }) => Promise<void>;
  deleteProduct: (artikelNr: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getProduct = (artikelNr: string) => {
    return products.find(p => p.artikelNr === artikelNr);
  };

  const addProduct = async (newProduct: Omit<Product, 'image'> & { image: File | null }) => {
    try {
      setIsLoading(true);
      await createProduct(newProduct);
      await loadProducts(); // Reload products after creation
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductContext = async (artikelNr: string, updatedProduct: Omit<Product, 'image'> & { image: File | null }) => {
    try {
      setIsLoading(true);
      await updateProduct(artikelNr, updatedProduct);
      await loadProducts(); // Reload products after update
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProductContext = async (artikelNr: string) => {
    try {
      setIsLoading(true);
      await deleteProduct(artikelNr);
      await loadProducts(); // Reload products after deletion
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      getProduct,
      addProduct,
      updateProduct: updateProductContext,
      deleteProduct: deleteProductContext,
      isLoading,
      error,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}