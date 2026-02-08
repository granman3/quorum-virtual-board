import { AgentRole } from './types.js';
import { parseVoteAndConfidence } from './services/geminiService.js';

// ============================================================================
// MINDSMITH.AI — COMPANY PROFILE (Context for all advisors)
// ============================================================================
export const COMPANY_PROFILE = {
  name: "Mindsmith",
  domain: "mindsmith.ai",
  tagline: "AI-native e-learning platform for corporate L&D teams",
  founded: "August 2022",
  origin: "BYU Sandbox incubator, Provo, Utah",
  stage: "Seed",

  founders: {
    ceo: { name: "Zack Allen", title: "Co-founder & CEO" },
    cto: { name: "Ethan Webb", title: "Co-founder & CTO" },
  },

  funding: {
    preSeed: { amount: "$550K", date: "December 2023", lead: "Grix Venture Capital", participants: ["SaaS Ventures", "Peterson Ventures"] },
    seed: { amount: "$4.1M", date: "November 2025", lead: "Next Frontier Capital", participants: ["WndrCo", "Grix Venture Capital"] },
    totalRaised: "$4.65M",
    estimatedRunway: "18-22 months at current burn",
  },

  board: [
    { name: "Zack Allen", role: "Co-founder & CEO" },
    { name: "Ethan Webb", role: "Co-founder & CTO" },
    { name: "Aaron Skonnard", role: "Board Member (Pluralsight co-founder)" },
    { name: "Erika Nash", role: "Board Observer (Next Frontier Capital)" },
  ],

  advisors: [
    { name: "Karl Sun", affiliation: "Lucid co-founder" },
    { name: "Aaron Skonnard", affiliation: "Pluralsight co-founder" },
  ],

  metrics: {
    freeUsers: "7,000+ (first year)",
    revenueGrowthMoM: "20-40%",
    contentCreationSpeed: "12x faster than traditional methods",
    languages: "30+",
    pricingTiers: {
      free: "$0 — unlimited lessons, 2 shared, basic support",
      professional: "$39/mo — unlimited sharing, GPT-4, analytics",
      team: "Custom — collaboration, branding, dedicated support",
    },
  },

  customers: {
    enterprise: ["HubSpot", "Laing O'Rourke", "Gaylor Electric", "Tek Experts"],
    segments: ["Manufacturing", "Energy", "IT Services", "Finance", "Hospitality", "Cybersecurity"],
    fortune500Count: "Multiple (undisclosed)",
  },

  product: {
    core: "Transforms static content (SOPs, manuals, slide decks) into interactive e-learning courses using generative AI",
    keyFeatures: [
      "AI-powered content generation aligned to learning objectives",
      "Drag-and-drop authoring with 20+ interactive elements",
      "SCORM wrapping with cloud-hosted dynamic delivery",
      "Automatic multilingual adaptation (30+ languages)",
      "Real-time collaboration for L&D teams",
      "Built-in analytics and performance measurement",
      "LMS integration support",
    ],
    security: "SOC 2 certified, enterprise-grade",
    techStack: "Cloud-native architecture",
  },

  competitors: ["Articulate (Storyline/Rise)", "Lectora", "iSpring", "Elucidat", "Dominknow"],

  market: {
    tam: "$50B+ global corporate e-learning market",
    trend: "Legacy authoring tools haven't innovated in 20 years — AI-native disruption",
  },
};

// ============================================================================
// MINDSMITH-SPECIFIC DEMO SCENARIOS
// ============================================================================
export const MINDSMITH_SCENARIOS = [
  {
    title: "Series A Timing",
    question: "We closed our $4.1M seed 3 months ago and we're seeing 20-40% month-over-month revenue growth. Our runway is 18-22 months. Should we start the Series A process now to raise from a position of strength, or wait another 6-9 months to hit stronger milestones?",
    followUp: "Marcus, what ARR milestone should we target before going out?"
  },
  {
    title: "Enterprise vs PLG Motion",
    question: "We have 7,000 free-tier users and a growing list of Fortune 500 enterprise deals. Our self-serve professional plan is $39/mo but enterprise contracts are averaging $25K-$80K annually. Should we double down on product-led growth or shift resources to enterprise sales? We can't afford to do both well right now.",
    followUp: "Elena, how do we avoid killing the PLG flywheel while going upmarket?"
  },
  {
    title: "Articulate Adds AI Features",
    question: "Articulate just announced AI-powered features in Storyline and Rise — auto-generate courses from documents, AI assessment builder, and smart translations. They have 120,000+ customers. How do we respond? Do we accelerate our roadmap, differentiate further, or go after their unhappy customers?",
    followUp: "David, how deep is their AI integration really, versus what we've built?"
  },
  {
    title: "International Expansion",
    question: "We're getting inbound interest from UK and EU-based enterprises — Laing O'Rourke wants to expand their deployment across European offices. Should we invest in EU infrastructure, GDPR compliance hardening, and local sales presence now, or stay focused on the US market?",
    followUp: "Sarah, what's the realistic cost and timeline for full GDPR compliance?"
  },
  {
    title: "AI Model Strategy",
    question: "We currently rely on OpenAI's GPT-4 API for our AI features, which costs us roughly $0.12 per course generated. Should we invest in fine-tuning our own models to reduce costs and differentiate, or keep building on top of third-party APIs and focus on the product layer?",
    followUp: "David, what's the engineering lift to fine-tune and host our own model?"
  },
];

