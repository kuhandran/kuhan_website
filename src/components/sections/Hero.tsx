// ============================================
// FILE: src/components/sections/Hero.tsx
// ============================================

'use client';
import { Button } from '../elements/Button';
import { ArrowDown, Sparkles, Zap, Globe } from 'lucide-react';
import contentLabels from '../../../public/data/contentLabels.json';

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
              {contentLabels.hero.badge}
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            {contentLabels.hero.mainHeading}
          </h1>
          
          {/* Subheadline with roles */}
          <div className="text-xl md:text-2xl text-slate-300 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center gap-2 font-semibold text-blue-400">
              <Zap size={20} />
              {contentLabels.hero.roles.primary}
            </span>
            {' '}<span className="text-slate-500">|</span>{' '}
            <span className="font-semibold text-purple-400">{contentLabels.hero.roles.secondary}</span>
            {' '}<span className="text-slate-500">|</span>{' '}
            <span className="font-semibold text-emerald-400">{contentLabels.hero.roles.tertiary}</span>
          </div>
          
          {/* Description */}
          <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {contentLabels.hero.description}
          </p>
          
          {/* Key Highlights */}
          <div className="flex flex-wrap gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 text-slate-300 group hover:text-emerald-400 transition-colors">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="font-medium">{contentLabels.hero.highlights.experience}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 group hover:text-blue-400 transition-colors">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="font-medium">{contentLabels.hero.highlights.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 group hover:text-purple-400 transition-colors">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
              <span className="font-medium inline-flex items-center gap-1">
                <Globe size={16} />
                {contentLabels.hero.highlights.relocation}
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
              <span>{contentLabels.hero.cta.primary}</span>
              <ArrowDown size={20} className="ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => scrollToSection('contact')}
            >
              {contentLabels.hero.cta.secondary}
            </Button>
          </div>
          
          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16 pt-16 border-t border-slate-700/50 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="group cursor-default p-4 rounded-lg hover:bg-blue-500/10 hover:border hover:border-blue-500/30 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {contentLabels.hero.stats.experience.value}
              </div>
              <div className="text-xs md:text-sm text-slate-400">{contentLabels.hero.stats.experience.label}</div>
            </div>
            <div className="group cursor-default p-4 rounded-lg hover:bg-emerald-500/10 hover:border hover:border-emerald-500/30 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {contentLabels.hero.stats.efficiency.value}
              </div>
              <div className="text-xs md:text-sm text-slate-400">{contentLabels.hero.stats.efficiency.label}</div>
            </div>
            <div className="group cursor-default p-4 rounded-lg hover:bg-purple-500/10 hover:border hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {contentLabels.hero.stats.countries.value}
              </div>
              <div className="text-xs md:text-sm text-slate-400">{contentLabels.hero.stats.countries.label}</div>
            </div>
            <div className="group cursor-default p-4 rounded-lg hover:bg-amber-500/10 hover:border hover:border-amber-500/30 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {contentLabels.hero.stats.education.value}
              </div>
              <div className="text-xs md:text-sm text-slate-400">{contentLabels.hero.stats.education.label}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          aria-label={contentLabels.hero.scroll.ariaLabel}
        >
          <span className="text-xs uppercase tracking-wider">{contentLabels.hero.scroll.text}</span>
          <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};