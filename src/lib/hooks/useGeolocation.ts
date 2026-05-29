'use client';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/config/domains';

export interface GeoData {
  country:     string; // 'MY', 'SG', 'GB' …
  countryName: string; // 'Malaysia'
  city:        string; // 'Kuala Lumpur'
  timezone:    string; // 'Asia/Kuala_Lumpur'
  utcOffset:   string; // '+0800'
}

// Module-level cache — one fetch per session regardless of how many components mount
let _cached: GeoData | 'failed' | null = null;

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoData | null>(
    _cached && _cached !== 'failed' ? _cached : null
  );
  const [loading, setLoading] = useState(_cached === null);

  useEffect(() => {
    if (_cached !== null) return;

    fetch(API_ENDPOINTS.ipGeolocation(), { headers: { Accept: 'application/json' } })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const result: GeoData = {
          country:     d.country_code  ?? '',
          countryName: d.country_name  ?? '',
          city:        d.city          ?? '',
          timezone:    d.timezone      ?? '',
          utcOffset:   d.utc_offset    ?? '',
        };
        _cached = result;
        setGeo(result);
      })
      .catch(() => { _cached = 'failed'; })
      .finally(() => setLoading(false));
  }, []);

  return { geo, loading };
}

// ── Relevance badge ────────────────────────────────────────────────────────────
// Maps a visitor's country code to a contextual badge shown on experience cards.

interface RelevanceBadge {
  text:    string;
  variant: 'emerald' | 'blue' | 'purple' | 'amber';
}

const SEA   = new Set(['SG', 'TH', 'ID', 'PH', 'VN', 'BN', 'KH', 'LA', 'MM']);
const GULF  = new Set(['AE', 'SA', 'QA', 'KW', 'BH', 'OM']);
const EU    = new Set(['DE', 'FR', 'NL', 'CH', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'IT', 'ES', 'PT', 'PL']);
const APAC  = new Set(['JP', 'KR', 'CN', 'HK', 'TW', 'NZ']);

export function getRelevanceBadge(country: string): RelevanceBadge | null {
  if (!country) return null;

  // Specific regional matches
  if (country === 'MY')               return { text: '🟢 Local Market Experience',       variant: 'emerald' };
  if (country === 'SG')               return { text: '🌏 SEA Regional Experience',        variant: 'blue'    };
  if (SEA.has(country))               return { text: '🌏 Open to SEA Opportunities',      variant: 'blue'    };
  if (country === 'GB' || country === 'IE')
                                       return { text: '🎓 UK-Educated · Open to UK Roles', variant: 'purple'  };
  if (country === 'AU')               return { text: '📚 UOW Alumni · Open to Australia',  variant: 'blue'    };
  if (GULF.has(country))              return { text: '✈️ Open to Gulf Opportunities',      variant: 'amber'   };
  if (EU.has(country))                return { text: '🌍 Open to European Opportunities',  variant: 'purple'  };
  if (APAC.has(country))              return { text: '🌏 Open to APAC Opportunities',      variant: 'blue'    };
  if (country === 'US' || country === 'CA')
                                       return { text: '🌎 Open to North America Roles',    variant: 'blue'    };
  if (country === 'LK')               return { text: '🌐 Sri Lankan · Global Professional', variant: 'amber' };
  if (country === 'IN')               return { text: '🌍 Open to India Opportunities',     variant: 'amber'   };

  // Catch-all — every visitor sees a relevant badge
  return { text: '🌍 Open to Global Opportunities', variant: 'blue' };
}
