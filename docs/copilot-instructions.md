# Project Instructions Index

## Scope and Discovery

Use this document as the instruction index for the Component Workstation.
It lives in `docs/` as requested and is not automatically discovered as GitHub
Copilot repository instructions. To enable automatic loading later, create
`.github/copilot-instructions.md` referencing this index and the relevant guides,
or explicitly attach these documents to a task. No automatic-loading wrapper is
created by this documentation change.

## Required Reading

- [Functional requirements](functional-requirements.md): scope, behaviors,
  acceptance criteria, delivery order, accessibility, and safety.
- [UI guidelines](ui-guidelines.md): workspace organization, interaction patterns,
  visual tokens, responsive behavior, and owner-fillable design decisions.
- [Testing guidelines](testing-guidelines.md): Jest, Supertest, Playwright,
  naming, locations, isolation, hooks, ports, POM, and CI standards.
- [Coding guidelines](coding-guidelines.md): formatting, imports, strict typing,
  module boundaries, linting, DRY, security, and definition of done.
- [Project structure](project-structure.md): actual scaffold versus intended
  implementation layout and package ownership.
- [Project README](../README.md): current project status and documentation entry.

The scaffold module notes also provide context:
[web](../apps/web/README.md), [API](../apps/api/README.md),
[UI package](../packages/ui/README.md),
[contracts](../packages/contracts/README.md), and
[E2E tests](../tests/e2e/README.md).

## Working Rules

Follow the owner's latest explicit request. Treat functional requirements as the
behavioral contract, the testing guide as authoritative for testing conventions,
and the intended layout as authoritative for future source placement. Existing
`apps/web` and `apps/api` README directories are historical scaffold placeholders,
not a reason to put new application source outside the required package paths.

- Use React/TypeScript on the frontend and Node.js/TypeScript on the backend.
- Put future frontend/backend code under `packages/frontend` / `packages/backend`.
- Use Jest for unit/component tests and Jest + Supertest for backend HTTP tests.
- Use Playwright with Chromium only, POM, and 5-8 critical E2E journeys.
- Follow the exact test suffixes and directories in the testing guide.
- Keep tests independent, with appropriate setup and teardown hooks.
- Add appropriate tests to every feature and regression coverage to bug fixes.
- Configure ports through environment variables with documented defaults.
- Keep UI worksheet blanks unresolved until the owner supplies specifications;
  ask when an unresolved choice blocks implementation.
- Preserve existing work, avoid unrelated refactors, and report verification gaps.
- Update contracts and documentation together when behavior changes.

Do not claim dependencies, servers, scripts, or tests exist before implementation.