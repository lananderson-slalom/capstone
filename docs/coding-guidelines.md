# Coding Guidelines

## Approach

Write clear, conservative code that supports a maintainable React/TypeScript
workstation and Node.js backend. Prefer explicit behavior and small modules over
clever shortcuts. Follow the functional requirements and UI/testing guides;
update documentation when public behavior or contracts change. The initial React
toolbox now has TypeScript, ESLint, Prettier, Jest, and Playwright configured.
Backend and shared-package conventions remain targets for future implementation;
see the root README for current commands and limitations.

## Formatting and Naming

Use two-space indentation, LF line endings, UTF-8, semicolons, single quotes in
JavaScript/TypeScript, and formatter-managed trailing commas. Let Prettier wrap
code at an initial 100-character print width; use double quotes in JSX attributes.
Commit a shared configuration rather than relying on editor-specific settings.
Do not reformat unrelated code while implementing a small feature.

Use descriptive names: PascalCase for components/types, camelCase for functions
and variables, and UPPER_SNAKE_CASE for true configuration constants. Use
PascalCase component filenames and kebab-case feature/helper filenames. Avoid
single-letter names, unclear abbreviations, and boolean names that hide intent.
Tests follow the exact conventions in [testing-guidelines.md](testing-guidelines.md).

## TypeScript and Contracts

Enable strict TypeScript. Prefer inferred local types and explicit public
function contracts where they improve clarity. Avoid `any`, unchecked casts,
non-null assertions, and suppression comments; narrow `unknown` input using
runtime validation. A justified escape hatch must be narrow and documented.

Use shared, versioned schemas for API payloads and persistent configuration.
Keep drafts and transient selection/hover state separate from saved component
models. Validate at system boundaries, not just in frontend forms. Model distinct
states with unions when they prevent impossible combinations.

## Imports and Module Boundaries

Group imports in this order: platform/built-in modules, external dependencies,
workspace packages, application aliases, then relative imports. Separate groups
with a blank line and use `import type` for type-only dependencies. Keep
side-effect imports deliberate and preserve ordering when order matters.

Use explicit public exports; avoid deep imports into another package's internals
and circular dependencies. Frontend code must not import server or database
modules. Contracts must remain serializable and browser-independent. Reusable
UI must not depend on the workstation shell. Align TypeScript, bundler, and Jest
alias resolution rather than making each tool understand a different layout.

## React and UI Code

Use function components, typed props, and focused hooks. Treat state as immutable.
Keep calculations pure where possible; derive values instead of synchronizing
duplicate state through effects. Use effects to synchronize with external
systems, and clean up subscriptions, listeners, and outstanding requests.

Use stable keys from domain IDs, controlled inputs where editing requires them,
and explicit loading/error/empty states. Keep accessibility in the component
contract: semantic elements, labels, visible focus, keyboard interactions, and
status feedback are not optional polish. Do not use raw HTML injection for
imported content.

Avoid adding memoization everywhere by default. Profile costly work and follow
the eventual React/compiler configuration before choosing optimizations.
Use tokens rather than scattered magic colors or dimensions. Keep editor UI
styling separate from the user's component theme configuration.

## Backend and Data

Separate the testable application from the listener entry point. Keep routes
focused on HTTP validation/translation, services on business rules, and
repositories on storage. Use parameterized queries and transactions where an
operation updates related records. Close resources and handle shutdown cleanly.

Validate environment configuration at startup. Use `PORT` with backend default
3030 and frontend default 3000, as specified in the testing guide; never scatter
hardcoded ports. Keep credentials, database files, and private backups out of
source control and logs. Log actionable errors without leaking user datasets.

Handle failures explicitly and preserve drafts. Do not silently swallow errors,
return misleading success, or use broad catch blocks that hide programming
faults. Validate URLs and import limits; do not fetch arbitrary showcase URLs on
the backend or execute imported/generated source inside the workstation.

## DRY, Simplicity, and Dependencies

Apply Don't Repeat Yourself (DRY) to repeated knowledge and business rules, not
merely similar-looking syntax. Share schema definitions, token resolution, and
repeated validation when they truly represent the same rule. Two small local
functions may be clearer than a generic abstraction with many options.

Keep responsibilities focused and implement only required behavior. Prefer
existing utilities and established libraries for parsing, charts, and domain
logic. Evaluate dependency maintenance, licensing, bundle size, accessibility,
and security before adoption. Commit the lockfile and use reproducible installs.

Generated React/TypeScript code must be deterministic, escaped safely, and usable
outside this repository. Make imports, styles, fonts, assets, and dependency
requirements explicit rather than relying on workstation internals.

## Linting and Quality Gates

Configure ESLint for TypeScript, React Hooks, and accessibility rules, with
Prettier handling formatting rather than overlapping style rules. Include
unused-import and promise-safety checks where supported. CI should check lint,
formatting, types, tests, and builds; local tools may auto-fix safe formatting.

Do not disable rules broadly to get a change through CI. Fix the cause or justify
a targeted exception. Comments should explain a non-obvious constraint or
tradeoff, not narrate the code. Track temporary work with a clear reason and
follow-up reference; do not leave unexplained TODOs in core paths.

## Definition of Done

A feature is complete when its acceptance criteria are met, its relevant tests
pass, error and accessibility states work, and its documentation is current.
Review changes for correctness, reference integrity, privacy, and independent
code-export behavior. Keep changes focused and avoid unrelated cleanup.

Use [testing-guidelines.md](testing-guidelines.md) for required test locations,
frameworks, isolation, and CI expectations, and [ui-guidelines.md](ui-guidelines.md)
for visual and interaction decisions. Leave unresolved owner-design fields
visible rather than inventing undocumented permanent choices.