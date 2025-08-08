import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import Logo from './Logo';

interface AuthLoginProps {
  onLogin: (user: any) => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Mock validation
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }
    // Simulate login
    await new Promise(res => setTimeout(res, 1200));
    // Replace with real backend auth
    onLogin({
      id: '1',
      name: form.name || 'User',
      email: form.email,
      plan: 'free',
    });
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all fields.');
      setIsLoading(false);
      return;
    }
    // Simulate signup
    await new Promise(res => setTimeout(res, 1200));
    // Replace with real backend signup
    onLogin({
      id: '2',
      name: form.name,
      email: form.email,
      plan: 'free',
    });
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@vinnora.com',
      picture: 'https://via.placeholder.com/40',
      company: 'Vinnora',
      plan: 'free'
    };
    onLogin(mockUser);
    setIsLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!form.email) {
      setError('Please enter your email to reset password.');
      setIsLoading(false);
      return;
    }
    // Simulate forgot password
    await new Promise(res => setTimeout(res, 1200));
    setError('Password reset link sent to your email (mock).');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vinnora CRM</h1>
          <p className="text-gray-600 mt-2">Selling Simplified</p>
          <p className="text-sm text-gray-500 mt-1">Built in India, for Indians</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {showForgot ? 'Forgot Password' : isSignup ? 'Sign Up' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {showForgot
                ? 'Enter your email to reset your password'
                : isSignup
                ? 'Create your account'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Login/Signup/Forgot Form */}
          {!showForgot ? (
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border rounded-lg bg-white"
                    value={form.name}
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                  value={form.email}
                  onChange={handleInput}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                  value={form.password}
                  onChange={handleInput}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => setShowForgot(true)}
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (isSignup ? 'Signing up...' : 'Signing in...') : isSignup ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                  value={form.email}
                  onChange={handleInput}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="text-gray-600 hover:underline text-sm"
                  onClick={() => setShowForgot(false)}
                  disabled={isLoading}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </form>
          )}

          {/* Google Login Button */}
          {!showForgot && (
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
              }`}
              style={{ marginTop: '1rem' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="font-medium">
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
          )}

          <div className="mt-6 text-center">
            <span className="text-gray-700">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              className="ml-2 text-orange-600 hover:underline font-medium"
              onClick={() => {
                setIsSignup(s => !s);
                setError('');
                setShowForgot(false);
              }}
              disabled={isLoading}
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;