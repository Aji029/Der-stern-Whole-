import { supabase } from '../supabase';
import type { Supplier } from '../../types/supplier';

export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      companyName: item.company_name,
      contactPerson: item.contact_person,
      email: item.email,
      phone: item.phone,
      address: item.address,
      taxId: item.tax_id,
      paymentTerms: item.payment_terms,
      supplierType: item.supplier_type,
      rating: item.rating,
      notes: item.notes
    }));
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
    throw error;
  }
}

export async function createSupplier(supplier: Omit<Supplier, 'id'>): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    const { error } = await supabase
      .from('suppliers')
      .insert([{
        company_name: supplier.companyName,
        contact_person: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        tax_id: supplier.taxId,
        payment_terms: supplier.paymentTerms,
        supplier_type: supplier.supplierType,
        rating: supplier.rating,
        notes: supplier.notes,
        user_id: user.id
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to create supplier:', error);
    throw error;
  }
}

export async function updateSupplier(id: string, supplier: Supplier): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    const { error } = await supabase
      .from('suppliers')
      .update({
        company_name: supplier.companyName,
        contact_person: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        tax_id: supplier.taxId,
        payment_terms: supplier.paymentTerms,
        supplier_type: supplier.supplierType,
        rating: supplier.rating,
        notes: supplier.notes
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to update supplier:', error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) throw new Error('Authentication required');

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete supplier:', error);
    throw error;
  }
}