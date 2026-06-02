'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface JDMatchResult {
  matchScore:       number;           // 0–100
  headline:         string;           // "Strong Match" | "Good Match" | …
  matchedSkills:    string[];         // skills that appear in both JD + candidate
  missingSkills:    string[];         // JD requires but candidate lacks
  relevantRoles:    string[];         // candidate company names relevant to the JD
  summary:          string;           // 2–3 sentence Claude explanation
  highlights:       string[];         // specific achievements that map to the JD
}

interface JDMatchState {
  result:      JDMatchResult | null;
  isAnalyzing: boolean;
  error:       string | null;
  analyzeJD:   (text: string) => Promise<void>;
  clearMatch:  () => void;
}

const JDMatchContext = createContext<JDMatchState | null>(null);

export function JDMatchProvider({ children }: { children: ReactNode }) {
  const [result, setResult]           = useState<JDMatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const analyzeJD = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-jd', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ jd: text }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data: JDMatchResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearMatch = useCallback(() => { setResult(null); setError(null); }, []);

  return (
    <JDMatchContext.Provider value={{ result, isAnalyzing, error, analyzeJD, clearMatch }}>
      {children}
    </JDMatchContext.Provider>
  );
}

export function useJDMatch() {
  const ctx = useContext(JDMatchContext);
  if (!ctx) throw new Error('useJDMatch must be used inside JDMatchProvider');
  return ctx;
}