// ============================================================================
// PRE-BAKED ADVISOR RESPONSES — SCENARIO 1: Series A Timing
// ============================================================================
const SERIES_A_RESPONSES = {
  [AgentRole.FINANCE]: `### Series A Timing — Financial Analysis

Let me cut through the excitement with some numbers.

**Current Position:**
- Seed: $4.1M raised, ~$3.6M remaining (assuming $180-220K/mo burn rate post-hire plan)
- Revenue growth: 20-40% MoM — impressive, but let's stress-test that range
- Runway: 18-22 months puts our "oh shit" date around mid-2027

**The Case for Waiting 6-9 Months:**
- At 25% MoM growth (conservative midpoint), we roughly **3x revenue** in 9 months
- Series A investors want to see $1.5-2.5M ARR for an edtech/SaaS seed-to-A. If we're not there yet, we're negotiating from weakness
- Every month of growth at these rates meaningfully improves our valuation multiple
- We'd still have 12-15 months of runway when we start the process — comfortable

**The Case Against Waiting:**
- That 20-40% MoM range is suspiciously wide. If growth decelerates to 15% MoM (common after initial enterprise contracts land), our story weakens
- Fundraising takes 3-5 months. Starting at month 12 of runway is panic territory
- Market conditions shift — if AI/edtech sentiment cools, we're stuck

**My Recommendation:**
Start *quiet* conversations now — build relationships with 8-10 target Series A funds over the next 3 months. But **don't open a formal round** until we have 2-3 consecutive months of data showing sustained 25%+ growth and we've crossed $1.5M ARR. Use the next 6 months to de-risk the metrics, not to sprint into a process.

The absolute worst outcome is a down round or a failed raise that leaks to the market. That's a death sentence at our stage.

**Vote: APPROVE**
**Confidence: 7**

**Risk Level: MODERATE** — We have runway, but the 20-40% MoM variance needs to tighten before we can tell a clean story to Series A investors.`,

  [AgentRole.GROWTH]: `### Series A Timing — Growth & Market Perspective

Okay, here's the thing everyone in this room needs to understand: **the window is open right now.**

**Why the Market Timing Matters More Than the Spreadsheet:**
- AI + edtech is the hottest intersection in B2B SaaS right now. Every VC I've talked to has "AI-enabled vertical SaaS" at the top of their thesis
- Articulate just announced AI features — that *validates our category*. Investors love funding the insurgent when the incumbent starts copying
- Aaron Skonnard on our board gives us instant credibility in the learning tech space. We need to leverage that signal while it's fresh

**The Competitive Clock:**
- We're not the only AI-native authoring tool. Competitors are raising too — every month we wait, someone else closes a round and gets ahead in the press
- With $15-20M in Series A capital, we could **lock in the category** before anyone else scales. First-mover advantage in enterprise sales is everything — once an L&D team standardizes on a platform, switching costs are massive
- Our Fortune 500 customer logos (HubSpot, Laing O'Rourke) are Series A gold. But those logos depreciate — 6 months from now, every AI-native tool will have comparable references

**What I'd Do:**
Start the Series A process **yesterday**. Not full sprint — more like a "pre-marketing" phase. Take 15-20 meetings over the next 60 days. Share the vision, the metrics, the customer love. Create urgency.

If we get a term sheet at a $40-50M valuation, we take it. If the market says "come back with more data," fine — we'll have those relationships warm and ready.

But sitting on our hands for 9 months while the market moves? That's how you become a case study in missed timing.

**Vote: APPROVE**
**Confidence: 8**

**Opportunity Score: 8/10** — The AI + edtech fundraising window is wide open, our metrics are compelling, and our board composition signals credibility. Move now.`,

  [AgentRole.TECH]: `### Series A Timing — Technical Readiness Assessment

Let me bring a different lens to this conversation. Before we talk about *when* to raise, let's talk about **what we're raising for** — because that changes the answer entirely.

**Technical Debt Reality Check:**
- We scaled fast from BYU Sandbox to 7,000 users. I guarantee our infrastructure is held together with duct tape in places. Every early-stage startup is
- Our SOC 2 certification is table stakes, but Series A enterprise buyers will demand SOC 2 Type II, penetration testing reports, and a proper security roadmap
- We're running on OpenAI's API — that's a single point of failure and a margin compression risk that any technical due diligence will flag

**What Series A Investors Will Dig Into:**
1. **Architecture scalability** — Can our platform handle 10x the current load? If we're running a monolith, the honest answer is "maybe, but painfully"
2. **AI differentiation** — "We use GPT-4" isn't a moat. They'll ask what we've built on top that's defensible. Do we have proprietary training data? Custom fine-tunes? Novel prompt engineering?
3. **Data pipeline maturity** — Our analytics features need to be generating real insights, not just dashboards. That's an engineering investment
4. **Team composition** — We need to show we can recruit senior engineers. Right now, we're likely a small team punching above our weight

**My Recommendation:**
Use the next **4-5 months** to shore up the technical foundation:
- Migrate to a more scalable architecture if we haven't already
- Start building our proprietary AI layer (fine-tuned models, custom embeddings for instructional design patterns)
- Complete SOC 2 Type II audit
- Hire 2-3 senior engineers who've built at scale — their names on the team page matter in due diligence

Then raise. A Series A with a solid technical story and defensible AI moat will command a significantly better valuation than "we're growing fast on top of OpenAI's API."

**Vote: APPROVE**
**Confidence: 6**

**Feasibility: MODERATE** — 4-5 months is tight but achievable if we prioritize ruthlessly. The technical investments pay dividends in both product quality and fundraising narrative.`,

  [AgentRole.LEGAL]: `### Series A Timing — Legal & Regulatory Considerations

Before we get swept up in growth metrics and market timing, there are several legal and compliance factors that should directly influence our Series A timeline.

**Pre-Series A Legal Readiness:**
1. **Cap Table Hygiene** — Our cap table needs to be clean. With a pre-seed from Grix/SaaS Ventures/Peterson and now a seed from Next Frontier/WndrCo, we need to ensure all SAFEs or convertible notes have clear conversion terms. Any ambiguity here will stall due diligence
2. **IP Assignment** — Given our BYU Sandbox origins, we need ironclad documentation that all IP is assigned to the company, not the university. This is a *deal-killer* if it's unclear. I've seen Series A processes collapse over university IP claims
3. **Employee/Contractor Agreements** — Every person who's written code needs a signed CIIA (Confidential Information and Invention Assignment). If we used any contractors in the early days without proper agreements, we need to fix that now
4. **Data Processing Agreements** — We're handling corporate training data for Fortune 500 companies. Our DPAs need to be bulletproof, and our data handling practices need to match what's in the agreements

**Regulatory Landscape:**
- **GDPR exposure** — If we're already serving Laing O'Rourke (UK-based), we likely have EU data subject data. Are we compliant? If not, this needs to be resolved before Series A diligence
- **AI regulation** — The EU AI Act is rolling out. E-learning AI likely falls under "limited risk" but we need a clear regulatory position paper. Sophisticated investors will ask
- **SOC 2 Type II** — David's right. Type I is a start, but enterprise customers and Series A investors expect Type II (audit over a period, not a point in time)

**My Timeline Recommendation:**
I need **3-4 months minimum** to get our legal house in order:
- Clean up any BYU IP assignment ambiguities (Month 1)
- Audit all contractor/employee IP agreements (Month 1-2)
- Complete GDPR readiness assessment and remediate gaps (Month 2-3)
- Prepare a data room with clean corporate docs (Month 3-4)

Rushing into a Series A with loose legal threads isn't bold — it's reckless. One IP question from a VC's legal team can derail the entire process and signal to the market that we're not ready.

**Vote: AGAINST**
**Confidence: 7**

**Legal Risk: ELEVATED** — Our BYU origins and rapid early growth likely created IP and compliance gaps that are common but must be resolved before opening a formal fundraise.`,

  [AgentRole.SYNTHESIS]: `## Board Resolution

### Key Consensus
All four advisors agree on one critical point: **Mindsmith should not rush into a formal Series A process today.** The reasons vary — Marcus wants cleaner financial metrics, David wants technical defensibility, Sarah needs to close legal gaps, and even Elena frames her recommendation as "pre-marketing" rather than a formal raise.

The board also universally agrees that **the market timing is favorable** and that waiting too long (9+ months) carries its own risks.

### Critical Disagreements
The central tension is between **Elena and the rest of the board on urgency:**
- Elena argues the AI + edtech fundraising window could close and competitors are raising now — "sitting on our hands for 9 months is how you become a case study in missed timing"
- Marcus counters that a failed raise or down round is worse than a delayed one — "that's a death sentence at our stage"
- Sarah flags potential deal-killers (BYU IP assignment, GDPR gaps) that could embarrass us mid-process
- David argues the technical moat story isn't strong enough yet — "we use GPT-4 isn't a moat"

### Decision Framework

| Option | Timeline | Key Requirement | Risk |
|--------|----------|----------------|------|
| **A. Start pre-marketing now, formal process in 4-5 months** | Feb-Jun 2026 | Parallel-path legal cleanup, technical hardening, and investor relationships | Medium — balanced approach but requires flawless execution across all workstreams |
| **B. Wait 6-9 months, raise on stronger metrics** | Aug-Nov 2026 | Hit $1.5-2M ARR, tighten MoM growth variance, complete SOC 2 Type II | Medium-High — better metrics but market timing risk and reduced runway buffer |
| **C. Opportunistic raise — take a great term sheet if it comes** | Ongoing | Maintain investor conversations without formal process pressure | Low-Medium — preserves optionality but may signal lack of conviction |

### Secretary's Recommendation
**Option A is the consensus path.** Begin warm investor outreach immediately (Elena's instinct is correct on timing), but use the next 4-5 months to address Marcus's, David's, and Sarah's concerns in parallel:

1. **Months 1-2:** Legal cleanup (IP, GDPR, data room) + start building proprietary AI layer + quiet VC conversations
2. **Months 3-4:** Tighten financial metrics, complete SOC 2 Type II, hire senior engineers
3. **Month 5:** Launch formal Series A process with clean metrics, defensible tech, and buttoned-up legal

This gives Mindsmith the best of both worlds: Elena's market urgency with the rigor the other three advisors demand.`
};

