import React, { useState } from 'react';
import Head from 'next/head';

const LoginForm = ({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    onSubmit({ email, password });
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-darkBlue">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-primary hover:text-blue-700 transition-colors">
                Forgot Password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="text-primary font-bold hover:underline">
              Contact Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
