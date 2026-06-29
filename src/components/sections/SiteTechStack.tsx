'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import {
  Monitor, Globe, Layers, HardDrive, Cpu,
  MessageSquare, Shield, Database, Archive, Brain, BarChart3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Virtual canvas — all node positions live here
───────────────────────────────────────────────────────────────*/
const W = 1000;
const H = 600;
const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/* Deterministic packet durations — avoids SSR/client mismatch */
const PKT_DUR  = [2.2, 1.9, 2.8, 2.4, 1.7, 3.1, 2.0, 2.6, 1.8, 2.3];
const PKT_BEGIN = [2.0, 2.3, 2.6, 2.9, 3.2, 3.5, 3.8, 4.1, 4.4, 4.7];

/* ─────────────────────────────────────────────────────────────
   Node data
───────────────────────────────────────────────────────────────*/
interface NodeDef {
  id: string;
  cx: number; cy: number;
  label: string; sub: string;
  color: string; border: string; glow: string; bg: string;
  Icon: LucideIcon;
}

const NODES: NodeDef[] = [
  {
    id: 'user',
    cx: 60, cy: 300,
    label: 'User Browser', sub: 'Client',
    color: '#94a3b8', border: '#475569', glow: '#47556940', bg: '#0f172a',
    Icon: Monitor,
  },
  {
    id: 'dns',
    cx: 240, cy: 300,
    label: 'Cloudflare DNS', sub: 'DNS · CDN',
    color: '#fb923c', border: '#f97316', glow: '#f9731640', bg: '#1c0900',
    Icon: Globe,
  },
  {
    id: 'amplify',
    cx: 450, cy: 150,
    label: 'AWS Amplify', sub: 'UI Hosting',
    color: '#fbbf24', border: '#f59e0b', glow: '#f59e0b40', bg: '#181000',
    Icon: Layers,
  },
  {
    id: 'r2',
    cx: 720, cy: 75,
    label: 'Cloudflare R2', sub: 'Static Assets',
    color: '#fb923c', border: '#f97316', glow: '#f9731640', bg: '#1c0900',
    Icon: HardDrive,
  },
  {
    id: 'workers',
    cx: 720, cy: 390,
    label: 'CF Workers API', sub: 'API · JWT Auth',
    color: '#fb923c', border: '#f97316', glow: '#f9731640', bg: '#1c0900',
    Icon: Cpu,
  },
  {
    id: 'chatbot',
    cx: 450, cy: 460,
    label: 'Chatbot Worker', sub: 'AI Endpoint',
    color: '#a78bfa', border: '#8b5cf6', glow: '#8b5cf640', bg: '#0e0520',
    Icon: MessageSquare,
  },
  {
    id: 'jwt',
    cx: 590, cy: 540,
    label: 'JWT · Session', sub: 'Auth Layer',
    color: '#34d399', border: '#10b981', glow: '#10b98140', bg: '#001510',
    Icon: Shield,
  },
  {
    id: 'r1db',
    cx: 760, cy: 540,
    label: 'R1 Database', sub: 'Data Storage',
    color: '#38bdf8', border: '#0ea5e9', glow: '#0ea5e940', bg: '#001220',
    Icon: Database,
  },
  {
    id: 'kv',
    cx: 930, cy: 540,
    label: 'Cloudflare KV', sub: 'Token Cache',
    color: '#fb923c', border: '#f97316', glow: '#f9731640', bg: '#1c0900',
    Icon: Archive,
  },
  {
    id: 'claude',
    cx: 930, cy: 280,
    label: 'Claude LLM', sub: 'Anthropic AI',
    color: '#c084fc', border: '#a855f7', glow: '#a855f740', bg: '#0e0520',
    Icon: Brain,
  },
  {
    id: 'ga4',
    cx: 890, cy: 48,
    label: 'Google Analytics', sub: 'Traffic Monitor',
    color: '#facc15', border: '#eab308', glow: '#eab30840', bg: '#181000',
    Icon: BarChart3,
  },
];

/* ─────────────────────────────────────────────────────────────
   Edge data
───────────────────────────────────────────────────────────────*/
interface EdgeDef {
  id: string;
  from: string; to: string;
  label: string;
  color: string;
  dashed?: boolean;
  delay: number;      // line draw-in delay
}

