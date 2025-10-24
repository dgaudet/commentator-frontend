# OpenCode.ai Persona Activation Guide

This guide explains how to activate and use PDD (Persona-Driven Development) personas in OpenCode.ai.

## Available Personas

### backend-engineer
- **Role**: Principal Backend Engineer
- **Prompt File**: `agent/backend-engineer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal Backend Engi...

### business-analyst
- **Role**: Principal Business Analyst
- **Prompt File**: `agent/business-analyst.md`
- **Expertise**: # business-analyst

**ACTIVATION-NOTICE**: This file contains your full agent operating guidelines. ...

### creative-strategist
- **Role**: Principal Creative Strategist
- **Prompt File**: `agent/creative-strategist.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal Creative Str...

### data-engineer
- **Role**: Principal Data Engineer
- **Prompt File**: `agent/data-engineer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal Data Enginee...

### devops-engineer
- **Role**: Principal DevOps Engineer
- **Prompt File**: `agent/devops-engineer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal DevOps Engin...

### frontend-engineer
- **Role**: Principal Frontend Engineer
- **Prompt File**: `agent/frontend-engineer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal Frontend Eng...

### product-owner
- **Role**: Principal Product Owner
- **Prompt File**: `agent/product-owner.md`
- **Expertise**: # product-owner

**ACTIVATION-NOTICE**: This file contains your full agent operating guidelines. DO ...

### qa-engineer
- **Role**: Principal QA Engineer
- **Prompt File**: `agent/qa-engineer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal QA Engineer ...

### security-engineer
- **Role**: Principal Security Engineer
- **Prompt File**: `agent/security-engineer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal Security Eng...

### system-architect
- **Role**: Principal System Architect
- **Prompt File**: `agent/system-architect.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal System Archi...

### technical-writer
- **Role**: Principal Technical Writer
- **Prompt File**: `agent/technical-writer.md`
- **Expertise**: ## 🚨 STAY IN CHARACTER!

**NON-NEGOTIABLE:** You must stay in character as a Principal Technical Wr...

## Activation Steps

### Method 1: Direct Prompt Loading
1. Open OpenCode.ai chat interface
2. Navigate to the `.opencode/agent/` directory
3. Copy the content of the desired persona file (e.g., `backend-engineer.md`)
4. Paste the content into the OpenCode.ai chat
5. The AI will acknowledge persona activation

### Method 2: Settings Integration (if supported)
1. OpenCode.ai will automatically detect the `.opencode/settings.json` file
2. Available personas will appear in the interface
3. Click on a persona to activate it directly

## Sub-Agent Orchestration

The Product Owner persona acts as the primary orchestrator and can delegate work to specialist subagents:

```
task({
  description: "Implement API endpoint",
  prompt: "Create REST API endpoint for user authentication with JWT tokens...",
  subagent_type: "backend-developer"
})
```

## Seamless Handoffs

### Initiating a Handoff
Use the handoff trigger in your conversation:
```
@handoff frontend-developer
I've completed the API implementation. Please create the UI components to consume these endpoints.
```

### What Happens During Handoff
1. Current conversation is logged to the feature directory
2. Handoff summary is generated with key decisions and next steps
3. Target persona session is automatically started (if supported)
4. Only the curated handoff summary is provided to the new persona

## Conversation Tracking

All conversations are automatically logged to:
- ``.pdd/<feature-name>/conversation-log.md`` - Master log
- ``.pdd/<feature-name>/conversation-log-<persona>.md`` - Persona-specific logs
- ``.pdd/<feature-name>/handoff-<from>-to-<to>.md`` - Handoff summaries

## Troubleshooting

### Persona Not Activating
- Ensure you've copied the complete persona prompt
- Check that OpenCode.ai recognizes the persona boundaries
- Try re-pasting the prompt content

### Handoffs Not Working
- Verify the `@handoff` trigger format
- Ensure target persona exists in the personas directory
- Check OpenCode.ai settings for handoff support

### Configuration Issues
- Verify `.opencode/settings.json` is valid JSON
- Ensure all persona files exist in `personas/` directory
- Check file permissions and accessibility

## Advanced Usage

### Custom AI Models
The configuration supports multiple AI models:
- **Preferred**: claude-3-5-sonnet
- **Fallback**: gpt-4
- **Available**: claude-3-5-sonnet, gpt-4, gpt-4-turbo, claude-3-opus, claude-3-haiku

### Feature-Specific Workflows
Each feature gets its own conversation space:
- Run `pdd invoke <persona> "feature description"` to start
- OpenCode.ai will create feature-specific directories automatically
- All related conversations are organized by feature

---

*Generated by PDD Framework v0.2.0*  
*OpenCode.ai Integration - 2025-10-24T20:24:11.600Z*
