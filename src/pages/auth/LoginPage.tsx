import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { LogIn, Star } from 'lucide-react';

interface LocationState {
  message?: string;
  from?: Location;
}

export function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccessMessage(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
               style={{ background: '#8cb918' }}>
            <Star className="h-8 w-8 text-white fill-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white/50 text-base font-medium tracking-wider uppercase">Der</span>
            <span className="text-white text-3xl font-extrabold tracking-wider uppercase">Stern</span>
          </div>
        </div>
        <h2 className="mt-5 text-center text-lg font-semibold text-white/70">
          Admin Sign In
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur py-8 px-6 shadow-2xl rounded-2xl">

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 border border-green-200 text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium" style={{ color: '#6d9212' }}>
                Forgot password?
              </Link>
            </div>

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
