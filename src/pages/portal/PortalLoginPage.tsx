import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Star } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { usePortalAuth as useAuth } from '../../context/PortalAuthContext';

export function PortalLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(formData.email, formData.password);
      navigate('/portal', { replace: true });
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Star className="h-12 w-12 text-yellow-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Customer Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to place orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 text-red-800 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              {!isLoading && <LogIn className="h-5 w-5 mr-2" />}
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
