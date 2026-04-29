# Testing Agent — Project Polaris

This file defines the testing agent's scope, available toolchain, pass criteria, and output artefact format. The testing agent runs after every implementation-and-review cycle to confirm that the new feature works correctly and has not broken any existing behaviour.

**Dependencies:** Read [`agent.md`](./agent.md) and [`workflow.md`](./workflow.md) before this file.

**Output artefact:** A test-run summary (inline in the response or written to `TEST_SUMMARY.md`).

---

## What to Test

Test **user-facing behaviour**, not implementation details.

- ✅ "The login form shows an error when submitted with an empty email field."
- ✅ "Navigating to `/portal/student` without being authenticated redirects to `/auth/login`."
- ❌ "The `useLoginForm` hook sets `isLoading` to `true`." (internal detail — do not test directly)
- ❌ "The `useState` setter is called with the correct argument." (internal detail)

---

## Test Scope Per Feature

For every new feature, cover these three tiers:

### 1. Happy Path
The primary user flow works end-to-end:
- User can complete the intended action with valid inputs.
- The correct UI state is displayed after completion.
- Navigation proceeds to the expected next screen.

### 2. Edge Cases
- **Empty states:** Lists with zero items show the correct empty-state message/illustration.
- **Maximum input lengths:** Fields reject or truncate input beyond defined maxima.
- **Form validation:** Required fields, email format, password rules — all validated before submission.
- **Network / async errors:** If the feature simulates async behaviour (even with dummy data), error states must render correctly.
- **Role-based access:** Actions restricted to a specific role are hidden or disabled for other roles.

### 3. Regression
- Run the full existing test suite.
- Zero new test failures allowed.
- If a pre-existing test starts failing after a change, diagnose whether the change or the test is wrong — fix the code, not the test (unless the test was incorrect from the start).

---

## Testing Toolchain

<!-- TODO: confirm toolchain — No testing framework is listed in package.json as of project initialisation. The following is a recommendation pending team approval. -->

**Current status:** No automated testing framework is configured in `package.json`.

**Recommended setup (pending approval):**
- **Unit / Integration:** [Vitest](https://vitest.dev/) — Vite-native, TypeScript-first.
- **Component / UI:** [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) — tests user-facing behaviour, not internals.
- **End-to-end:** [Playwright](https://playwright.dev/) — for critical user flows (login, registration, project creation).

Until a framework is installed, testing must be performed **manually** following the structured test plan below. The agent must document every manual test case and its result in the output artefact.

---

## Structured Manual Test Plan Format

When running tests manually (no framework configured), produce test cases in this format:

```markdown
### TC-<number>: <short description>

**Precondition:** <what must be true before this test>
**Steps:**
1. <step>
2. <step>
**Expected:** <what the user should see>
**Actual:** PASS | FAIL — <notes if FAIL>
```

---

## Pass Criteria

A feature passes testing when:

- [ ] All happy-path test cases: `PASS`.
- [ ] All edge-case test cases: `PASS`.
- [ ] Regression: zero new failures in the existing test suite (or, if no suite exists, manual regression tests on the five most recently implemented features all pass).
- [ ] Code coverage on new code ≥ **80%** (when a testing framework is installed).

---

## Output Artefact — Test-Run Summary

```markdown
# Test Summary: <Feature Name>

**Date:** <ISO 8601>
**Tester:** testing_agent
**Verdict:** PASS | FAIL

## Test Cases

| ID | Description | Tier | Result | Notes |
|---|---|---|---|---|
| TC-01 | Login with valid credentials | Happy Path | PASS | |
| TC-02 | Login with empty email | Edge Case | PASS | |
| TC-03 | Existing portfolio page unchanged | Regression | PASS | |

## Coverage
New code coverage: XX% (or "N/A — no framework installed")

## Summary
Total: X | Passed: X | Failed: X

## Failed Cases (if any)
Detail each failure with reproduction steps and the component/file involved.
```

---

## Failure Protocol

If any test case fails:
1. Write the test summary with the failure noted.
2. Diagnose: is the failure in the new code or in a pre-existing component?
3. Return execution to step 3 of [`workflow.md`](./workflow.md) (IMPLEMENT) with the failing test cases as context.
4. After fixes: re-run review (steps 4–5 of `workflow.md`), then re-run tests.
5. Repeat until all tests pass.
