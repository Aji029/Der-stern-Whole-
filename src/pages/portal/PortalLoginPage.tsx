import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Star } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { usePortalAuth as useAuth } from '../../context/PortalAuthContext';

export function PortalLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/portal/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/portal/products', { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
         style={{ background: 'linear-gradient(135deg, #2e3c0a 0%, #3d5010 50%, #2e3c0a 100%)' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
               style={{ background: '#8cb918' }}>
            <Star className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        <div className="mt-5 text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-white/50 text-base font-medium tracking-wider uppercase">Der</span>
            <span className="text-white text-3xl font-extrabold tracking-wider uppercase">Stern</span>
          </div>
          <h2 className="mt-2 text-white/70 text-sm font-medium tracking-wide">
            Customer Portal
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur py-8 px-6 shadow-2xl rounded-2xl">
          <h3 className="text-center text-lg font-semibold text-gray-800 mb-6">
            Sign in to place orders
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-white transition-all"
              style={{
                background: isSubmitting ? '#6d9212' : '#8cb918',
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
