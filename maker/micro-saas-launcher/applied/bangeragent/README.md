# Micro-SaaS Launcher → BangerAgent (Applied Skill)

This directory contains the **micro-saas-launcher** skill applied specifically to
[BangerAgent](https://github.com/SolFrater/BangerAgent), an AI-powered X/Twitter
content optimization SaaS.

## Files

| File | What It Is | How to Use |
|------|-----------|------------|
| `CLAUDE.md` | Project config for Claude Code | Copy to BangerAgent repo root |
| `GROWTH_PLAYBOOK.md` | 3-phase growth strategy | Follow sequentially |
| `TECHNICAL_AUDIT.md` | Prioritized codebase audit | Fix P0 issues first |

## Quick Start

1. Copy `CLAUDE.md` into the root of the BangerAgent repo
2. Read `TECHNICAL_AUDIT.md` for P0 blockers
3. Follow `GROWTH_PLAYBOOK.md` Phase 1 to monetize

## BangerAgent Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS (Vercel)
- **Backend:** Supabase Edge Functions (Deno)
- **AI:** Claude Haiku 4.5 via @anthropic-ai/sdk
- **Database:** PostgreSQL via Supabase (with RLS)
- **Auth:** Supabase OAuth (email, Google, Twitter)
- **Live:** https://bangeragent.vercel.app

## Critical Path to Revenue

```
Week 1: Stripe + landing page + rate limiting + legal pages
Week 2: Product Hunt launch + community posts
Week 3: Email onboarding + upgrade prompts
Week 4: SEO content + growth loops
```
