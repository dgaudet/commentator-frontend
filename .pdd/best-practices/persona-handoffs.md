# Persona Handoff Best Practices

## Overview

Seamless handoffs between personas are critical for maintaining context continuity and workflow efficiency in the PDD Framework. This document provides guidelines for executing effective persona-to-persona handoffs.

## When to Hand Off

Hand off work to another persona when:

1. **Boundary Reached**: Your expertise or authority limit has been reached
2. **Phase Complete**: Your phase of work is finished (e.g., ideation → requirements)
3. **Specialization Needed**: Another persona has better expertise for the next step
4. **Quality Gate**: A different persona's review or approval is required
5. **User Requested**: User explicitly requests a different persona

## Handoff Command Syntax

Use the `pdd handoff` command to create a seamless transition:

```bash
pdd handoff "<target-persona>" "<task-description>"
```

### Examples

**From Creative Strategist to Product Owner**:
```bash
pdd handoff "product owner" "Refine these innovation concepts into user stories and acceptance criteria"
```

**From Backend Developer to Frontend Developer**:
```bash
pdd handoff "frontend developer" "Create UI for this REST API with the provided endpoints"
```

**From Business Analyst to System Architect**:
```bash
pdd handoff "system architect" "Design technical architecture for these business requirements"
```

**From QA Engineer to DevOps Engineer**:
```bash
pdd handoff "devops engineer" "Set up CI/CD pipeline with these test automation requirements"
```

## Pre-Handoff Checklist

Before executing a handoff, ensure:

- [ ] **Deliverables Complete**: All outputs for your phase are documented
- [ ] **Context Documented**: Key decisions, assumptions, and constraints are captured
- [ ] **Quality Validated**: Your quality gates have been passed
- [ ] **Handoff Context**: Clear task description for the next persona
- [ ] **Files Organized**: Relevant files are in the feature directory
- [ ] **Outstanding Issues**: Any blockers or questions are documented

## Handoff Information to Include

### For All Handoffs
- **What was accomplished**: Summary of your work
- **Key decisions made**: Important choices and their rationale
- **Assumptions**: Any assumptions that were made
- **Constraints**: Technical, business, or time constraints
- **Next steps**: What the receiving persona should focus on

### Domain-Specific Handoffs

**Technical Handoffs** (Developer → Developer):
- API endpoints and contracts
- Data models and schemas
- Authentication/authorization requirements
- Performance requirements
- Error handling strategies

**Business to Technical** (BA/PO → Architect/Developer):
- User stories and acceptance criteria
- Business rules and validation logic
- User flows and interaction patterns
- Success metrics and KPIs
- Compliance requirements

**Technical to Business** (Developer → BA/PO):
- Technical constraints or limitations
- Implementation trade-offs
- Timeline estimates
- Risk assessments
- Technical debt identified

## Handoff Protocol by Persona

### Creative Strategist → Product Owner
**Deliverables**:
- Innovation concepts and ideas
- Problem reframing statements
- Feasibility assessments
- Strategic alignment notes

**Command**:
```bash
pdd handoff "product owner" "Prioritize and refine these innovation concepts into a product roadmap"
```

### Product Owner → Backend Developer
**Deliverables**:
- User stories with acceptance criteria
- API requirements
- Data model requirements
- Business rules

**Command**:
```bash
pdd handoff "backend developer" "Implement REST API based on these user stories and requirements"
```

### Backend Developer → Frontend Developer
**Deliverables**:
- API documentation (OpenAPI/Swagger)
- Data contracts and models
- Authentication flow
- Error responses

**Command**:
```bash
pdd handoff "frontend developer" "Build UI consuming this API with the documented endpoints"
```

### Any Developer → QA Engineer
**Deliverables**:
- Implementation complete
- Unit tests passing
- Feature documentation
- Test scenarios identified

**Command**:
```bash
pdd handoff "qa engineer" "Create test plan and automation for this feature"
```

