# End-to-End Tests

Six toolbox Playwright workflows run on desktop and mobile viewports,
using Chromium as the only browser and page objects in `pages/`.
The export journey checks copying, an independent rendered snippet, and the
manual fallback. The responsive journey verifies the local worktable texture.

Run `npm run test:e2e` from the root after `npx playwright install chromium`.
The runner starts its own frontend server and isolates browser contexts per test.
No backend data exists yet. Future persistence tests must add isolated storage
fixtures and teardown; browser contexts alone do not isolate a database.

Cover editing, saving and reloading, theme reuse, linked table/chart data, export,
and showcase management. Use isolated test storage and deterministic fixtures.
Unit/component tests belong in the required frontend/backend test directories,
not in this directory. Use `*.spec.js` or `*.spec.ts` for E2E journey files.

See [testing requirements](../../docs/functional-requirements.md#qr-01-thorough-automated-testing)
and [testing guidelines](../../docs/testing-guidelines.md).
