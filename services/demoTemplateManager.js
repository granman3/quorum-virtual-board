// Demo Template Manager - Template-based responses for custom questions

import { AgentRole } from '../types.js';

export const TEMPLATE_TYPES = {
  FINANCE: 'finance',
  MARKET: 'market',
  TECH: 'tech',
  LEGAL: 'legal',
  DEFAULT: 'default'
};

export const DEMO_TEMPLATES = {
  [TEMPLATE_TYPES.FINANCE]: {
    name: 'Financial Analysis',
    keywords: ['funding', 'raise', 'series', 'investment', 'revenue', 'cost', 'margin', 'burn', 'runway', 'arr', 'mrr', 'profit', 'loss', 'cash', 'budget'],
    responses: {
      [AgentRole.FINANCE]: `### Financial Analysis

Let me cut through with some numbers.

**Current Position:**
- Revenue trajectory: Strong growth momentum
- Burn rate: Manageable with current funding
- Runway: 18-22 months at current pace

**The Case for Proceeding:**
- Growth metrics support the investment
- Unit economics are improving
- Market timing is favorable

**The Case Against:**
- Execution risk remains
- Market conditions could shift
- Alternative uses of capital exist

**My Recommendation:**
Proceed with caution. Set clear milestones and metrics. Review progress quarterly.

**Vote: APPROVE**
**Confidence: 7**

**Risk Level: MODERATE** — Manageable with proper controls.`,

      [AgentRole.GROWTH]: `### Market Opportunity Assessment

Here's the growth perspective.

**Market Timing:**
- Market conditions are favorable
- Competitive window is open
- Customer demand is accelerating

**Growth Trajectory:**
- 20-40% MoM growth achievable
- Market penetration still early
- Expansion opportunities clear

**Competitive Advantage:**
- First-mover advantage in key segments
- Product differentiation strong
- Brand momentum building

**Vote: APPROVE**
**Confidence: 8**

**Opportunity Score: 8/10** — Strong opportunity, move decisively.`,

      [AgentRole.TECH]: `### Technical Feasibility Assessment

Let me evaluate the technical requirements.

**Implementation Complexity:**
- Architecture supports the initiative
- Engineering effort: 4-8 weeks with current team
- No major technical blockers identified

**Scalability Considerations:**
- Cloud-native infrastructure ready
- Performance impact minimal
- Maintenance overhead manageable

**Technical Risks:**
- Integration complexity moderate
- Some refactoring required
- Testing timeline tight but achievable

**Vote: APPROVE**
**Confidence: 6**

**Feasibility: MODERATE** — Achievable with focused effort.`,

      [AgentRole.LEGAL]: `### Legal & Regulatory Assessment

Let me flag the key considerations.

**Compliance Requirements:**
- Standard regulatory considerations
- Minor adjustments to terms of service
- Customer communication needed

**Risk Assessment:**
- Liability exposure manageable
- Insurance coverage adequate
- Contract updates minimal

**Mitigation Steps:**
- Update privacy policy
- Review customer agreements
- Document decision process

**Vote: APPROVE**
**Confidence: 7**

**Legal Risk: MANAGEABLE** — Proceed with standard safeguards.`,

      [AgentRole.SYNTHESIS]: `## Board Resolution

### Vote Tally
| Advisor | Vote | Confidence |
|---------|------|------------|
| CFO | APPROVE | 7/10 |
| CMO | APPROVE | 8/10 |
| CTO | APPROVE | 6/10 |
| General Counsel | APPROVE | 7/10 |

**Board Decision: 4-0 APPROVE** — Avg Confidence: 7/10

**Consensus:** Strong consensus on proceeding with the initiative. All advisors see favorable conditions.

**Core Tension:** Minor concerns on execution timeline and risk management, but all agree the opportunity outweighs the risks.

**Recommendation:** Proceed with implementation. Set quarterly review checkpoints. Monitor key metrics closely.`
    }
  },

  [TEMPLATE_TYPES.MARKET]: {
    name: 'Market Strategy',
    keywords: ['market', 'competition', 'customer', 'growth', 'expand', 'launch', 'product', 'sales', 'enterprise', 'plg', 'acquire'],
    responses: {
      [AgentRole.FINANCE]: `### Market Strategy — Financial Analysis

Let me frame this financially.

**Revenue Impact:**
- Immediate revenue potential: Moderate
- Long-term revenue ceiling: Significant
- Payback period: 12-18 months

**Investment Required:**
- Customer acquisition costs
- Go-to-market expenses
- Operational overhead

**ROI Analysis:**
- LTV:CAC ratio favorable
- Gross margins support expansion
- Unit economics improve at scale

**Vote: APPROVE**
**Confidence: 7**

**Risk Level: MODERATE** — Investment justified by market opportunity.`,

      [AgentRole.GROWTH]: `### Market Strategy — Growth Perspective

This is a strategic opportunity.

**Market Dynamics:**
- TAM is expanding rapidly
- Competitors are slow to respond
- Customer pain points are acute

**Execution Playbook:**
- Focus on high-value segments first
- Build case studies quickly
- Scale what works

**Competitive Moat:**
- Product differentiation strong
- Speed advantage against incumbents
- Network effects building

**Vote: APPROVE**
**Confidence: 9**

**Opportunity Score: 9/10** — Category-defining opportunity.`,

      [AgentRole.TECH]: `### Market Strategy — Technical Readiness

Here's the technical perspective.

**Platform Readiness:**
- Infrastructure supports scaling
- Feature gaps are minor
- Performance is stable

**Engineering Priorities:**
- Enhance core features
- Improve onboarding flow
- Build analytics capabilities

**Integration Needs:**
- Customer requested integrations
- API improvements needed
- Documentation updates

**Vote: APPROVE**
**Confidence: 7**

**Feasibility: MODERATE** — Technical foundation is solid.`,

      [AgentRole.LEGAL]: `### Market Strategy — Legal Considerations

Key legal factors to consider.

**Contract Updates:**
- Revise customer agreements
- Update SLA terms
- Clarify data ownership

**Compliance:**
- Industry-specific regulations
- Data residency requirements
- Customer due diligence

**Risk Management:**
- Customer liability provisions
- Insurance coverage review
- Dispute resolution clauses

**Vote: APPROVE**
**Confidence: 6**

**Legal Risk: MANAGEABLE** — Standard commercial considerations.`,

      [AgentRole.SYNTHESIS]: `## Board Resolution

### Vote Tally
| Advisor | Vote | Confidence |
|---------|------|------------|
| CFO | APPROVE | 7/10 |
| CMO | APPROVE | 9/10 |
| CTO | APPROVE | 7/10 |
| General Counsel | APPROVE | 6/10 |

**Board Decision: 4-0 APPROVE** — Avg Confidence: 7.25/10

**Consensus:** Strong agreement on market opportunity. All advisors recommend moving forward.

**Core Tension:** Balance between speed of execution and risk management. CMO wants to move fast; Legal and CTO want proper safeguards.

**Recommendation:** Execute aggressive go-to-market strategy with proper legal and technical controls. Set monthly review cadence.`
    }
  },

  [TEMPLATE_TYPES.TECH]: {
    name: 'Technical Strategy',
    keywords: ['technology', 'technical', 'engineering', 'architecture', 'api', 'infrastructure', 'scale', 'performance', 'security', 'ai', 'model'],
    responses: {
      [AgentRole.FINANCE]: `### Technical Strategy — Financial Perspective

Here's the financial impact.

**Investment Analysis:**
- Engineering costs: Moderate
- Infrastructure costs: Predictable
- ROI timeline: 6-12 months

**Cost-Benefit:**
- Efficiency gains justify investment
- Long-term cost reduction
- Competitive advantage building

**Budget Recommendation:**
- Phase the investment
- Tie spending to milestones
- Maintain flexibility

**Vote: APPROVE**
**Confidence: 7**

**Risk Level: LOW-MODERATE** — Investment is justified.`,

      [AgentRole.GROWTH]: `### Technical Strategy — Market Impact

This supports our market position.

**Competitive Impact:**
- Differentiates us from competitors
- Enables new use cases
- Strengthens value proposition

**Customer Value:**
- Improves product experience
- Enables enterprise features
- Supports scaling customers

**Market Timing:**
- Technical investment now
- Market leadership later
- First-mover advantage

**Vote: APPROVE**
**Confidence: 8**

**Opportunity Score: 8/10** — Strategic technical investment.`,

      [AgentRole.TECH]: `### Technical Strategy — Implementation Plan

Here's my technical assessment.

**Technical Approach:**
- Proven architecture patterns
- Manageable complexity
- Clear implementation path

**Resource Requirements:**
- Engineering team: 2-3 engineers
- Timeline: 6-12 weeks
- Dependencies: Minimal

**Risk Mitigation:**
- Incremental rollout
- Feature flags for safety
- Rollback plan ready

**Vote: APPROVE**
**Confidence: 8**

**Feasibility: STRAIGHTFORWARD** — Clear execution path.`,

      [AgentRole.LEGAL]: `### Technical Strategy — Legal & Compliance

Key legal considerations.

**Data Handling:**
- Privacy implications
- Data residency
- Retention policies

**Security:**
- Compliance requirements
- Audit trail needs
- Access controls

**Intellectual Property:**
- IP ownership clear
- License compliance
- Third-party dependencies

**Vote: APPROVE**
**Confidence: 7**

**Legal Risk: MANAGEABLE** — Standard compliance work needed.`,

      [AgentRole.SYNTHESIS]: `## Board Resolution

### Vote Tally
| Advisor | Vote | Confidence |
|---------|------|------------|
| CFO | APPROVE | 7/10 |
| CMO | APPROVE | 8/10 |
| CTO | APPROVE | 8/10 |
| General Counsel | APPROVE | 7/10 |

**Board Decision: 4-0 APPROVE** — Avg Confidence: 7.5/10

**Consensus:** Strong technical case with clear benefits across all dimensions.

**Core Tension:** Minor concerns on timeline and resource allocation, but all agree on direction.

**Recommendation:** Approve technical investment. CTO to lead implementation with monthly board updates.`
    }
  },

  [TEMPLATE_TYPES.LEGAL]: {
    name: 'Legal & Regulatory',
    keywords: ['legal', 'compliance', 'regulation', 'gdpr', 'contract', 'liability', 'risk', 'insurance', 'policy', 'international', 'expansion'],
    responses: {
      [AgentRole.FINANCE]: `### Legal Initiative — Financial Impact

Financial implications analysis.

**Cost Structure:**
- Legal fees: $50-80K estimated
- Compliance tools: $15-25K annually
- Insurance: $20-30K annually

**ROI Consideration:**
- Enables enterprise deals
- Reduces liability exposure
- Supports international expansion

**Budget Impact:**
- One-time setup costs
- Ongoing maintenance
- Revenue enablement

**Vote: APPROVE**
**Confidence: 8**

**Risk Level: LOW** — Necessary investment for growth.`,

      [AgentRole.GROWTH]: `### Legal Initiative — Market Opportunity

Market perspective on this.

**Market Access:**
- Opens enterprise segment
- Enables international markets
- Builds customer trust

**Competitive Position:**
- Most competitors lack this
- Trust differentiator
- Enterprise-grade positioning

**Sales Impact:**
- Shortens sales cycles
- Reduces procurement friction
- Enables larger deals

**Vote: APPROVE**
**Confidence: 9**

**Opportunity Score: 9/10** — Essential for enterprise growth.`,

      [AgentRole.TECH]: `### Legal Initiative — Technical Requirements

Technical implementation needs.

**Data Infrastructure:**
- Data mapping required
- Audit logging needed
- Access control enhancements

**System Updates:**
- Privacy controls
- Data export features
- Retention automation

**Integration Work:**
- Compliance tooling
- Monitoring dashboards
- Reporting capabilities

**Vote: APPROVE**
**Confidence: 7**

**Feasibility: MODERATE** — 4-6 weeks of engineering work.`,

      [AgentRole.LEGAL]: `### Legal Initiative — Compliance Assessment

My area of expertise.

**Regulatory Requirements:**
- GDPR compliance gaps exist
- SOC 2 Type II needed
- Industry standards evolving

**Implementation Plan:**
- Phase 1: Data audit (Month 1)
- Phase 2: Controls implementation (Months 2-3)
- Phase 3: Certification (Month 4)

**Ongoing Obligations:**
- Annual audits
- Continuous monitoring
- Staff training

**Vote: APPROVE**
**Confidence: 9**

**Legal Risk: MANAGEABLE** — Standard compliance framework.`,

      [AgentRole.SYNTHESIS]: `## Board Resolution

### Vote Tally
| Advisor | Vote | Confidence |
|---------|------|------------|
| CFO | APPROVE | 8/10 |
| CMO | APPROVE | 9/10 |
| CTO | APPROVE | 7/10 |
| General Counsel | APPROVE | 9/10 |

**Board Decision: 4-0 APPROVE** — Avg Confidence: 8.25/10

**Consensus:** Strong agreement that legal and compliance investment is essential for next growth phase.

**Core Tension:** Timing and resource allocation - balance between speed and thoroughness.

**Recommendation:** Prioritize compliance work. Allocate budget and engineering resources. Target completion within 4 months.`
    }
  },

  [TEMPLATE_TYPES.DEFAULT]: {
    name: 'General Business',
    keywords: [],
    responses: {
      [AgentRole.FINANCE]: `### Financial Analysis

Let me provide the financial perspective.

**Current Assessment:**
- Financial position is stable
- Growth trajectory positive
- Investment opportunity exists

**Key Considerations:**
- Cost-benefit analysis favorable
- Risk-adjusted returns acceptable
- Resource allocation sound

**Vote: APPROVE**
**Confidence: 7**

**Risk Level: MODERATE** — Proceed with standard controls.`,

      [AgentRole.GROWTH]: `### Strategic Assessment

Here's the growth perspective.

**Opportunity Analysis:**
- Market timing is favorable
- Competitive position strong
- Growth potential significant

**Strategic Fit:**
- Aligns with company vision
- Builds competitive moat
- Scales core business

**Vote: APPROVE**
**Confidence: 8**

**Opportunity Score: 8/10** — Solid strategic opportunity.`,

      [AgentRole.TECH]: `### Technical Assessment

Here's the technical view.

**Feasibility Analysis:**
- Technical requirements clear
- Implementation path defined
- Resources available

**Execution Plan:**
- Phased approach recommended
- Risk mitigation built-in
- Timeline achievable

**Vote: APPROVE**
**Confidence: 7**

**Feasibility: MODERATE** — Achievable with proper planning.`,

      [AgentRole.LEGAL]: `### Risk Assessment

Key legal considerations.

**Compliance Status:**
- Regulatory requirements met
- Standard safeguards needed
- Risk exposure manageable

**Documentation:**
- Review existing agreements
- Update as needed
- Maintain records

**Vote: APPROVE**
**Confidence: 7**

**Legal Risk: MANAGEABLE** — Standard business considerations.`,

      [AgentRole.SYNTHESIS]: `## Board Resolution

### Vote Tally
| Advisor | Vote | Confidence |
|---------|------|------------|
| CFO | APPROVE | 7/10 |
| CMO | APPROVE | 8/10 |
| CTO | APPROVE | 7/10 |
| General Counsel | APPROVE | 7/10 |

**Board Decision: 4-0 APPROVE** — Avg Confidence: 7.25/10

**Consensus:** Board supports the initiative with standard oversight.

**Core Tension:** Balance between speed and thoroughness.

**Recommendation:** Proceed with implementation. Establish review checkpoints. Monitor key metrics.`
    }
  }
};

