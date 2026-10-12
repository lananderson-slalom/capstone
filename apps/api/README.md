# Storage API

Planned Node.js/TypeScript backend with Express and SQLite.

Owns validated persistence for presets, themes, folders, datasets, connections,
and showcase metadata. Keep the testable application separate from the process
entry point, and use temporary databases in integration tests.

See [functional requirements](../../docs/functional-requirements.md) and
[the project structure](../../docs/project-structure.md). No server is implemented
yet. Public deployment requires authentication before exposing editing APIs.