import { describe, expect, it, vi } from "vitest";
import { gradeAnswer } from "./grade";
import { AIResponseValidationError, AITimeoutError } from "./errors";
import type { GradingInput } from "@/lib/schemas";

vi.mock("./ai-adapter");

const validInput: GradingInput = {
  questionText: "ما هو HTTP؟",
  rubricText: "شرح البروتوكول: 10 درجات",
  totalScore: 10,
  answerText: "HTTP هو بروتوكول نقل النص التشعبي",
};

const validAIResponse = JSON.stringify({
  criteria: [
    {
      name: "شرح البروتوكول",
      maxScore: 10,
      proposedScore: 8,
      evidence: "ذكر الطالب تعريف HTTP",
      rationale: "إجابة جيدة لكن تحتاج تفصيل أكثر",
    },
  ],
  strengths: "معرفة أساسية جيدة",
  improvements: "يحتاج شرح أمثلة عملية",
  finalFeedback: "إجابة جيدة بشكل عام",
  warnings: [],
});

describe("gradeAnswer", () => {
  it("returns normalized result for valid AI response", async () => {
    const { callAI } = await import("./ai-adapter");
    vi.mocked(callAI).mockResolvedValue(validAIResponse);

    const result = await gradeAnswer(validInput);
    expect(result.earnedTotal).toBe(8);
    expect(result.requestedTotal).toBe(10);
    expect(result.criteria).toHaveLength(1);
    expect(result.criteria[0].proposedScore).toBe(8);
    expect(result.rubricMismatch).toBe(false);
  });

  it("throws AIResponseValidationError for malformed JSON", async () => {
    const { callAI } = await import("./ai-adapter");
    vi.mocked(callAI).mockResolvedValue("not json {{{");

    await expect(gradeAnswer(validInput)).rejects.toThrow(AIResponseValidationError);
  });

  it("throws AIResponseValidationError for missing required fields", async () => {
    const { callAI } = await import("./ai-adapter");
    vi.mocked(callAI).mockResolvedValue(JSON.stringify({ criteria: [] }));

    await expect(gradeAnswer(validInput)).rejects.toThrow(AIResponseValidationError);
  });

  it("clamps proposedScore exceeding maxScore", async () => {
    const { callAI } = await import("./ai-adapter");
    const response = JSON.stringify({
      criteria: [
        {
          name: "معيار",
          maxScore: 10,
          proposedScore: 25,
          evidence: "دليل",
          rationale: "سبب",
        },
      ],
      strengths: "قوة",
      improvements: "تحسين",
      finalFeedback: "ملاحظات",
      warnings: [],
    });
    vi.mocked(callAI).mockResolvedValue(response);

    const result = await gradeAnswer({ ...validInput, totalScore: 10 });
    expect(result.criteria[0].proposedScore).toBe(10);
  });

  it("propagates AITimeoutError from adapter", async () => {
    const { callAI } = await import("./ai-adapter");
    vi.mocked(callAI).mockRejectedValue(new AITimeoutError());

    await expect(gradeAnswer(validInput)).rejects.toThrow(AITimeoutError);
  });
});
