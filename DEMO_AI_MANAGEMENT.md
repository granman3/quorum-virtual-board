# Quorum Demo AI Management System

## Overview

This system manages AI usage for the public demo deployment of Quorum, implementing a four-tier approach to balance cost control with user experience.

## Architecture

### Components

1. **Budget Manager** (`services/demoAIBudgetManager.js`)
   - Tracks daily AI usage (100 calls/day limit)
   - Calculates real-time costs ($0.002 per call)
   - Provides budget status for UI components

2. **Template Manager** (`services/demoTemplateManager.js`)
   - Keyword-based template detection
   - 5 template types: Finance, Market, Tech, Legal, Default
   - Pre-built advisor responses for common scenarios

3. **Pre-Baked Manager** (`services/demoPreBakedManager.js`)
   - 5 high-quality investor pitch scenarios
   - Zero-cost, instant responses
   - Enhanced with metadata (investor value, AI savings, complexity)

4. **UI Components**
   - `DemoAIBudgetIndicator`: Visual budget tracker
   - `DemoFallbackWarning`: Contextual warnings
   - `DemoStatusBanner`: Top-level status display

## Usage Flow

### Scenario 1: Pre-Baked Content (Recommended)
```
User selects "Series A Timing" 
→ Track usage: preBaked
→ Display pre-recorded response
→ Cost: $0.00
→ Speed: Instant
```

### Scenario 2: Template Response (Low Cost)
```
User asks custom question about "fundraising"
→ Detect template: Finance
→ Generate template-based response
→ Track usage: template
→ Cost: $0.01 (5 AI calls for variety)
→ Speed: Fast
```

### Scenario 3: Full AI (High Cost)
```
User asks complex custom question
→ Budget check: available
→ Generate full AI response
→ Track usage: ai
→ Cost: $0.02+ (10+ AI calls)
→ Speed: Normal
```

### Scenario 4: Graceful Degradation
```
Budget exhausted (>100 calls)
→ Fallback to templates
→ If templates unavailable, use pre-baked
→ User sees appropriate messaging
→ Cost: $0.00
```

## Configuration

### Budget Limits
```javascript
DEMO_DAILY_LIMIT = 100;  // Max AI calls per day
COST_PER_CALL = 0.002;   // Gemini 2.5 Flash cost
```

### Template Types
- **Finance**: funding, raise, series, investment, revenue, cost, margin, burn
- **Market**: competition, customer, growth, expand, launch, product, sales
- **Tech**: technology, engineering, architecture, api, infrastructure, scale
- **Legal**: compliance, regulation, gdpr, contract, liability, risk
- **Default**: catch-all for general business questions

### Usage Categories
- `preBaked`: Pre-recorded scenarios (cost: $0)
- `template`: Template-based responses (cost: ~$0.01)
- `ai`: Full AI generation (cost: ~$0.02+)
- `fallback`: Degraded experience (cost: $0)

## UI States

### Budget Indicator
- **Green** (0-70%): "Good Standing" - All features available
- **Amber** (70-90%): "Moderate Usage" - Templates recommended
- **Red** (90-100%): "Almost Limit" - Pre-baked only

### Warning Messages
- **70%+**: Info banner with remaining calls
- **90%+**: Warning banner, templates will be used
- **100%**: Error banner, pre-baked only

## Integration Points

### DemoApp.js Integration
```javascript
// Import services
import { checkDemoBudget, trackDemoUsage } from './services/demoAIBudgetManager.js';
import { detectTemplateType, generateTemplateResponse } from './services/demoTemplateManager.js';
import { getAllScenarios, getPreBakedResponse } from './services/demoPreBakedManager.js';

// Add to component state
const [budgetStatus, setBudgetStatus] = useState(checkDemoBudget());

// Track usage
trackDemoUsage('preBaked');
setBudgetStatus(checkDemoBudget());

// Display budget indicator
<DemoAIBudgetIndicator />

// Show warnings
{budgetStatus.percentage >= 70 && <DemoFallbackWarning />}
```

