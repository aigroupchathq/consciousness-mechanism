---
name: gsd
description: Get-Shit-Done (GSD) meta-prompting, spec-driven development, and context-engineering engine. Use for structured planning, state tracking, phase execution, and preventing context rot across complex multi-step development.
---

# GSD (Get-Shit-Done) Engine for Antigravity

GSD is a structured framework that eliminates **context rot** and non-deterministic agent drift by enforcing strict **spec-driven planning, phase isolation, and state preservation**.

---

## 🏗️ The GSD Directory Protocol (`.planning/`)

Every GSD-managed project must maintain a `.planning/` directory with these authoritative contracts:

```
.planning/
├── PROJECT.md          # Core mission, architecture, tech stack, constraints
├── ROADMAP.md          # Multi-phase milestone roadmap with checkboxes & verification gates
├── STATE.md            # Real-time state: current phase, active task, decisions log, blockers
├── REQUIREMENTS.md     # Functional & non-functional specifications, edge cases
└── phases/
    ├── 01-*.md         # Step-by-step verifiable task plan for Phase 1
    ├── 02-*.md         # Step-by-step verifiable task plan for Phase 2
    └── ...
```

---

## ⚡ Core GSD Phase Workflows

### 1. `DISCUSS-PHASE`
- **Objective**: Clarify ambiguities, extract hidden assumptions, and define verification criteria.
- **Rules**:
  - Ask targeted clarifying questions before writing code.
  - Formulate non-negotiables and failure modes.

### 2. `PLAN-PHASE`
- **Objective**: Deconstruct the phase into deterministic, bite-sized tasks.
- **Rules**:
  - Each task must have a clear input, output, and verifiable test/command.
  - Record the tasks in `.planning/phases/XX-<phase-name>.md`.
  - Update `.planning/ROADMAP.md` and `.planning/STATE.md`.

### 3. `EXECUTE-PHASE`
- **Objective**: Execute tasks sequentially with high precision.
- **Rules**:
  - When a task is complete, mark it `[x]` in the phase spec and `STATE.md`.
  - Perform verification immediately after each task.
  - Do NOT modify multiple unrelated subsystems simultaneously.

### 4. `VERIFY-WORK`
- **Objective**: Run automated sanity checks, unit tests, and visual checks.
- **Rules**:
  - Confirm all acceptance criteria defined in the phase spec are satisfied.
  - Document any discovered regressions or new learnings in `STATE.md`.
