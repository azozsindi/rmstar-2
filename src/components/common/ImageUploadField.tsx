import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Check, Loader2, Sparkles } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  aspectRatio?: 'banner' | 'landscape' | 'square';
  placeholderText?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Compresses an image file client-side via HTML5 Canvas
 * Resizes to max 1600px and 82% JPEG quality, typically reducing 5-15MB phone photos to ~90KB
 */
export const compressImageFile = (file: File, maxDimension = 1600, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'landscape',
  placeholderText,
  className = '',
  compact = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
      // Reset input so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const heightClasses = {
    banner: 'h-40 sm:h-48',
    landscape: 'h-32 sm:h-36',
    square: 'h-28 sm:h-32 w-28 sm:w-32',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#C8C8C8] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>{label}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] text-[#888] hover:text-[#C8A45D] flex items-center gap-1 transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'إخفاء الرابط' : 'أو إدخال رابط ويب'}</span>
          </button>
        </div>
      )}

      {/* Preview Box & Upload Button */}
      <div className="bg-[#141414] border border-[#262626] rounded-sm p-3 space-y-3">
        {value ? (
          <div className="space-y-2">
            <div className={`relative ${heightClasses[aspectRatio]} rounded-sm overflow-hidden border border-[#333] bg-[#0A0A0A] group`}>
              <img
                src={value}
                alt={label || 'Uploaded preview'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                <span className="text-[10px] text-[#E2C98A] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#C8A45D]" />
                  <span>تم تعيين الصورة بنجاح</span>
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 rounded text-xs transition-colors cursor-pointer"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Change button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-[#1C1C1C] hover:bg-[#282828] border border-[#C8A45D]/50 hover:border-[#C8A45D] text-xs font-semibold text-[#E2C98A] rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C8A45D]" />
                    <span>جارٍ معالجة وضغط الصورة...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>تغيير الصورة من الاستوديو / الجهاز</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="py-2 px-3 bg-[#1C1C1C] hover:bg-red-950/50 border border-[#333] hover:border-red-500/50 text-xs text-[#888] hover:text-red-300 rounded-sm transition-colors cursor-pointer"
                title="إزالة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty State - Big Upload Prompt */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#333] hover:border-[#C8A45D]/70 bg-[#0F0F0F] hover:bg-[#161616] rounded-sm p-5 text-center cursor-pointer transition-all duration-200 group"
          >
            {isProcessing ? (
              <div className="py-4 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#C8A45D] mx-auto" />
                <p className="text-xs font-semibold text-[#E2C98A]">جارٍ معالجة وضغط الصورة من الاستوديو...</p>
              </div>
            ) : (
              <div className="py-2 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#1A1A1A] group-hover:bg-[#C8A45D]/10 border border-[#333] group-hover:border-[#C8A45D]/50 flex items-center justify-center text-[#A6A6A6] group-hover:text-[#E2C98A] transition-all">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#F4F1E9] group-hover:text-[#E2C98A] transition-colors block">
                    رفع صورة من الاستوديو / مكتبة الصور
                  </span>
                  <span className="text-[11px] text-[#777] mt-0.5 block">
                    {placeholderText || 'اضغط هنا لاختيار صورة من هاتفك أو جهازك (JPG, PNG, WebP)'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] rounded-full text-[10px] text-[#999] border border-[#2E2E2E]">
                  <Sparkles className="w-3 h-3 text-[#C8A45D]" />
                  <span>يتم ضغط الصورة تلقائياً لأعلى سرعة وجودة</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Optional Web URL Input */}
        {showUrlInput && (
          <div className="pt-2 border-t border-[#222] space-y-1">
            <span className="text-[11px] text-[#888] block">أو ألصق رابط صورة مباشر (URL):</span>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#C8A45D] rounded px-3 py-1.5 text-xs text-[#F4F1E9] font-mono focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