// ============================================================================
// PRE-BAKED ADVISOR RESPONSES — SCENARIO 2: Enterprise vs PLG Motion
// ============================================================================
const ENTERPRISE_VS_PLG_RESPONSES = {
  [AgentRole.FINANCE]: `### Enterprise vs PLG — Financial Analysis

Let me frame this with the numbers that actually matter.

**Current Revenue Economics:**
- Self-serve Professional: $39/mo = $468/year per user. At ~7,000 free users, even if 5% convert, that's ~$164K ARR from PLG. Modest.
- Enterprise contracts: $25K-$80K/year. If we close just 5 enterprise deals at $50K avg, that's $250K ARR from a handful of accounts
- **The math is screaming at us: one enterprise deal equals 100+ self-serve conversions**

**Unit Economics Comparison:**
| Metric | PLG (Self-Serve) | Enterprise |
|--------|-----------------|------------|
| ACV | $468 | $25K-$80K |
| CAC (est.) | $50-100 (content/SEO) | $8K-15K (sales cycle) |
| CAC Payback | 1-3 months | 2-4 months |
| Gross Margin | ~85% (API costs) | ~80% (support + API) |
| Churn Risk | High (SMB) | Low (multi-year, sticky) |
| LTV:CAC | ~6:1 | ~12:1 |

The enterprise LTV:CAC ratio is **twice as good.** And enterprise churn is structurally lower — once you're embedded in an L&D workflow with SCORM packages deployed across an LMS, switching costs are enormous.

**My Recommendation:**
Shift 70% of resources to enterprise. But don't kill PLG entirely — it's your **top-of-funnel machine**. Free users become champions who bring Mindsmith into their organizations. The play is:

1. Keep the free tier as a lead generation engine (low cost to maintain)
2. Kill or simplify the $39/mo tier — it's a distraction. Make it a "contact sales" upsell trigger
3. Invest in a 2-person enterprise sales team + sales engineering support
4. Target $1.5M ARR from 25-30 enterprise accounts within 12 months

The $39/mo revenue is a rounding error compared to what enterprise can deliver. Don't chase nickels when there are hundred-dollar bills on the table.

**Vote: APPROVE**
**Confidence: 8**

**Risk Level: LOW** — Enterprise pivot is financially de-risking. The only risk is if we can't close enterprise deals at scale, which our existing Fortune 500 logos suggest we can.`,

  [AgentRole.GROWTH]: `### Enterprise vs PLG — Growth & Market Strategy

I hear Marcus talking about killing the $39/mo tier and I want to be very clear: **that would be a catastrophic mistake.**

**Why PLG Is Our Unfair Advantage:**
- 7,000 free users in year one isn't just a number — it's a **distribution moat**. Articulate has 120K+ customers built over 20 years of enterprise sales. We can't out-sell them. But we can out-distribute them
- Every free user is a potential champion inside an organization. They create a course, show their manager, and suddenly we're in a procurement conversation we never initiated
- PLG compounds. Enterprise sales is linear — you hire reps, they close deals. PLG is exponential — users invite users, courses get shared, teams adopt organically

**The Data Backs This Up:**
Look at the playbook: Slack, Notion, Figma, Canva — all started with bottom-up adoption and layered enterprise sales on top. Not the other way around. The companies that went enterprise-first in crowded markets (remember when Box tried to compete with Dropbox purely on enterprise?) struggled to build organic awareness.

**What I'd Actually Do:**
Instead of choosing, we **sequence** it:

1. **Double down on PLG virality** — Add "Made with Mindsmith" branding on free-tier courses. Add team invite flows. Build a template marketplace where users share courses. Every shared course is a billboard
2. **Build an enterprise motion ON TOP of PLG signals** — When a free user from a Fortune 500 domain signs up, that's a sales trigger. When 3+ users from the same company are active, that's a qualified lead. Product-qualified leads are 3-5x more likely to close than cold outbound
3. **Price the enterprise tier for value, not cost** — $25K/year is leaving money on the table. If we're saving L&D teams 12x time, we should charge based on value delivered. Target $50-100K ACV for enterprise

Don't let the finance team's spreadsheet turn us into just another enterprise sales org competing on RFPs. Our PLG motion is what makes us *different.*

**Vote: AGAINST**
**Confidence: 9**

**Opportunity Score: 9/10** — The combination of PLG + enterprise is rare and powerful. Most companies only have one motion. We have both. That's our moat.`,

  [AgentRole.TECH]: `### Enterprise vs PLG — Technical Architecture Implications

This isn't just a go-to-market question — it's fundamentally an **architecture decision** that will shape our engineering roadmap for the next 2 years.

**What Enterprise Actually Requires (That We Probably Don't Have Yet):**

1. **Multi-tenancy & Data Isolation**
   - Enterprise customers demand logically (or physically) isolated data. If we're running a shared multi-tenant architecture (likely), we need tenant-level data partitioning
   - HubSpot's training data cannot be queryable from Gaylor Electric's instance. Period.
   - Engineering lift: 2-3 months for proper tenant isolation

2. **SSO & Identity Management**
   - Enterprise = SAML/OIDC SSO integration. Every Fortune 500 will require it
   - We need to support Okta, Azure AD, OneLogin at minimum
   - Engineering lift: 4-6 weeks

3. **Admin & Analytics Dashboard**
   - Enterprise L&D managers need org-level analytics: completion rates, assessment scores, compliance tracking across departments
   - Our current analytics are likely per-course. Enterprise needs per-organization roll-ups
   - Engineering lift: 6-8 weeks

4. **LMS Integration Depth**
   - We support SCORM, but enterprise buyers will ask about xAPI (Tin Can), LTI, and direct integrations with Cornerstone, Workday Learning, SAP SuccessFactors
   - Each integration is 3-4 weeks of engineering work
   - Engineering lift: 2-4 months for top 3-4 LMS platforms

5. **SLA & Uptime Guarantees**
   - Enterprise contracts require 99.9% uptime SLAs. Do we have redundancy, failover, and monitoring to back that up?
   - We need proper incident response, status pages, and on-call rotations
   - Engineering lift: 4-6 weeks

**Total Engineering Investment for Enterprise-Readiness:** ~6-9 months with a team of 4-5 engineers focused on platform work.

**What PLG Requires (Much Less):**
- Better onboarding flows: 2 weeks
- Collaboration features: 4-6 weeks
- Template marketplace: 4-6 weeks

**My Recommendation:**
We can't do both simultaneously with our current team size. If we go enterprise, we need to **hire platform engineers first** — not sales reps. Selling enterprise deals we can't technically deliver is how you burn Fortune 500 bridges permanently.

I'd prioritize: SSO (table stakes) → Tenant isolation (non-negotiable) → Top 2 LMS integrations → Admin dashboards. In that order.

**Vote: ABSTAIN**
**Confidence: 6**

**Feasibility: COMPLEX** — Enterprise readiness is a 6-9 month engineering investment. We can start selling now with caveats, but full enterprise-grade infrastructure requires significant engineering focus.`,

  [AgentRole.LEGAL]: `### Enterprise vs PLG — Legal & Compliance Considerations

This decision has major legal implications that go beyond revenue models. Let me walk through what each path requires.

**Enterprise Sales — Legal Requirements:**

1. **Contract Complexity**
   - Enterprise deals require MSAs (Master Service Agreements), DPAs, BAAs (if any health-related training content), and custom SLAs
   - Each Fortune 500 will redline our standard terms. Budget for outside counsel at $500-800/hr for contract negotiations, or hire a contracts attorney
   - Average enterprise contract negotiation: 4-8 weeks of legal back-and-forth
   - Current estimate: We need **standardized enterprise contract templates** reviewed by counsel experienced in SaaS licensing

2. **Data Processing & Privacy**
   - Enterprise customers will require detailed Data Processing Agreements specifying exactly how we handle their training content and employee learning data
   - Training completion data is employee performance data — in the EU, that's sensitive under GDPR and triggers enhanced protections
   - Some industries (financial services, healthcare) have additional regulatory requirements for training platforms
   - **Risk:** If a customer's employee data is breached, our liability exposure is significant. We need cyber insurance ($2-5M policy minimum)

3. **Procurement & Security Reviews**
   - Fortune 500 procurement teams will require: SOC 2 Type II report, penetration test results, vendor risk assessment completion, data residency commitments
   - Some will require us to complete their security questionnaire (200-500 questions). Each one takes 20-40 hours
   - We should invest in a Trust Center (Vanta, Drata, or SafeBase) to automate security review responses

4. **Intellectual Property**
   - Who owns the AI-generated course content? This must be crystal clear in our Terms of Service
   - If we're using GPT-4, OpenAI's terms grant commercial rights to outputs, but customers will still ask. We need a clear IP ownership clause: "Customer owns all content created using the platform"
   - AI-generated content and copyright law is still evolving — we need to monitor the Copyright Office guidance closely

**PLG — Legal Requirements (Simpler):**
- Standard Terms of Service and Privacy Policy
- Self-serve DPA for data-conscious users
- DMCA safe harbor provisions for user-generated content

**My Recommendation:**
If we pursue enterprise aggressively, budget **$150-250K annually** for legal infrastructure:
- In-house contracts paralegal or junior attorney: $80-120K
- Outside counsel retainer: $50-80K
- Cyber insurance: $15-25K
- Compliance tooling (Vanta/Drata): $15-20K

This isn't optional — it's the cost of playing in the enterprise league. Companies that skip this investment end up losing deals in procurement or, worse, facing liability they aren't insured for.

**Vote: APPROVE**
**Confidence: 7**

**Legal Risk: MANAGEABLE** — Enterprise is legally intensive but navigable with proper investment. The AI content ownership question is the one area where the law is genuinely unsettled and warrants careful positioning.`,

  [AgentRole.SYNTHESIS]: `## Board Resolution

### Key Consensus
The board unanimously agrees that **Mindsmith should pursue enterprise revenue** — the unit economics are too compelling to ignore. No one is arguing for PLG-only. However, there is sharp disagreement on how to balance the two motions.

All advisors also agree that **enterprise readiness requires significant investment** — whether in engineering (David), legal infrastructure (Sarah), sales capacity (Marcus), or product virality (Elena).

### Critical Disagreements
The board is split into two camps:

**Camp 1: Enterprise-First (Marcus + Sarah)**
Marcus argues enterprise LTV:CAC is 2x better and wants to redirect 70% of resources, potentially killing the $39/mo tier. Sarah emphasizes the legal and compliance investment needed and suggests budgeting accordingly.

**Camp 2: PLG-Led Enterprise (Elena + David, partially)**
Elena passionately argues that PLG is Mindsmith's *unfair advantage* — "Don't let the finance team's spreadsheet turn us into just another enterprise sales org." She cites Slack, Notion, and Figma as models. David implicitly supports this by noting that PLG requires far less engineering investment (weeks vs. months).

The most heated exchange: Elena calls killing the $39/mo tier "a catastrophic mistake" while Marcus calls that revenue "a rounding error."

### Decision Framework

| Option | Resource Split | 12-Month ARR Target | Key Risk |
|--------|---------------|---------------------|----------|
| **A. Enterprise-First** | 70% enterprise / 30% PLG | $1.5M (30 accounts × $50K) | Lose PLG moat, become generic enterprise vendor |
| **B. PLG-Led Enterprise** | 50% PLG / 50% enterprise | $800K-1.2M (blended) | Slower enterprise revenue, harder to tell Series A story |
| **C. Sequenced Approach** | PLG now → Enterprise in Q3 | $600K-1M (ramping) | Delayed enterprise revenue, competitor risk |

### Secretary's Recommendation
**A modified version of Option B — PLG as the engine, enterprise as the monetization layer:**

1. **Keep the free tier and PLG motion** — Elena is right that this is Mindsmith's differentiator. But instrument it as a lead-gen machine (track company domains, usage patterns, team adoption signals)
2. **Hire one enterprise AE + one solutions engineer** (Marcus's recommendation, scaled down). Close 10-15 enterprise deals in the next 12 months, prioritizing accounts where PLG signals are already strong
3. **Prioritize David's technical roadmap**: SSO → tenant isolation → top 2 LMS integrations. Without these, enterprise deals stall in procurement
4. **Budget for Sarah's legal infrastructure**: Enterprise contract templates, cyber insurance, and compliance tooling. Non-negotiable for Fortune 500 deals
5. **Don't kill the $39/mo tier** — but simplify it. Make it a clear stepping stone to enterprise, not a destination

This approach lets Mindsmith **tell both stories to Series A investors**: organic product-led adoption AND enterprise revenue traction.`
};

