# Voice Assistant

A cross-platform desktop AI voice assistant with humanized personality.

## Quick Start

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run compile
```

## Project Structure

```
packages/
├── main/       # @app/main - Electron main process
├── preload/    # @app/preload - Secure IPC bridge
├── renderer/   # @app/renderer - React UI
└── core/       # @app/core - Business logic
```

## Tech Stack

- **Framework**: Electron 28+
- **UI**: React 19 + TypeScript
- **Bundler**: Vite 5+
- **State**: Zustand
- **Database**: Supabase
- **Testing**: Vitest + Playwright

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development with HMR |
| `npm run build` | Build all packages |
| `npm run compile` | Build + package installer |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run typecheck` | Type check all packages |

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## Architecture

### Provider Abstraction

All AI services use abstract interfaces allowing easy swapping:

- `LLMProvider` - Chat with OpenAI, Gemini, Claude
- `VoiceProvider` - STT/TTS or Voice-to-Voice
- `VADProvider` - Voice Activity Detection

### Agentic Development

Use workflow commands for autonomous development:

- `/dev` - Start dev server
- `/test` - Run tests
- `/build` - Build project

Workflows in `.agent/workflows/` have `// turbo` annotations for auto-execution.
