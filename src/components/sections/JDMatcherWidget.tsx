'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, RotateCcw, Loader2 } from 'lucide-react';
import { useJDMatch } from '@/lib/context/JDMatchContext';
import { trackJDMatch } from '@/lib/analytics/ga4';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const SCORE_COLOR = (s: number) =>
  s >= 75 ? 'text-emerald-500' :
  s >= 50 ? 'text-blue-500'    :
  s >= 30 ? 'text-amber-500'   : 'text-rose-500';

const SCORE_BG = (s: number) =>
  s >= 75 ? 'bg-emerald-500' :
  s >= 50 ? 'bg-blue-500'    :
  s >= 30 ? 'bg-amber-500'   : 'bg-rose-500';

export function JDMatcherWidget() {
  const { result, isAnalyzing, error, analyzeJD, clearMatch } = useJDMatch();
  const [open, setOpen]   = useState(false);
  const [text, setText]   = useState('');
  const textareaRef       = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = async () => {
    await analyzeJD(text);
    if (result) {
      trackJDMatch(result.matchedSkills.length, result.matchedSkills.length + result.missingSkills.length);
      // Scroll to experience section so they see the highlights
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClear = () => { clearMatch(); setText(''); };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 border border-slate-700 shadow-xl text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        aria-label="Match this role against my profile"
      >
        <Sparkles size={15} className="text-blue-400" />
        {result ? (
          <span className={`font-bold ${SCORE_COLOR(result.matchScore)}`}>{result.matchScore}% Match</span>
        ) : (
          <span>Match Your JD</span>
        )}
        {result && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
      </motion.button>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl w-full z-[70] bg-white rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-500" />
                  <span className="font-bold text-slate-900 text-base">AI Job Match Analyzer</span>
                </div>
                <div className="flex items-center gap-2">
                  {result && (
                    <button onClick={handleClear} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                      <RotateCcw size={12} /> Clear
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                    <X size={18} className="text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
                {/* ── Result view ── */}
                {result ? (
                  <div className="space-y-5">
                    {/* Score header */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className={`text-5xl font-extrabold tabular-nums ${SCORE_COLOR(result.matchScore)}`}>
                        {result.matchScore}%
                      </div>
                      <div>
                        <div className={`text-base font-bold ${SCORE_COLOR(result.matchScore)}`}>{result.headline}</div>
                        <div className="w-40 h-2 rounded-full bg-slate-200 mt-2 overflow-hidden">
                          <div className={`h-full rounded-full ${SCORE_BG(result.matchScore)} transition-all duration-700`}
                            style={{ width: `${result.matchScore}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>

                    {/* Matched skills */}
                    {result.matchedSkills.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">✓ Your Matching Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedSkills.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills */}
                    {result.missingSkills.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">⚠ Skills to Develop</p>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highlights */}
                    {result.highlights.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">🎯 Key Highlights for This Role</p>
                        <ul className="space-y-1.5">
                          {result.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <ChevronRight size={14} className="text-blue-400 mt-0.5 shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 text-center">
                      Matching experience highlighted below ↓ scroll to Experience & Skills
                    </p>
                  </div>
                ) : (
                  /* ── Input view ── */
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      Paste any job description and Claude will instantly show how your profile matches — highlighted across Experience and Skills sections.
                    </p>
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder="Paste the job description here…"
                      rows={10}
                      className="w-full px-4 py-3 text-sm rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none text-slate-700 placeholder-slate-400 bg-slate-50 focus:bg-white transition-all"
                    />
                    {error && (
                      <p className="text-xs text-rose-500 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
                    )}
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || text.trim().length < 50}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {isAnalyzing ? (
                        <><Loader2 size={16} className="animate-spin" /> Analyzing with Claude…</>
                      ) : (
                        <><Sparkles size={16} /> Analyze My Match</>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">Powered by Claude · results appear on this page</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
