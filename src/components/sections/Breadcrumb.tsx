'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb() {
  const router = useRouter();
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href?: string; isLast?: boolean }[] = [
      { label: 'Home', href: '/' },
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label: label,
        href: isLast ? undefined : currentPath,
        isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="bg-white border-b border-slate-200" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight size={16} className="text-slate-400" />}
              {crumb.href ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-slate-600 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Alias for case studies
export const CaseStudyBreadcrumb = Breadcrumb;
