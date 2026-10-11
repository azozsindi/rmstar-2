import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { locale, t } = useLanguage();
  const { signInWithGoogle, loginError, clearError } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setLoading(true);
    const success = await signInWithGoogle();
    setLoading(false);
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080808]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#C8A45D]/50 rounded-sm max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in">
        <button
          onClick={() => {
            clearError();
            onClose();
          }}
          className="absolute top-4 end-4 text-[#888] hover:text-[#FFF] font-mono text-xs"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-[#1A1A1A] border border-[#C8A45D]/40 text-[#E2C98A] flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-[#C8A45D]" />
          </div>
          <h2 className="text-xl font-bold text-[#F4F1E9]">{t('adminLogin')}</h2>
          <p className="text-xs text-[#8A8A8A]">
            {locale === 'ar'
              ? 'بوابة الدخول المشفرة لمسؤولي إدارة منظومة آر إم ستار'
              : 'Secure privileged authentication for authorized RM STAR administrators'}
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-950/50 border border-red-800 rounded-sm flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{loginError}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-sm bg-[#F4F1E9] hover:bg-[#FFFFFF] text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#080808]" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t('adminGoogleLogin')}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-[#666] text-center leading-normal">
            {locale === 'ar'
              ? 'تتم مصادقة الصلاحيات عبر بريد المسؤول المعتمد في قواعد بيانات Firebase.'
              : 'Privileges are validated via authenticated Google identity verified against authorized admin records.'}
          </p>
        </div>
      </div>
    </div>
  );
};