const EDGES: EdgeDef[] = [
  { id: 'e1',  from: 'user',    to: 'dns',     label: 'HTTPS Request',  color: '#94a3b8', delay: 0.1 },
  { id: 'e2',  from: 'dns',     to: 'amplify', label: 'Route → UI',     color: '#fbbf24', delay: 0.4 },
  { id: 'e3',  from: 'dns',     to: 'workers', label: 'Route → API',    color: '#fb923c', delay: 0.4 },
  { id: 'e4',  from: 'dns',     to: 'chatbot', label: 'Route → AI',     color: '#a78bfa', delay: 0.4 },
  { id: 'e5',  from: 'amplify', to: 'r2',      label: 'Fetch Assets',   color: '#fb923c', delay: 0.8 },
  { id: 'e6',  from: 'workers', to: 'jwt',     label: 'Issue JWT',      color: '#34d399', delay: 1.1 },
  { id: 'e7',  from: 'workers', to: 'r1db',    label: 'Query DB',       color: '#38bdf8', delay: 1.1 },
  { id: 'e8',  from: 'workers', to: 'kv',      label: 'Cache Token',    color: '#fb923c', delay: 1.1 },
  { id: 'e9',  from: 'chatbot', to: 'claude',  label: 'LLM Request',    color: '#c084fc', delay: 1.4 },
  { id: 'e10', from: 'ga4',     to: 'amplify', label: 'Monitor Traffic',color: '#facc15', dashed: true, delay: 1.7 },
];

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────*/
function nodeById(id: string) { return NODES.find(n => n.id === id)!; }

function pathD(fromId: string, toId: string): string {
  const a = nodeById(fromId);
  const b = nodeById(toId);
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2;
  if (Math.abs(b.cx - a.cx) >= Math.abs(b.cy - a.cy)) {
    return `M ${a.cx} ${a.cy} C ${mx} ${a.cy} ${mx} ${b.cy} ${b.cx} ${b.cy}`;
  }
  return `M ${a.cx} ${a.cy} C ${a.cx} ${my} ${b.cx} ${my} ${b.cx} ${b.cy}`;
}

function midPoint(fromId: string, toId: string) {
  const a = nodeById(fromId);
  const b = nodeById(toId);
  return { x: (a.cx + b.cx) / 2, y: (a.cy + b.cy) / 2 };
}

