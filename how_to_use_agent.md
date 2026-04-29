# How to Use the Polaris Agent System

This guide tells you — as a developer — exactly how to prompt any AI coding agent to implement a feature for Project Polaris. You only need to know the requirement number(s). The agent reads this folder and handles the rest.

---

## The One-Line Prompt

```
Implement Requirement <N> for Project Polaris.
Read .agent/agent.md first and follow the workflow defined there.
```

That's it. Replace `<N>` with the requirement number from `requirements.md`
(e.g., `19`, `42`, or `79–84` for a range).

---

## Step-by-Step Instructions

### 1. Find your requirement number

Open [`.agent/requirements.md`](.agent/requirements.md) and find the `## Requirement N` block
for the feature you want to build. Note the number — that's all you need.

### 2. Open your agentic tool

Use whichever tool your team has access to. The prompt below works the same way in all of them:

| Tool | Where to type the prompt |
|---|---|
| **GitHub Copilot (Chat / Edits)** | The Copilot Chat panel in VS Code |
| **Google Antigravity** | The conversation input in the Antigravity sidebar |
| **Cursor** | The AI panel (`Ctrl+L` or `Cmd+L`) |
| **Claude / ChatGPT (with file access)** | The chat window, with this repo as context |
| **Any other agent** | Wherever you type instructions to the agent |

### 3. Send this prompt

Copy-paste the block below, fill in the number(s), and send it:

```
Implement Requirement <N> for Project Polaris.

Read .agent/agent.md first — it is the entry point for all agent work on this project.
Then follow the workflow defined in .agent/workflow.md exactly, step by step.
```

#### Examples

Implementing a single requirement:
```
Implement Requirement 19 for Project Polaris.
Read .agent/agent.md first and follow the workflow in .agent/workflow.md.
```

Implementing a group of related requirements together:
```
Implement Requirements 25, 26, 27, 28, 29, 30, and 31 for Project Polaris.
Read .agent/agent.md first and follow the workflow in .agent/workflow.md.
```

---

## What the Agent Will Do (You Don't Need to Manage This)

Once you send the prompt, the agent follows this sequence automatically:

1. **Reads** `agent.md`, `planning_agent.md`, `styling.md`, `testing.md`, and the
   relevant design files — before writing any code.
2. **Plans** — produces a `PLAN.md` breaking the requirement into components, routes,
   hooks, and state changes.
3. **Implements** — writes all necessary files following the architecture and styling rules.
4. **Self-reviews** — checks its own output against the review checklist.
5. **Runs tests** — validates behaviour and reports results.
6. **Documents** — updates `project_data/` to reflect any new components or hooks.

You do not need to tell it where to put files, which design tokens to use, or how to
structure the code. The agent folder contains all of that.

---

## Tips for Better Results

### Be specific about scope if needed
The default prompt implements **exactly** the requirements you list. If you want to
narrow or widen the scope, add a note:

```
Implement Requirement 19 for Project Polaris.
Focus only on the "Create" and "View" actions — skip Edit and Delete for now.
Read .agent/agent.md first and follow the workflow in .agent/workflow.md.
```

### Check the dependency chain first
Some requirements depend on others. Before implementing Requirement N, glance at its
`Dependencies:` field in `requirements.md`. If a dependency isn't built yet, implement
it first (same prompt, different number).

### Assign to the right developer
`requirements.md` has an `Assigned To:` field per requirement. Make sure you're
implementing requirements assigned to you, or coordinate with your team.

### If the agent asks a clarifying question
Answer it — those are genuine ambiguities in the spec that the planning agent could not
resolve from the documentation alone. Once you answer, the agent continues.

### If something looks wrong
Check `.agent/review_agent.md` — its checklist tells you exactly what the agent is
supposed to verify. You can also re-run the review manually by saying:

```
Run the review_agent checklist (from .agent/review_agent.md)
on the code you just wrote and fix any failures.
```

---

## Quick Reference Card

| What you want | Prompt to use |
|---|---|
| Implement a single requirement | `Implement Requirement N for Project Polaris. Read .agent/agent.md first and follow .agent/workflow.md.` |
| Implement a group of requirements | `Implement Requirements N, M, P for Project Polaris. Read .agent/agent.md first and follow .agent/workflow.md.` |
| Review existing code | `Run the review_agent checklist from .agent/review_agent.md on [file path] and produce a report.` |
| Audit a component for design consistency | `Run the component-audit skill from .agent/skills/component-audit.md on [file path].` |
| Check accessibility | `Run the accessibility-check skill from .agent/skills/accessibility-check.md on [file path].` |
| Create a new page boilerplate | `Run the page-scaffold skill from .agent/skills/page-scaffold.md for the "[Page Name]" page in the [flow] flow.` |
| Generate a React Context | `Run the context-design skill from .agent/skills/context-design.md for [feature description].` |

---

## File Map (What the Agent Reads)

```
.agent/
├── agent.md              ← START HERE — entry point, project context, agent registry
├── workflow.md           ← The step-by-step implementation sequence
├── planning_agent.md     ← How the agent breaks down a requirement into a plan
├── review_agent.md       ← The code review checklist (25 items)
├── styling.md            ← Design token map + component styling rules
├── testing.md            ← Test scope, toolchain, pass criteria
├── requirements.md       ← All 91 product requirements
├── pages.md              ← UI blueprint — pages, components, routes
├── Design/               ← Per-page layout references + design system spec
│   └── stellar_academic/DESIGN.md  ← Master design system tokens
├── project_data/         ← Architecture, implemented components, decisions log
└── skills/               ← Reusable agent procedures (audit, scaffold, etc.)
```

---

## Troubleshooting

**The agent ignores the agent folder / goes off-script**
> Explicitly include `Read .agent/agent.md first` in your prompt. Some tools need a
> direct instruction to read a specific file before doing anything else.

**The agent produces code with hardcoded colours or wrong fonts**
> Tell it: `Re-read .agent/styling.md and correct all design token violations in
> the files you just wrote.`

**The agent created files in the wrong folder**
> Tell it: `Re-read .agent/project_data/architecture.md and move the files to the
> correct paths as defined there.`

**The agent skipped the planning step**
> Tell it: `Stop. Before writing any more code, produce a PLAN.md following the
> template in .agent/planning_agent.md for Requirement N.`
