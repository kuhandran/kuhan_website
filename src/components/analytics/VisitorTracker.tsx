'use client';
import { useEffect } from 'react';
import { useVisitorIntelligence } from '@/lib/hooks/useVisitorIntelligence';

const FIRED_KEY = 'vi_fired'; // once per browser session

export function VisitorTracker() {
  const intel = useVisitorIntelligence();

  useEffect(() => {
    if (intel.loading) return;
    if (sessionStorage.getItem(FIRED_KEY)) return;
    sessionStorage.setItem(FIRED_KEY, '1');

    // Map useVisitorIntelligence → exact schema the auth service expects
    const payload = {
      id:         intel.session.sessionId,
      created_at: new Date().toISOString(),

      network: {
        ip:         intel.ip,
        org_name:   intel.org.name,
        org_domain: intel.org.domain,
        asn:        intel.org.asn,
        isp:        intel.org.isp,
      },

      location: {
        country: intel.country,
        city:    intel.city,
      },

      referrer: {
        domain:       intel.referrer.domain,
        is_linkedin:  intel.referrer.isLinkedIn,
        is_google:    intel.referrer.isGoogle,
        is_job_board: intel.referrer.isJobBoard,
        is_direct:    intel.referrer.isDirect,
        search_query: intel.referrer.searchQuery,
      },

      device: {
        os:         intel.device.os,
        browser:    intel.device.browser,
        resolution: intel.device.resolution,
        language:   intel.device.language,
        timezone:   intel.device.timezone,
        cpu_cores:  intel.device.cpuCores,
        memory_gb:  intel.device.memory,
      },

      session: {
        visit_count:    intel.session.visitCount,
        first_visit_at: intel.session.firstVisitAt,
        last_visit_at:  intel.session.lastVisitAt,
      },

      events:   [], // behaviour events appended by future event flush
      jd_match: null,
    };

    fetch('/api/analytics/session', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }).catch(() => {}); // fire-and-forget — never block the UI

  }, [intel.loading, intel]);

  return null;
}
