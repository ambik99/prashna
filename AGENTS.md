# Prashna

Prashna is a free web app for CBSE teachers to design question papers and marking schemes. See `CONTEXT.md` for the project's vocabulary.

## Working on tickets

- One branch per ticket, named `<issue-number>-<short-slug>` (for example `2-test-harness-and-core-paper-tests`), branched from `main`. Never work directly on `main`.
- One pull request per ticket, with `Closes #<issue-number>` in the description. The sole developer merges it; there is no review step.
- No AI attribution in commits, pull requests or issues.
- Run `npm test` (build, type check, unit tests and browser tests; see `tests/README.md` and `docs/development.md`). It must pass before a ticket is done.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues on ambik99/prashna, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
