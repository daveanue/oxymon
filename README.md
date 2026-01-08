# Oxymon 🎙️

> An AI-powered voice assistant built with Electron, React, and TypeScript

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848F.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

Oxymon is a desktop voice assistant that enables natural voice interactions with AI. Built with a modular, provider-based architecture, it supports experimentation with different voice models and interaction patterns.

## ✨ Features

- 🎯 **Modular Architecture** - Swappable providers for voice, LLM, and VAD (Voice Activity Detection)
- 🔄 **Dual Voice Modes** - Support for both Voice-to-Voice (V2V) and STT/TTS pipelines
- 💾 **Persistent Memory** - Conversation history stored with Supabase
- 🎨 **Modern UI** - Beautiful React interface with real-time voice visualization
- 🔒 **Secure by Design** - Context isolation, sandboxed renderer, and proper IPC patterns
- 🧪 **Fully Tested** - Unit tests with Vitest, E2E tests with Playwright

## 🏗️ Architecture

Oxymon follows a strict package-based architecture to maintain separation of concerns:

```
packages/
├── core/       # Pure TypeScript - business logic, providers, utilities
├── main/       # Electron main process - Node.js APIs, system integration
├── preload/    # Context bridge - secure IPC communication
└── renderer/   # React UI - user interface and interactions
```

### Provider Pattern

All AI services are abstracted behind provider interfaces, allowing easy swapping:

- **VoiceProvider** - Speech recognition and synthesis (Whisper, Picovoice, etc.)
- **LLMProvider** - Language models (OpenAI, Anthropic, Google, etc.)
- **VADProvider** - Voice activity detection (Picovoice, WebRTC VAD, etc.)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/daveanue/oxymon.git
   cd oxymon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # At least one LLM provider
   OPENAI_API_KEY=your_key_here
   # or ANTHROPIC_API_KEY=your_key_here
   # or GOOGLE_AI_API_KEY=your_key_here

   # Voice capabilities
   ELEVENLABS_API_KEY=your_key_here    # TTS
   PICOVOICE_ACCESS_KEY=your_key_here  # Wake word / VAD

   # Database
   SUPABASE_URL=your_url_here
   SUPABASE_ANON_KEY=your_key_here
   ```

4. **Start development mode**
   ```bash
   npm run dev
   ```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode with hot reload |
| `npm run build` | Build production bundles for all packages |
| `npm run compile` | Compile and package the application |
| `npm test` | Run unit tests with Vitest |
| `npm run test:e2e` | Run end-to-end tests with Playwright |
| `npm run typecheck` | Type check all packages |
| `npm run lint` | Lint all packages |

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Type Checking
```bash
npm run typecheck
```

## 🔧 Configuration

### Electron Builder

Application packaging is configured in `electron-builder.yml`. Supports:
- Windows (NSIS installer)
- macOS (DMG)
- Linux (AppImage, deb)

### Vite Configuration

Each package has its own Vite configuration optimized for its environment:
- `packages/main/vite.config.ts` - Node.js target
- `packages/preload/vite.config.ts` - Limited Node.js
- `packages/renderer/vite.config.ts` - Browser target
- `packages/core/vite.config.ts` - Pure TypeScript

## 🏛️ Project Structure

```
oxymon/
├── .agent/                    # AI agent workflows and rules
│   └── workflows/            # Development workflows
├── packages/
│   ├── core/                 # Core business logic
│   │   ├── src/
│   │   │   ├── config/      # Configuration management
│   │   │   ├── providers/   # Provider interfaces & implementations
│   │   │   └── utils/       # Shared utilities
│   │   └── vite.config.ts
│   ├── main/                 # Electron main process
│   │   ├── src/
│   │   │   ├── index.ts     # Entry point
│   │   │   ├── window.ts    # Window management
│   │   │   └── ipc-handlers.ts  # IPC handlers
│   │   └── vite.config.ts
│   ├── preload/              # Preload scripts
│   │   ├── src/
│   │   │   └── index.ts     # Context bridge API
│   │   └── vite.config.ts
│   └── renderer/             # React UI
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── store/       # Zustand state management
│       │   ├── styles/      # Global styles
│       │   └── App.tsx      # Main app component
│       └── vite.config.ts
├── electron-builder.yml      # Build configuration
├── package.json              # Root package configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔒 Security

Oxymon follows Electron security best practices:

- ✅ Context isolation enabled
- ✅ Sandbox mode enabled
- ✅ Node integration disabled in renderer
- ✅ Remote module disabled
- ✅ All IPC communication validated
- ✅ API keys only accessible in main process

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the architecture principles in `GEMINI.md`
4. Write tests for new functionality
5. Ensure all tests pass (`npm test && npm run test:e2e`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Principles

See `GEMINI.md` for workspace-specific rules and architecture boundaries.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- State management with [Zustand](https://github.com/pmndrs/zustand)
- Build tooling by [Vite](https://vitejs.dev/)
- Testing with [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)

## 📧 Contact

David Wang - [@daveanue](https://github.com/daveanue)

Project Link: [https://github.com/daveanue/oxymon](https://github.com/daveanue/oxymon)

---

**Note**: This project is under active development. Features and APIs may change.
