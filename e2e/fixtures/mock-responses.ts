export const MOCK_RESPONSES = {
  FINANCE: `## Financial Analysis

**Bottom Line:** This initiative shows moderate financial promise but requires careful capital allocation.

**Key Metrics:**
- Projected ROI: 18-24% over 18 months
- Required investment: $250K-$400K
- Payback period: 12-14 months
- Impact on burn rate: +15% for 6 months

**Risk Level: MODERATE**`,

  GROWTH: `## Growth Strategy Assessment

**Market Opportunity:** Strong product-market fit signals with significant upside potential.

**Key Growth Metrics:**
- TAM expansion: $2.1B addressable segment
- Expected conversion lift: 25-35%
- Customer acquisition timeline: 3-6 months to meaningful traction
- Competitive window: 6-9 months before market saturation

**Recommendation:** Move aggressively while the window is open.`,

  TECH: `## Technical Assessment

**Architecture Impact:** This can be implemented within the existing infrastructure with moderate refactoring.

**Implementation Details:**
- Estimated development: 4-6 sprint cycles
- Technical debt impact: Low — aligns with current architecture
- Scalability: Current infra supports 10x growth on this path
- Dependencies: Requires API versioning strategy

**Risk Level: LOW** — Well within engineering capabilities.`,

  LEGAL: `## Legal & Compliance Review

**Compliance Status:** No immediate regulatory blockers identified, but proactive measures needed.

**Key Considerations:**
- Data privacy: GDPR/CCPA compliant with current architecture
- IP protection: File provisional patent within 60 days
- Contractual: Standard terms of service update required
- Liability: Professional liability insurance review recommended

**Risk Level: LOW** — Proceed with standard legal safeguards.`,

  SYNTHESIS: `## Board Resolution

**Consensus:** The board recommends proceeding with measured execution.

### Points of Agreement
- Market timing is favorable (Growth, Finance)
- Technical implementation is feasible (Tech)
- No regulatory blockers (Legal)

### Key Conditions
1. Stage investment in two tranches based on Q1 metrics (Finance)
2. Prioritize enterprise segment for faster payback (Growth)
3. Implement with API-first architecture for flexibility (Tech)
4. Complete IP filing before public launch (Legal)

### Dissenting Notes
- Finance recommends more conservative timeline than Growth's aggressive push
- Growth argues delay risks competitive window closing

**Final Vote: 4-0 in favor with conditions above.**`,
};

/**
 * Creates an SSE-formatted response that matches Gemini API streaming format.
 */
export function createSSEResponse(text: string): string {
  const data = JSON.stringify({
    candidates: [{
      content: {
        parts: [{ text }],
        role: 'model',
      },
      finishReason: 'STOP',
      index: 0,
    }],
  });
  return `data: ${data}\n\n`;
}

/** Agent order for sequential mock responses */
export const AGENT_ORDER = ['FINANCE', 'GROWTH', 'TECH', 'LEGAL', 'SYNTHESIS'] as const;