// ============================================================================
// PRE-BAKED ADVISOR RESPONSES — SCENARIO 3: Articulate Competitive Response
// ============================================================================
const ARTICULATE_RESPONSE = {
  [AgentRole.FINANCE]: `### Articulate's AI Features — Financial Perspective

Before we panic, let's look at the actual financial implications.

**Articulate's Position:**
- 120,000+ customers, estimated $200M+ ARR
- Recently acquired by private equity (Charlesbank Capital, ~$1.5B valuation)
- PE ownership means they're optimizing for cash flow, not innovation. They'll add AI features to protect existing revenue, not to disrupt themselves

**What This Means For Our Unit Economics:**
- Articulate's AI features will reduce churn from their existing base — customers who were considering switching to us might stay. Our **new logo acquisition cost from Articulate's base just went up**
- But here's what PE-backed companies can't do: move fast. Their AI features will be bolt-on, not native. They'll charge extra for it (PE loves incremental revenue). That creates price sensitivity
- Our cost advantage: We built AI-native from day one. Our cost-to-serve per course is likely 40-60% lower than Articulate adding AI as a feature layer on top of legacy architecture

**Financial Strategy:**
1. **Don't engage in a feature war** — we'll lose on marketing spend. Articulate has 100x our budget
2. **Compete on total cost of ownership** — Show enterprise buyers that Mindsmith at $50K/year replaces a $150K/year Articulate license PLUS a team of instructional designers
3. **Target Articulate's mid-market** — Their Fortune 500 customers are locked in. But their mid-market ($5K-$25K ACV) customers are the ones feeling the pain and evaluating alternatives
4. **Build a competitive displacement calculator** — "Switch from Articulate and save X hours and $Y per year." Make the ROI undeniable

Don't increase burn rate to "respond" to this. That's exactly what they want — force smaller competitors to overspend. Play our game, not theirs.

**Vote: APPROVE**
**Confidence: 7**

**Risk Level: MODERATE** — Articulate's AI features validate our category but raise competitive pressure. Our AI-native architecture is a structural advantage they can't easily replicate under PE ownership.`,

  [AgentRole.GROWTH]: `### Articulate's AI Features — This Is Our Moment

I'm going to say something that might surprise everyone in this room: **Articulate just did us a massive favor.**

**Why This Is Actually Great News:**

1. **Category Validation** — Every enterprise L&D leader just got an email from Articulate saying "AI is the future of e-learning." That's a $200M company telling our target buyers exactly what we've been saying. We don't have to convince the market anymore — Articulate just spent millions in marketing doing it for us
2. **The Innovator's Dilemma In Real-Time** — Articulate can't go all-in on AI without cannibalizing their core product. Their 120K customers bought Storyline because they have instructional designers. If AI replaces instructional designers... those customers don't need Storyline anymore. Articulate is trapped
3. **Their AI Is Lipstick on a Pig** — I guarantee their "AI-powered features" are GPT wrappers bolted onto a 15-year-old authoring architecture. It'll generate mediocre content that still needs manual cleanup in their clunky editor. Our AI is *native* — it shapes the entire creation experience

**My Battle Plan:**

**Immediate (This Week):**
- Publish a blog post: "We've been AI-native since Day 1 — here's what that actually means" (not attacking Articulate, just establishing our position)
- Create a head-to-head comparison page (tasteful, data-driven) showing AI-native vs AI-added

**Short-term (30 Days):**
- Launch an "Articulate Migration Program" — free migration of existing Storyline/Rise courses into Mindsmith format. Make switching frictionless
- Reach out to every Articulate customer who's ever signed up for our free tier. They were already curious — now give them a reason to move

**Medium-term (90 Days):**
- Host a webinar: "The Future of AI-Native Learning Design" featuring our enterprise customers showing real results. Social proof beats feature lists
- Double down on the content marketing engine — every Google search for "Articulate AI features" should show our comparison content

**The Key Message:**
"Articulate is adding AI to old software. Mindsmith was built on AI from the ground up. That's the difference between a horse-drawn car and a Tesla."

**Vote: APPROVE**
**Confidence: 9**

**Opportunity Score: 9/10** — This is a category-defining moment. Articulate's announcement accelerates buyer awareness and creates switching momentum. We need to ride this wave aggressively.`,

  [AgentRole.TECH]: `### Articulate's AI Features — Technical Depth Assessment

Let me give you the honest technical read on what Articulate actually shipped versus what we have.

**Articulate's AI Features (Based on Their Announcement):**

1. **Auto-generate courses from documents** — This is almost certainly a document-to-text extraction pipeline feeding into GPT/Claude for content generation, then mapping outputs to their existing slide templates. It's impressive for their users, but:
   - Their output is constrained by Storyline's rigid slide-based format
   - They can't generate truly interactive elements (branching scenarios, simulations) from documents — only text-on-slides
   - Our approach generates *instructionally-designed* content with embedded assessments, interactions, and learning objectives. That's a fundamentally different capability

2. **AI Assessment Builder** — Likely auto-generates multiple-choice questions from content. This is a solved problem technically (we've had this for over a year). The quality depends entirely on their prompt engineering and post-processing

3. **Smart Translations** — Machine translation with AI polish. We already do this across 30+ languages with dynamic language adaptation. If they're just wrapping DeepL or Google Translate with a GPT cleanup pass, our approach is comparable or better

**Where They Have Advantages:**
- **SCORM/xAPI export maturity** — Storyline has 15+ years of LMS compatibility testing. Their exports work flawlessly with every LMS on the market. We're newer and likely have edge cases
- **Offline authoring** — Storyline is a desktop app. Some L&D teams with strict security policies prefer offline tools. Our cloud-native approach is a liability here
- **Asset library & templates** — They have thousands of pre-built templates, stock characters, and interactions. Our library is newer and smaller

**Where We Win Decisively:**
- **AI-native architecture** — Our AI isn't a feature; it's the foundation. We can iterate on AI capabilities 10x faster because we don't have legacy code to work around
- **Speed** — 12x faster isn't marketing fluff — it's measurable. Articulate's AI features will maybe give them 2-3x improvement over their manual workflow
- **Modern web stack** — We're cloud-native, real-time collaborative, and API-first. Storyline is a Windows desktop app from 2012. That's a generation gap
- **Cost per course** — Our infrastructure cost per generated course is likely $0.10-0.15. They're running the same AI APIs but with the overhead of mapping to their legacy format

**My Recommendation:**
Don't try to match them feature-for-feature. Instead, **accelerate our differentiation:**

1. **Invest in adaptive learning paths** — AI that adjusts content based on learner performance. Articulate can't do this on their architecture
2. **Build the AI instructional design engine** — Not just "generate content" but "design pedagogically sound learning experiences." This is where fine-tuned models on instructional design data would give us an actual moat
3. **Open our API** — Let customers build custom integrations. Storyline is a closed ecosystem. An open platform wins long-term

Don't get into a feature arms race. Win on architecture.

**Vote: APPROVE**
**Confidence: 8**

**Feasibility: STRAIGHTFORWARD** — Our technical advantages are structural, not feature-level. The key investments (adaptive learning, AI instructional design engine) are achievable in 3-6 months and deepen our moat.`,

  [AgentRole.LEGAL]: `### Articulate's AI Features — Legal & Competitive Intelligence

Before we draft our battle plan, let me flag some important legal considerations in competitive positioning.

**Competitive Marketing Guardrails:**

1. **Comparative Advertising Laws**
   - Elena wants comparison pages and displacement campaigns. Fine — but we must follow FTC guidelines on comparative advertising
   - Every claim must be **substantiated and accurate**. "12x faster" needs to be backed by a methodology we can defend. "AI-native vs AI-added" is fine as positioning, but specific performance claims need data
   - **Do not** make false or misleading claims about Articulate's product capabilities. We can say what we do better; we cannot misrepresent what they do
   - Recommend: Legal review of all competitive marketing materials before publication

2. **Articulate Migration Program — IP Risks**
   - If we offer to migrate Storyline courses to Mindsmith, we need to be very careful about how we handle Articulate's proprietary file formats
   - Reverse-engineering their .story file format could trigger DMCA anti-circumvention claims or breach their EULA
   - **Safe approach:** Only migrate from standard export formats (SCORM packages, published HTML). Do not attempt to parse proprietary Articulate project files
   - Include clear terms: "Customer represents they have the right to migrate this content and that migration does not violate any third-party agreements"

3. **AI Content Ownership — Competitive Angle**
   - Articulate's AI features likely use the same foundation models (OpenAI, Anthropic). Their terms of service around AI-generated content ownership may be unclear or restrictive
   - This is a **competitive opportunity**: If our ToS clearly states "You own everything you create with Mindsmith, including AI-generated content," and theirs is ambiguous, that's a selling point in enterprise procurement

4. **Trade Secret & Non-Compete**
   - If we hire anyone from Articulate (or they hire from us), we need clean non-compete/non-solicitation analysis
   - Utah's non-compete law (post-2016) restricts non-competes to one year and requires consideration. But trade secret protections still apply broadly

**What We Should Do:**
- **Proactively clarify our AI content ownership terms** — Make this a headline in our enterprise pitch. It's a real differentiator as the legal landscape around AI content evolves
- **File a provisional patent on our AI instructional design methodology** — If we have a novel approach to generating pedagogically-sound content, protect it now before Articulate develops something similar
- **Set up competitive intelligence monitoring** — Track Articulate's patent filings, job postings, and product announcements. Know what they're building before it ships

**Vote: APPROVE**
**Confidence: 7**

**Legal Risk: MANAGEABLE** — Competitive response is legally safe if we stick to factual claims, avoid proprietary format reverse-engineering, and protect our own IP proactively.`,

  [AgentRole.SYNTHESIS]: `## Board Resolution

### Key Consensus
The board is remarkably aligned on this one: **Articulate's AI announcement is a net positive for Mindsmith.** Every advisor sees this as category validation, not an existential threat. The structural advantages of AI-native architecture versus AI-as-a-feature are real and defensible.

All four also agree: **do not engage in a feature arms race.** Win on architecture, speed, and total cost of ownership — not by matching Articulate feature-for-feature.

### Critical Disagreements
The disagreement is on **how aggressively to respond:**

- **Elena wants to go on offense immediately** — migration programs, comparison pages, competitive webinars. She calls this "our moment" and scores it 9/10
- **Sarah pumps the brakes on competitive marketing** — comparison claims need FTC compliance, migration programs have IP risks around proprietary file formats, and any false claims could trigger legal exposure
- **Marcus warns against increasing burn rate** — "Don't increase burn rate to respond. That's exactly what they want — force smaller competitors to overspend"
- **David wants to invest in deepening technical differentiation** (adaptive learning, AI instructional design engine) rather than marketing spend

### Decision Framework

| Option | Focus | Investment | Risk |
|--------|-------|-----------|------|
| **A. Aggressive offense** | Competitive marketing, migration programs, direct comparison | $50-100K marketing sprint | Legal exposure from comparative claims, burn rate increase |
| **B. Technical deepening** | Adaptive learning, proprietary AI engine, open API | 3-6 months engineering | Slower market response, competitors capture narrative |
| **C. Balanced response** | Thought leadership + targeted competitive plays + technical investment | Split resources | Diluted focus but lower risk |

### Secretary's Recommendation
**Option C — Balanced response with sequenced priorities:**

**Week 1-2:** Thought leadership (low risk, high impact)
- Publish "What AI-native really means" content (legal-reviewed)
- Clarify AI content ownership in ToS — make it a competitive advantage per Sarah's suggestion

**Month 1-2:** Targeted competitive plays (legal-reviewed)
- Comparison page using only factual, substantiated claims
- Articulate migration from SCORM packages only (not proprietary formats, per Sarah's guidance)
- Product-qualified lead outreach to Articulate users in our free tier

**Month 2-6:** Technical moat deepening
- Adaptive learning paths (David's #1 recommendation)
- Provisional patent on AI instructional design methodology (Sarah)
- Open API strategy to differentiate from Articulate's closed ecosystem

This approach lets Mindsmith **capitalize on the moment without overextending financially or legally.** The market timing is favorable — use it wisely.`
};

