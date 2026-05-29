import React, { useState } from 'react';
import { User, Shield, Lock, ThumbsUp, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';
import AppLogo from './AppLogo';

interface LoginFormProps {
  onLogin: (username: string, role: UserRole) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [role, setRole] = useState<UserRole>('USER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authenticating offline
    setTimeout(() => {
      if (!username.trim()) {
        setError('Please enter a username');
        setIsLoading(false);
        return;
      }

      if (role === 'ADMIN') {
        // Admin credentials validation
        if (password !== 'admin123') {
          setError('Invalid Admin credentials. (Hint: password is "admin123")');
          setIsLoading(false);
          return;
        }
        onLogin(username, 'ADMIN');
      } else {
        // Guest credentials - allow any for local stay registration purposes
        onLogin(username, 'USER');
      }
      setIsLoading(false);
    }, 600);
  };

  const handleQuickLogin = (selectedRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedRole === 'ADMIN') {
        onLogin('Aravind (Admin)', 'ADMIN');
      } else {
        onLogin('Johnathan Doe', 'USER');
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-white min-h-[500px]">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-sky-100 shadow-xl p-8 transition-all duration-300 transform">
        
        {/* App Logo Display in Sky Blue */}
        <AppLogo size="md" showText={true} className="mb-6" />

        {/* Info card */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-slate-500">
            Sign in to access corporate guest house register
          </p>
        </div>

        {/* Role Segmented Tabs Selector */}
        <div className="grid grid-cols-2 gap-1.5 bg-sky-50/75 p-1 rounded-2xl border border-sky-100 mb-6">
          <button
            type="button"
            id="login-role-user"
            onClick={() => {
              setRole('USER');
              setError('');
              if (!username || username === 'Aravind (Admin)') setUsername('');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              role === 'USER'
                ? 'bg-white text-sky-600 shadow-md border-b border-sky-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Guest / User
          </button>
          <button
            type="button"
            id="login-role-admin"
            onClick={() => {
              setRole('ADMIN');
              setError('');
              if (!username || username === 'Johnathan Doe') setUsername('Aravind (Admin)');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              role === 'ADMIN'
                ? 'bg-white text-sky-600 shadow-md border-b border-sky-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            Administrator
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              {role === 'ADMIN' ? 'Admin Username' : 'Guest Name'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-450">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="input-login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'ADMIN' ? 'e.g. Admin Supervisor' : 'Enter your full name'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-250/20 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Input (Admin Specific) */}
          {role === 'ADMIN' && (
            <div className="space-y-1 transition-all">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-400 uppercase">
                  Admin Security Key
                </label>
                <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full">
                  Key: admin123
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-450">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="input-login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-250/20 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-450 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={isLoading}
            className="w-full px-10 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-200/50 hover:bg-sky-700 hover:shadow-xl hover:shadow-sky-300/30 disabled:bg-sky-400 transition-all uppercase text-xs tracking-wide flex items-center justify-center gap-1.5 mt-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Launch {role === 'ADMIN' ? 'Admin Dashboard' : 'Registration Form'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Testing Badges */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            Quick Testing Sandbox Accs
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('USER')}
              className="flex flex-col items-center justify-center p-2.5 border border-dashed border-sky-200 rounded-2xl hover:bg-sky-50/50 transition text-center group"
            >
              <User className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 mt-1">Guest Quick Login</span>
              <span className="text-[9px] text-slate-450 mt-0.5">Simple User Role</span>
            </button>
            <button
              onClick={() => handleQuickLogin('ADMIN')}
              className="flex flex-col items-center justify-center p-2.5 border border-dashed border-sky-300 rounded-2xl hover:bg-sky-50/50 transition text-center group"
            >
              <Shield className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-700 mt-1">Admin Quick Login</span>
              <span className="text-[9px] text-slate-450 mt-0.5">Password Pre-set</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
