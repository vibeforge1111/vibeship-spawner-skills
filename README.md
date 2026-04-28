[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/vibeforge1111-vibeship-spawner-skills-badge.png)](https://mseep.ai/app/vibeforge1111-vibeship-spawner-skills)

# Spawner Skills

> **[spawner.vibeship.co](https://spawner.vibeship.co)** | **[Browse All Skills](https://spawner.vibeship.co/skills)**

**462 production-grade skills** for Claude. Zero cost, works offline. Full MCP integration.

## Why Spawner Skills?

Most "AI prompts" are just text files. Spawner Skills are **production-grade knowledge systems** with 4 specialized files per skill:

```
maker/micro-saas-launcher/
├── skill.yaml           # Identity, patterns, anti-patterns, handoffs
├── sharp-edges.yaml     # Gotchas with detection patterns
├── validations.yaml     # Automated code quality checks
└── collaboration.yaml   # How skills work together
```

### What Makes Our Skills Different

| Feature | Regular Prompts | Spawner Skills |
|---------|-----------------|----------------|
| **Patterns** | Generic advice | Battle-tested implementation code |
| **Anti-patterns** | None | "Don't do this because..." with alternatives |
| **Sharp Edges** | None | Gotchas with automatic detection |
| **Validations** | None | Regex patterns that catch mistakes |
| **Collaboration** | None | Skills delegate to each other |
| **Severity Levels** | None | Critical, high, medium, low |

---

## Quick Start

```bash
# Full setup: Skills + MCP server (recommended)
npx github:vibeforge1111/vibeship-spawner-skills install --mcp
```

This one command:
- Installs 462 skills to `~/.spawner/skills/`
- Configures the Spawner MCP server for Claude Desktop & Claude Code
- Enables project memory, code validation, sharp edge detection

### Other Commands

```bash
# Just install skills (no MCP)
npx github:vibeforge1111/vibeship-spawner-skills install

# Add MCP to existing installation
npx github:vibeforge1111/vibeship-spawner-skills setup-mcp

# Update skills to latest
npx github:vibeforge1111/vibeship-spawner-skills update

# Check status
npx github:vibeforge1111/vibeship-spawner-skills status
```

### Manual Clone (Alternative)

```bash
git clone https://github.com/vibeforge1111/vibeship-spawner-skills ~/.spawner/skills
```

---

## The 4-File Skill System

### 1. `skill.yaml` - Identity & Patterns

Defines who the skill is and how it works:

```yaml
id: micro-saas-launcher
name: Micro-SaaS Launcher
identity:
  role: SaaS Launch Architect
  personality: |
    You've launched 12 micro-SaaS products. You know the difference
    between "building" and "shipping." You push for MVP ruthlessly.

patterns:
  - name: 2-Week MVP
    when_to_use: Starting any new SaaS
    implementation: |
      Week 1: Core feature + auth + payments
      Week 2: Landing page + launch

anti_patterns:
  - name: Feature Creep Before Launch
    why_bad: You'll never ship. Users don't want features, they want solutions.
    what_to_do_instead: Launch with ONE core feature. Add more based on feedback.

handoffs:
  - trigger: "landing page|sales page"
    to: landing-page-design
    context: "SaaS landing page needed"
```

### 2. `sharp-edges.yaml` - Gotchas & Warnings

Things that bite you in production:

```yaml
sharp_edges:
  - id: no-distribution-plan
    summary: Building without knowing how to reach customers
    severity: critical
    situation: You're building but have no idea where customers will come from
    why: |
      Distribution is harder than building.
      "If you build it, they will come" is a lie.
      Most failed startups had good products, bad distribution.
    solution: |
      ## Before Writing Code, Answer:

      | Question | Your Answer |
      |----------|-------------|
      | Where do your customers hang out? | _________ |
      | Can you reach 100 of them this week? | _________ |
      | What's your unfair distribution advantage? | _________ |

      If you can't answer these, STOP BUILDING.
    symptoms:
      - "I'll figure out marketing later"
      - "The product will sell itself"
      - Building for 3+ months with no users
    detection_pattern: "marketing later|users will come|viral"
```

### 3. `validations.yaml` - Automated Code Checks

Catch mistakes before they ship:

```yaml
validations:
  - id: no-payment-integration
    name: No Payment Integration
    severity: critical
    type: conceptual
    check: "SaaS should have payment integration"
    indicators:
      - "No Stripe/payment code"
      - "Free tier only"
      - "Payment coming soon"
    message: "No payment integration - you're building a hobby, not a business."
    fix_action: "Add Stripe checkout before launch. No exceptions."

  - id: api-key-exposed
    name: API Key in Frontend Code
    severity: critical
    type: regex
    pattern: '(sk_live_|sk_test_)[a-zA-Z0-9]{20,}'
    file_patterns:
      - "*.js"
      - "*.ts"
      - "*.tsx"
    message: "Stripe secret key exposed in frontend code!"
    fix_action: "Move to environment variables on backend"
```

### 4. `collaboration.yaml` - Skill Teamwork

How skills work together:

```yaml
receives_from:
  - skill: landing-page-design
    context: "SaaS landing page"
    receives:
      - "Conversion-optimized design"
      - "Hero section structure"
    provides: "Complete SaaS product launch"

delegation_triggers:
  - trigger: "landing page|sales page"
    delegate_to: landing-page-design
    pattern: sequential
    context: "Need landing page for SaaS"

  - trigger: "SEO|organic traffic"
    delegate_to: seo
    pattern: parallel
    context: "SEO for SaaS content"

common_combinations:
  - name: Full SaaS Launch
    skills:
      - micro-saas-launcher
      - landing-page-design
      - stripe
      - seo
    workflow: |
      1. Validate idea (micro-saas-launcher)
      2. Build MVP with payments (micro-saas-launcher + stripe)
      3. Create landing page (landing-page-design)
      4. Launch and iterate
      5. Add SEO for organic growth (seo)
```

---

## What You Get

### Local Skills (462)
Claude reads YAML files directly from `~/.spawner/skills/`:
- Patterns, anti-patterns, best practices
- Sharp edges (gotchas) for each technology
- Works offline, zero API cost

### MCP Server Tools
When you use `--mcp`, these tools become available:

| Tool | What It Does |
|------|--------------|
| `spawner_orchestrate` | Auto-routes your request to the right workflow |
| `spawner_validate` | Runs guardrail checks on your code |
| `spawner_remember` | Saves decisions for future sessions |
| `spawner_watch_out` | Surfaces relevant sharp edges |
| `spawner_unstick` | Helps when you're going in circles |
| `spawner_skills` | Searches and loads skills by context |

---

## Skill Categories (35)

| Category | Count | Description |
|----------|-------|-------------|
| game-dev | 51 | Unity, Godot, Phaser, multiplayer, game design |
| marketing | 36 | AI video, copywriting, SEO, content, viral |
| integrations | 25 | AWS, GCP, Stripe, Discord, Slack, Twilio |
| ai | 24 | LLM architect, embeddings, fine-tuning, NLP |
| strategy | 24 | Product strategy, growth, competitive intel |
| ai-agents | 23 | Autonomous agents, browser automation, voice |
| creative | 23 | Memes, easter eggs, gamification, viral hooks |
| devops | 22 | CI/CD, Docker, K8s, observability, SRE |
| backend | 21 | APIs, microservices, queues, caching |
| blockchain | 20 | Smart contracts, DeFi, NFTs, Solana |
| security | 13 | Auth, OWASP, compliance, privacy |
| ai-tools | 12 | Code generation, image editing, multimodal |
| design | 12 | UI, UX, branding, landing pages |
| frameworks | 12 | Next.js, React, Svelte, Supabase, Tailwind |
| community | 11 | Discord, Telegram, DevRel, ambassador programs |
| data | 11 | Postgres, Redis, vectors, graphs, temporal |
| maker | 11 | Viral tools, bots, extensions, SaaS, templates |
| mind | 10 | Debugging, decision-making, system design |
| development | 9 | General development utilities |
| frontend | 8 | React, mobile, state management |
| testing | 8 | QA, test architecture, code review |
| education | 7 | Course creation, AI tutoring, learning design |
| product | 7 | A/B testing, analytics, PM |
| biotech | 6 | Genomics, drug discovery, lab automation |
| enterprise | 6 | Compliance, governance, architecture |
| finance | 6 | Algo trading, DeFi, derivatives |
| hardware | 6 | Embedded, FPGA, robotics, sensors |
| trading | 6 | Execution algorithms, quant research |
| climate | 5 | Carbon, energy, sustainability |
| communications | 5 | Dev comms, crisis, stakeholder |
| legal | 5 | Contracts, GDPR, patents, SOX |
| simulation | 5 | Monte Carlo, digital twin, physics |
| space | 5 | Orbital mechanics, mission planning |
| science | 4 | Experimental design, statistics |
| startup | 3 | YC playbook, founder mode |

**[Browse all 462 skills](https://spawner.vibeship.co/skills)**

---

## Skill Packs

| Pack | Description |
|------|-------------|
| `essentials` | Core skills for building apps (auto-installed) |
| `agents` | Autonomous agents and automation |
| `community` | Community building and management |
| `education` | Course creation and online learning |
| `maker` | Viral tools, bots, extensions, SaaS |
| `enterprise` | Compliance and governance |
| `finance` | Trading and fintech |
| `mind` | Debugging and decision-making |
| `specialized` | Biotech, space, climate, hardware |
| `complete` | All 462 skills |

---

## Documentation

- **[Skills Directory](SKILLS_DIRECTORY.md)** - Complete list of all 462 skills
- **[Getting Started Guide](GETTING_STARTED.md)** - How to use skills effectively
- **[Contributing](CONTRIBUTING.md)** - How to add or improve skills

---

## How It Works

1. Install skills with `npx github:vibeforge1111/vibeship-spawner-skills install`
2. Tell Claude to read a skill: `Read: ~/.spawner/skills/maker/micro-saas-launcher/skill.yaml`
3. Claude now has specialist knowledge - ask it to build something!

---

## License

Apache 2.0
