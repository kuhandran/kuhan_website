import { NextRequest, NextResponse } from 'next/server';

// Works with Anthropic directly OR via Cloudflare AI Gateway — just change the URL env var.
// ANTHROPIC_API_KEY   = sk-ant-...
// AI_API_URL          = https://api.anthropic.com/v1/messages  (default)
//                   OR = https://gateway.ai.cloudflare.com/v1/{account}/{gateway}/anthropic/v1/messages

const API_URL = process.env.AI_API_URL ?? 'https://api.anthropic.com/v1/messages';
const API_KEY = process.env.ANTHROPIC_API_KEY ?? '';

// Truncate JD to cap input tokens — main cost variable
const MAX_JD_CHARS = 1800;

// Compact profile — same info, ~40% fewer tokens than the verbose version
const CANDIDATE_PROFILE =
`Kuhandran SamudraPandiyan | Technical PM + Full-Stack Engineer | 8yr | KL Malaysia | global relocation open
Skills: React.js,React Native,TypeScript,Redux,Spring Boot,Node.js,RESTful APIs,Microservices,Java,Python,Power BI,SQL,AWS,Docker,Git,CI/CD,Agile,Scrum,Project Management
Roles: FWD Insurance TechPM(2023-now)—led cross-border teams,reduced incidents 15%,React Native DMS/OWB modules; Maybank SrSWE(2021-23)—React.js apps,APIs,15% load speed; Maybank SWE(2020-21)—SPA architecture
Education: MBA Business Analytics Cardiff Met UK; CS INTI/UOW`;

// ── Prompt builder ────────────────────────────────────────────────────────────
function buildPrompt(jd: string): string {
  // Truncate JD to keep input cost predictable
  const jdTrimmed = jd.length > MAX_JD_CHARS ? jd.slice(0, MAX_JD_CHARS) + '…' : jd;

  return `${CANDIDATE_PROFILE}

JD:${jdTrimmed}

Return ONLY JSON, no markdown:
{"matchScore":0-100,"headline":"Strong Match|Good Match|Partial Match|Low Match","matchedSkills":[],"missingSkills":[],"relevantRoles":[],"summary":"1-2 sentences","highlights":[]}`;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'AI API key not configured. Add ANTHROPIC_API_KEY to environment variables.' },
      { status: 503 }
    );
  }

  try {
    const { jd } = await request.json() as { jd?: string };

    if (!jd || jd.trim().length < 50) {
      return NextResponse.json({ error: 'Job description too short.' }, { status: 400 });
    }

    const claude = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'x-api-key':         API_KEY,
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',  // cheapest Claude model
        max_tokens: 512,                          // JSON response needs ~200-300 tokens max
        messages:   [{ role: 'user', content: buildPrompt(jd) }],
      }),
    });

    if (!claude.ok) {
      const err = await claude.text();
      console.error('[JD Analyze] Claude error:', err);
      return NextResponse.json({ error: 'AI service error.' }, { status: 502 });
    }

    const claudeData = await claude.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const raw = claudeData.content?.find(b => b.type === 'text')?.text ?? '';

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result  = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[JD Analyze]', err);
    return NextResponse.json({ error: 'Failed to analyze job description.' }, { status: 500 });
  }
}
