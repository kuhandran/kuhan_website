'use client';

import { useState, useEffect } from 'react';
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './Button';

interface ResumePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string;
  language?: string;
}

function getConsent(): boolean {
  if (typeof document === 'undefined') return false;
  const cookie = document.cookie.split('; ').find((r) => r.startsWith('analytics-consent='));
  return cookie?.split('=')[1] === 'true';
}

async function trackDownload(language: string) {
  try {
    await fetch('/api/analytics/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'resume_download',
        language,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    });
    // Fire Cloudflare Zaraz event if available (shows in CF dashboard under custom events)
    const w = window as unknown as { zaraz?: { track: (e: string, p?: Record<string, unknown>) => void } };
    w.zaraz?.track('resume_download', { language });
  } catch {
    // best-effort — don't block the download if tracking fails
  }
}

export const ResumePDFViewer = ({
  isOpen,
  onClose,
  resumeUrl,
  language = 'en',
}: ResumePDFViewerProps) => {
  const [hasConsent, setHasConsent] = useState(() => getConsent());
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(100);

  // Re-check consent every 500 ms while the modal is open so the UI
  // updates immediately after the user accepts the consent banner.
  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => setHasConsent(getConsent()), 500);
    return () => clearInterval(id);
  }, [isOpen]);

  const handleDownload = async () => {
    if (!hasConsent) {
      alert('Please accept analytics in the banner at the bottom of the page to unlock the download.');
      return;
    }
    if (!resumeUrl) return;

    setIsDownloading(true);
    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error(response.statusText);

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Kuhandran_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Track AFTER successful download
      await trackDownload(language);
    } catch (error) {
      console.error('Download error:', error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 shrink-0">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Resume</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {hasConsent ? '✓ Download unlocked' : '⚠ Accept analytics to download'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors ml-4"
            aria-label="Close"
          >
            <X size={28} className="text-slate-600" />
          </button>
        </div>

        {/* PDF viewer */}
        <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-600">Loading PDF...</p>
            </div>
          ) : (
            <iframe
              src={`${resumeUrl}#view=fitH`}
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              onLoadStart={() => setIsLoading(true)}
              title="Resume PDF"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 md:p-6 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((p) => Math.max(50, p - 10))}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              title="Zoom out"
              disabled={isDownloading}
            >
              <ZoomOut size={18} className="text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-600 min-w-12 text-center">{scale}%</span>
            <button
              onClick={() => setScale((p) => Math.min(200, p + 10))}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              title="Zoom in"
              disabled={isDownloading}
            >
              <ZoomIn size={18} className="text-slate-600" />
            </button>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant={hasConsent ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleDownload}
              disabled={!hasConsent || isDownloading}
              className={`flex-1 sm:flex-none ${!hasConsent ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <Download size={16} className="mr-2" />
              {isDownloading ? 'Downloading...' : hasConsent ? 'Download' : 'Accept Cookies First'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isDownloading}
              className="flex-1 sm:flex-none"
            >
              Close
            </Button>
          </div>
        </div>

        {!hasConsent && (
          <div className="px-4 md:px-6 py-3 bg-amber-50 border-t border-amber-200 text-sm text-amber-800 shrink-0">
            <strong>Note:</strong> Scroll down to the consent banner and click <strong>Accept &amp; Unlock Download</strong>.
          </div>
        )}
      </div>

      {isOpen && (
        <style jsx>{`html { overflow: hidden; }`}</style>
      )}
    </>
  );
};
