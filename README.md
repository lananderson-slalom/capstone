# Component Workstation

A toolbox-inspired workspace for designing reusable UI components, exporting
React/TypeScript code, organizing themes, and showcasing active websites.

## Project Documents

- [Functional requirements](docs/functional-requirements.md)
- [Project structure](docs/project-structure.md)
- [UI guidelines and design worksheet](docs/ui-guidelines.md)
- [Testing guidelines](docs/testing-guidelines.md)
- [Coding guidelines](docs/coding-guidelines.md)
- [Project instructions index](docs/copilot-instructions.md)
- [Standalone code export](docs/code-export.md)

## Getting Started

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Override the port with `PORT=3001 npm run dev`.
The server reports an error if the requested port is occupied rather than
silently switching ports.

## Current Toolbox

The React/TypeScript toolbox uses a red exterior, black interiors, and silver-gray
hardware. Previews start with black text and borders on white backgrounds;
the inspector sits on a textured wooden worktable with a thick edge and legs.
The catalog is shaped like a tool chest, with a raised lid, recessed search tray,
stacked drawers, full-width pulls, a lock, and a side handle. The lid opens and
closes its search tray without clearing your search or current component draft.
Search or collapse component drawers, select a component, try its native HTML
preview, and edit its label, width, height, or disabled state in the inspector.
The Colors section provides swatch pickers for text, background, and border
colors, with hex readouts. Click a swatch to open the browser's color chooser;
changes update the selected component immediately, not the toolbox shell.
Component drafts are retained when switching selections within the session;
reload clears them. Reset restores the selected component's defaults, including
colors. Table border colors apply to its cells; checkbox border colors also tint
the native checked indicator, whose appearance varies by browser.

Available previews: button, link, text input, text area, checkbox, select, card,
sample table, and an image placeholder. The sample table is not sortable yet.
The image placeholder does not load an external asset. Dimensions specify width
and minimum height; previews shrink to fit narrow screens and content can expand.

The Component code section below the preview generates standalone HTML, CSS,
and JavaScript from the current draft. Each tab has a copy button, and Select code
provides a manual fallback. See [code export](docs/code-export.md) for usage and
limitations. JavaScript is browser code, not the Java programming language.

Saving, themes, drag resizing, charts, React/TypeScript export, the showcase wall,
and the Node.js storage API are not implemented yet. Final visual design remains open.

## Verification

```sh
npm test
npm run test:coverage
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Jest tests live in `packages/frontend/src/__tests__/`. The six current Playwright
journeys use Chromium only and page objects under `tests/e2e/pages/`. Each gets
a fresh browser context. E2E runs start a dedicated server at port 3100; override
it with `E2E_PORT=3101 npm run test:e2e`. Tests build and serve the production
frontend. No backend or persisted test data exists.
As persistence is added, extend these journeys toward the seven target workflows.

On Linux, Chromium also needs operating-system libraries. If it cannot launch,
have a machine administrator install Playwright's Chromium dependencies. In this
dev container they were unpacked without elevated privileges into the user cache;
rerun browser tests here with:

```sh
LD_LIBRARY_PATH="$HOME/.cache/workstation-browser-libs/usr/lib/x86_64-linux-gnu" npm run test:e2e
```

CI installs Chromium and its dependencies on the runner. It gates changes on
lint, formatting, types, coverage, builds, and browser workflows. Coverage minimums
are 85% statements/lines/functions and 80% branches for the toolbox logic.

Use `npm run format:check` to check formatting and `npm run format` to apply it.
The latter includes documentation; keep unrelated formatting changes out of PRs.
Production runtime dependencies currently have no known audit advisories;
the Jest toolchain has moderate transitive development advisories. Review
`npm audit` rather than applying forced breaking dependency changes blindly.
