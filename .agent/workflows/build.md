---
description: Build and package the application for distribution
---

# Build Workflow

## Development Build
// turbo
1. Build all packages:
```bash
npm run build
```

## Production Package

### Windows
// turbo
2. Package for Windows:
```bash
npm run compile:win
```

### macOS
3. Package for macOS:
```bash
npm run compile:mac
```

## Output

Built installers are placed in the `release/` directory:
- Windows: `Voice Assistant-{version}-win.exe`
- macOS: `Voice Assistant-{version}-mac.dmg`

## Before Building

1. Update version in root `package.json`
2. Ensure all environment variables are set
3. Run `npm run typecheck` to verify no errors
4. Run `npm test` to ensure tests pass
