<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from common examples. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repo Rules

Before changing code, always read these files in order:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `DESIGN.md`

Do not skip `ARCHITECTURE.md` or `DESIGN.md`.

If source code and documentation disagree:
- trust source code after verification
- call out the drift explicitly
- update the correct document if the task touches that area

## Primary Goal

Do not optimize only for "feature works".
Optimize for a code base that stays coherent when the project scales:

- no unnecessary intermediate layers
- no duplicate logic
- no duplicate UI patterns
- no duplicate implementation patterns for the same problem
- no drift between source code and docs
- no components that own too many responsibilities
- no local fixes that weaken the system

## Mandatory Working Rules

- Keep all edited text files in `UTF-8` with `LF` line endings.
- Protect Vietnamese copy from mojibake and encoding drift.
- Prefer updating existing patterns over introducing new ones.
- Prefer clear naming over excessive comments.
- Add short comments only when logic is not obvious, there is an important assumption, or there is a non-trivial workaround.
- Use the correct comment syntax for the current language. Do not use shell-style `#` comments in TS/TSX/CSS.

## Architecture Rules

- Public pages, auth pages, CMS admin, and CMS user are different shells. Do not mix them.
- Server reads should follow:
  - page or server component -> service -> backend
- Browser mutations should follow:
  - client component or form -> server action -> service -> backend
- `src/app/api/v1/*` should stay minimal and only exist for auth or callback flows that truly need cookies, refresh, or redirects.
- Do not recreate generic data proxy route handlers.

## Stack Consistency Rules

If the repo already has a standard tool for a class of problems, use it.

- Forms: `react-hook-form`
- Validation: `zod`
- Shared UI primitives: shadcn-based components in `src/components/ui`
- Shared UI state: `zustand`
- Client async state and caching: `@tanstack/react-query`
- Server-side data access: domain services in `src/services`
- Browser mutation bridge: server actions in `src/actions`

Do not introduce a second pattern for the same problem unless the current one is clearly insufficient.

## UI Rules

- Use tokens and primitives from `DESIGN.md` and `src/app/globals.css`.
- Reuse `surface-card`, `surface-panel`, `surface-float`, and existing layout primitives before inventing local styles.
- Do not hard-code new colors when semantic tokens already exist.
- Do not add a one-off visual language for a single screen.

## Refactor Rules

When refactoring:

- preserve route contract
- preserve data contract
- preserve UI semantics
- preserve filter, breadcrumb, heading, CTA, and summary behavior
- improve structure only after behavior is safe

Do not justify semantic changes with "clean code".

## Validation Rules

After a meaningful batch of changes, at minimum run:

- `npx.cmd tsc --noEmit`

If the task includes UI, also verify:

- desktop
- mobile
- hover, focus, disabled states
- Vietnamese labels and messages
- form validation and submit state when forms are involved

If you did not run a manual UI check, say so clearly.