## Cost Analysis

### Pre-Baked Scenarios
- **Cost**: $0.00
- **Speed**: Instant
- **Quality**: High (hand-crafted responses)
- **Use Case**: Investor pitches, demos

### Template Responses
- **Cost**: ~$0.01 per session
- **Speed**: Fast (<2 seconds)
- **Quality**: Medium (structured templates)
- **Use Case**: Common question patterns

### Full AI
- **Cost**: ~$0.02+ per session
- **Speed**: Normal (5-10 seconds)
- **Quality**: High (real AI generation)
- **Use Case**: Complex custom questions

### Daily Budget
- **Max Calls**: 100
- **Max Cost**: $0.20
- **Recommended Mix**: 80% pre-baked, 15% template, 5% AI

## Monitoring

### Usage Metrics
```javascript
// Get current usage
const usage = getDemoUsage();
console.log(usage);
// { calls: 45, preBaked: 35, template: 8, ai: 2, fallback: 0 }

// Check budget status
const budget = checkDemoBudget();
console.log(budget);
// { allowed: true, remaining: 55, percentage: 45, canUseAI: true }
```

### Cost Tracking
```javascript
// Get current cost
const cost = getCurrentCost();
console.log(`$${cost.toFixed(3)} spent today`);

// Estimate cost
const estimatedCost = estimateCost(50);
console.log(`50 calls would cost $${estimatedCost.toFixed(3)}`);
```

## Best Practices

### For Demo Presentations
1. **Start with pre-baked scenarios** (0% budget usage)
2. **Use templates for common questions** (5% budget per session)
3. **Reserve full AI for complex questions** (10% budget per session)
4. **Monitor budget throughout day**
5. **Reset budget at midnight automatically**

### For Investor Pitches
1. Use **Series A Timing** scenario (9.5/10 investor value)
2. Follow with **Enterprise vs PLG** (9.2/10 investor value)
3. Use **Articulate Competitive** if asked about competition (9.3/10)
4. Keep budget under 30% for safety margin

### For Public Demos
1. Display budget indicator prominently
2. Show warnings at 70% usage
3. Gracefully degrade to templates
4. Never show errors to users
5. Reset daily at midnight

## Troubleshooting

### Budget Not Resetting
```javascript
// Manual reset (admin only)
resetDailyUsage();
```

### Templates Not Detecting
```javascript
// Check detection
const type = detectTemplateType("Should we raise a series A?");
console.log(type); // Should return 'finance'

// Check keywords
const keywords = DEMO_TEMPLATES['finance'].keywords;
console.log(keywords); // ['funding', 'raise', 'series', ...]
```

### Budget Indicator Not Showing
```javascript
// Check budget status
const budget = checkDemoBudget();
console.log(budget);

// Force update
setBudgetStatus(checkDemoBudget());
```

## Future Enhancements

### Phase 2 (Week 3-4)
- [ ] Add Firebase Firestore analytics
- [ ] Implement real-time dashboard
- [ ] Add A/B testing for templates
- [ ] Create admin panel for budget management

### Phase 3 (Month 2)
- [ ] Machine learning for better template detection
- [ ] Custom template builder
- [ ] Cost optimization algorithms
- [ ] Enterprise-specific templates

### Phase 4 (Month 3+)
- [ ] Multi-tenant budget isolation
- [ ] Role-based access control
- [ ] API rate limiting per user
- [ ] Cost allocation reporting

## Support

For issues or questions:
1. Check this README first
2. Review component documentation
3. Check browser console for errors
4. Contact development team

## Changelog

### v1.0.0 (Current)
- Initial implementation
- Budget manager with 100 calls/day limit
- 5 template types with keyword detection
- 5 pre-baked investor scenarios
- UI components for budget display
- Graceful degradation system
- Cost tracking and analytics

---

**Last Updated**: January 2026  
**Maintained By**: Quorum Development Team
