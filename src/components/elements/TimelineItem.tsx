'use client';
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './Badge';
import { getImage } from '@/lib/api/apiClient';
import { MapPin, Calendar, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { getRelevanceBadge } from '@/lib/hooks/useGeolocation';

interface TimelineItemProps {
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  techStack: string[];
  isLeft?: boolean;
  logo?: string;
  visitorCountry?: string;
}

const PREVIEW_COUNT = 2;

const highlightNumbers = (text: string): React.ReactNode => {
  const parts = text.split(/(\b\d[\d,.]*[%+]?\b)/g);
  return parts.map((part, i) =>
    /^\d/.test(part) ? (
      <strong key={i} className="text-blue-600 font-bold">{part}</strong>
    ) : part
  );
};

const BADGE_COLORS = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
  amber:   'bg-amber-50 text-amber-700 border-amber-200',
};

const TimelineItemInner = ({
  title,
  company,
  duration,
  location,
  description,
  techStack,
  logo,
  visitorCountry,
}: TimelineItemProps) => {
  const isCurrent      = duration.toLowerCase().includes('present');
  const relevanceBadge = getRelevanceBadge(visitorCountry ?? '');
  const items          = Array.isArray(description) ? description : [];
  const hasMore    = items.length > PREVIEW_COUNT;
  const [expanded, setExpanded] = useState(false);

  const preview  = items.slice(0, PREVIEW_COUNT);
  const extra    = items.slice(PREVIEW_COUNT);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 group
        ${isCurrent
          ? 'shadow-xl shadow-blue-100/60 border border-blue-200 ring-1 ring-blue-100'
          : 'shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300'
        }`}
    >
      {/* Left accent stripe */}
      <div
        className={`absolute inset-y-0 left-0 w-1
          ${isCurrent
            ? 'bg-linear-to-b from-blue-400 via-blue-500 to-blue-600'
            : 'bg-linear-to-b from-slate-300 to-slate-200'
          }`}
      />

      {/* Card background */}
      <div className={isCurrent ? 'bg-linear-to-br from-blue-50/40 via-white to-white' : 'bg-white'}>

        {/* ── Header ── */}
        <div className="flex items-start gap-4 pl-7 pr-6 pt-6 pb-5">
          {logo && (
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                ${isCurrent
                  ? 'bg-white shadow-md ring-2 ring-blue-100'
                  : 'bg-slate-50 shadow-sm ring-1 ring-slate-200'
                }`}
            >
              <picture>
                <source srcSet={getImage(logo).replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                <img src={getImage(logo)} alt={company} className="w-9 h-9 object-contain" />
              </picture>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isCurrent && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Currently Here
                </span>
              )}
              {relevanceBadge && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${BADGE_COLORS[relevanceBadge.variant]}`}>
                  {relevanceBadge.text}
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={11} className="text-slate-400" />{duration}
              </span>
              <span className="text-slate-300 text-xs select-none">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={11} className="text-slate-400" />{location}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">{title}</h3>
            <p className={`text-sm font-semibold mt-0.5 ${isCurrent ? 'text-blue-600' : 'text-slate-500'}`}>
              {company}
            </p>
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="pl-7 pr-6 pb-5">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={13} className="text-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Key Impact</span>
          </div>

          <ul className="space-y-2.5">
            {/* Always-visible first 2 */}
            {preview.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className={`mt-1.75 w-1.5 h-1.5 rounded-full shrink-0 ${isCurrent ? 'bg-blue-400' : 'bg-slate-300'}`} />
                <span>{highlightNumbers(item)}</span>
              </li>
            ))}

            {/* Expandable extra items */}
            <AnimatePresence initial={false}>
              {expanded && extra.map((item, i) => (
                <motion.li
                  key={`extra-${i}`}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed overflow-hidden"
                >
                  <span className={`mt-1.75 w-1.5 h-1.5 rounded-full shrink-0 ${isCurrent ? 'bg-blue-400' : 'bg-slate-300'}`} />
                  <span>{highlightNumbers(item)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Show more / less toggle */}
          {hasMore && (
            <button
              onClick={() => setExpanded(v => !v)}
              className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-colors
                ${isCurrent
                  ? 'text-blue-500 hover:text-blue-700'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {expanded ? (
                <><ChevronUp size={13} /> Show less</>
              ) : (
                <><ChevronDown size={13} /> +{extra.length} more achievement{extra.length > 1 ? 's' : ''}</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Tech stack footer ── */}
      {techStack?.length > 0 && (
        <div
          className={`pl-7 pr-6 py-3.5 border-t flex flex-wrap gap-1.5
            ${isCurrent ? 'border-blue-100 bg-blue-50/50' : 'border-slate-100 bg-slate-50/70'}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 self-center mr-1">Stack</span>
          {techStack.map((tech, i) => (
            <Badge key={i} variant={isCurrent ? 'blue' : 'gray'} size="sm">{tech}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export const TimelineItem = memo(TimelineItemInner);
