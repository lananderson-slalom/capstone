# Project Structure

## Original Documentation Scaffold

```text
capstone/
|-- README.md
|-- docs/
|   |-- functional-requirements.md
|   |-- project-structure.md
|   |-- ui-guidelines.md
|   |-- testing-guidelines.md
|   |-- coding-guidelines.md
|   `-- copilot-instructions.md
|-- apps/
|   |-- web/
|   |   `-- README.md
|   `-- api/
|       `-- README.md
|-- packages/
|   |-- ui/
|   |   `-- README.md
|   `-- contracts/
|       `-- README.md
`-- tests/
    `-- e2e/
        `-- README.md
```

The initial React toolbox now lives in `packages/frontend`, with Vite, Jest,
and a root npm workspace. Root `tests/e2e` contains six Chromium workflows and
page objects. The tree above records the original documentation scaffold;
see [the root README](../README.md) for current setup and implemented behavior.
Backend, shared UI, and contracts remain documentation-only placeholders.

The existing `apps/web` and `apps/api` directories contain only initial README
placeholders. The newer owner-specified package paths below replace those paths
for future implementation; no application source needs migration yet.

## Intended Implementation Layout

Use an npm workspace monorepo. Recommended tooling: Vite with React/TypeScript,
an Express/TypeScript Node.js API, SQLite storage, Zod contracts, Jest,
React Testing Library, Supertest, and Playwright. Select a maintained chart
library and CSV parser during implementation instead of writing those engines.
Configure Vite to use `PORT` with default 3000 rather than its native 5173 default.

The following tree is the full target layout. Frontend and browser-test files
exist for the initial toolbox; backend and remaining feature modules are planned.

```text
capstone/
|-- package.json                 # Workspace scripts and package membership
|-- package-lock.json
|-- tsconfig.base.json
|-- .github/workflows/ci.yml      # Type checks, tests, builds, export checks
|-- packages/
|   |-- frontend/
|   |   |-- package.json
|   |   |-- index.html
|   |   |-- vite.config.ts
|   |   |-- tsconfig.json
|   |   |-- public/              # Workstation assets
|   |   `-- src/
|   |       |-- main.tsx
|   |       |-- app/             # Shell, navigation, providers
|   |       |-- features/
|   |       |   |-- library/     # Catalog, search, toolbox drawers
|   |       |   |-- editor/      # Canvas, inspector, resize, history
|   |       |   |-- export/      # Deterministic React/CSS generators
|   |       |   |-- presets/     # Saved components and folders
|   |       |   |-- themes/      # Theme folders, tokens, overrides
|   |       |   |-- data/        # Imports, mappings, table/chart bindings
|   |       |   `-- showcase/    # Project frames and portfolio view
|   |       |-- services/        # Typed API client
|   |       |-- styles/          # Workstation styling and tokens
|   |       `-- __tests__/       # Jest unit/component tests and helpers
|   |-- backend/
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   |-- __tests__/           # Jest backend unit tests
|   |   |   `-- integration/     # Jest + Supertest endpoint tests
|   |   `-- src/
|   |       |-- app.ts           # Testable server configuration
|   |       |-- server.ts        # Process entry point
|   |       |-- routes/          # Validated HTTP endpoints
|   |       |-- services/        # Persistence rules, imports, references
|   |       |-- repositories/    # Database access
|   |       `-- db/migrations/   # Versioned storage schema changes
|   |-- ui/
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   `-- src/
|   |       |-- components/      # Reusable buttons, inputs, tables, charts
|   |       |-- tokens/          # Theme/style resolution
|   |       `-- index.ts         # Public exports
|   `-- contracts/
|       |-- package.json
|       |-- tsconfig.json
|       `-- src/
|           |-- schemas/        # Runtime validation and versioned models
|           `-- index.ts         # Shared schemas and inferred types
|-- tests/
|   |-- e2e/                     # 5-8 Chromium Playwright journeys (*.spec.ts)
|   |   |-- pages/               # Required page objects
|   |   `-- fixtures/            # Isolated data and lifecycle helpers
|   `-- export-fixtures/         # Compile/render generated code independently
`-- docs/
    |-- functional-requirements.md
    |-- project-structure.md
    |-- ui-guidelines.md
    |-- testing-guidelines.md
    |-- coding-guidelines.md
    |-- copilot-instructions.md
    |-- architecture.md
    |-- api.md
    `-- user-guide.md
```

## Ownership and Dependencies

- `packages/frontend` owns the workstation UI, editable drafts, and code generation.
- `packages/backend` owns durable storage, request validation, and reference integrity.
- `packages/ui` owns the reusable catalog components and theme resolution. It
  must not depend on the workstation shell or backend.
- `packages/contracts` owns serializable configuration, API, and dataset schemas.
  It must not depend on either application or browser-specific code.
- Both applications use contracts; the web app also uses UI components.
- Generated code must work independently of this monorepo. Export dependencies
  must be explicit, and verified in isolated fixtures.

## Test Placement

Use Jest unit tests named `*.test.js` or `*.test.ts` in
`packages/backend/__tests__/` and `packages/frontend/src/__tests__/`.
Backend HTTP integration tests use Jest + Supertest under
`packages/backend/__tests__/integration/` with the same suffixes. Playwright
journeys use `*.spec.js` or `*.spec.ts` under `tests/e2e/`, Chromium only, and POM.
Reserve `tests/export-fixtures/` for independent generated-code checks.
See [testing-guidelines.md](testing-guidelines.md) for the full policy.

## Implementation Conventions

Use strict TypeScript, explicit public exports, and validated shared contracts.
Keep persistent configuration separate from transient editor state. Keep local
database files, backups, credentials, and generated build output out of Git.
Add workspace scripts and executable setup instructions when packages are
implemented; do not advertise commands before they work.
