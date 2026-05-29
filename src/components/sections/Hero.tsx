'use client';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '../elements/Button';
import { ArrowDown, Sparkles, Zap, Globe } from 'lucide-react';
import { useContentLabels } from '../../lib/data/contentLabels';

const HeroParticles = dynamic(
  () => import('../three/HeroParticles').then((m) => ({ default: m.HeroParticles })),
  { ssr: false, loading: () => null }
);

const DEFAULT_HERO_LABELS = {
  hero: {
    badge: "Hi, I'm Kuhandran",
    mainHeading: 'Technical Leader Driving Digital Transformation',
    description:
      'Specialized in enterprise applications, React Native development, and data visualization. Combining 8+ years of technical expertise with strategic business insights to drive operational efficiency and innovation.',
    roles: {
      primary: 'Technical Delivery Manager',
      secondary: 'Full-Stack Engineer',
      tertiary: 'Data Enthusiast',
    },
    highlights: {
      experience: '8+ Years Experience',
      location: 'Based in Malaysia',
      relocation: 'Open to Relocation',
    },
    cta: { primary: 'View My Work', secondary: "Let's Connect" },
    stats: {
      experience: { value: '8+', label: 'Years Experience' },
      efficiency:  { value: '15%', label: 'Efficiency Gains' },
      countries:   { value: '2',   label: 'Countries' },
      education:   { value: 'MBA', label: 'Business Analytics' },
    },
    scroll: { text: 'Scroll Down', ariaLabel: 'Scroll to about section' },
  },
};

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// ── Magnetic button — client-only spring, no SSR involvement ────────────────
function Magnetic({ children }: { children: ReactNode }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 22 });
  const sy = useSpring(my, { stiffness: 260, damping: 22 });

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width  / 2) * 0.28);
        my.set((e.clientY - r.top  - r.height / 2) * 0.28);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.div>
  );
}

// ── Count-up hook (useEffect-only → runs client-side, no SSR mismatch) ──────
function parseNumeric(s: string) {
  const m = s?.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : null;
}

function useCountUp(target: number, delayMs: number) {
  // Start at 0 — SSR and client both render 0, so no hydration mismatch.
  // No mounted guard: if CDN updates target the effect restarts cleanly.
  // No synchronous setState inside the effect — the first RAF frame
  // naturally produces 0 (eased(0) * target = 0).
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (target <= 0) return;
    const t = setTimeout(() => {
      const dur = 1300;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delayMs);
    return () => clearTimeout(t);
  }, [target, delayMs]);

  return val;
}

