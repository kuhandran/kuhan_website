// ============================================
// FILE: src/components/layout/Navbar.tsx
// ============================================

'use client';
import { useState, useEffect } from 'react';
import { Button } from '../elements/Button';
import { ResumePDFViewer } from '../elements/ResumePDFViewer';
import { Menu, X, Download } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResumePDFOpen, setIsResumePDFOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Contact', href: '#contact' }
  ];
  
  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/')) {
      // External internal route
      window.location.href = href;
    } else {
      // Anchor link
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleDownloadResume = () => {
    setIsResumePDFOpen(true);
  };
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-3' 
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => handleNavClick('#')}
              className="text-2xl md:text-3xl font-bold text-slate-900 hover:text-blue-600 transition-colors z-50"
            >
              <span className="inline-block hover:scale-110 transition-transform">
                KS<span className="text-blue-500">.</span>
              </span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="relative text-slate-600 hover:text-blue-600 font-medium transition-colors group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>
            
            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleDownloadResume}
                className="group"
              >
                <Download size={16} className="mr-2 group-hover:animate-bounce" />
                Download Resume
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-900 z-50 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={28} className="text-slate-900" />
              ) : (
                <Menu size={28} />
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 pb-8 px-6">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-2 mb-8">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-all transform hover:translate-x-2"
                style={{ 
                  animation: isMobileMenuOpen ? `slideInRight 0.3s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {/* Mobile CTA Button */}
          <div className="mt-auto">
            <Button 
              variant="primary" 
              size="md" 
              className="w-full group"
              onClick={handleDownloadResume}
            >
              <Download size={18} className="mr-2 group-hover:animate-bounce" />
              Download Resume
            </Button>
            
            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-2">Get in touch</p>
              <a 
                href="mailto:skuhandran@yahoo.com"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium block mb-2"
              >
                skuhandran@yahoo.com
              </a>
              <a 
                href="tel:+60149337280"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium block"
              >
                +60 14 933 7280
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
        resumeUrl="https://static.kuhandranchatbot.info/resume/resume.pdf"
      />
    </>
  );
};