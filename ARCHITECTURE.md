# Architecture Document — kuhan-website

## 1. Overview

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Vercel

**Purpose**: Personal portfolio website with an AI-powered chatbot backed by two Cloudflare Workers services.

---

## 2. What's Broken Today

| Problem | Location | Impact |
|---|---|---|
| Chatbot files scattered across `sections/` | `sections/Chatbot.tsx`, `ChatbotState.ts`, `chatbotHelpers.ts`, `EmailCaptcha.tsx`, `OtpEntry.tsx`, `ChatProcess.tsx` | One feature spans 6 unrelated files |
| API calls live inside components | `Chatbot.tsx`, `Contact.tsx`, `Skills.tsx` | Can't test, can't reuse |
| Two cache systems running in parallel | `cache-legacy.ts` + `cache/manager.ts` | Unpredictable behaviour |
| `contentLabels` accessed two ways | Static import in some files, hook in others | Inconsistent, causes "0% proficiency" type bugs |
| Redux added but nothing uses the store meaningfully | `@reduxjs/toolkit` in deps | Dead weight |
| `chatbotHelpers.ts` still writes to localStorage | `chatbotHelpers.ts` | Security risk for tokens |
| `loaders.ts` is 300 lines doing URL config + API config + page layout | `src/lib/config/loaders.ts` | Impossible to navigate |

---

## 3. Proposed Directory Structure

```
src/
│
├── app/                            # Next.js App Router (keep as-is)
│   ├── layout.tsx                  # Root layout + CSP headers
│   ├── page.tsx                    # Home page
│   ├── not-found.tsx
│   ├── case-studies/
│   └── api/                        # Server-side API routes only
│
├── components/
│   ├── ui/                         # (renamed from elements/) Atomic, stateless
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── SkillBar.tsx
│   │   ├── StatCard.tsx
│   │   └── ... (one component = one file, no business logic)
│   │
│   ├── layout/                     # Navbar, Footer — keep
│   │
│   ├── sections/                   # Page sections — one file each, no API calls
│   │   ├── Hero.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Contact.tsx
│   │   └── ...
│   │
│   └── chatbot/                    # Chatbot feature module (self-contained)
│       ├── Chatbot.tsx             # Root: layout + step routing only
│       ├── EmailStep.tsx           # Email + Turnstile captcha UI
│       ├── OtpStep.tsx             # OTP entry UI
│       ├── ChatStep.tsx            # Chat messages + input UI
│       ├── useChatSession.ts       # All chatbot state + session logic
│       └── types.ts                # ChatbotStep, Message, etc.
│
├── services/                       # All external API calls — NO React here
│   ├── auth.service.ts             # generate-otp, authorise-otp
│   ├── chat.service.ts             # generate-token, /chat
│   └── contact.service.ts          # Contact form submission
│
├── hooks/                          # Shared React hooks
│   ├── useContentLabels.ts
│   ├── useSkills.ts
│   ├── useLanguageContent.ts
│   └── useVisitorAnalytics.ts
│
├── lib/                            # Pure utilities — no React, no API calls
│   ├── config/
│   │   ├── domains.ts              # Base URLs only
│   │   ├── types.ts                # Shared TypeScript types
│   │   └── loaders.ts              # Fetch helpers (split by concern)
│   └── data/                       # Static/fallback data
│       ├── skills.ts
│       ├── projects.ts
│       └── contentLabels.ts        # Static fallback labels only
│
└── pwa/                            # Keep as-is
```

---

## 4. Service Layer (new)

Every external fetch lives in `src/services/`. Components never call `fetch()` directly.

### `services/auth.service.ts`
```ts
const BASE = 'https://auth-services.kuhandranchatbot.info';

export async function sendOtp(identifier: string, captchaToken: string) { ... }
export async function verifyOtp(identifier: string, otp: string): Promise<{ sessionToken: string }> { ... }
```

### `services/chat.service.ts`
```ts
const BASE = 'https://chat-services.kuhandranchatbot.info';

export async function generateToken(identifier: string, sessionToken: string): Promise<{ accessToken: string }> { ... }
export async function sendMessage(accessToken: string, message: string, sessionId?: string) { ... }
```

