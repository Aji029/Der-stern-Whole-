import { supabase } from '../supabase';
import type { Customer } from '../../types/customer';

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch customers');
    }

    if (!data) {
      return [];
    }

    return data.map(item => ({
      id: item.id,
      companyName: item.company_name,
      contactPerson: item.contact_person,
      email: item.email,
      phone: item.phone,
      address: item.address,
      taxId: item.tax_id,
    }));
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    throw error;
  }
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('customers')
      .insert([{
        company_name: customer.companyName,
        contact_person: customer.contactPerson,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        tax_id: customer.taxId
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to create customer:', error);
    throw error;
  }
}

export async function updateCustomer(id: string, customer: Customer): Promise<void> {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        company_name: customer.companyName,
        contact_person: customer.contactPerson,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        tax_id: customer.taxId
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to update customer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete customer:', error);
    throw error;
  }
}