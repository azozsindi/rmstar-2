import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitQuotationRequest, DEFAULT_SITE_SETTINGS } from '../../services/db';
import { SiteSettings } from '../../types';
import { CheckCircle2, AlertCircle, Loader2, Send, Fuel, MessageCircle, ExternalLink } from 'lucide-react';

interface QuotationFormProps {
  settings?: SiteSettings;
  onSuccess?: () => void;
  compact?: boolean;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({ settings, compact = false }) => {
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
  const [whatsAppRedirectUrl, setWhatsAppRedirectUrl] = useState<string | null>(null);

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

        // Format Complete WhatsApp Message for Official Procurement Team
        const rawPhone = settings?.officialWhatsApp || DEFAULT_SITE_SETTINGS.officialWhatsApp || '0555338893';
        let cleanNumber = rawPhone.replace(/[^0-9]/g, '');
        if (cleanNumber.startsWith('05')) {
          cleanNumber = '966' + cleanNumber.substring(1);
        } else if (!cleanNumber.startsWith('966')) {
          cleanNumber = '966' + cleanNumber;
        }

        const unitLabel = unit === 'liters'
          ? (locale === 'ar' ? 'لتر' : 'Liters')
          : unit === 'tons'
          ? (locale === 'ar' ? 'طن متري' : 'Metric Tons')
          : (locale === 'ar' ? 'حمولة صهريج كامل' : 'Tanker Loads');

        const cityVal = city.trim() || (locale === 'ar' ? 'الرياض' : 'Riyadh');
        const countryVal = country.trim() || (locale === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia');

        const waText = locale === 'ar'
          ? `السلام عليكم ورحمة الله وبركاته،
أود طلب تسعيرة توريد وقود من شركة آر إم ستار (RM STAR):

📋 تفاصيل الطلب كاملة:
• الاسم الكريم: ${contactName.trim()}
• الشركة / المنشأة: ${companyName.trim()}
• رقم الجوال: ${telephoneNumber.trim()}
• البريد الإلكتروني: ${businessEmail.trim()}
• الموقع والتسليم: ${cityVal} — ${countryVal}
• نوع المنتج المطلوب: ${productRequested}
• الكمية المطلوبة: ${quantity.trim()} ${unitLabel}
${additionalRequirements.trim() ? `• ملاحظات ومتطلبات خاصة: ${additionalRequirements.trim()}\n` : ''}
🔖 الرمز المرجعي للطلب: #${res.id}
📅 تاريخ الطلب: ${new Date().toLocaleDateString('ar-SA')}
— تم إرسال الطلب عبر البوابة الرسمية لشركة RM STAR`
          : `Hello RM STAR Team,
I would like to request an official fuel supply quotation:

📋 Complete Request Details:
• Contact Name: ${contactName.trim()}
• Company: ${companyName.trim()}
• Phone: ${telephoneNumber.trim()}
• Email: ${businessEmail.trim()}
• Delivery Location: ${cityVal}, ${countryVal}
• Product Requested: ${productRequested}
• Quantity Requested: ${quantity.trim()} ${unitLabel}
${additionalRequirements.trim() ? `• Special Notes: ${additionalRequirements.trim()}\n` : ''}
🔖 Reference ID: #${res.id}
📅 Date: ${new Date().toLocaleDateString('en-US')}
— Submitted via RM STAR Official Portal`;

        const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waText)}`;
        setWhatsAppRedirectUrl(waUrl);

        // Immediate redirect to WhatsApp with order details
        try {
          const w = window.open(waUrl, '_blank');
          if (!w || w.closed || typeof w.closed === 'undefined') {
            window.location.href = waUrl;
          }
        } catch {
          window.location.href = waUrl;
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedId && whatsAppRedirectUrl) {
    return (
      <div className="bg-[#121212] border-2 border-[#25D366]/40 rounded-sm p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#25D366]/20 via-[#128C7E]/20 to-[#25D366]/30 flex items-center justify-center border-2 border-[#25D366]/60 text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.3)] animate-pulse">
          <MessageCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#25D366] uppercase tracking-wider block">
            {locale === 'ar' ? 'تم تجهيز الطلب بالكامل' : 'Order Ready For Dispatch'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#F4F1E9]">
            {locale === 'ar' ? 'جارٍ تحويلك إلى واتساب لإرسال الطلب كاملاً!' : 'Redirecting to WhatsApp with Complete Order!'}
          </h3>
          <p className="text-xs sm:text-sm text-[#A6A6A6] max-w-lg mx-auto leading-relaxed">
            {locale === 'ar'
              ? 'تم تسجيل طلبك وحفظه بنجاح برقم مرجعي، وجارٍ فتح محادثة واتساب الرسمية مع مسؤولي عقود توريد الوقود لنقل كافة التفاصيل والكميات.'
              : 'Your quotation request has been recorded and is opening in WhatsApp with all parameters formatted.'}
          </p>
        </div>

        {/* Big pulsing Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsAppRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba59] hover:to-[#0f776a] text-white font-extrabold text-sm sm:text-base rounded-sm shadow-[0_6px_30px_rgba(37,211,102,0.5)] hover:shadow-[0_0_40px_rgba(37,211,102,0.8)] transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <span>{locale === 'ar' ? 'فتح واتساب الآن لإرسال الطلب فوراً' : 'Open WhatsApp to Send Request Now'}</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>
        </div>

        <div className="inline-block bg-[#161616] border border-[#2E2E2E] px-4 py-2 text-xs font-mono text-[#E2C98A] rounded-sm">
          {locale === 'ar' ? 'الرمز المرجعي للطلب: ' : 'Reference ID: '} <span className="font-bold text-[#F4F1E9]">#{submittedId}</span>
        </div>

        <div className="pt-3 border-t border-[#1C1C1C]">
          <button
            onClick={() => {
              setSubmittedId(null);
              setWhatsAppRedirectUrl(null);
              setContactName('');
              setCompanyName('');
              setBusinessEmail('');
              setTelephoneNumber('');
              setCity('');
              setQuantity('');
              setAdditionalRequirements('');
            }}
            className="text-xs text-[#C8A45D] hover:underline cursor-pointer"
          >
            {locale === 'ar' ? '← تقديم طلب عرض أسعار آخر' : '← Submit Another Request'}
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

      {/* WhatsApp Notice & Submit Action */}
      <div className="space-y-3 pt-2">
        <div className="p-3 bg-[#161616] border border-[#25D366]/30 rounded-sm flex items-center gap-2.5 text-xs text-[#A6A6A6]">
          <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
          <span className="leading-relaxed">
            {locale === 'ar'
              ? 'عند إرسال النموذج، سيتم تسجيل الطلب وتحويلك مباشرة إلى محادثة واتساب الرسمية لإرسال الطلب بكامل تفاصيله فوراً.'
              : 'Upon clicking submit, your quotation will be registered and forwarded directly to our official procurement WhatsApp.'}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-sm bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366] hover:from-[#20ba59] hover:to-[#0f776a] text-white font-black text-sm tracking-wide shadow-[0_4px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>{locale === 'ar' ? 'جارٍ تسجيل الطلب وتحويله إلى واتساب...' : 'Processing Quotation & Preparing WhatsApp...'}</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5 text-white" />
              <span>
                {locale === 'ar'
                  ? 'إرسال طلب التسعيرة وتحويل الطلب كاملاً إلى واتساب'
                  : 'Submit & Open Complete Order in WhatsApp'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