// ── Component ────────────────────────────────────────────────────────────────
export const Hero = () => {
  const { contentLabels } = useContentLabels();
  const labels = contentLabels || DEFAULT_HERO_LABELS;

  // Click ripples
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // All mouse tracking via CSS vars — zero hydration risk
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top)  / rect.height;
    const el = e.currentTarget;
    // Spotlight
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    // Parallax layers (CSS transition handles smoothing — no Framer Motion needed)
    el.style.setProperty('--px1', `${(nx - 0.5) * 28}px`);
    el.style.setProperty('--py1', `${(ny - 0.5) * 12}px`);
    el.style.setProperty('--px2', `${(nx - 0.5) * 14}px`);
    el.style.setProperty('--py2', `${(ny - 0.5) *  6}px`);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = performance.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1400);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  // Count-up stats
  const expStr  = labels?.hero?.stats?.experience?.value || '8+';
  const effStr  = labels?.hero?.stats?.efficiency?.value  || '15%';
  const ctryStr = labels?.hero?.stats?.countries?.value   || '2';
  const expP  = parseNumeric(expStr);
  const effP  = parseNumeric(effStr);
  const ctryP = parseNumeric(ctryStr);

  const expCount  = useCountUp(expP?.num  ?? 0, 850);
  const effCount  = useCountUp(effP?.num  ?? 0, 1000);
  const ctryCount = useCountUp(ctryP?.num ?? 0, 1150);

  const statCards = [
    { display: expP  ? `${expCount}${expP.suffix}`   : expStr,  label: labels?.hero?.stats?.experience?.label || 'Years Experience', accent: 'hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10' },
    { display: effP  ? `${effCount}${effP.suffix}`   : effStr,  label: labels?.hero?.stats?.efficiency?.label  || 'Efficiency Gains', accent: 'hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10' },
    { display: ctryP ? `${ctryCount}${ctryP.suffix}` : ctryStr, label: labels?.hero?.stats?.countries?.label   || 'Countries',        accent: 'hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10' },
    { display: labels?.hero?.stats?.education?.value || 'MBA',  label: labels?.hero?.stats?.education?.label   || 'Business Analytics', accent: 'hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10' },
  ];

  return (
    <section
      className="hero-spotlight min-h-screen flex items-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <HeroParticles />

      {/* Click ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="hero-ripple absolute rounded-full border border-blue-400/40 pointer-events-none"
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* Ambient blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
              <Sparkles size={16} className="animate-pulse" />
              {labels?.hero?.badge || 'Welcome to my portfolio'}
            </span>
          </motion.div>

          {/* Headline — CSS-var parallax, entrance via Framer Motion */}
          <div className="hero-layer-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {labels?.hero?.mainHeading || "Hi, I'm Kuhandran"}
            </motion.h1>
          </div>

          {/* Roles — CSS-var parallax layer 2 */}
          <div className="hero-layer-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease }}
              className="text-xl md:text-2xl text-slate-300 mb-4"
            >
              <span className="inline-flex items-center gap-2 font-semibold text-blue-400">
                <Zap size={20} />{labels?.hero?.roles?.primary || 'Full-Stack Developer'}
              </span>
              {' '}<span className="text-slate-500">|</span>{' '}
              <span className="font-semibold text-purple-400">{labels?.hero?.roles?.secondary || 'AI Enthusiast'}</span>
              {' '}<span className="text-slate-500">|</span>{' '}
              <span className="font-semibold text-emerald-400">{labels?.hero?.roles?.tertiary || 'Problem Solver'}</span>
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease }}
            className="text-base text-slate-400 mb-8 max-w-2xl leading-relaxed"
          >
            {labels?.hero?.description || DEFAULT_HERO_LABELS.hero.description}
          </motion.p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease }}
            className="flex flex-wrap gap-6 mb-10"
          >
            {[
              { text: labels?.hero?.highlights?.experience, dot: 'bg-emerald-400' },
              { text: labels?.hero?.highlights?.location,   dot: 'bg-blue-400' },
              { text: labels?.hero?.highlights?.relocation, dot: 'bg-purple-400', icon: <Globe size={14} /> },
            ].map(({ text, dot, icon }, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-default">
                <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${dot}`} />
                <span className="text-sm font-medium inline-flex items-center gap-1">{icon}{text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA — magnetic buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58, ease }}
            className="flex flex-wrap gap-4"
          >
            <Magnetic>
              <Button variant="primary" size="lg" onClick={(e) => { e.stopPropagation(); scrollTo('projects'); }} className="group">
                <span>{labels?.hero?.cta?.primary || 'Explore My Work'}</span>
                <ArrowDown size={18} className="ml-2 group-hover:translate-y-1 transition-transform" />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="secondary" size="lg" onClick={(e) => { e.stopPropagation(); scrollTo('contact'); }}>
                {labels?.hero?.cta?.secondary || 'Get in Touch'}
              </Button>
            </Magnetic>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72, ease }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16 pt-10 border-t border-white/10"
          >
            {statCards.map(({ display, label, accent }, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.04 }}
                transition={{ duration: 0.18, ease }}
                className={`group cursor-default p-4 rounded-xl border border-transparent transition-all duration-300 ${accent}`}
              >
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1 tabular-nums">
                  {display}
                </div>
                <div className="text-xs text-slate-500 tracking-wide">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={(e) => { e.stopPropagation(); scrollTo('about'); }}
          className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label={labels?.hero?.scroll?.ariaLabel || 'Scroll to about section'}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">{labels?.hero?.scroll?.text || 'Scroll'}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
};
