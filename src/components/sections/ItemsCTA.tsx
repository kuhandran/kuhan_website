'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/elements/Button';
import { ArrowRight } from 'lucide-react';

interface ItemsCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonAction?: () => void;
}

export function ItemsCTA({
  title = 'Ready to see what we can do?',
  description = 'Start your next project with our proven expertise.',
  buttonText = 'Get Started',
  buttonHref = '/contact',
  buttonAction,
}: ItemsCTAProps) {
  const router = useRouter();
  
  const handleClick = () => {
    if (buttonAction) {
      buttonAction();
    } else if (buttonHref) {
      // If href starts with # or is a hash link, navigate to home with hash
      if (buttonHref.startsWith('#')) {
        router.push('/' + buttonHref);
      } else if (buttonHref === '/contact') {
        // Convert /contact to /#contact for hash-based navigation
        router.push('/#contact');
      } else {
        // For other routes, use regular navigation
        router.push(buttonHref);
      }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-slate-900">{title}</h2>
          <p className="text-lg text-slate-600 mb-8">{description}</p>

          <Button
            onClick={handleClick}
            className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {buttonText}
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Alias for case studies
export const CaseStudiesCTA = ItemsCTA;
