# Testing Guidelines

## Policy

Every new feature must include tests appropriate to its risk and behavior.
Every bug fix should include a regression test that fails without the fix.
Favor thorough unit/component and API integration coverage; reserve browser tests
for 5-8 critical user journeys. Tests must be isolated, independent, repeatable,
and maintainable. No test may depend on another test's execution or saved data.

This document defines required conventions. Frontend Jest tests, coverage gates,
and six Chromium/POM journeys are implemented for the toolbox and standalone export. Backend
tests and the full seven target journeys remain future work. See the root README
for current commands. This guide supersedes earlier Vitest and colocated-test
recommendations.

## Frameworks and Placement

| Test kind               | Required tools                     | Location                                  | Naming                     |
| ----------------------- | ---------------------------------- | ----------------------------------------- | -------------------------- |
| Backend unit            | Jest, Node environment             | `packages/backend/__tests__/`             | `*.test.js` or `*.test.ts` |
| Frontend unit/component | Jest, React Testing Library, jsdom | `packages/frontend/src/__tests__/`        | `*.test.js` or `*.test.ts` |
| Backend API integration | Jest + Supertest, Node environment | `packages/backend/__tests__/integration/` | `*.test.js` or `*.test.ts` |
| Complete UI workflows   | Playwright, Chromium only, POM     | `tests/e2e/`                              | `*.spec.js` or `*.spec.ts` |

Prefer TypeScript tests for this TypeScript project. Match unit filenames to the
module under test: `app.test.ts`, `theme-resolver.test.ts`, or `Button.test.ts`.
Use descriptive integration names such as `presets-api.test.ts` and journey names
such as `component-export-workflow.spec.ts`. Mirror feature subdirectories inside
the required frontend test directory to prevent filename collisions.

Keep the requested `.test.ts` / `.test.js` suffixes even for React tests. Use
`React.createElement` or a typed rendering helper in `.test.ts` files instead of
adding a `.test.tsx` exception. Support helpers are not test files and may use
`.tsx` when they contain JSX.

Use separate Jest projects/configurations for frontend unit, backend unit, and
backend integration suites. Exclude the integration directory from backend unit
discovery and exclude Playwright specs from all Jest projects. Configure a
maintained TypeScript transform, jsdom, and jest-dom explicitly; do not assume
Jest automatically understands TypeScript or Vite aliases.

Tests for shared UI/contracts must also have an explicit home: browser behavior
in the frontend test tree, server validation in the backend unit tree. Avoid
running identical shared pure-function tests twice without a meaningful reason.

## Unit and React Component Tests

Use arrange-act-assert with descriptive `describe` and `it` names that state
observable behavior. Test the public contract rather than private methods or
React implementation details. A focused test should explain one behavior.

- Cover normal cases, boundaries, invalid input, and important failure paths.
- Test dimension limits, undo/redo, theme inheritance/overrides, serialization,
  URL validation, and deterministic export generation.
- Test numeric/date/text sorting, null placement, stable equal-key ordering,
  filtering before pagination, and empty datasets.
- Verify imported column mappings and invalid CSV/JSON handling.
- Query React elements by role, label, and accessible name first. Use test IDs
  only when no suitable user-facing semantic query exists.
- Use Testing Library user-event for realistic interactions and await events.
- Assert visible output, callbacks, and accessibility states rather than exact
  internal state shape or CSS class strings.
- Include keyboard alternatives to resize controls, validation feedback,
  clipboard failure/fallback, focus behavior, and loading/error/empty states.
- Keep snapshots small and intentional; prefer behavioral assertions over large
  snapshots of component trees or generated source.
- For code export, check deterministic output and compile/render independent
  fixtures under `tests/export-fixtures/`, including sorting and connected data.

Mock external dependencies at boundaries: clocks, clipboard, network clients,
and filesystem adapters. Do not mock the function being tested or reproduce its
implementation in the expected result. Prefer real schema validation and pure
helpers. Restore mocks after each test and restore real timers after fake timers.

## Backend API Integration Tests

Use Jest + Supertest to exercise backend API endpoints with real HTTP requests.
`request(app)` uses an actual HTTP server on an ephemeral port; calling route
functions directly is not an integration test. Export a testable Express app
separately from the process entry point so importing it does not start production
listeners or connect to a developer's database.

- Use a real isolated test database and real migrations/repositories.
- Test status codes, response bodies, content types, and durable database effects.
- Cover create/read/update/delete, invalid input, missing records, duplicate
  names where constrained, reference integrity, and size limits.
- Verify workspace backup/restore and persistence when storage is reopened.
- Confirm failures do not partially write data or erase valid existing records.
- Simulate failed writes at a controlled adapter boundary in dedicated tests;
  do not replace persistence across the entire integration suite.
- Do not contact external sites, download fonts, or use production credentials.
- If a test starts a listener explicitly, bind to port `0`, read the assigned
  address, and close the listener in teardown.

Use a unique temporary database/file directory per test or isolated fixture.
Apply migrations before creating fixtures. Close handles before deleting files.
When testing shared-state concurrency, explicitly configure its scope; never
rely on incidental test ordering or globally reset another worker's database.

