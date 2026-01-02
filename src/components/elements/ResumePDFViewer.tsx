'use client';

import { useState, useEffect } from 'react';
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './Button';

interface ResumePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string;
}

export const ResumePDFViewer = ({
  isOpen,
  onClose,
  resumeUrl
}: ResumePDFViewerProps) => {
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(100);

  // Check for analytics consent cookie
  const checkConsent = () => {
    const cookies = document.cookie.split('; ');
    const consentCookie = cookies.find((row) => row.startsWith('analytics-consent='));
    
    if (consentCookie) {
      const value = consentCookie.split('=')[1];
      setHasAnalyticsConsent(value === 'true');
      return value === 'true';
    }
    setHasAnalyticsConsent(false);
    return false;
  };

  // Check consent on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      checkConsent();
      
      // Listen for cookie changes
      const interval = setInterval(() => {
        checkConsent();
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleDownloadResume = async () => {
    // Re-check consent before downloading
    const hasConsent = checkConsent();
    
    if (!hasConsent) {
      alert('Please accept analytics cookies to download the resume. Look for the consent banner at the bottom of the page.');
      return;
    }

    setIsDownloading(true);

    try {
      // Validate resumeUrl is available
      if (!resumeUrl) {
        throw new Error('Resume URL is not available');
      }

      // Use fetch to download the file
      const response = await fetch(resumeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Kuhandran_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Success feedback
      console.log('Resume downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resume. Please try again or use your browser\'s download option from the PDF viewer.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(200, prev + 10));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(50, prev - 10));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Full Screen Modal */}
      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Resume</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {hasAnalyticsConsent ? '✓ Download available' : '⚠ Accept cookies to download'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors ml-4"
            aria-label="Close"
            title="Close"
          >
            <X size={28} className="text-slate-600" />
          </button>
        </div>

        {/* Content - Full Screen PDF */}
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

        {/* Footer - Controls & Download */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 md:p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              title="Zoom out"
              disabled={isDownloading}
            >
              <ZoomOut size={18} className="text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-600 min-w-12 text-center">
              {scale}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              title="Zoom in"
              disabled={isDownloading}
            >
              <ZoomIn size={18} className="text-slate-600" />
            </button>
          </div>

          {/* Download Button */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant={hasAnalyticsConsent ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleDownloadResume}
              disabled={!hasAnalyticsConsent || isDownloading}
              className={`flex-1 sm:flex-none ${
                hasAnalyticsConsent ? '' : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <Download size={16} className="mr-2" />
              {isDownloading ? 'Downloading...' : hasAnalyticsConsent ? 'Download' : 'Accept Cookies'}
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

        {/* Info Message */}
        {!hasAnalyticsConsent && (
          <div className="px-4 md:px-6 py-2 md:py-3 bg-amber-50 border-t border-amber-200 text-xs md:text-sm text-amber-800 flex-shrink-0">
            <strong>Note:</strong> To download, please accept analytics cookies in the consent banner at the bottom of the page. Scroll down to see it.
          </div>
        )}
      </div>

      {/* Hide scrollbar when modal is open */}
      {isOpen && (
        <style jsx>{`
          html {
            overflow: hidden;
          }
        `}</style>
      )}
    </>
  );
};
