import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitQuotationRequest } from '../../services/db';
import { CheckCircle2, AlertCircle, Loader2, Send, Fuel } from 'lucide-react';

interface QuotationFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({ compact = false }) => {
  const { locale, t } = useLanguage();

  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [country, setCountry] = useState('Saudi Arabia');
  const [city, setCity] = useState('');
  const [productRequested, setProductRequested] = useState('ديزل تجاري عالي الجودة (Ultra-Low Sulfur Diesel)');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('liters');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!contactName.trim() || !companyName.trim() || !businessEmail.trim() || !telephoneNumber.trim()) {
      setError(locale === 'ar' ? 'يرجى ملء كافة الحقول الأساسية المطلوبة.' : 'Please complete all required fields.');
      return;
    }

    if (!businessEmail.includes('@') || !businessEmail.includes('.')) {
      setError(locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح للعمل.' : 'Please provide a valid corporate email address.');
      return;
    }

    if (!quantity.trim()) {
      setError(locale === 'ar' ? 'يرجى تحديد الكمية المطلوبة.' : 'Please enter requested fuel quantity.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitQuotationRequest({
        contactName: contactName.trim(),
        companyName: companyName.trim(),
        businessEmail: businessEmail.trim(),
        telephoneNumber: telephoneNumber.trim(),
        country: country.trim() || 'Saudi Arabia',
        city: city.trim() || 'Riyadh',
        productRequested,
        quantity: quantity.trim(),
        unit,
        additionalRequirements: additionalRequirements.trim(),
      });

      if (res.success) {
        setSubmittedId(res.id);
        // Reset inputs
        setContactName('');
        setCompanyName('');
        setBusinessEmail('');
        setTelephoneNumber('');
        setCity('');
        setQuantity('');
        setAdditionalRequirements('');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="bg-[#121212] border border-[#C8A45D]/40 rounded-sm p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#C8A45D]/10 flex items-center justify-center border border-[#C8A45D]/40 text-[#E2C98A]">
          <CheckCircle2 className="w-8 h-8 text-[#C8A45D]" />
        </div>
        <h3 className="text-xl font-bold text-[#F4F1E9]">{t('quoteSuccessTitle')}</h3>
        <p className="text-sm text-[#A6A6A6] max-w-lg mx-auto leading-relaxed">
          {t('quoteSuccessDesc')}
        </p>
        <div className="inline-block bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-2 text-xs font-mono text-[#E2C98A]">
          {locale === 'ar' ? 'الرمز المرجعي للطلب: ' : 'Reference ID: '} {submittedId}
        </div>
        <div className="pt-2">
          <button
            onClick={() => setSubmittedId(null)}
            className="text-xs text-[#C8A45D] hover:underline"
          >
            {locale === 'ar' ? 'تقديم طلب جديد' : 'Submit Another Request'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#121212] border border-[#222] rounded-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <div className="p-2 bg-[#1A1A1A] text-[#C8A45D] rounded-sm border border-[#333]">
          <Fuel className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#F4F1E9]">{t('quoteFormTitle')}</h3>
          <p className="text-xs text-[#8A8A8A]">{t('quoteFormSubtitle')}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-sm bg-red-950/40 border border-red-800 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Name */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteFullName')} <span className="text-[#C8A45D]">*</span>
          </label>
          <input
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
            placeholder={locale === 'ar' ? 'سلطان المنصور' : 'John Miller'}
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteCompany')} <span className="text-[#C8A45D]">*</span>
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
            placeholder={locale === 'ar' ? 'شركة المقاولات المتحدة' : 'Apex Logistics LLC'}
          />
        </div>

        {/* Corporate Email */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteEmail')} <span className="text-[#C8A45D]">*</span>
          </label>
          <input
            type="email"
            required
            value={businessEmail}
            onChange={(e) => setBusinessEmail(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
            placeholder="procurement@company.com"
            dir="ltr"
          />
        </div>

        {/* Telephone */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quotePhone')} <span className="text-[#C8A45D]">*</span>
          </label>
          <input
            type="tel"
            required
            value={telephoneNumber}
            onChange={(e) => setTelephoneNumber(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
            placeholder="+966 5X XXX XXXX"
            dir="ltr"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteCountry')}
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
          />
        </div>

        {/* City / Destination */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteCity')}
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
            placeholder={locale === 'ar' ? 'الرياض / الجبيل الصناعية' : 'Riyadh / Industrial City'}
          />
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteProduct')}
          </label>
          <select
            value={productRequested}
            onChange={(e) => setProductRequested(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none transition-colors cursor-pointer"
          >
            <option value="نقل وتوريد ديزل للمصانع والشركات">
              {locale === 'ar' ? 'نقل وتوريد ديزل للشركات والمصانع' : 'Commercial Fuel Supply & Transport for Factories'}
            </option>
            <option value="ديزل تجاري منخفض الكبريت (Euro 5)">
              {locale === 'ar' ? 'ديزل منخفض الكبريت فائق الجودة (Euro 5)' : 'Ultra-Low Sulfur Diesel (Euro 5)'}
            </option>
            <option value="توريد صهاريج ودينات لمواقع العمل">
              {locale === 'ar' ? 'توريد صهاريج ودينات لمواقع العمل والمشروعات' : 'Tanker & Dina Transport to On-site Tanks'}
            </option>
            <option value="ديزل قطاع صناعي ومولدات طاقة">
              {locale === 'ar' ? 'ديزل صناعي للمولدات والمعدات الثقيلة' : 'Industrial Diesel for Heavy Machinery & Generators'}
            </option>
            <option value="عقود توريد ونقل وقود شهرية وسنوية">
              {locale === 'ar' ? 'عقود نقل وقود دورية للأساطيل والشركات' : 'Long-term Corporate Fleet Fuel Contracts'}
            </option>
          </select>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
              {t('quoteQuantity')} <span className="text-[#C8A45D]">*</span>
            </label>
            <input
              type="text"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors"
              placeholder="e.g. 50,000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
              {t('quoteUnit')}
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] outline-none transition-colors cursor-pointer"
            >
              <option value="liters">{t('quoteUnitLiters')}</option>
              <option value="tons">{t('quoteUnitTons')}</option>
              <option value="tankers">{t('quoteUnitTankers')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {!compact && (
        <div>
          <label className="block text-xs font-medium text-[#C8C8C8] mb-1.5">
            {t('quoteNotes')}
          </label>
          <textarea
            rows={3}
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#181818] border border-[#2C2C2C] focus:border-[#C8A45D] rounded-sm text-sm text-[#F4F1E9] placeholder-[#555] outline-none transition-colors resize-none"
            placeholder={locale === 'ar' ? 'حدد موقع الخزانات، مواعيد التفريغ، أو أي متطلبات فنية خاصة...' : 'Provide details on tank locations, preferred delivery windows, discharge pumps...'}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-sm bg-gradient-to-r from-[#C8A45D] via-[#E2C98A] to-[#C8A45D] text-[#080808] font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(200,164,93,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{locale === 'ar' ? 'جارٍ تسجيل الطلب...' : 'Processing Quotation...'}</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>{t('quoteSubmitBtn')}</span>
          </>
        )}
      </button>
    </form>
  );
};
