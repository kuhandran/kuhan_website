'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/elements/Button';
import { ArrowRight, Mail } from 'lucide-react';

interface FooterCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  primaryButtonAction?: () => void;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  secondaryButtonAction?: () => void;
}

export function FooterCTA({
  title = "Let's Work Together",
  description = 'Have a project in mind? Let us help you bring your ideas to life.',
  primaryButtonText = 'Start a Project',
  primaryButtonHref = '/contact',
  primaryButtonAction,
  secondaryButtonText = 'Get in Touch',
  secondaryButtonHref = 'mailto:contact@example.com',
  secondaryButtonAction,
}: FooterCTAProps) {
  const router = useRouter();

  const handlePrimaryClick = () => {
    if (primaryButtonAction) {
      primaryButtonAction();
    } else if (primaryButtonHref) {
      if (primaryButtonHref.startsWith('http') || primaryButtonHref.startsWith('mailto')) {
        window.location.href = primaryButtonHref;
      } else if (primaryButtonHref.startsWith('#')) {
        // Handle hash links - navigate to home with hash
        router.push('/' + primaryButtonHref);
      } else if (primaryButtonHref === '/contact') {
        // Convert /contact to /#contact for hash-based navigation
        router.push('/#contact');
      } else {
        router.push(primaryButtonHref);
      }
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryButtonAction) {
      secondaryButtonAction();
    } else if (secondaryButtonHref) {
      if (secondaryButtonHref.startsWith('http') || secondaryButtonHref.startsWith('mailto')) {
        window.location.href = secondaryButtonHref;
      } else {
        router.push(secondaryButtonHref);
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">{title}</h2>
          <p className="text-lg text-blue-100 mb-8">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handlePrimaryClick}
              className="bg-white text-blue-600 hover:bg-slate-100 inline-flex items-center gap-2"
            >
              {primaryButtonText}
              <ArrowRight size={18} />
            </Button>
            <Button
              variant="secondary"
              onClick={handleSecondaryClick}
              className="border border-white text-white hover:bg-white/10 inline-flex items-center gap-2"
            >
              <Mail size={18} />
              {secondaryButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Alias for case studies
export const CaseStudyFooterCTA = FooterCTA;