/* ─────────────────────────────────────────────────────────────
   Variants
───────────────────────────────────────────────────────────────*/
const nodeVar: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (d: number) => ({
    opacity: 1, scale: 1,
    transition: { delay: d, duration: 0.45, ease },
  }),
};

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────*/
export function SiteTechStack() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="site-tech-stack"
      ref={ref}
      className="py-24 bg-slate-950 relative overflow-hidden"
      aria-label="Site architecture diagram"
    >
      {/* Grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.05) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(148,163,184,0.05) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div aria-hidden="true" className="absolute top-0 left-1/3 w-125 h-125 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/3 w-100 h-100 bg-violet-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10">
            Live Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How This Site Is Built
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            A production-grade cloud system — Cloudflare edge, AWS hosting, serverless APIs,
            JWT auth, AI chatbot, and real-time analytics connected live.
          </p>
        </motion.div>

        {/* Diagram */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-x-auto">
          {/* Aspect-ratio container: 1000 × 600 */}
          <div className="relative" style={{ minWidth: 880, paddingBottom: `${(H / W) * 100}%` }}>
            <div className="absolute inset-0">

              {/* ── SVG: edges + animated packets ───────────────────── */}
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <defs>
                  {/* Glow filter for packets */}
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Named paths reused by animateMotion */}
                  {EDGES.map(e => (
                    <path key={`dp-${e.id}`} id={`dp-${e.id}`} d={pathD(e.from, e.to)} fill="none" />
                  ))}

                  {/* Arrowhead per edge */}
                  {EDGES.map(e => (
                    <marker
                      key={`mk-${e.id}`}
                      id={`mk-${e.id}`}
                      markerWidth="6" markerHeight="6"
                      refX="5" refY="3"
                      orient="auto"
                    >
                      <path d="M0 0 L6 3 L0 6 z" fill={e.color} opacity={0.8} />
                    </marker>
                  ))}
                </defs>

                {/* ── Visible edge strokes (pathLength 0→1 animation) ── */}
                {EDGES.map(e => (
                  <motion.path
                    key={`line-${e.id}`}
                    d={pathD(e.from, e.to)}
                    stroke={e.color}
                    strokeWidth={1.5}
                    strokeDasharray={e.dashed ? '8 5' : undefined}
                    fill="none"
                    opacity={0.5}
                    markerEnd={`url(#mk-${e.id})`}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView
                      ? { pathLength: 1, opacity: 0.5 }
                      : { pathLength: 0, opacity: 0 }}
                    transition={{ delay: e.delay, duration: 0.9, ease }}
                  />
                ))}

                {/* ── Edge labels ── */}
                {EDGES.map(e => {
                  const mid = midPoint(e.from, e.to);
                  return (
                    <motion.text
                      key={`lbl-${e.id}`}
                      x={mid.x}
                      y={mid.y - 9}
                      textAnchor="middle"
                      fontSize={9}
                      fill={e.color}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 0.75 } : { opacity: 0 }}
                      transition={{ delay: e.delay + 0.9, duration: 0.4 }}
                    >
                      {e.label}
                    </motion.text>
                  );
                })}

                {/* ── Animated data packets ── */}
                {inView && EDGES.map((e, i) => (
                  <circle
                    key={`pkt-${e.id}`}
                    r={5}
                    fill={e.color}
                    filter="url(#glow)"
                  >
                    <animateMotion
                      dur={`${PKT_DUR[i % PKT_DUR.length]}s`}
                      repeatCount="indefinite"
                      begin={`${PKT_BEGIN[i % PKT_BEGIN.length]}s`}
                    >
                      <mpath href={`#dp-${e.id}`} />
                    </animateMotion>
                  </circle>
                ))}

                {/* ── Node pulse rings ── */}
                {inView && NODES.map(node => (
                  <circle
                    key={`pulse-${node.id}`}
                    cx={node.cx}
                    cy={node.cy}
                    r={28}
                    fill="none"
                    stroke={node.border}
                    strokeWidth={1}
                    opacity={0}
                  >
                    <animate
                      attributeName="r"
                      from="18" to="36"
                      dur="2.4s"
                      repeatCount="indefinite"
                      begin={`${NODES.indexOf(node) * 0.22}s`}
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4" to="0"
                      dur="2.4s"
                      repeatCount="indefinite"
                      begin={`${NODES.indexOf(node) * 0.22}s`}
                    />
                  </circle>
                ))}
              </svg>

              {/* ── Node cards (absolute-positioned over SVG) ── */}
              {NODES.map((node, i) => {
                const { Icon } = node;
                const edgeArrival = EDGES.find(e => e.to === node.id)?.delay ?? i * 0.08;
                return (
                  <motion.div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${(node.cx / W) * 100}%`,
                      top: `${(node.cy / H) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 136,
                      zIndex: 10,
                    }}
                    custom={edgeArrival + 0.3}
                    variants={nodeVar}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                  >
                    <div
                      className="rounded-xl border px-2.5 py-2 flex flex-col gap-0.5"
                      style={{
                        background: node.bg,
                        borderColor: node.border,
                        boxShadow: `0 0 0 1px ${node.border}30, 0 0 20px ${node.glow}`,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: node.color, flexShrink: 0 }}>
                          <Icon size={13} />
                        </span>
                        <span className="text-white text-[11px] font-semibold leading-tight truncate">
                          {node.label}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-semibold uppercase tracking-widest"
                        style={{ color: node.color, opacity: 0.6, paddingLeft: '17px' }}
                      >
                        {node.sub}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Legend */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          {[
            { label: 'AWS',             color: '#f59e0b' },
            { label: 'Cloudflare',      color: '#f97316' },
            { label: 'Anthropic / AI',  color: '#a855f7' },
            { label: 'Google',          color: '#eab308' },
            { label: 'Auth / Security', color: '#10b981' },
            { label: 'Data / Storage',  color: '#0ea5e9' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: item.color }} />
              <span className="text-slate-400 text-xs">{item.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <svg width="22" height="4" viewBox="0 0 22 4" aria-hidden="true">
              <line x1="0" y1="2" x2="22" y2="2" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            <span className="text-slate-400 text-xs">Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="22" height="4" viewBox="0 0 22 4" aria-hidden="true">
              <circle cx="5" cy="2" r="3" fill="#fb923c" />
              <line x1="9" y1="2" x2="22" y2="2" stroke="#94a3b8" strokeWidth="1" />
            </svg>
            <span className="text-slate-400 text-xs">Live data packet</span>
          </div>
        </motion.div>

        {/* SEO hidden text */}
        <p className="sr-only">
          Built on AWS Amplify for UI hosting and CI/CD, Cloudflare DNS for domain and CDN,
          Cloudflare R2 for static asset storage, Cloudflare Workers for serverless API with
          JWT authentication and session management, Cloudflare KV for token caching,
          R1 Database for persistent data, Claude LLM by Anthropic for the AI chatbot,
          and Google Analytics 4 for traffic monitoring.
        </p>
      </div>
    </section>
  );
}
