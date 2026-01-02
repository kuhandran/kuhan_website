// ============================================
// FILE: src/components/layout/Navbar.tsx
// ============================================

'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../elements/Button';
import { ResumePDFViewer } from '../elements/ResumePDFViewer';
import { LanguageSwitcher } from '../language/LanguageSwitcher';
import { Menu, X, Download } from 'lucide-react';
import { getResume } from '@/lib/api/apiClient';
import { useLanguage } from '@/lib/hooks/useLanguageHook';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResumePDFOpen, setIsResumePDFOpen] = useState(false);
  
  // Use original logo with proper sizing
  const logoUrl = '/logo.svg';
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash navigation with improved timing and retry logic
  useEffect(() => {
    const scrollToHash = (attempt = 0, maxAttempts = 100) => {
      const hash = window.location.hash;
      
      // Handle empty hash (#) - scroll to top
      if (hash === '#' || hash === '') {
        if (attempt === 0) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      
      if (hash) {
        const element = document.querySelector(hash);
        
        if (element) {
          // Element found - scroll to it
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } else if (attempt < maxAttempts) {
          // Element not found yet - retry with exponential backoff
          // Very long delays for sections loaded from CDN (achievements, contact)
          let delay: number;
          if (attempt < 10) {
            delay = 300 + (attempt * 100); // 300-1200ms for first 10 attempts
          } else if (attempt < 25) {
            delay = 1500 + ((attempt - 10) * 250); // 1500-4250ms for middle attempts
          } else if (attempt < 50) {
            delay = 5000; // 5s for attempts 25-50
          } else if (attempt < 80) {
            delay = 8000; // 8s for attempts 50-80
          } else {
            delay = 10000; // 10s for final attempts (slow CDN)
          }
          setTimeout(() => scrollToHash(attempt + 1, maxAttempts), delay);
        }
      }
    };

    // Start the scroll attempt
    scrollToHash();
  }, [pathname]);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);
  
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Contact', href: '#contact' }
  ];
  
  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href === '#') {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '/case-studies') {
      // Case Studies page - use router.push for proper Next.js navigation
      router.push('/case-studies');
    } else if (href.startsWith('#')) {
      // Anchor link
      if (pathname !== '/') {
        // Not on home page - navigate to home page WITH hash
        router.push('/' + href);
      } else {
        // Already on home page - scroll directly
        const sectionId = href.substring(1);
        const element = document.getElementById(sectionId);
        
        if (element) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        } else {
          // Fallback: try querySelector
          const fallbackElement = document.querySelector(href);
          if (fallbackElement) {
            requestAnimationFrame(() => {
              fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }
        }
      }
    }
  };
  
  const handleDownloadResume = () => {
    setIsResumePDFOpen(true);
  };
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-xl shadow-xl border-b border-blue-500/20 py-2.5' 
          : 'bg-slate-900/90 backdrop-blur-lg py-3.5'
      }`}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  router.push('/');
                }
              }}
              className="relative z-50 group flex items-center"
              title="Go to home"
            >
              {/* Logo Container with Gradient Background */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <div className="relative bg-white backdrop-blur-sm p-1.5 rounded-md border border-white/20 group-hover:border-blue-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/50">
                  <img 
                    src={logoUrl}
                    alt="Kuhandran Logo"
                    className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
              {/* Brand Text (Optional - uncomment if needed) */}
              {/* <span className="hidden lg:block text-white font-bold text-lg">Kuhandran</span> */}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="relative px-3 py-2 text-sm text-slate-300 hover:text-white font-medium transition-all duration-200 group rounded-md hover:bg-white/5"
                >
                  {link.name}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </button>
              ))}
            </div>
            
            {/* CTA Section - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleDownloadResume}
                className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border-0 whitespace-nowrap"
              >
                <Download size={16} className="mr-1.5 group-hover:animate-bounce" />
                Resume
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher />
              <button
                className="relative z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-400/50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[320px] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-2xl z-40 lg:hidden transition-transform duration-300 ease-in-out border-l border-blue-500/20 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative flex flex-col h-full pt-20 pb-8 px-6">
          {/* Mobile Header */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <h3 className="text-white font-bold text-xl mb-1">Navigation</h3>
            <p className="text-slate-400 text-sm">Explore my portfolio</p>
          </div>
          
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1 mb-auto">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="group relative text-left text-slate-300 hover:text-white font-medium py-3.5 px-4 rounded-lg transition-all hover:bg-white/10 border border-transparent hover:border-blue-500/30"
                style={{ 
                  animation: isMobileMenuOpen ? `slideInRight 0.3s ease-out ${index * 0.05}s both` : 'none'
                }}
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-300"></div>
              </button>
            ))}
          </div>
          
          {/* Mobile CTA Section */}
          <div className="mt-6 space-y-4 pt-6 border-t border-white/10">
            <Button 
              variant="primary" 
              size="md" 
              className="w-full group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 border-0"
              onClick={handleDownloadResume}
            >
              <Download size={18} className="mr-2 group-hover:animate-bounce" />
              Download Resume
            </Button>
            
            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">Get in Touch</p>
              <a 
                href="mailto:skuhandran@yahoo.com"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium mb-3 group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="group-hover:underline">skuhandran@yahoo.com</span>
              </a>
              <a 
                href="tel:+60149337280"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="group-hover:underline">+60 14 933 7280</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add keyframe animation for mobile menu items */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* PDF Viewer Modal */}
      <ResumePDFViewer
        isOpen={isResumePDFOpen}
        onClose={() => setIsResumePDFOpen(false)}
        resumeUrl={getResume('resume.pdf')}
      />
    </>
  );
};