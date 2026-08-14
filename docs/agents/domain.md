# Domain Docs

Engineering skills consume this repo's domain documentation before exploring
relevant code.

## Before exploring, read these

- Root `CONTEXT.md`
- Relevant ADRs under `docs/adr/`

If files do not exist, proceed silently. Domain-modeling skills create them
lazily when terms or decisions become established.

## Layout

This repo uses single-context layout:

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use glossary vocabulary

Use terms defined in `CONTEXT.md` when naming domain concepts in issues,
proposals, code, and tests. Avoid synonyms rejected by glossary.

Missing concepts signal either unsuitable invented language or glossary gap
requiring domain modeling.

## Flag ADR conflicts

Surface conflicts with existing ADRs explicitly instead of silently overriding
them.
