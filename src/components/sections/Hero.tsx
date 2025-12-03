// ============================================
// FILE: src/components/sections/Hero.tsx
// ============================================

'use client';
import { Button } from '../elements/Button';
import { ArrowDown, Sparkles, Zap, Globe } from 'lucide-react';

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500 rounded-full filter blur-3xl animate-pulse" 
          style={{ animationDelay: '2s' }} 
        />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />
      
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl">
          {/* Greeting Badge */}
          <div className="mb-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
              <Sparkles size={16} className="animate-pulse" />
              Hi, I&apos;m Kuhandran
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Technical Leader Driving{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-pulse">
              Digital Transformation
            </span>
          </h1>
          
          {/* Subheadline with roles */}
          <div className="text-xl md:text-2xl text-slate-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center gap-2 font-semibold text-blue-400">
              <Zap size={20} />
              Technical Delivery Manager
            </span>
            {' '}<span className="text-slate-500">|</span>{' '}
            <span className="font-semibold text-purple-400">Full-Stack Engineer</span>
            {' '}<span className="text-slate-500">|</span>{' '}
            <span className="font-semibold text-emerald-400">Data Enthusiast</span>
          </div>
          
          {/* Description */}
          <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Specialized in enterprise applications, React Native development, and data visualization. 
            Combining 8+ years of technical expertise with strategic business insights to drive 
            operational efficiency and innovation.
          </p>
          
          {/* Key Highlights */}
          <div className="flex flex-wrap gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 text-slate-300 group hover:text-emerald-400 transition-colors">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="font-medium">8+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 group hover:text-blue-400 transition-colors">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="font-medium">Based in Malaysia</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 group hover:text-purple-400 transition-colors">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="font-medium inline-flex items-center gap-1">
                <Globe size={16} />
                Open to Relocation
              </span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="group"
            >
              <span>View My Work</span>
              <ArrowDown size={20} className="ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => scrollToSection('contact')}
            >
              Let&apos;s Connect
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-slate-700/50 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="group cursor-default">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                8+
              </div>
              <div className="text-sm text-slate-400">Years Experience</div>
            </div>
            <div className="group cursor-default">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                15%
              </div>
              <div className="text-sm text-slate-400">Efficiency Gains</div>
            </div>
            <div className="group cursor-default">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                2
              </div>
              <div className="text-sm text-slate-400">Countries</div>
            </div>
            <div className="group cursor-default">
              <div className="text-3xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                MBA
              </div>
              <div className="text-sm text-slate-400">Business Analytics</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-wider">Scroll Down</span>
          <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};