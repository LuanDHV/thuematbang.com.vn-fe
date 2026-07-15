# Monorepo Source Snapshot

This file records the source state used when importing the existing apps into
the monorepo.

## Imported Sources

- `apps/client` came from `thuematbang.com.vn-fe`
  - Commit: `89398d47241025547325343d0e50fe9437469f03`
  - Runtime: Next.js SSR
  - Legacy admin remains as fallback during migration.
- `apps/admin` came from `thuematbang.com.vn-admin`
  - Commit: `97f7fb29e1f4676cb45381119c1deed13bb4ef42`
  - Runtime: Vite SPA
  - Auth stays independent from the Next.js client runtime.
- `packages/contracts` came from `thuematbang-contracts`
  - Commit: `1affb3a23b7a5f404dd52ea4affbe8dffa78f2c5`
  - Original repo had uncommitted changes in `.gitignore`, `package.json`, and `dist/types/commerce.d.ts.map`.
  - Build output was not imported; contracts should be rebuilt from source inside the workspace.

## Boundaries

- `apps/client` and `apps/admin` must not import source files from each other.
- Shared domain code should go through `@thuematbang/contracts`.
- `packages/contracts` is a build-time package, not a deployed service.