// Detect template type from question content
export const detectTemplateType = (question) => {
  if (!question || typeof question !== 'string') {
    return TEMPLATE_TYPES.DEFAULT;
  }
  
  const questionLower = question.toLowerCase();
  
  // Check each template type's keywords
  for (const [type, template] of Object.entries(DEMO_TEMPLATES)) {
    if (type === TEMPLATE_TYPES.DEFAULT) continue;
    
    const hasKeyword = template.keywords.some(keyword => 
      questionLower.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      return type;
    }
  }
  
  return TEMPLATE_TYPES.DEFAULT;
};

// Generate template response
export const generateTemplateResponse = (templateType, context) => {
  const template = DEMO_TEMPLATES[templateType] || DEMO_TEMPLATES[TEMPLATE_TYPES.DEFAULT];
  
  const responses = {};
  Object.entries(template.responses).forEach(([role, response]) => {
    responses[role] = response;
  });
  
  return {
    templateType,
    templateName: template.name,
    responses,
    generatedAt: Date.now()
  };
};

// Get all available template types
export const getAvailableTemplates = () => {
  return Object.entries(DEMO_TEMPLATES).map(([type, template]) => ({
    type,
    name: template.name,
    keywordCount: template.keywords.length
  }));
};

// Check if question matches a specific template
export const matchesTemplate = (question, templateType) => {
  const template = DEMO_TEMPLATES[templateType];
  if (!template || !template.keywords) return false;
  
  const questionLower = question.toLowerCase();
  return template.keywords.some(keyword => 
    questionLower.includes(keyword.toLowerCase())
  );
};
