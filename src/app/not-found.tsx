'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          404
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Page Not Found
        </h2>
        
        <p className="text-xl text-slate-300 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
              <ChevronLeft size={20} />
              Back to Home
            </button>
          </Link>
          
          <Link href="/case-studies">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors">
              View Case Studies
            </button>
          </Link>
        </div>

        <div className="mt-16 text-slate-400">
          <p className="text-sm">
            Error Code: 404 | Page Not Found
          </p>
        </div>
      </div>
    </main>
  );
}
