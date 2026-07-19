# Product Requirements Document

## Product

**CPIT280 AI Grader** is a personal web application for a teacher to evaluate one student answer at a time against an uploaded assignment question and rubric.

## Goal

Reduce grading effort while preserving teacher control, transparent criterion-level evidence, and score consistency.

## Core workflow

1. Add the assignment question by upload or pasted text.
2. Add the rubric by upload or pasted text.
3. Confirm or edit the total score; default is 20.
4. Add one student answer by upload or pasted text.
5. Click `تصحيح الإجابة`.
6. Review the criterion-level result.
7. Edit scores or feedback when needed.
8. Copy the feedback or print/save the page as PDF.

## Initial supported inputs

- Pasted text
- `.txt`
- `.pdf`
- `.docx`

## Required output

- Proposed score as `earned / total`.
- Criterion rows containing name, maximum score, proposed score, evidence, rationale, and warning.
- Strengths.
- Improvements.
- Final student feedback.
- General warnings.

## Teacher control

- Every criterion score is editable.
- Final feedback is editable.
- Totals update deterministically.
- The AI result is labeled as a proposal.

## Privacy

- No login.
- No database.
- No permanent file storage.
- No logging of extracted student content.
