---
description: Start development mode with hot reload
---

# Development Workflow

// turbo
1. Install dependencies (first time only):
```bash
npm install
```

// turbo
2. Rebuild native modules (first time or after Electron update):
```bash
npm run postinstall
```

// turbo
3. Start development mode:
```bash
npm run dev
```

This will:
- Start Vite dev server for renderer (HMR enabled)
- Build preload in watch mode
- Build main in watch mode
- Launch Electron loading the dev server

## Verify Everything Works
- Electron window should open
- React UI should render
- Console should show no errors
- Changes to React components should hot-reload
