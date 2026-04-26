import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Loader, KeyRound, Copy, CheckCircle, X, Globe } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useCustomers } from '../../../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { CustomerSearch } from './CustomerSearch';
import type { Customer } from '../../../types/customer';

function generatePassword(companyName: string): string {
  const clean = companyName.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Stern';
  const upper = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  const symbols = ['!', '#', '@', '*'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  return `${upper}${digits}${sym}`;
}

interface PortalModalProps {
  customer: Customer;
  onClose: () => void;
}

function PortalAccessModal({ customer, onClose }: PortalModalProps) {
  const { user: adminUser } = useAuth();
  const [password] = useState(() => generatePassword(customer.companyName));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const portalUrl = `${window.location.origin}/portal/login`;

  const handleCreate = async () => {
    if (!customer.email) {
      setErrorMsg('This customer has no email address. Add one first.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      // Save admin session before any auth operation
      const { data: { session: adminSession } } = await supabase.auth.getSession();

      const { error } = await supabase.auth.signUp({
        email: customer.email,
        password,
      });

      // Immediately restore admin session (in case signUp replaced it)
      if (adminSession) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }

      if (error) {
        if (error.message?.toLowerCase().includes('already registered')) {
          setErrorMsg(`An account for ${customer.email} already exists. Share the email and the customer's own password, or use "Forgot Password" at the portal login.`);
          setStatus('error');
          return;
        }
        throw error;
      }

      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
      setStatus('error');
    }
  };

  const handleCopy = () => {
    const text = `Portal login details for ${customer.companyName}:\n\nURL: ${portalUrl}\nEmail: ${customer.email}\nPassword: ${password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-yellow-600" />
            <h2 className="font-semibold text-gray-900">Portal Access</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-semibold text-gray-900">{customer.companyName}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Portal URL</p>
              <p className="text-sm font-mono text-gray-700 break-all">{portalUrl}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email (Login)</p>
              <p className="text-sm font-mono text-gray-900">{customer.email || '⚠ No email set'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Generated Password</p>
              <p className="text-lg font-mono font-bold text-gray-900 tracking-widest">{password}</p>
            </div>
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {status === 'success' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">Account created! Share the credentials below.</p>
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <><CheckCircle className="h-4 w-4 text-green-600" /> Copied to clipboard!</>
                ) : (
                  <><Copy className="h-4 w-4" /> Copy credentials to share</>
                )}
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                isLoading={status === 'loading'}
                disabled={status === 'loading' || !customer.email}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white border-0"
              >
                <KeyRound className="h-4 w-4 mr-1.5" />
                Create Account
              </Button>
            </div>
          )}

          {status === 'success' && (
            <button onClick={onClose} className="w-full text-sm text-gray-500 hover:text-gray-700 py-1">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomerList() {
  const navigate = useNavigate();
  const { customers, deleteCustomer, isLoading, error } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [portalCustomer, setPortalCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers
      .filter(customer => {
        if (!customer) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
          (customer.companyName || '').toLowerCase().includes(searchLower) ||
          (customer.contactPerson || '').toLowerCase().includes(searchLower) ||
          (customer.email || '').toLowerCase().includes(searchLower) ||
          (customer.phone || '').toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [customers, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading customers: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {portalCustomer && (
        <PortalAccessModal
          customer={portalCustomer}
          onClose={() => setPortalCustomer(null)}
        />
      )}

      <CustomerSearch
        searchTerm={searchTerm || ''}
        onSearchChange={setSearchTerm}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.companyName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.contactPerson || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPortalCustomer(customer)}
                          title="Create portal access"
                        >
                          <Globe className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/customers/${customer.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this customer?')) {
                              deleteCustomer(customer.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
