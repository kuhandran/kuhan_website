'use client';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/config/domains';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrgInfo {
  raw:    string;   // "AS45609 FWD Insurance"
  name:   string;   // "FWD Insurance"
  asn:    string;   // "AS45609"
  domain: string;   // "fwd.com.my" (from reverse DNS hostname)
  isp:    string;   // "FWD Life Insurance"
}

export interface ReferrerInfo {
  raw:          string;
  domain:       string;
  isLinkedIn:   boolean;
  isGoogle:     boolean;
  isJobBoard:   boolean;   // Indeed, Glassdoor, JobStreet, Hiredly…
  isDirect:     boolean;   // no referrer = email link / bookmark / type-in
  searchQuery:  string;    // Google query if detectable (often blocked now)
}

export interface DeviceInfo {
  os:         'Windows' | 'Mac' | 'Linux' | 'Android' | 'iOS' | 'Other';
  browser:    'Chrome' | 'Edge' | 'Firefox' | 'Safari' | 'Other';
  resolution: string;   // "1920×1080"
  language:   string;   // "en-GB"
  timezone:   string;   // "Europe/London"
  cpuCores:   number;
  memory:     number | null;   // GB, Chrome only
}

export interface SessionInfo {
  visitCount:   number;   // 1 = first time, 2+ = return visitor
  lastVisitAt:  string | null;
  firstVisitAt: string;
  sessionId:    string;   // random, per-tab
}

export interface VisitorIntelligence {
  ip:       string;
  country:  string;
  city:     string;
  org:      OrgInfo;
  referrer: ReferrerInfo;
  device:   DeviceInfo;
  session:  SessionInfo;
  loading:  boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cleanOrgName(raw: string): string {
  // "AS45609 FWD Insurance" → "FWD Insurance"
  return raw.replace(/^AS\d+\s+/i, '').trim();
}

function extractDomain(hostname: string): string {
  // "proxy01.corp.fwd.com.my" → "fwd.com.my"
  if (!hostname) return '';
  const parts = hostname.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
}

const JOB_BOARDS = [
  'indeed', 'glassdoor', 'jobstreet', 'jobsdb', 'hiredly',
  'linkedin', 'monster', 'reed', 'totaljobs', 'seek', 'mycareersfuture',
];

function analyzeReferrer(raw: string): ReferrerInfo {
  if (!raw) {
    return {
      raw: '', domain: '', isLinkedIn: false, isGoogle: false,
      isJobBoard: false, isDirect: true, searchQuery: '',
    };
  }
  try {
    const url   = new URL(raw);
    const host  = url.hostname.toLowerCase();
    const query = url.searchParams.get('q') ?? url.searchParams.get('query') ?? '';
    return {
      raw,
      domain:      host,
      isLinkedIn:  host.includes('linkedin.com'),
      isGoogle:    host.includes('google.'),
      isJobBoard:  JOB_BOARDS.some(j => host.includes(j)),
      isDirect:    false,
      searchQuery: query,
    };
  } catch {
    return {
      raw, domain: raw, isLinkedIn: false, isGoogle: false,
      isJobBoard: false, isDirect: false, searchQuery: '',
    };
  }
}

function parseDevice(): DeviceInfo {
  const ua = navigator.userAgent;

  const os =
    /Windows/.test(ua)     ? 'Windows' :
    /Macintosh/.test(ua)   ? 'Mac'     :
    /Android/.test(ua)     ? 'Android' :
    /iPhone|iPad/.test(ua) ? 'iOS'     :
    /Linux/.test(ua)       ? 'Linux'   : 'Other';

  const browser =
    /Edg\//.test(ua)                        ? 'Edge'    :
    /Chrome\//.test(ua)                     ? 'Chrome'  :
    /Firefox\//.test(ua)                    ? 'Firefox' :
    /Safari\//.test(ua)                     ? 'Safari'  : 'Other';

  return {
    os,
    browser,
    resolution: `${screen.width}×${screen.height}`,
    language:   navigator.language,
    timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone,
    cpuCores:   navigator.hardwareConcurrency ?? 0,
    memory:     (navigator as { deviceMemory?: number }).deviceMemory ?? null,
  };
}

const SESSION_KEY  = 'vi_session';
const VISIT_KEY    = 'vi_visits';
const LAST_KEY     = 'vi_last';
const FIRST_KEY    = 'vi_first';

function readSession(): SessionInfo {
  try {
    const now       = new Date().toISOString();
    const existing  = sessionStorage.getItem(SESSION_KEY);
    const sessionId = existing ?? Math.random().toString(36).slice(2);
    if (!existing) sessionStorage.setItem(SESSION_KEY, sessionId);

    const count     = (parseInt(localStorage.getItem(VISIT_KEY) ?? '0') + (existing ? 0 : 1));
    const lastVisit = localStorage.getItem(LAST_KEY);
    const firstVisit = localStorage.getItem(FIRST_KEY) ?? now;

    if (!existing) {
      localStorage.setItem(VISIT_KEY, String(count));
      localStorage.setItem(LAST_KEY,  now);
      if (!localStorage.getItem(FIRST_KEY)) localStorage.setItem(FIRST_KEY, now);
    }

    return {
      visitCount:   count,
      lastVisitAt:  lastVisit,
      firstVisitAt: firstVisit,
      sessionId,
    };
  } catch {
    return {
      visitCount: 1, lastVisitAt: null,
      firstVisitAt: new Date().toISOString(),
      sessionId: Math.random().toString(36).slice(2),
    };
  }
}

// ── Module-level cache ────────────────────────────────────────────────────────
let _cached: VisitorIntelligence | null = null;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useVisitorIntelligence(): VisitorIntelligence {
  const [data, setData] = useState<VisitorIntelligence>(
    _cached ?? {
      ip: '', country: '', city: '',
      org:     { raw: '', name: '', asn: '', domain: '', isp: '' },
      referrer: analyzeReferrer(''),   // safe default
      device:  { os: 'Other', browser: 'Other', resolution: '', language: '', timezone: '', cpuCores: 0, memory: null },
      session: { visitCount: 1, lastVisitAt: null, firstVisitAt: '', sessionId: '' },
      loading: true,
    }
  );

  useEffect(() => {
    if (_cached) { setData(_cached); return; }

    // Capture browser context synchronously (no API needed)
    const referrer = analyzeReferrer(document.referrer);
    const device   = parseDevice();
    const session  = readSession();

    // Fetch org/geo from ipapi.co
    fetch(API_ENDPOINTS.ipGeolocation(), { headers: { Accept: 'application/json' } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        const rawOrg = d.org ?? '';
        const result: VisitorIntelligence = {
          ip:      d.ip           ?? '',
          country: d.country_code ?? '',
          city:    d.city         ?? '',
          org: {
            raw:    rawOrg,
            name:   cleanOrgName(rawOrg),
            asn:    d.asn          ?? '',
            domain: extractDomain(d.hostname ?? ''),
            isp:    d.isp          ?? '',
          },
          referrer,
          device,
          session,
          loading: false,
        };
        _cached = result;
        setData(result);
      })
      .catch(() => {
        const partial: VisitorIntelligence = {
          ip: '', country: '', city: '',
          org: { raw: '', name: '', asn: '', domain: '', isp: '' },
          referrer, device, session, loading: false,
        };
        _cached = partial;
        setData(partial);
      });
  }, []);

  return data;
}