// ============================================================================
// PRE-BAKED ADVISOR RESPONSES — SCENARIO 4: International Expansion
// ============================================================================
const INTERNATIONAL_EXPANSION_RESPONSES = {
  [AgentRole.FINANCE]: `### International Expansion — Financial Analysis

Laing O'Rourke wanting to expand across European offices is a great signal — but let me run the numbers on what "going international" actually costs.

**Revenue Opportunity:**
- Laing O'Rourke is a £5B+ construction company with 15,000+ employees across UK, Europe, Australia, and Middle East
- Expanding their Mindsmith deployment could be a $100K-200K/year enterprise contract
- EU corporate e-learning market is ~$15B (roughly 30% of global). Significant TAM expansion

**Cost of Entry:**
| Item | Estimated Cost | Timeline |
|------|---------------|----------|
| EU data residency (AWS eu-west) | $3-5K/mo infra + migration | 2-3 months |
| GDPR compliance program | $50-80K (legal + technical) | 3-4 months |
| UK entity establishment | $15-25K (legal + accounting) | 2-3 months |
| Local sales presence (1 AE) | $80-120K/yr fully loaded | Ongoing |
| Localization & support | $30-50K initial | 2-3 months |
| **Total Year 1 Investment** | **$250-400K** | |

**Break-Even Analysis:**
- At $250-400K investment, we need 5-8 enterprise deals at $50K ACV to break even in Year 1
- Laing O'Rourke alone could cover 40-50% of that if we expand the deployment
- But here's the catch: EU sales cycles are typically **30-50% longer** than US cycles. Budget for 6-9 month sales cycles versus our current 3-4 months

**My Recommendation:**
Don't "invest in EU infrastructure and local sales presence" broadly. That's a $400K bet on a market we haven't validated beyond one customer.

Instead, execute a **Laing O'Rourke-first strategy:**
1. Expand the Laing O'Rourke deal to cover EU offices — this single contract justifies the EU data residency and GDPR investment
2. Use Laing O'Rourke as the reference customer to open 3-4 additional EU conversations
3. Only establish a local entity and hire a local AE once we have $200K+ in EU pipeline

Let the customer pull us into Europe, don't push.

**Vote: APPROVE**
**Confidence: 6**

**Risk Level: MODERATE** — International expansion is financially viable but capital-intensive. A customer-led approach minimizes downside risk while capturing the Laing O'Rourke opportunity.`,

  [AgentRole.GROWTH]: `### International Expansion — Market Opportunity

Let me paint the picture of what we're actually looking at here.

**The EU E-Learning Market Is Ripe for Disruption:**
- $15B+ market dominated by the same legacy tools as the US (Articulate, Lectora, iSpring)
- But with one massive difference: **EU companies are subject to more training mandates** — GDPR training, health & safety, anti-money laundering, ESG compliance. This isn't optional learning — it's legally required
- That means higher volume, more frequent updates, and more pain with legacy tools. Exactly the use case where "12x faster" matters most
- EU companies are also more receptive to AI-native tools — the UK and Nordics in particular are early adopters in enterprise tech

**Why Laing O'Rourke Is the Perfect Beachhead:**
- They're a UK/Australian construction giant — construction is one of the most training-intensive industries (safety compliance, certifications, equipment training)
- A successful multi-country Laing O'Rourke deployment becomes **the case study** that opens every other construction and engineering firm in Europe
- The construction/infrastructure sector alone in Europe represents thousands of companies with mandatory training requirements

**My Expansion Strategy:**

1. **Land and expand with Laing O'Rourke** — Get the EU deployment locked in. Document everything: time savings, compliance improvements, learner engagement metrics. Build the definitive case study
2. **Vertical focus, not geographic breadth** — Don't try to sell to "EU companies." Sell to EU construction, manufacturing, and energy companies. These verticals have the highest training burden and the most pain with legacy tools
3. **Partner with EU-based L&D consultancies** — Companies like Kineo (UK), CrossKnowledge (France), and GoodHabitz (Netherlands) already have enterprise relationships. A partnership model is faster than direct sales
4. **Leverage our multilingual advantage** — We already support 30+ languages with dynamic adaptation. Most competitors require separate course versions per language. That's our EU killer feature

**Don't think of this as "international expansion."** Think of it as **"entering the largest compliance training market in the world with a product built for exactly this use case."**

**Vote: APPROVE**
**Confidence: 8**

**Opportunity Score: 8/10** — EU expansion is high-potential but requires deliberate sequencing. Laing O'Rourke + vertical focus + partnerships is the right motion.`,

  [AgentRole.TECH]: `### International Expansion — Technical Infrastructure Assessment

Let me map out exactly what we need to build and what the real engineering timeline looks like.

**Data Residency Requirements:**
GDPR doesn't technically require EU data storage, but practically, every EU enterprise procurement team will demand it. Here's what we need:

1. **EU Region Deployment**
   - Spin up a parallel stack in AWS eu-west-1 (Ireland) or eu-central-1 (Frankfurt)
   - If our architecture is well-containerized, this is a 2-3 week infrastructure task
   - If we have hardcoded region dependencies (S3 buckets, specific service endpoints, etc.), add another 2-4 weeks for refactoring
   - We need to decide: **single-region with data replication, or full multi-region active-active?**
   - My recommendation: Start with single EU region, route EU customers there. Active-active is overkill at our scale

2. **Data Isolation & Routing**
   - Customer data must be routed to the correct region based on their data residency preferences
   - This means tenant-level configuration for data region
   - We need region-aware routing at the API gateway level
   - Engineering lift: 3-4 weeks

3. **AI API Regional Concerns**
   - We use OpenAI's GPT-4 API. Their EU data processing is handled under their DPA, but some customers will ask: "Where does my content go when it's processed by AI?"
   - OpenAI processes data in the US. For EU customers, we may need to use Azure OpenAI (which offers EU-hosted endpoints) instead
   - Switching to Azure OpenAI: 1-2 weeks (API is nearly identical, but auth and endpoint configuration differ)

4. **CDN & Content Delivery**
   - SCORM packages and course assets need to be served from EU edge locations
   - If we're on CloudFront, adding EU edge locations is configuration, not code
   - But we need to ensure media assets (images, videos) are stored in EU regions for EU customers

5. **Monitoring & Compliance Logging**
   - EU audit logs must stay in EU. We need region-partitioned logging
   - GDPR requires data subject access requests (DSARs) and right-to-deletion. We need tooling to find and delete all data for a specific user across our entire stack
   - Engineering lift: 2-3 weeks for DSAR tooling

**Total Engineering Timeline:**
| Phase | Work | Duration |
|-------|------|----------|
| EU region deployment | Infrastructure + routing | 3-4 weeks |
| Data isolation | Tenant config + region routing | 3-4 weeks |
| AI API migration | Azure OpenAI for EU customers | 1-2 weeks |
| DSAR tooling | Data export + deletion | 2-3 weeks |
| Testing & hardening | Load testing, failover, compliance validation | 2-3 weeks |
| **Total** | | **11-16 weeks** |

With 2-3 engineers dedicated, we're looking at **3-4 months** of engineering work. This is not a "flip a switch" situation, but it's also not a rewrite.

**Vote: APPROVE**
**Confidence: 7**

**Feasibility: MODERATE** — EU infrastructure is well-understood engineering work, not R&D. The main risk is Azure OpenAI API compatibility and region-partitioned data handling adding latency. Both are solvable.`,

  [AgentRole.LEGAL]: `### International Expansion — GDPR & Regulatory Deep Dive

This is my territory. Let me give you the comprehensive legal picture.

**GDPR Compliance — What We Actually Need:**

1. **Lawful Basis for Processing**
   - We process employee learning data on behalf of enterprise customers. Our lawful basis is "legitimate interest" or "performance of a contract" — *not* consent
   - But we need a clear data processing agreement (DPA) with each EU customer specifying: what data we process, why, how long we retain it, and our security measures
   - We also need a Record of Processing Activities (ROPA) — a live document cataloging every data flow

2. **Data Protection Impact Assessment (DPIA)**
   - AI-powered processing of employee performance data (learning analytics, assessment scores) likely triggers a mandatory DPIA under GDPR Article 35
   - This is a structured assessment of the risks of our processing and the measures we take to mitigate them
   - Cost: $15-25K if done with a specialist firm, 6-8 weeks

3. **International Data Transfers**
   - EU → US data transfers require valid transfer mechanisms. The EU-US Data Privacy Framework (DPF) is currently active, but it's been invalidated twice before (Safe Harbor, Privacy Shield)
   - **Risk mitigation:** Offer EU data residency (David's plan) AND have Standard Contractual Clauses (SCCs) as a backup transfer mechanism
   - We need to certify under the DPF or rely on SCCs. Both require specific contractual provisions

4. **Data Subject Rights**
   - GDPR grants individuals (learners using our platform) the right to: access their data, correct it, delete it, port it, and object to processing
   - We need a process to handle Data Subject Access Requests (DSARs) within 30 days
   - Since we're a processor (not controller), these requests typically come through our enterprise customers, but we need the technical capability to fulfill them

5. **UK-Specific Considerations**
   - Post-Brexit, the UK has its own data protection regime (UK GDPR + Data Protection Act 2018)
   - Currently, the UK has an adequacy decision from the EU, so data flows between UK and EU are unrestricted
   - But UK is developing its own Data Protection and Digital Information Bill which may diverge from EU GDPR. We need to monitor this
   - For Laing O'Rourke specifically: UK + EU compliance is needed since they operate in both jurisdictions

6. **EU AI Act Implications**
   - The EU AI Act classifies AI systems by risk level
   - Our AI-powered e-learning generation likely falls under "limited risk" (requires transparency obligations)
   - We need to clearly disclose to end users when content is AI-generated
   - If our analytics make decisions about employee competency or performance, that *could* be classified as "high risk" — which triggers significant compliance obligations including human oversight requirements
   - **This needs a detailed AI Act classification assessment** — budget $10-15K for a specialized firm

**Cost & Timeline Summary:**
| Item | Cost | Timeline |
|------|------|----------|
| DPA templates & SCCs | $15-20K (outside counsel) | 4-6 weeks |
| DPIA assessment | $15-25K (specialist firm) | 6-8 weeks |
| EU AI Act classification | $10-15K (specialist firm) | 4-6 weeks |
| UK entity formation + HMRC registration | $15-25K | 8-12 weeks |
| DPF certification or SCC implementation | $5-10K | 4-6 weeks |
| GDPR training for team | $2-5K | 1-2 weeks |
| **Total** | **$62-100K** | **3-4 months** |

**My Recommendation:**
Phase this in parallel with David's technical work:
- **Month 1:** DPA templates, start DPIA, begin EU AI Act classification
- **Month 2:** Complete DPIA, implement SCCs, start UK entity formation
- **Month 3:** Complete all legal instruments, finalize data room for EU customers
- **Month 4:** Ready for EU enterprise sales with full compliance posture

**Vote: ABSTAIN**
**Confidence: 6**

**Legal Risk: ELEVATED** — GDPR compliance is non-negotiable and the penalties are severe (up to 4% of global annual turnover). The EU AI Act adds a new dimension. However, the legal path is well-established — we just need to invest properly. Cutting corners here would be reckless.`,

  [AgentRole.SYNTHESIS]: `## Board Resolution

### Key Consensus
All four advisors agree: **Pursue the Laing O'Rourke EU expansion, but with a disciplined, customer-led approach — not a broad "go international" push.** The board is aligned that this is a "walk before you run" situation.

Everyone also agrees on the total investment: roughly **$300-500K in Year 1** across engineering, legal, and go-to-market. This is significant for a seed-stage company but justified if Laing O'Rourke expansion alone can drive $100-200K in annual revenue.

### Critical Disagreements
The disagreements are about **scope and ambition:**

- **Elena wants to think bigger** — she sees the EU compliance training market as a massive vertical opportunity and wants partnerships with EU L&D consultancies. She's right about the opportunity but wrong about the timing
- **Marcus insists on a customer-led approach** — "Let the customer pull us into Europe, don't push." He wants to break even on the Laing O'Rourke expansion before investing further
- **David and Sarah are aligned on timeline** — both estimate 3-4 months of parallel engineering and legal work before we're EU-ready. Neither thinks this can be rushed safely

The sharpest tension: Elena's partnership strategy would require marketing investment and relationship-building that Marcus views as premature given our stage and cash position.

### Decision Framework

| Option | Investment | Timeline to Revenue | Risk |
|--------|-----------|-------------------|------|
| **A. Laing O'Rourke-only** | $150-200K (minimal EU infra + legal) | 3-4 months | Low — but limited upside |
| **B. Customer-led expansion** | $300-400K (EU infra + legal + 1 local AE) | 4-6 months | Medium — balanced approach |
| **C. Full EU market entry** | $500K+ (infra + legal + sales + partnerships) | 6-9 months | High — stretches seed capital |

### Secretary's Recommendation
**Option B — Customer-led expansion, triggered by Laing O'Rourke:**

1. **Months 1-4:** Build EU infrastructure (David) and complete GDPR/legal compliance (Sarah) in parallel. Expand Laing O'Rourke deployment as the first EU customer
2. **Month 4-5:** Use Laing O'Rourke case study to open 3-5 additional EU enterprise conversations, focusing on construction, manufacturing, and energy verticals (Elena's vertical focus is smart)
3. **Month 6+:** If EU pipeline reaches $200K+, hire a local AE and explore Elena's partnership strategy
4. **Budget guardrail:** Cap total EU investment at $350K in Year 1 (Marcus). If ROI isn't materializing by Month 9, reassess

This gives Mindsmith a **credible EU presence without betting the company on international expansion.** Laing O'Rourke absorbs much of the infrastructure cost, and the vertical focus creates a repeatable playbook.`
};