### Rule
- Services return typed data or throw.
- Components catch the error and show a message.
- No `response.json()` scattered across component files.

---

## 5. Chatbot — Clean State Machine

The chatbot has three distinct steps. Model it as a state machine in a custom hook.

### `components/chatbot/useChatSession.ts`
```ts
type Step = 'email' | 'otp' | 'chat';

export function useChatSession() {
  const [step, setStep] = useState<Step>('email');
  const [accessToken, setAccessToken] = useState<string | null>(null);  // memory only
  const [cfSessionId, setCfSessionId] = useState<string | null>(null);
  // ... other state

  async function submitEmail(email: string, captchaToken: string) { ... }
  async function submitOtp(otp: string) { ... }
  async function sendMessage(text: string) { ... }
  function reset(msg?: string) { ... }

  return { step, submitEmail, submitOtp, sendMessage, reset, ... };
}
```

### `components/chatbot/Chatbot.tsx` (becomes thin)
```tsx
export function Chatbot() {
  const session = useChatSession();
  return (
    <>
      <ChatButton />
      {isOpen && (
        <ChatWindow>
          {session.step === 'email' && <EmailStep onSubmit={session.submitEmail} />}
          {session.step === 'otp'   && <OtpStep   onSubmit={session.submitOtp}   />}
          {session.step === 'chat'  && <ChatStep   onSend={session.sendMessage}   />}
        </ChatWindow>
      )}
    </>
  );
}
```

---

## 6. Data Flow

```
User action
    │
    ▼
Component (handles UI only)
    │ calls hook fn
    ▼
Custom Hook (manages state + error)
    │ calls service fn
    ▼
Service (makes fetch, returns typed data)
    │
    ▼
External API
```

**Never skip a layer.** A component must not call a service directly; it goes through a hook.

---

## 7. Content Labels — Single Pattern

**Problem today**: some files do `import { contentLabels } from '../../lib/data/contentLabels'` (static, stale), others call the hook (async, fresh). This mismatch causes sections like Skills to render with empty/zero data before the async load resolves.

**Fix**: One pattern only — `useContentLabels()` hook everywhere.

```ts
// hooks/useContentLabels.ts
export function useContentLabels() {
  const [labels, setLabels] = useState(staticFallback);
  useEffect(() => {
    fetchLabels().then(setLabels).catch(() => {/* keep fallback */});
  }, []);
  return labels;
}
```

Static files in `lib/data/contentLabels.ts` become the fallback only — never imported directly into components.

---

## 8. What to Remove

| Remove | Replace with |
|---|---|
| `src/lib/api/cache-legacy.ts` | `cache/manager.ts` only |
| `src/components/sections/chatbotHelpers.ts` | Logic moves into `useChatSession.ts` |
| `src/components/sections/ChatbotState.ts` | Types move into `chatbot/types.ts` |
| `localStorage` for tokens | React state (in-memory) only |
| Redux (`@reduxjs/toolkit`, `react-redux`) | React state + hooks covers all current needs |

---

## 9. Security Rules

1. **Never write `accessToken` or `refreshToken` to `localStorage`.**
2. **Tokens live in React state only** — cleared on page reload automatically.
3. **All API base URLs are constants in service files** — not scattered across components.
4. **CSP in `layout.tsx`** is the single source of truth for allowed origins.

---

## 10. File Naming Convention

| Type | Convention | Example |
|---|---|---|
| React component | PascalCase `.tsx` | `ChatStep.tsx` |
| Hook | camelCase prefixed `use` | `useChatSession.ts` |
| Service | camelCase suffixed `.service` | `chat.service.ts` |
| Types | camelCase `types.ts` or co-located | `chatbot/types.ts` |
| Static data | camelCase | `skills.ts` |

---

## 11. Priority Order for Refactor

1. **Create `services/`** — move all `fetch()` calls out of components (1–2 hrs)
2. **Create `components/chatbot/`** — move 6 scattered files into one feature folder (1 hr)
3. **Fix `useContentLabels`** — one hook, used everywhere, fixes Skills 0% bug (30 min)
4. **Delete `cache-legacy.ts` and `chatbotHelpers.ts`** — dead code removal (15 min)
5. **Remove Redux** — replace with hook state (30 min)
