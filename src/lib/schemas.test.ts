import { describe, expect, it } from "vitest";
import {
  GradingInputSchema,
  CriterionResultSchema,
  AIGradingResponseSchema,
} from "./schemas";

describe("GradingInputSchema", () => {
  it("accepts valid input", () => {
    const result = GradingInputSchema.safeParse({
      questionText: "ما هو HTTP؟",
      rubricText: "معيار 1: 10 درجات",
      totalScore: 20,
      answerText: "HTTP هو بروتوكول",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty questionText", () => {
    const result = GradingInputSchema.safeParse({
      questionText: "",
      rubricText: "rubric",
      totalScore: 20,
      answerText: "answer",
    });
    expect(result.success).toBe(false);
  });

  it("rejects totalScore of 0", () => {
    const result = GradingInputSchema.safeParse({
      questionText: "question",
      rubricText: "rubric",
      totalScore: 0,
      answerText: "answer",
    });
    expect(result.success).toBe(false);
  });

  it("accepts totalScore of 0.25", () => {
    const result = GradingInputSchema.safeParse({
      questionText: "question",
      rubricText: "rubric",
      totalScore: 0.25,
      answerText: "answer",
    });
    expect(result.success).toBe(true);
  });
});

describe("CriterionResultSchema", () => {
  it("rejects negative maxScore", () => {
    const result = CriterionResultSchema.safeParse({
      name: "criterion",
      maxScore: -1,
      proposedScore: 0,
      evidence: "evidence",
      rationale: "rationale",
    });
    expect(result.success).toBe(false);
  });

  it("accepts proposedScore exceeding maxScore at schema level", () => {
    const result = CriterionResultSchema.safeParse({
      name: "criterion",
      maxScore: 5,
      proposedScore: 10,
      evidence: "evidence",
      rationale: "rationale",
    });
    expect(result.success).toBe(true);
  });
});

describe("AIGradingResponseSchema", () => {
  it("rejects empty criteria array", () => {
    const result = AIGradingResponseSchema.safeParse({
      criteria: [],
      strengths: "good",
      improvements: "improve",
      finalFeedback: "feedback",
      warnings: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid response", () => {
    const result = AIGradingResponseSchema.safeParse({
      criteria: [
        {
          name: "criterion 1",
          maxScore: 10,
          proposedScore: 8,
          evidence: "evidence",
          rationale: "rationale",
        },
      ],
      strengths: "good",
      improvements: "improve",
      finalFeedback: "feedback",
      warnings: [],
    });
    expect(result.success).toBe(true);
  });
});
