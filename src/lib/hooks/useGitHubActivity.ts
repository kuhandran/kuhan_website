'use client';
import { useState, useEffect } from 'react';

export interface GitHubStats {
  commits: number;
  activeRepos: number;
  lastPushedAt: string | null;
  daysAgo: number | null;
}

// Module-level cache keyed by username so a username change always re-fetches
const cache = new Map<string, GitHubStats>();

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export function useGitHubActivity(username: string) {
  const [stats, setStats]   = useState<GitHubStats | null>(cache.get(username) ?? null);
  const [loading, setLoading] = useState(!cache.has(username));

  useEffect(() => {
    if (!username || cache.has(username)) return;

    const controller = new AbortController();

    fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      signal:  controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((events: Array<{ type: string; created_at: string; repo: { name: string }; payload?: { commits?: unknown[] } }>) => {
        if (!Array.isArray(events)) return;

        const cutoff    = Date.now() - 30 * 86_400_000;
        const recent    = events.filter(e => new Date(e.created_at).getTime() > cutoff);
        const pushes    = recent.filter(e => e.type === 'PushEvent');
        const commits   = pushes.reduce((n, e) => n + (e.payload?.commits?.length ?? 0), 0);
        const repos     = new Set(recent.map(e => e.repo?.name)).size;
        const lastPush  = pushes[0]?.created_at ?? null;

        const result: GitHubStats = {
          commits,
          activeRepos: repos,
          lastPushedAt: lastPush,
          daysAgo: lastPush ? daysSince(lastPush) : null,
        };

        cache.set(username, result);
        setStats(result);
      })
      .catch(() => {}) // fail silently — badge just won't appear
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [username]);

  return { stats, loading };
}
