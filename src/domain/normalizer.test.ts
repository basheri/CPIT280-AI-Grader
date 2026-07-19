import { describe, expect, it } from "vitest";
import { normalizeGradingResult } from "./normalizer";
import type { AIGradingResponse } from "@/lib/schemas";

function makeResponse(overrides?: Partial<AIGradingResponse>): AIGradingResponse {
  return {
    criteria: [
      {
        name: "معيار 1",
        maxScore: 10,
        proposedScore: 8,
        evidence: "أجاب بشكل صحيح",
        rationale: "إجابة جيدة",
      },
      {
        name: "معيار 2",
        maxScore: 10,
        proposedScore: 7,
        evidence: "إجابة جزئية",
        rationale: "تحتاج تفصيل",
      },
    ],
    strengths: "نقاط قوة",
    improvements: "نقاط تحسين",
    finalFeedback: "ملاحظات نهائية",
    warnings: [],
    ...overrides,
  };
}

describe("normalizeGradingResult", () => {
  it("clamps proposedScore that exceeds maxScore", () => {
    const raw = makeResponse({
      criteria: [
        {
          name: "معيار",
          maxScore: 5,
          proposedScore: 12,
          evidence: "دليل",
          rationale: "سبب",
        },
      ],
    });

    const result = normalizeGradingResult(raw, 5);
    expect(result.criteria[0].proposedScore).toBe(5);
  });

  it("rounds fractional scores to nearest quarter", () => {
    const raw = makeResponse({
      criteria: [
        {
          name: "معيار",
          maxScore: 10,
          proposedScore: 7.63,
          evidence: "دليل",
          rationale: "سبب",
        },
      ],
    });

    const result = normalizeGradingResult(raw, 10);
    expect(result.criteria[0].proposedScore).toBe(7.75);
  });

  it("recalculates earnedTotal from clamped scores", () => {
    const raw = makeResponse({
      criteria: [
        {
          name: "معيار 1",
          maxScore: 5,
          proposedScore: 100,
          evidence: "دليل",
          rationale: "سبب",
        },
        {
          name: "معيار 2",
          maxScore: 5,
          proposedScore: 3.5,
          evidence: "دليل",
          rationale: "سبب",
        },
      ],
    });

    const result = normalizeGradingResult(raw, 10);
    expect(result.earnedTotal).toBe(8.5);
  });

  it("detects rubric-total mismatch", () => {
    const raw = makeResponse();
    const result = normalizeGradingResult(raw, 25);
    expect(result.rubricMismatch).toBe(true);
    expect(result.warnings).toContain("مجموع معايير الـRubric لا يطابق الدرجة الكلية المطلوبة.");
  });

  it("sets rubricMismatch to false when totals match", () => {
    const raw = makeResponse();
    const result = normalizeGradingResult(raw, 20);
    expect(result.rubricMismatch).toBe(false);
  });

  it("flags criterion with missing evidence", () => {
    const raw = makeResponse({
      criteria: [
        {
          name: "معيار",
          maxScore: 10,
          proposedScore: 5,
          evidence: "",
          rationale: "سبب",
        },
      ],
    });

    const result = normalizeGradingResult(raw, 10);
    expect(result.criteria[0].warning).toContain("لم يُقدَّم دليل لهذا المعيار");
  });

  it("passes through empty warnings array", () => {
    const raw = makeResponse();
    const result = normalizeGradingResult(raw, 20);
    expect(result.warnings).toEqual([]);
  });
});