// ============================================================================
// PRE-BAKED ADVISOR RESPONSES — SCENARIO 5: AI Model Strategy
// ============================================================================
const AI_MODEL_STRATEGY_RESPONSES = {
  [AgentRole.FINANCE]: `### AI Model Strategy — Financial Analysis

This is fundamentally a **margin question**, and the answer depends on where we are on the cost curve.

**Current Economics:**
- Cost per course generated: ~$0.12 (OpenAI GPT-4 API)
- If we generate 10,000 courses/month, that's $1,200/mo in API costs
- At 50,000 courses/month (growth target), that's $6,000/mo — still manageable
- AI API costs as % of revenue: Likely 3-8% of gross revenue (healthy for SaaS)

**Fine-Tuning Cost Analysis:**
| Item | Cost | Recurring |
|------|------|-----------|
| ML engineer hire (senior) | $180-220K/yr | Yes |
| Training data preparation | $30-50K | One-time |
| GPU compute for training | $5-15K per training run | Periodic |
| Inference hosting (GPU instances) | $3-8K/mo | Yes |
| MLOps tooling | $1-2K/mo | Yes |
| **Year 1 Total** | **$280-380K** | |

**Break-Even Analysis:**
- At $0.12/course on OpenAI vs $0.03-0.05/course self-hosted (estimate), we save $0.07-0.09 per course
- To recoup a $300K investment on cost savings alone, we'd need to generate **3.3-4.3 million courses.** At 50K/month, that's **5-7 years to break even purely on cost savings**
- **The math doesn't work as a cost play.** Not even close.

**Where It DOES Make Financial Sense:**
- If fine-tuned models create **measurably better output** that increases conversion rates, reduces churn, or justifies premium pricing
- If it becomes a **competitive moat** that supports a higher valuation multiple at Series A ($300K investment → $3-5M in valuation uplift if investors see proprietary AI)
- If API dependency becomes a **business risk** (OpenAI changes pricing, terms, or availability)

**My Recommendation:**
Do NOT invest in fine-tuning for cost reduction — the math is terrible at our scale. Instead:

1. **Stay on OpenAI/third-party APIs** for the next 12-18 months. Our AI costs are a small percentage of revenue
2. **Negotiate volume pricing** — At our usage levels, OpenAI offers committed-use discounts. Could reduce cost to $0.06-0.08/course
3. **Explore cheaper models for non-critical tasks** — Use GPT-4 for course generation (quality matters) but use GPT-3.5 or open-source models for translation, quiz generation, and formatting tasks
4. **Revisit fine-tuning at $5M+ ARR** when the scale justifies the investment and we have the data to train on

The $300K+ it would cost to build our own model is better spent on sales, marketing, and product development at this stage.

**Vote: AGAINST**
**Confidence: 8**

**Risk Level: LOW** — Staying on third-party APIs is the financially rational choice. API dependency is a real risk, but the mitigation is multi-provider diversification, not building our own models.`,

  [AgentRole.GROWTH]: `### AI Model Strategy — Market Differentiation Perspective

Marcus just told you the math doesn't work on cost savings, and he's right — but he's answering the wrong question. **This isn't a cost decision. It's a differentiation decision.**

**The Moat Problem:**
Right now, our "AI" is GPT-4 with good prompt engineering. You know who else can build that? Everyone. Articulate just did it. Every new edtech startup with a developer and an API key can do it.

"We use GPT-4" is not a moat. It's a feature anyone can copy in a weekend hackathon.

**What a Fine-Tuned Model Actually Gives Us:**

1. **Instructional Design Intelligence** — A model trained on thousands of effective e-learning courses, learning science research, and assessment design patterns would generate *fundamentally better* content than generic GPT-4. Not just faster — better
2. **Brand-Specific Voice Training** — Imagine: enterprise customers upload their brand guidelines, tone of voice docs, and existing training materials. Our fine-tuned model generates content that *sounds like them*. GPT-4 can approximate this with prompting. A fine-tuned model nails it consistently
3. **"Powered by Mindsmith AI"** — This becomes a marketing asset. "Our proprietary AI, trained on instructional design best practices" is a completely different story than "We use ChatGPT." Every enterprise buyer knows the difference
4. **Pricing Power** — If our AI is proprietary and produces measurably better learning outcomes, we can charge more. That's the financial payoff Marcus isn't modeling

**The Competitive Window:**
Articulate will eventually try to build their own AI. So will every well-funded competitor. The question is: **who has the training data advantage?**

We've generated thousands of courses. We have assessment performance data. We have learner engagement data. That's a dataset no one else has — but only if we start using it now.

Every course generated on our platform is training data we should be capturing. Every learner interaction is signal. If we wait 18 months to start this, we've wasted 18 months of irreplaceable data accumulation.

**My Recommendation:**
Split the approach:

1. **Start building the data flywheel NOW** — Instrument everything. Capture which generated content gets edited (our AI was wrong), which gets used as-is (our AI was right), which assessments have good discrimination. This data is gold, and it costs almost nothing to collect
2. **Hire one ML engineer** — Not to build a model from scratch, but to start fine-tuning experiments. What does a GPT-4 model fine-tuned on 5,000 high-quality Mindsmith courses produce? Let's find out
3. **Keep GPT-4 as the production backbone** while the ML work happens in parallel
4. **Launch "Mindsmith AI" branding** in 6-9 months when we have results to show

**Vote: APPROVE**
**Confidence: 7**

**Opportunity Score: 7/10** — The long-term moat potential is enormous, but the near-term investment is real. Start with data collection (free) and one hire (meaningful but not reckless).`,

  [AgentRole.TECH]: `### AI Model Strategy — Technical Deep Dive

Let me break this down into what's technically real versus what's marketing fantasy.

**Option 1: Stay on Third-Party APIs (Current State)**

Pros:
- Zero ML infrastructure to maintain
- Automatic access to model improvements (when OpenAI ships GPT-5, we get it immediately)
- No GPU costs, no MLOps headaches
- Focus engineering on product, not infrastructure

Cons:
- No differentiation — same model as every competitor
- API dependency — pricing, rate limits, and availability are OpenAI's decisions, not ours
- Limited customization — prompt engineering has a ceiling
- Data privacy concerns — customer content is processed by OpenAI's infrastructure

Real risk: OpenAI changed their pricing 3 times in 2024 alone. They could raise prices, deprecate models, or change terms at any time. Building your business on someone else's API is building on rented land.

**Option 2: Fine-Tune Existing Models**

What this actually means:
- Take a base model (Llama 3, Mistral, or GPT-4 via OpenAI's fine-tuning API)
- Train it on our domain-specific data: successful course structures, effective assessments, instructional design patterns
- Host the fine-tuned model ourselves or use OpenAI's fine-tuning API

Technical requirements:
- 5,000-50,000 high-quality training examples (course input → ideal output pairs)
- Data annotation/curation: 2-3 months to prepare a quality dataset
- Fine-tuning runs: 1-2 weeks per experiment on OpenAI's API, or 2-4 weeks on our own infrastructure
- Evaluation framework: How do we measure if the fine-tuned model is actually better?

Hosting options:
- **OpenAI fine-tuning API:** Easiest, but you're still dependent on OpenAI. Cost: ~2x base model pricing
- **Self-hosted (Llama 3 70B):** Full control, but requires GPU infrastructure. Cost: $3-8K/mo for inference (A100/H100 instances)
- **Managed inference (Replicate, Together AI, Anyscale):** Middle ground. Cost: $1-3K/mo, scales with usage

**Option 3: Build a Proprietary Model (Not Recommended)**

Training from scratch requires:
- 100M+ parameter model minimum for quality
- Massive training dataset (billions of tokens)
- $500K-2M in compute costs per training run
- Team of 3-5 ML researchers
- 6-12 months minimum

This is what Anthropic and OpenAI do. It's not what a seed-stage edtech startup should attempt.

**My Recommendation:**

**Phase 1 (Now — Month 2): Data Infrastructure**
- Instrument our platform to capture training signals: edits users make to AI-generated content, assessment quality scores, course completion rates
- Build a data pipeline that creates clean training pairs automatically
- Engineering lift: 1 engineer, 6-8 weeks
- Cost: Nearly zero incremental

**Phase 2 (Month 3-5): Fine-Tuning Experiments**
- Hire one senior ML engineer
- Run experiments using OpenAI's fine-tuning API first (lowest friction)
- Evaluate: Does fine-tuned GPT-4 produce measurably better instructional content than base GPT-4 with our current prompts?
- If yes → proceed to Phase 3. If marginal → stay on base models and revisit quarterly

**Phase 3 (Month 6-9): Open-Source Migration**
- If fine-tuning shows clear value, migrate to self-hosted Llama 3 or Mistral
- This eliminates API dependency and gives us full control
- Run both systems in parallel during transition
- Engineering lift: 2-3 engineers, 2-3 months

**Do not skip Phase 1.** The data flywheel is the single most important technical investment we can make right now, and it's nearly free. Without good training data, fine-tuning is just expensive prompt engineering.

**Vote: APPROVE**
**Confidence: 7**

**Feasibility: MODERATE** — The phased approach is achievable with incremental investment. Phase 1 is trivial. Phase 2 requires one ML hire. Phase 3 is a significant engineering project but well-understood.`,

  [AgentRole.LEGAL]: `### AI Model Strategy — Legal & IP Implications

The AI model decision has significant legal implications that go beyond technical and financial considerations.

**Third-Party API — Legal Risks:**

1. **Terms of Service Dependency**
   - OpenAI's Terms of Use and API terms govern how we can use their models. Key provisions:
     - We own the outputs (good), but OpenAI reserves the right to use inputs/outputs for model improvement unless we opt out via their API settings
     - For enterprise customers processing sensitive training content through OpenAI's API, this is a **data governance concern**
   - We need to ensure we're using OpenAI's "API data usage" opt-out (zero data retention mode) for all enterprise customer content
   - **Risk:** If we're not properly configured, enterprise customer training materials could be used to train future OpenAI models. That's a breach of our DPA commitments

2. **Service Availability & Business Continuity**
   - OpenAI's API Terms include broad termination rights. They can suspend or terminate access with limited notice
   - For enterprise customers expecting 99.9% uptime, our SLA is only as good as OpenAI's. And we don't have an SLA from OpenAI (enterprise tier does, standard doesn't)
   - **Recommendation:** Upgrade to OpenAI Enterprise API tier and ensure we have a documented business continuity plan if API access is interrupted

**Fine-Tuning / Self-Hosting — Legal Considerations:**

1. **Training Data Rights**
   - If we fine-tune on customer-generated content (courses created on our platform), we need explicit rights to use this data for model training
   - Our Terms of Service must include a clear license grant: "You grant Mindsmith a license to use content created on the platform to improve our AI services"
   - This is **standard** (Canva, Figma, most SaaS platforms have similar clauses) but must be transparent and conspicuous
   - Enterprise customers may push back on this — we need a carve-out option for sensitive content

2. **Open-Source Model Licensing**
   - Llama 3: Meta's community license allows commercial use but has restrictions for apps with 700M+ monthly users (not a concern for us)
   - Mistral: Apache 2.0 — fully permissive commercial use
   - Both allow fine-tuning and self-hosting. No legal barriers here

3. **AI-Generated Content & Copyright**
   - Current US Copyright Office position: AI-generated content without meaningful human creative input is not copyrightable
   - For our customers, this means the courses generated by our AI may not be protectable by copyright
   - This is a **market-wide issue**, not specific to us. But we should be transparent about it in our ToS rather than making implied promises about IP ownership
   - If we fine-tune our own model, the legal position doesn't change — the outputs are still AI-generated

4. **Patent Opportunities**
   - If we develop novel fine-tuning methodologies for instructional design (e.g., a unique approach to generating pedagogically-optimized content), that could be patentable
   - Method patents in AI are tricky but possible. Budget $15-25K for a patent application
   - This creates defensive IP value even if we never enforce it — investors love patent portfolios

**My Recommendation:**

1. **Immediate:** Audit our OpenAI API configuration — ensure zero data retention is enabled for all enterprise customer queries. This is urgent
2. **Update Terms of Service** to include clear language about using platform data for AI model improvement, with an enterprise opt-out
3. **If we pursue fine-tuning:** Use only data from customers who've consented via our ToS. Maintain a clear audit trail of training data provenance
4. **File a provisional patent** on any novel instructional design AI methodology — costs $3-5K and preserves our priority date while we decide on a full patent

**Vote: APPROVE**
**Confidence: 6**

**Legal Risk: MANAGEABLE** — The legal landscape for AI model training is complex but navigable. The most urgent issue is ensuring our current OpenAI API usage doesn't inadvertently breach our data processing commitments to enterprise customers.`,

  [AgentRole.SYNTHESIS]: `## Board Resolution

### Key Consensus
The board unanimously agrees on two points:
1. **Building a proprietary model from scratch is off the table** — the cost ($500K-2M+) and team requirements (3-5 ML researchers) are completely inappropriate for a seed-stage company
2. **The data flywheel should start immediately** — capturing training signals from platform usage is nearly free and creates long-term strategic value regardless of which model strategy we pursue

### Critical Disagreements
The central tension is between **Marcus's financial pragmatism and Elena's differentiation argument:**

- **Marcus says the fine-tuning math doesn't work** — $300K+ investment requires 3.3-4.3 million courses to break even on cost savings alone. He recommends staying on third-party APIs for 12-18 months
- **Elena counters that this isn't a cost decision** — "'We use GPT-4' is not a moat. It's a feature anyone can copy in a weekend hackathon." She wants one ML hire and fine-tuning experiments now
- **David mediates with a phased approach** — Start with data collection (free), move to fine-tuning experiments (one hire), then consider self-hosting if results warrant it
- **Sarah raises an urgent compliance issue** — Is our OpenAI API configured for zero data retention? If enterprise customer content is being used to train OpenAI models, we may be in breach of our DPAs

### Decision Framework

| Option | Year 1 Cost | Differentiation | Risk |
|--------|------------|----------------|------|
| **A. Stay on APIs + negotiate pricing** | $15-30K (API costs) | None — same model as competitors | Low cost, high competitive risk |
| **B. Phased approach (David's plan)** | $80-150K (1 ML hire + compute) | Growing — fine-tuned models in 6-9 months | Medium — balanced risk/reward |
| **C. Full self-hosted AI** | $300-400K (team + infrastructure) | High — proprietary model | High — diverts resources from product |

### Secretary's Recommendation
**Option B — David's phased approach, with Sarah's urgent audit:**

**Immediate (This Week):**
- Audit OpenAI API configuration for zero data retention — Sarah flagged this as potentially urgent. If enterprise customer data is leaking into OpenAI's training pipeline, fix it today
- Update Terms of Service with clear AI training data provisions

**Phase 1 (Months 1-2):** Build data infrastructure
- Instrument the platform to capture training signals (edits, quality scores, engagement data)
- Cost: Engineering time only, no incremental spend
- This creates the foundation for everything else

**Phase 2 (Months 3-5):** Hire + experiment
- One senior ML engineer ($180-220K/yr)
- Run fine-tuning experiments on OpenAI's API first (lowest friction)
- Evaluate: Is fine-tuned output measurably better than prompted GPT-4?

**Phase 3 (Months 6-9):** Decide based on data
- If fine-tuning shows clear value → migrate to self-hosted (Llama 3/Mistral)
- If marginal → stay on APIs, revisit at higher scale
- File provisional patent on any novel methodology

This approach is **financially responsible (Marcus), strategically sound (Elena), technically phased (David), and legally compliant (Sarah).** The total Year 1 investment is $80-150K — meaningful but not company-altering.`
};

