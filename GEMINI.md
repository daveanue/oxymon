# Voice Assistant - Workspace Rules

> These rules are specific to this Electron voice assistant project.
> For universal principles, see your Global Rules.

---

## Architecture Boundaries

### Package Responsibilities
| Package | Environment | Can Import From |
|---------|-------------|-----------------|
| `@app/main` | Node.js (Electron main) | `@app/core` only |
| `@app/preload` | Limited Node (context bridge) | `@app/core` only |
| `@app/renderer` | Browser (React) | `@app/core` only |
| `@app/core` | Pure TypeScript | Nothing external—no Electron, no React |

### IPC Communication Pattern
All main↔renderer communication must follow this flow:
```
renderer → window.api.method() → preload contextBridge → ipcMain.handle() → main
```

Never:
- Import from `electron` in renderer
- Access `process`, `fs`, or Node APIs directly in renderer
- Bypass preload with direct IPC

---

## Security Constraints (Non-Negotiable)

1. **Context Isolation**: Never set `contextIsolation: false`
2. **Sandbox Mode**: Keep `sandbox: true` in webPreferences
3. **API Keys**: Only access in main process, never expose to renderer
4. **Input Validation**: All IPC handlers must validate incoming data shape/type
5. **File Paths**: Never send raw file system paths to renderer

---

## Provider Pattern

This project uses swappable providers for AI services:

```typescript
// Pattern: Define interface in @app/core
interface VoiceProvider {
  startListening(): Promise<void>;
  stopListening(): Promise<void>;
  onTranscript(callback: (text: string) => void): void;
}

// Implement concrete providers that satisfy interface
class WhisperProvider implements VoiceProvider { ... }
class PicovoiceProvider implements VoiceProvider { ... }
```

When adding new AI capabilities:
1. Define the abstract interface first
2. Implement at least one concrete provider
3. Ensure providers can be swapped at runtime via configuration

---

## Dual Voice Pipeline Consideration

This app may use either:
- **Voice-to-Voice (V2V)**: Single model handles audio in → audio out
- **STT/TTS Pipeline**: Speech-to-text → LLM → Text-to-speech

When implementing voice features, always consider:
- Does this work in both modes?
- If mode-specific, is it behind the provider abstraction?
- What's the latency impact?

---

## State Management

- Use **Zustand** for React state (already configured)
- Electron main process state should use simple module-level state or a store pattern
- Cross-process state sync happens only through IPC—never shared memory

---

## Testing Expectations

| Test Type | Tool | When to Run |
|-----------|------|-------------|
| Unit tests | Vitest | Every change (`npm test`) |
| Type checking | tsc | Every change (`npm run typecheck`) |
| E2E tests | Playwright | Before merge (`npm run test:e2e`) |

For IPC channels: Write tests that verify the contract between main and renderer.

---

## Environment Variables

Required for full functionality:
```env
# At least one LLM provider
OPENAI_API_KEY or ANTHROPIC_API_KEY or GOOGLE_AI_API_KEY

# Voice capabilities
ELEVENLABS_API_KEY    # TTS
PICOVOICE_ACCESS_KEY  # Wake word / VAD

# Database
SUPABASE_URL
SUPABASE_ANON_KEY
```

Never commit `.env`. Use `.env.example` as template.
