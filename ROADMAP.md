# Oxymon Voice Agent — Project Roadmap

## Vision

A desktop AI voice assistant with **emotionally correct delivery** — not just transcription + answers, but a companion that knows *when* to engage and *how* to speak with appropriate prosody, cadence, and tone.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Desktop App                         │
├─────────────────┬─────────────────────────┬─────────────────────┤
│   Ears          │         Brain           │        Mouth        │
│   (Input)       │       (Processing)      │       (Output)      │
├─────────────────┼─────────────────────────┼─────────────────────┤
│ Local VAD       │ Gemini Live Session     │ Prosody Validator   │
│ Wake Word Gate  │ SER (Hume)              │ SSML Renderer       │
│                 │ Engagement Engine       │ Cartesia TTS        │
│                 │ App Memory (Supabase)   │                     │
└─────────────────┴─────────────────────────┴─────────────────────┘
```

---

## Development Sprints

| Sprint | Focus | Status |
|:---|:---|:---|
| **1** | VAD + Audio Capture | 📋 Planned |
| **2** | Prosody Schema + SSML + TTS | 🔄 In Progress |
| **3** | Gemini Live Integration | 📋 Planned |
| **4** | SER + Memory | 📋 Planned |
| **5** | Full Pipeline Integration | 📋 Planned |

---

## Current Progress

### ✅ Completed
- Project scaffolding (Electron + React + Vite)
- CI/CD pipeline (GitHub Actions)
- Prosody schema types (`ProsodySchema.ts`)
- Prosody validator with clamping (`ProsodyValidator.ts`)
- SSML renderer for multiple TTS providers (`SSMLRenderer.ts`)
- 25 unit tests passing

### 🔄 In Progress
- Cartesia TTS integration

### 📋 Planned
- Silero VAD implementation
- Gemini Live session client
- Hume SER integration
- Supabase memory store
- Engagement engine triggers

---

## Key Design Decisions

1. **Own the prosody pipeline** — V2V models embed prosody in audio; we need SSML control for deterministic delivery
2. **Gemini Live for session engine** — Handles VAD, turn-taking, streaming; outputs text + prosody plan
3. **Two-tier memory** — Tiny persistent profile + project context, rehydrated on session start
4. **SER parallel processing** — Run emotion detection alongside STT, inject into prompts
5. **TTS-agnostic design** — Prosody types map to Cartesia, ElevenLabs, Google, or Amazon

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Type check
npm run typecheck
```

---

## Environment Variables

```env
CARTESIA_API_KEY=your_key      # Sprint 2
GOOGLE_AI_API_KEY=your_key     # Sprint 3
HUME_API_KEY=your_key          # Sprint 4
SUPABASE_URL=your_url          # Sprint 4
SUPABASE_ANON_KEY=your_key     # Sprint 4
```
