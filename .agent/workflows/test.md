---
description: Run tests and verify code changes
---

# Test Workflow

## Quick Test (Before Every Commit)
// turbo
1. Run type checking:
```bash
npm run typecheck
```

// turbo
2. Run unit tests:
```bash
npm test
```

## Full Verification (Before PR/Merge)
// turbo
3. Run E2E tests:
```bash
npm run test:e2e
```

// turbo
4. Build to verify no errors:
```bash
npm run build
```

## On Test Failure

If tests fail:
1. Check the error output carefully
2. Fix the failing test or the code causing the failure
3. Re-run the specific failing test:
```bash
npm test -- --filter "test name"
```
4. Once fixed, run full test suite again

## Test Coverage
```bash
npm run test:coverage
```
