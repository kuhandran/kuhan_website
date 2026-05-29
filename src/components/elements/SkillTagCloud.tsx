'use client';
import { useEffect, useRef, useMemo, useCallback } from 'react';

interface Skill {
  name: string;
  level: number;
  color: string;
}

// Named aliases → hex (CDN may send either form)
const NAMED_COLORS: Record<string, string> = {
  blue:   '#3b82f6',
  green:  '#10b981',
  amber:  '#f59e0b',
  purple: '#8b5cf6',
  red:    '#ef4444',
  cyan:   '#06b6d4',
  orange: '#f97316',
  pink:   '#ec4899',
};

function resolveHex(color: string): string {
  if (!color) return '#3b82f6';
  if (color.startsWith('#')) return color;           // already hex
  return NAMED_COLORS[color.toLowerCase()] ?? '#3b82f6';
}

const RADIUS = 158;

function fibonacciSphere(i: number, total: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const phi = Math.acos(-1 + (2 * i) / total);
  return { phi, theta: golden * i };
}

export function SkillTagCloud({ skills }: { skills: Skill[] }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const tooltipRef    = useRef<HTMLDivElement>(null);
  const rafRef        = useRef<number>(0);

  // Rotation state — all in refs so RAF never triggers re-render
  const rotY     = useRef(0);
  const rotX     = useRef(0.18);      // slight initial forward tilt
  const velX     = useRef(0);
  const velY     = useRef(0);
  const drag     = useRef({ active: false, lastX: 0, lastY: 0 });
  const hovered  = useRef<string | null>(null);

  // Precompute Fibonacci positions once per skill set
  const base = useMemo(
    () => skills.map((_, i) => fibonacciSphere(i, skills.length)),
    [skills]
  );

  useEffect(() => {
    const container = containerRef.current;
    const tooltip   = tooltipRef.current;
    if (!container || !tooltip) return;

    const tags = Array.from(container.querySelectorAll<HTMLSpanElement>('.stag'));

    const tick = () => {
      // Inertia decay
      velX.current *= 0.92;
      velY.current *= 0.92;

      if (!drag.current.active) {
        // Auto-rotate only when not hovered and not dragging
        if (!hovered.current) rotY.current += 0.007;
        rotY.current += velX.current;
        rotX.current += velY.current;
        // Clamp pitch so sphere never flips
        rotX.current = Math.max(-0.55, Math.min(0.55, rotX.current));
      }

      const cosY = Math.cos(rotY.current), sinY = Math.sin(rotY.current);
      const cosX = Math.cos(rotX.current), sinX = Math.sin(rotX.current);

      tags.forEach((tag, i) => {
        const { phi, theta } = base[i];

        // Sphere → world coords
        const bx = RADIUS * Math.sin(phi) * Math.cos(theta);
        const by = RADIUS * Math.sin(phi) * Math.sin(theta);
        const bz = RADIUS * Math.cos(phi);

        // Rotate Y then X
        const x1 = bx * cosY - bz * sinY;
        const z1 = bx * sinY + bz * cosY;
        const y2 = by * cosX - z1 * sinX;
        const z2 = by * sinX + z1 * cosX;

        const depth = (z2 + RADIUS) / (2 * RADIUS); // 0=back, 1=front
        const isHov = hovered.current === tag.dataset.name;
        const hex   = tag.dataset.hex ?? '#3b82f6';
        const lv    = Number(tag.dataset.level ?? 50);

        // ── GPU-composited properties only (no layout reflow) ──────────────
        // fontSize/fontWeight/letterSpacing cause reflow every frame — use
        // scale instead. profScale encodes proficiency, depthScale encodes depth.
        const profScale  = 0.55 + (lv / 100) * 0.6;
        const depthScale = 0.38 + depth * 0.78;
        const finalScale = (isHov ? 1.3 : 1) * profScale * depthScale;

        const opacity = isHov ? 1 : Math.max(0.07, Math.pow(depth, 1.5));

        // Fold scale into the transform string — single style write, no reflow
        tag.style.transform = `translate(-50%,-50%) translate3d(${x1.toFixed(1)}px,${y2.toFixed(1)}px,${z2.toFixed(1)}px) scale(${finalScale.toFixed(3)})`;
        tag.style.opacity   = opacity.toFixed(3);
        tag.style.zIndex    = String(Math.round(depth * 100) + (isHov ? 500 : 0));

        // Only write filter/glow/color when the value actually changes
        const blur      = !isHov && depth < 0.2 ? (0.2 - depth) * 5 : 0;
        const newFilter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : '';
        if (tag.style.filter !== newFilter) tag.style.filter = newFilter;

        if (isHov) {
          tag.style.textShadow = `0 0 18px ${hex}dd, 0 0 36px ${hex}55`;
          tag.style.color = '#ffffff';
        } else {
          const newGlow = depth > 0.78 ? `0 0 8px ${hex}44` : '';
          if (tag.style.textShadow !== newGlow) tag.style.textShadow = newGlow;
          if (tag.style.color !== hex)          tag.style.color = hex;
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [base]);

  // ── Drag (mouse) ────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    drag.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    velX.current = 0;
    velY.current = 0;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    velX.current = dx * 0.007;
    velY.current = dy * 0.007;
    rotY.current += velX.current;
    rotX.current = Math.max(-0.55, Math.min(0.55, rotX.current + velY.current));
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  }, []);

  const stopDrag = useCallback(() => { drag.current.active = false; }, []);

  // ── Drag (touch) ────────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    drag.current = { active: true, lastX: t.clientX, lastY: t.clientY };
    velX.current = 0; velY.current = 0;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!drag.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - drag.current.lastX;
    const dy = t.clientY - drag.current.lastY;
    velX.current = dx * 0.007;
    velY.current = dy * 0.007;
    rotY.current += velX.current;
    rotX.current = Math.max(-0.55, Math.min(0.55, rotX.current + velY.current));
    drag.current.lastX = t.clientX;
    drag.current.lastY = t.clientY;
  }, []);

  // Unique resolved hex colours (at most 5 shown in legend)
  const uniqueColors = useMemo(
    () => [...new Set(skills.map(s => resolveHex(s.color)))].slice(0, 5),
    [skills]
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 460 }}>

      {/* ── Dark glass background ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg,rgba(8,15,40,0.97) 0%,rgba(15,28,80,0.95) 50%,rgba(8,15,40,0.97) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      />

      {/* Subtle radial glow behind sphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(59,130,246,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Sphere ring outline */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-54%] rounded-full pointer-events-none"
        style={{
          width:  RADIUS * 2 + 30,
          height: RADIUS * 2 + 30,
          border: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '0 0 40px rgba(59,130,246,0.06)',
        }}
      />

      {/* ── Rotating tag sphere ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '900px',
          paddingBottom: 40, // leave room for legend
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
      >
        {skills.map((skill) => {
          const hex = resolveHex(skill.color); // works with both '#rrggbb' and 'blue'
          return (
            <span
              key={skill.name}
              data-name={skill.name}
              data-hex={hex}
              data-level={skill.level}
              className="stag absolute whitespace-nowrap font-semibold"
              style={{
                color: hex,
                top: '50%',
                left: '50%',
                fontSize: 14,           // fixed base — scale handles all sizing
                lineHeight: 1,
                willChange: 'transform, opacity',
                userSelect: 'none',
              }}
              onMouseEnter={() => {
                hovered.current = skill.name;
                if (tooltipRef.current) {
                  tooltipRef.current.textContent = `${skill.name} · ${skill.level}%`;
                  tooltipRef.current.style.opacity = '1';
                  tooltipRef.current.style.color = hex;
                }
              }}
              onMouseLeave={() => {
                hovered.current = null;
                if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
              }}
            >
              {skill.name}
            </span>
          );
        })}
      </div>

      {/* ── Hover tooltip (DOM-updated, no re-render) ── */}
      <div
        ref={tooltipRef}
        className="absolute top-4 left-0 right-0 text-center text-[11px] font-semibold tracking-widest uppercase pointer-events-none"
        style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
      />

      {/* ── Footer ── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Colour swatches (resolved hex, no labels) */}
        <div className="flex items-center gap-2">
          {uniqueColors.map(hex => (
            <div
              key={hex}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: hex, boxShadow: `0 0 6px ${hex}99` }}
              title={hex}
            />
          ))}
          <span className="ml-1 text-[10px]" style={{ color: 'rgba(148,163,184,0.5)' }}>
            {skills.length} skills
          </span>
        </div>
        <span className="text-[10px]" style={{ color: 'rgba(100,116,139,0.6)' }}>
          drag · size = proficiency
        </span>
      </div>
    </div>
  );
}
