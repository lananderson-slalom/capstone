# Frontend Toolbox

React/TypeScript with Vite, native HTML previews, a red tool chest, and a wooden
inspector worktable. Run commands from the repository root; see
[setup and verification](../../README.md).

`src/catalog.ts` owns the initial catalog, defaults, search, and dimension bounds.
`src/App.tsx` owns session-only selection and component drafts. `src/Preview.tsx`
renders the native previews. `src/CodeExport.tsx` provides language tabs and copy
controls; `src/export-component.ts` generates standalone HTML/CSS/JavaScript.
`src/styles.css` styles the responsive workstation and locally bundled wood
texture. See [export usage and asset licensing](../../docs/code-export.md).

Jest unit/component tests live in `src/__tests__/` and use `.test.ts` filenames.
Browser workflows use Chromium and POM under the root `tests/e2e/` directory.

No API, saved storage, theme editor, or React/TypeScript export is connected yet.
