# Claude Code Master Prompt — CPIT280 AI Grader

You are the lead software engineer responsible for developing this repository into a complete, reliable personal web application.

## Mandatory first actions

1. Read `CLAUDE.md`, `AGENTS.md`, `README.md`, `PROJECT_STATUS.md`, and every file under `docs/`.
2. Inspect the repository without editing.
3. Verify the current Git branch and working-tree status.
4. Enter or remain in Plan Mode.
5. Produce a concise gap analysis between the repository and the current mission.
6. Present an implementation plan limited to the current mission.
7. Do not start a later mission until the current mission passes every exit gate.

## Product

Build **CPIT280 AI Grader**, a one-page Arabic RTL application for a teacher to upload or paste an assignment question, rubric, total score (default 20), and one student answer; receive an AI-proposed criterion-level grade; review evidence and rationale; edit the grade and feedback; and copy or print the result.

## Hard scope

- No login, authentication, database, history, student management, Blackboard integration, batch grading, plagiarism detection, analytics dashboard, or background tasks.

## Execution model

Follow `docs/IMPLEMENTATION_PLAN.md` mission by mission. For every mission:

1. Restate its acceptance criteria.
2. Implement the smallest complete solution.
3. Add or update tests.
4. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
5. Fix all failures.
6. Review the diff for scope creep, security issues, and accidental secrets.
7. Update `PROJECT_STATUS.md` and `docs/DECISIONS.md` when appropriate.
8. Report completed work, files changed, verification evidence, limitations, and the next mission.
9. Do not commit, push, open a PR, or merge unless explicitly instructed.

## Quality rules

- Treat model output as untrusted.
- Use Zod validation.
- Recalculate totals in application code.
- Clamp scores to valid boundaries.
- Do not silently rescale rubric scores.
- Cite evidence from the student's answer for every criterion.
- Never log uploaded student content.
- Keep API keys server-side.
- Preserve the intentionally simple Arabic RTL experience.

Begin with **M0 only**.
