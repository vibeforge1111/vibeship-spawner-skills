# BangerAgent - CLAUDE.md
# Applied micro-saas-launcher skill for the BangerAgent SaaS product
# Drop this file into the root of the BangerAgent repo

## Project Overview

BangerAgent is an AI-powered X (Twitter) content optimization platform.
It helps creators craft viral posts, strategic replies, audit profiles,
map niches, and architect content plans using Claude AI.

**Stack:** React 19 + TypeScript + Tailwind CSS + Supabase (Edge Functions + Postgres) + Claude Haiku 4.5 + Vercel

**Business Model:** Freemium SaaS — 5 free uses per mode, premium for unlimited.

**Live:** https://bangeragent.vercel.app

---

## Architecture

```
Frontend (React/Vite on Vercel)
  └─ App.tsx (main state machine, 6 modes)
  └─ /components (13 UI components)
  └─ /hooks (useAuth, useHistory)
  └─ /services (apiClient, supabaseClient, exportService)

Backend (Supabase Edge Functions)
  └─ /supabase/functions/analyze/index.ts (single edge function, all 5 AI modes)
  └─ /supabase/migrations/ (6 migrations: profiles, logs, history, RLS, invite codes)

AI (Anthropic Claude)
  └─ Claude Haiku 4.5 via @anthropic-ai/sdk
  └─ Mode-specific system prompts with proprietary frameworks
  └─ JSON structured output
```

---

## Development Commands

```bash
# Frontend
npm install          # Install dependencies
npm run dev          # Dev server on port 3000
npm run build        # Production build to dist/
npm run preview      # Preview production build

# Supabase
supabase start       # Local Supabase
supabase functions serve analyze --env-file .env.local  # Local edge function
supabase db push     # Apply migrations
supabase functions deploy analyze  # Deploy edge function
```

---

## Environment Variables

```bash
# Frontend (.env)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Edge Functions (Supabase dashboard or .env.local)
ANTHROPIC_API_KEY=your-claude-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Key Files

| File | Purpose | Notes |
|------|---------|-------|
| `App.tsx` | Main component, mode state machine | 25.8KB - largest file |
| `supabase/functions/analyze/index.ts` | ALL AI logic | 29KB - single edge function |
| `components/AuthModal.tsx` | Authentication flow | Email, Google, Twitter OAuth |
| `components/TweetCard.tsx` | Tweet display + copy/post | Dual views |
| `hooks/useAuth.ts` | Auth state + usage tracking | Session management |
| `hooks/useHistory.ts` | History with Supabase + localStorage fallback | Offline support |
| `services/apiClient.ts` | Edge function client | Single analyzeContent() |
| `services/exportService.ts` | CSV + PDF export | All modes supported |

---

## AI Integration Details

- **Model:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- **Max tokens:** 1500-2500 depending on mode
- **System prompts:** Mode-specific with proprietary viral frameworks
  - "Paradox Hook", "Information Gaps", "Velocity Control"
- **Response format:** Structured JSON (validated post-response)
- **Error handling:** Try/catch with fallback
- **Cost model:** Haiku is cheapest tier - good for high-volume usage

---

## Database Schema

- `user_profiles` — Auth-linked profiles with usage quotas
- `analytics_logs` — Request tracking for performance monitoring
- `analysis_history` — All AI analysis results (JSONB), full-text searchable
- `invite_codes` — Controlled onboarding with redemption tracking
- Row-Level Security on ALL tables

---

## Coding Conventions

- TypeScript strict mode
- Tailwind CSS for all styling (dark theme: #050505 bg)
- Components in `/components/` (PascalCase)
- Hooks in `/hooks/` (use-prefixed camelCase)
- Services in `/services/` (camelCase)
- Single edge function handles all modes via `mode` parameter
- Supabase RLS policies on every table
- Environment variables prefixed with `VITE_` for frontend

---

## Micro-SaaS Launcher Principles Applied

### Revenue Priority
This product has working auth, AI features, and usage limits.
The critical next steps are:

1. **Stripe integration** — Convert free users to paid
2. **Landing page** — Clear value prop for organic traffic
3. **SEO content** — "How to write viral tweets" keyword cluster
4. **Email capture** — Onboarding sequence for trial users

### What NOT to Build Next
- Mobile app (responsive web is fine)
- More AI modes (5 is plenty for launch)
- Admin dashboard (use Supabase dashboard)
- API for third parties
- Dark/light mode toggle (already dark, it's fine)
- Complex team features

### What TO Build Next (Revenue-Connected)
1. Stripe Checkout with 2 tiers (Pro $29/mo, Agency $79/mo)
2. Landing page with demo and pricing
3. Usage-based upgrade prompts ("You've used 4/5 free forges")
4. Onboarding email sequence (welcome + day 3 + day 7)
5. "Powered by BangerAgent" watermark on shared results

---

## Critical Issues to Address

1. **No payment integration** — Can't collect revenue
2. **No rate limiting on edge function** — Abuse risk
3. **No error monitoring** — Add Sentry
4. **Single edge function is 29KB** — Should extract prompt templates
5. **No retry logic for Claude API calls** — Failures are silent
6. **No cost tracking per user** — Surprise AI bills possible
7. **Missing SEO metadata** — Invisible to search engines
8. **No OG image** — Social shares look blank