### QA Engineer → DevOps Engineer
**Deliverables**:
- Test automation complete
- Test data requirements
- Environment needs
- Performance benchmarks

**Command**:
```bash
pdd handoff "devops engineer" "Set up deployment pipeline and monitoring for this feature"
```

## Handoff Best Practices

### 1. **Use Descriptive Task Descriptions**
❌ Bad: `pdd handoff "backend developer" "continue"`
✅ Good: `pdd handoff "backend developer" "Implement authentication API with JWT tokens based on the security requirements document"`

### 2. **Complete Your Work First**
Don't hand off incomplete work. Ensure your deliverables are ready for the next persona.

### 3. **Preserve Feature Context**
The handoff automatically preserves the feature directory and conversation history. The receiving persona will have full context.

### 4. **Document Decisions**
Don't rely on the receiving persona to guess. Document key decisions and rationale.

### 5. **Flag Blockers Early**
If you encounter blockers that require another persona's expertise, hand off immediately rather than waiting.

### 6. **Cross-Functional Handoffs**
When handing off between business and technical personas:
- Translate domain terminology
- Provide context for technical constraints
- Include visual diagrams when helpful

## What Happens During Handoff

1. **Context Preservation**: Current feature directory and files are preserved
2. **Conversation History**: Full chat history is passed to new persona
3. **Persona Activation**: Target persona is activated with your handoff context
4. **Seamless Transition**: User continues in the same workspace with new expert

## Handoff Anti-Patterns

### ❌ Avoid These Mistakes

1. **Incomplete Handoffs**: Handing off without completing your phase
2. **Vague Instructions**: "continue from here" without specifics
3. **Missing Context**: Not documenting key decisions or assumptions
4. **Wrong Persona**: Handing off to a persona outside their expertise
5. **Circular Handoffs**: Bouncing back and forth without progress
6. **No Quality Check**: Handing off work that hasn't passed your quality gates

## Emergency Handoffs

If you encounter a critical issue outside your expertise:

```bash
# Security vulnerability found
pdd handoff "security engineer" "URGENT: Review potential SQL injection vulnerability in user input handling"

# Performance crisis
pdd handoff "devops engineer" "CRITICAL: Application experiencing high latency, need immediate performance analysis"

# Architecture concern
pdd handoff "system architect" "BLOCKER: Current approach won't scale, need architectural guidance"
```

## Handoff Verification

After executing a handoff, verify:
- [ ] Command executed successfully
- [ ] Target persona was activated
- [ ] Context file was generated
- [ ] Feature directory is preserved
- [ ] Conversation history is available

## Common Handoff Workflows

### Full Stack Feature Development
```
Product Owner (requirements)
    ↓ pdd handoff "backend developer" "..."
Backend Developer (API implementation)
    ↓ pdd handoff "frontend developer" "..."
Frontend Developer (UI implementation)
    ↓ pdd handoff "qa engineer" "..."
QA Engineer (testing)
    ↓ pdd handoff "devops engineer" "..."
DevOps Engineer (deployment)
```

### Innovation to Delivery
```
Creative Strategist (ideation)
    ↓ pdd handoff "business analyst" "..."
Business Analyst (requirements analysis)
    ↓ pdd handoff "product owner" "..."
Product Owner (prioritization)
    ↓ pdd handoff "system architect" "..."
System Architect (design)
    ↓ pdd handoff "backend developer" "..."
Backend Developer (implementation)
```

### Security Review Workflow
```
Any Developer (implementation)
    ↓ pdd handoff "security engineer" "..."
Security Engineer (security review)
    ↓ pdd handoff "backend developer" "..." (if issues found)
Backend Developer (fixes)
    ↓ pdd handoff "qa engineer" "..."
QA Engineer (validation)
```

## Remember

**Handoffs are not failures** - they're how the PDD Framework enables specialized expertise at every phase. A well-executed handoff is a sign of professional discipline and understanding of boundaries.

**The goal**: Seamless collaboration where each persona contributes their expertise without overlap or gaps.
