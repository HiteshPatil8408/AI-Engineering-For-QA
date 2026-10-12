# Architecture

A static React + TypeScript + Vite application with hash routing for GitHub Pages. No authentication, backend, or API keys are needed. Content is typed data, independent of rendering. The full 46-phase roadmap is retained in order; published lessons and planned modules are explicitly distinguished.

## Boundaries

- `src/course`: phase metadata and reviewed educational content.
- `src/state`: versioned progress schema, import validation, mastery calculation, local persistence.
- `src/exercises`: answer checking, progressive hints, skips, and real code execution.
- `src/lib`: lazy worker-based Python and DuckDB runtimes. Execution has a timeout and worker termination.
- `src/pages`: dashboard, lessons, roadmap, review, interviews, projects, glossary, settings.
- `local-labs`: optional Python engineering projects. Secrets stay in local environment variables.

## Decisions

Hash routing avoids server fallback requirements. CSS provides a responsive, accessible three-column learning layout. Progress is local to the browser and portable through validated JSON. Completion cannot substitute for an exercise pass; hints and skips remain in the review queue. Mastery weights are 15% reading, 20% quiz, 35% exercise, 30% checkpoint. The dashboard reports published-content progress and separately shows the full roadmap.

WASM runtimes load only on execution. Pyodide is fetched from its versioned public CDN; DuckDB assets are bundled locally. Initial runtime downloads need internet but no paid service. Python code runs in a disposable worker with no access to the page DOM. This is an educational sandbox, not an adversarial multi-tenant execution service.

## First-version scope

Publish genuine foundation content for phases 0–5, a focused initial interview bank, and five project briefs. Preserve later curriculum metadata without fake lesson bodies. Track missing depth in COURSE_PROGRESS.md. No deployment to an external account is performed by this implementation; GitHub Actions is prepared for the repository owner.
