import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Check, Sparkles } from 'lucide-react';

interface QRCodeViewProps {
  value: string; // The URL or vCard data encoded into the QR code
  size?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  logoUrl?: string;
  className?: string;
  showDownload?: boolean;
  downloadFileName?: string;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  value,
  size = 200,
  foregroundColor = '#0f172a',
  backgroundColor = '#ffffff',
  logoUrl,
  className = '',
  showDownload = false,
  downloadFileName = 'business_card_qr.png'
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(
      value,
      {
        width: size * 2, // 2x resolution for high DPI crispness
        margin: 2,
        color: {
          dark: foregroundColor || '#0f172a',
          light: backgroundColor || '#ffffff'
        },
        errorCorrectionLevel: logoUrl ? 'H' : 'M' // High error correction if logo is overlaid
      },
      (err, url) => {
        if (!isMounted) return;
        if (err) {
          console.error('QR Code generation error:', err);
          setError('Failed to render QR Code');
        } else {
          setDataUrl(url);
          setError(null);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [value, size, foregroundColor, backgroundColor, logoUrl]);

  const handleDownload = () => {
    if (!dataUrl) return;

    if (logoUrl) {
      // Draw logo in center onto a canvas before download
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = size * 2;
        canvas.height = size * 2;
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.onload = () => {
            const logoSize = (size * 2) * 0.22;
            const x = (size * 2 - logoSize) / 2;
            const y = (size * 2 - logoSize) / 2;

            // Draw clean white background behind logo
            ctx.fillStyle = backgroundColor || '#ffffff';
            ctx.beginPath();
            ctx.roundRect(x - 4, y - 4, logoSize + 8, logoSize + 8, 8);
            ctx.fill();

            ctx.drawImage(logoImg, x, y, logoSize, logoSize);

            const finalUrl = canvas.toDataURL('image/png');
            triggerDownload(finalUrl);
          };
          logoImg.onerror = () => triggerDownload(dataUrl);
          logoImg.src = logoUrl;
        } else {
          triggerDownload(dataUrl);
        }
      };
      img.src = dataUrl;
    } else {
      triggerDownload(dataUrl);
    }
  };

  const triggerDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="p-4 text-center text-xs text-red-500 bg-red-50 rounded-xl border border-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-block group">
        {dataUrl ? (
          <div 
            className="p-3.5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ backgroundColor: backgroundColor || '#ffffff' }}
          >
            <img 
              src={dataUrl} 
              alt="Scan QR Code" 
              style={{ width: `${size}px`, height: `${size}px` }}
              className="block object-contain"
            />

            {/* Optional logo overlay in center */}
            {logoUrl && (
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-1 shadow-md border border-slate-200/60 overflow-hidden flex items-center justify-center bg-white"
                style={{ width: `${size * 0.22}px`, height: `${size * 0.22}px` }}
              >
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
            )}
          </div>
        ) : (
          <div 
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex items-center justify-center bg-slate-100 rounded-2xl animate-pulse text-xs text-slate-400 font-medium"
          >
            Generating QR...
          </div>
        )}
      </div>

      {showDownload && dataUrl && (
        <button
          onClick={handleDownload}
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Download size={14} />}
          {copied ? 'QR Code Saved!' : 'Download QR Code'}
        </button>
      )}
    </div>
  );
};
