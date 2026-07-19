import { cleanup, render, fireEvent, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GradingResult } from "./grading-result";
import type { NormalizedGradingResult } from "@/lib/schemas";

afterEach(cleanup);

function makeResult(overrides?: Partial<NormalizedGradingResult>): NormalizedGradingResult {
  return {
    criteria: [
      {
        name: "معيار 1",
        maxScore: 10,
        proposedScore: 8,
        evidence: "دليل 1",
        rationale: "تبرير 1",
      },
      {
        name: "معيار 2",
        maxScore: 10,
        proposedScore: 7,
        evidence: "دليل 2",
        rationale: "تبرير 2",
      },
    ],
    earnedTotal: 15,
    requestedTotal: 20,
    rubricMismatch: false,
    strengths: "نقاط قوة",
    improvements: "نقاط تحسين",
    finalFeedback: "ملاحظات نهائية",
    warnings: [],
    ...overrides,
  };
}

function renderResult(overrides?: Partial<NormalizedGradingResult>, onReset = vi.fn()) {
  const { container } = render(
    <GradingResult initialResult={makeResult(overrides)} onReset={onReset} />
  );
  return within(container);
}

describe("GradingResult", () => {
  it("renders all criterion rows with correct scores", () => {
    const view = renderResult();
    expect(view.getByText("معيار 1")).toBeInTheDocument();
    expect(view.getByText("معيار 2")).toBeInTheDocument();
    expect(view.getByDisplayValue("8")).toBeInTheDocument();
    expect(view.getByDisplayValue("7")).toBeInTheDocument();
  });

  it("renders the total score", () => {
    const view = renderResult();
    expect(view.getByText("15 / 20")).toBeInTheDocument();
  });

  it("updates earned total when editing a criterion score", () => {
    const view = renderResult();
    const scoreInput = view.getByDisplayValue("8");
    fireEvent.change(scoreInput, { target: { value: "10" } });
    expect(view.getByText("17 / 20")).toBeInTheDocument();
  });

  it("clamps score that exceeds maxScore", () => {
    const view = renderResult();
    const scoreInput = view.getByDisplayValue("8");
    fireEvent.change(scoreInput, { target: { value: "25" } });
    expect(scoreInput).toHaveValue(10);
  });

  it("shows rubric mismatch warning when rubricMismatch is true", () => {
    const view = renderResult({ rubricMismatch: true });
    expect(
      view.getByText("مجموع معايير الـRubric لا يطابق الدرجة الكلية المطلوبة.")
    ).toBeInTheDocument();
  });

  it("does not show rubric mismatch warning when rubricMismatch is false", () => {
    const view = renderResult({ rubricMismatch: false });
    expect(
      view.queryByText("مجموع معايير الـRubric لا يطابق الدرجة الكلية المطلوبة.")
    ).not.toBeInTheDocument();
  });

  it("copies final feedback to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const view = renderResult();
    fireEvent.click(view.getByText("نسخ الملاحظات"));
    expect(writeText).toHaveBeenCalledWith("ملاحظات نهائية");
  });

  it("calls onReset when reset button is clicked", () => {
    const onReset = vi.fn();
    const view = renderResult({}, onReset);
    fireEvent.click(view.getByText("تصحيح إجابة جديدة"));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