## Isolation, Setup, and Teardown

Setup and teardown hooks are required for suites with fixtures/resources.
Use Jest `beforeEach`/`afterEach` for per-test data and mock lifecycle, and
`beforeAll`/`afterAll` only for expensive resources that cannot leak state.
Use equivalent Playwright hooks and fixtures for browser journeys.

Each test must create its own identifiable data. Reset local/session storage,
restore environment variables, and clean up listeners, database connections,
temporary files, mocks, and timers as applicable. React Testing Library's
configured automatic cleanup may handle unmounting; verify that it is enabled.

Playwright browser contexts must be fresh per test. Backend data is not isolated
by browser contexts: seed unique records through a test fixture/API and remove
them in fixture teardown, or provision an isolated database per worker.
Ensure cleanup runs even when an assertion fails. Do not create production
reset/seed endpoints solely to support tests.

Tests must pass individually, in a full suite, repeatedly, and in varying order.
Use fixed clocks/seeds where necessary and deterministic sample assets/data.
Await asynchronous operations; do not use arbitrary sleeps or leave rejected
promises and open handles behind.

## Ports and Server Readiness

Always use environment variables with sensible defaults for ports.
The backend convention is:

```ts
const PORT = process.env.PORT || 3030;
```

Validate and convert the resolved value to a numeric TCP port before listening;
Node can interpret a raw string as a named pipe. Reject invalid configuration
with a clear startup error. Ephemeral port `0` is appropriate for isolated tests.

The frontend defaults to port `3000`, overridable through its own `PORT`
environment variable. Vite normally defaults to 5173 and does not automatically
honor `PORT`: configure `server.port` from `Number(process.env.PORT || 3000)` and
enable `strictPort` so it does not silently choose another port.

Set `PORT` independently for each process. A CI coordinator may use variables
such as `BACKEND_PORT` and `FRONTEND_PORT`, passing their values as `PORT` to the
respective process. Configure frontend API URLs and Playwright `baseURL` from
the same resolved values; do not hardcode URLs throughout tests.

CI must either allocate ports before starting servers or discover assigned ports
from startup output/address metadata and pass the resulting URLs downstream.
Wait for a health endpoint and frontend readiness, not a timed delay. Never reuse
an arbitrary developer server or silently test a different application.

## Playwright: One Browser and Page Objects

Playwright is the required E2E framework. Configure exactly one browser project,
Chromium. Do not add Firefox/WebKit projects or device presets that introduce
another browser. Desktop and mobile viewport checks can use the same Chromium
project; viewport variation does not justify extra user journeys.

All E2E tests must use the Page Object Model (POM). Store page objects under
`tests/e2e/pages/` and reusable setup under `tests/e2e/fixtures/`.
Page objects encapsulate locators and meaningful actions, such as opening a
drawer, editing dimensions, saving a theme, or exporting code. Use small reusable
component objects for shared panels rather than one enormous workstation class.

Keep journey intent and business assertions visible in specs. Page objects may
verify their own readiness, but should not hide every test assertion or depend
on other page objects' mutable global state. Prefer role/label locators and
Playwright's auto-waiting assertions; avoid brittle CSS chains and forced clicks.

## Critical Journey Budget

Maintain 5-8 critical user journeys. Start with these seven:

1. Browse/search drawers, edit a button with resize controls, and undo/redo.
2. Save a component preset and reopen it after reload.
3. Save/apply a theme and verify a local override remains intact.
4. Copy/export a component, including the clipboard-unavailable fallback.
5. Import a dataset, sort/filter a table, and verify its linked chart updates.
6. Add/reorder showcase frames and reject an invalid website URL.
7. Recover from a failed save without losing the draft, then retry successfully.

Include representative keyboard and narrow-screen checks in these journeys.
Keep exhaustive permutations, data boundaries, and server failures in Jest.
Adding a journey requires explaining its distinct critical risk and staying
within the 5-8 budget by combining or retiring redundant journeys.

## CI, Coverage, and Maintenance

Gate changes on linting, strict TypeScript checks, Jest suites, independent export
fixture checks, production builds, and the Chromium E2E suite. Once configured,
document exact executable commands in the root README and keep lockfiles current.

Use an initial Jest coverage target of 85% statements, lines, and functions, and
80% branches for application logic. Exclude generated files and declarations,
not difficult business logic. Tighten targets for core sorting, configuration,
and export code as it matures. Threshold changes require documented rationale;
coverage percentages never replace meaningful assertions.

Run browser journeys against a production-like build with isolated test storage.
Retain failure traces/screenshots and concise reports, but never upload secrets
or private datasets. Permit at most one CI E2E retry for diagnostics, track flakes,
and fix them rather than treating retry success as proof of correctness.

Keep helpers small, typed, and shared only where they remove real duplication.
Review tests like production code. Remove obsolete expectations when behavior
changes, document deliberate gaps, and never disable unrelated failing tests to
make a feature appear ready.
