import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitContactMessage } from '../../services/db';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const { locale, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError(locale === 'ar' ? 'يرجى استكمال جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactMessage({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      if (res.success) {
        setSubmitted(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#121212] border border-[#C8A45D]/40 rounded-sm p-8 text-center space-y-4">
        <CheckCircle2 className="w-10 h-10 text-[#C8A45D] mx-auto" />
        <h3 className="text-lg font-bold text-[#F4F1E9]">{t('contactSuccess')}</h3>
        <p className="text-xs text-[#8A8A8A]">
          {locale === 'ar' ? 'تم تحويل رسالتكم إلى القسم المختص وسنعاود الاتصال بكم قريباً.' : 'Our management team will review your message and reply promptly.'}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-[#E2C98A] hover:underline"
        >
          {locale === 'ar' ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#121212] border border-[#222] rounded-sm p-6 space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-sm bg-red-950/40 border border-red-800 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-[#C8C8C8] mb-1">
          {t('contactName')} <span className="text-[#C8A45D]">*</span>
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1">
            {t('contactEmail')} <span className="text-[#C8A45D]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1">
            {t('contactPhone')}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none"
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#C8C8C8] mb-1">
          {t('contactSubject')} <span className="text-[#C8A45D]">*</span>
        </label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3 py-2 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#C8C8C8] mb-1">
          {t('contactMessage')} <span className="text-[#C8A45D]">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-sm bg-gradient-to-r from-[#C8A45D] to-[#E2C98A] text-[#080808] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>{t('contactSubmitBtn')}</span>
          </>
        )}
      </button>
    </form>
  );
};
