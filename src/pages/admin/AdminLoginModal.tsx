import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertCircle, Loader2, Lock, User, Eye, EyeOff, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { locale } = useLanguage();
  const isRtl = locale === 'ar';
  const { loginWithCredentials, loginError, clearError } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!username.trim()) {
      setLocalError(isRtl ? 'يرجى إدخال اسم المستخدم.' : 'Please enter your username.');
      return;
    }

    if (!password.trim()) {
      setLocalError(isRtl ? 'يرجى إدخال كلمة المرور.' : 'Please enter your password.');
      return;
    }

    setLoading(true);
    const success = await loginWithCredentials(username, password);
    setLoading(false);

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[#F4F1E9]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-[#777] hover:text-[#F4F1E9] p-1.5 transition-colors rounded-sm hover:bg-[#1A1A1A]"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-sm bg-[#171717] border border-[#C8A45D]/40 mx-auto flex items-center justify-center text-[#E2C98A] shadow-[0_0_15px_rgba(200,164,93,0.15)]">
            <Shield className="w-6 h-6 text-[#C8A45D]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1A1A] border border-[#C8A45D]/30 text-[10px] text-[#E2C98A] font-mono uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#C8A45D]" />
            <span>RM STAR CONTROL SYSTEM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F4F1E9] tracking-tight">
            {isRtl ? 'تسجيل دخول الإدارة' : 'Admin Control Panel Login'}
          </h2>
          <p className="text-xs text-[#8A8A8A] max-w-xs mx-auto">
            {isRtl
              ? 'أدخل اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم والتعديل على كافة عناصر الموقع.'
              : 'Enter your credentials to manage every aspect and content of the website.'}
          </p>
        </div>

        {/* Errors */}
        {(localError || loginError) && (
          <div className="mb-5 p-3 bg-red-950/40 border border-red-500/50 rounded-sm text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{localError || loginError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A6A6A6]">
              {isRtl ? 'اسم المستخدم (Username)' : 'Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setLocalError(null);
                  clearError();
                }}
                className="w-full bg-[#121212] border border-[#2B2B2B] focus:border-[#C8A45D] rounded-sm px-3.5 py-2.5 text-xs text-[#F4F1E9] focus:outline-none focus:ring-1 focus:ring-[#C8A45D] ps-10 font-mono"
                placeholder="rmstar"
                required
              />
              <User className="w-4 h-4 text-[#777] absolute start-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A6A6A6]">
              {isRtl ? 'كلمة المرور (Password)' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError(null);
                  clearError();
                }}
                className="w-full bg-[#121212] border border-[#2B2B2B] focus:border-[#C8A45D] rounded-sm px-3.5 py-2.5 text-xs text-[#F4F1E9] focus:outline-none focus:ring-1 focus:ring-[#C8A45D] ps-10 pe-10 font-mono"
                placeholder="••••••••"
                required
              />
              <Lock className="w-4 h-4 text-[#777] absolute start-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-3 text-[#777] hover:text-[#F4F1E9] transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-[#C8A45D] via-[#E2C98A] to-[#C8A45D] hover:shadow-[0_0_20px_rgba(200,164,93,0.4)] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#080808]" />
            ) : (
              <KeyRound className="w-4 h-4 text-[#080808]" />
            )}
            <span>{loading ? (isRtl ? 'جاري التحقق...' : 'Authenticating...') : (isRtl ? 'دخول لوحة التحكم' : 'Sign In to Dashboard')}</span>
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-5 pt-4 border-t border-[#1C1C1C] text-center">
          <p className="text-[10px] text-[#555] leading-relaxed">
            {isRtl
              ? 'منظومة آر إم ستار المحمية — صلاحيات التعديل الكاملة للمسؤول'
              : 'RM STAR Protected CMS — Full Administrative Privileges'}
          </p>
        </div>
      </div>
    </div>
  );
};