// ============================================================================
// MOCK RESPONSE INDEX — Maps scenarios to pre-baked responses
// ============================================================================
export const MOCK_SCENARIOS = [
  {
    ...MINDSMITH_SCENARIOS[0],
    responses: SERIES_A_RESPONSES,
  },
  {
    ...MINDSMITH_SCENARIOS[1],
    responses: ENTERPRISE_VS_PLG_RESPONSES,
  },
  {
    ...MINDSMITH_SCENARIOS[2],
    responses: ARTICULATE_RESPONSE,
  },
  {
    ...MINDSMITH_SCENARIOS[3],
    responses: INTERNATIONAL_EXPANSION_RESPONSES,
  },
  {
    ...MINDSMITH_SCENARIOS[4],
    responses: AI_MODEL_STRATEGY_RESPONSES,
  },
];

// ============================================================================
// HELPER: Get mock messages for a given scenario index
// ============================================================================
export const getMockMessages = (scenarioIndex) => {
  const scenario = MOCK_SCENARIOS[scenarioIndex];
  if (!scenario) return [];

  const baseTime = Date.now();
  const mode = scenario.question.split(/\s+/).length >= 30 ? 'DASHBOARD' : 'SMS';

  const makeMsg = (role, offset) => {
    const content = scenario.responses[role];
    const parsed = role !== AgentRole.USER && role !== AgentRole.SYNTHESIS
      ? parseVoteAndConfidence(content)
      : { vote: null, confidence: null };
    return {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: baseTime + offset,
      mode,
      vote: parsed.vote,
      confidence: parsed.confidence,
    };
  };

  const messages = [
    { id: crypto.randomUUID(), role: AgentRole.USER, content: scenario.question, timestamp: baseTime, mode, vote: null, confidence: null },
    makeMsg(AgentRole.FINANCE, 2000),
    makeMsg(AgentRole.GROWTH, 3500),
    makeMsg(AgentRole.TECH, 5000),
    makeMsg(AgentRole.LEGAL, 6500),
    makeMsg(AgentRole.SYNTHESIS, 9000),
  ];

  return messages;
};
