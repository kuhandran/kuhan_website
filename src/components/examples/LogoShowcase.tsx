// ============================================
// FILE: src/components/examples/LogoShowcase.tsx
// Demo component to test all logo variants
// ============================================

'use client';
import { useState } from 'react';

export const LogoShowcase = () => {
  const [selectedLogo, setSelectedLogo] = useState('logo-md.svg');
  
  const logos = [
    { name: 'Small (Mobile)', file: 'logo-sm.svg', size: '120x30px', desc: 'Mobile navbar' },
    { name: 'Medium (Desktop)', file: 'logo-md.svg', size: '200x50px', desc: 'Desktop navbar' },
    { name: 'Large (Hero)', file: 'logo-lg.svg', size: '300x75px', desc: 'Hero sections' },
    { name: 'Original', file: 'logo.svg', size: '1024x1024px', desc: 'Favicon/OG' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎨 Logo Showcase
          </h1>
          <p className="text-slate-400">
            Test all optimized logo variants with different backgrounds and sizes
          </p>
        </div>
        
        {/* Logo Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {logos.map((logo) => (
            <button
              key={logo.file}
              onClick={() => setSelectedLogo(logo.file)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedLogo === logo.file
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="text-white font-semibold mb-1">{logo.name}</div>
              <div className="text-xs text-slate-400 mb-1">{logo.size}</div>
              <div className="text-xs text-slate-500">{logo.desc}</div>
            </button>
          ))}
        </div>
        
        {/* Display Info */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">Selected:</span>
              <span className="text-white ml-2 font-mono">{selectedLogo}</span>
            </div>
            <div>
              <span className="text-slate-400">Dimensions:</span>
              <span className="text-white ml-2">
                {logos.find(l => l.file === selectedLogo)?.size}
              </span>
            </div>
          </div>
        </div>
        
        {/* Preview Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Dark Background */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Dark Backgrounds</h3>
            
            {/* Navbar Style (Current) */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <div className="text-sm text-slate-400 mb-3">Navbar Style (Current)</div>
              <div className="flex items-center justify-center p-8">
                <div className="relative bg-white/10 backdrop-blur-sm p-1 rounded-md border border-white/20 hover:border-blue-400/50 transition-all">
                  <img 
                    src={`/${selectedLogo}`}
                    alt="Logo"
                    className="h-6 w-auto filter brightness-0 invert"
                  />
                </div>
              </div>
            </div>
            
            {/* Solid Dark */}
            <div className="bg-slate-950 rounded-lg p-6 border border-slate-700">
              <div className="text-sm text-slate-400 mb-3">Solid Dark (h-6)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-6 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
            
            {/* Medium Size */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
              <div className="text-sm text-slate-400 mb-3">Medium (h-8)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
            
            {/* Large Size */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-sm text-slate-400 mb-3">Large (h-12)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
          </div>
          
          {/* Light Background */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Light Backgrounds</h3>
            
            {/* White Background */}
            <div className="bg-white rounded-lg p-6 border border-slate-300">
              <div className="text-sm text-slate-600 mb-3">White (h-6)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-6 w-auto"
                />
              </div>
            </div>
            
            {/* Light Gray */}
            <div className="bg-slate-100 rounded-lg p-6 border border-slate-300">
              <div className="text-sm text-slate-600 mb-3">Light Gray (h-6)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-6 w-auto"
                />
              </div>
            </div>
            
            {/* Blue Background */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="text-sm text-blue-600 mb-3">Blue Tint (h-8)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </div>
            </div>
            
            {/* Gradient Background */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6">
              <div className="text-sm text-white mb-3">Gradient (h-12)</div>
              <div className="flex items-center justify-center p-8">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Responsive Width Tests */}
        <div className="mt-12 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Responsive Width Tests</h3>
          
          {/* 41% Width */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-3">41% Width (max-w-200px)</div>
            <div className="flex items-center justify-center p-8">
              <img 
                src={`/${selectedLogo}`}
                alt="Logo"
                className="w-[41%] max-w-[200px] h-auto filter brightness-0 invert"
              />
            </div>
          </div>
          
          {/* Fixed Width */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-3">Fixed Width (w-48)</div>
            <div className="flex items-center justify-center p-8">
              <img 
                src={`/${selectedLogo}`}
                alt="Logo"
                className="w-48 h-auto filter brightness-0 invert"
              />
            </div>
          </div>
          
          {/* Full Width Container */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-400 mb-3">Full Width (w-full in 200px container)</div>
            <div className="flex items-center justify-center p-8">
              <div className="w-[200px]">
                <img 
                  src={`/${selectedLogo}`}
                  alt="Logo"
                  className="w-full h-auto filter brightness-0 invert"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Code Examples */}
        <div className="mt-12 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Code Example</h3>
          <pre className="text-sm text-slate-300 overflow-x-auto">
{`// Navbar implementation
<img 
  src="/${selectedLogo}"
  alt="Logo"
  className="h-6 w-auto filter brightness-0 invert"
/>

// Responsive sizing
<img 
  src="/${selectedLogo}"
  className="w-[41%] max-w-[200px] h-auto"
/>

// With hover effects
<img 
  src="/${selectedLogo}"
  className="h-6 w-auto transition-transform hover:scale-105"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};
