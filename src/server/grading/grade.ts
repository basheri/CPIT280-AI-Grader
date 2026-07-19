import type { GradingInput, NormalizedGradingResult } from "@/lib/schemas";
import { AIGradingResponseSchema } from "@/lib/schemas";
import { normalizeGradingResult } from "@/domain/normalizer";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder";
import { callAI } from "./ai-adapter";
import { AIResponseValidationError } from "./errors";

export async function gradeAnswer(input: GradingInput): Promise<NormalizedGradingResult> {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(
    input.questionText,
    input.rubricText,
    input.totalScore,
    input.answerText
  );

  const rawContent = await callAI(systemPrompt, userPrompt);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new AIResponseValidationError("استجابة الذكاء الاصطناعي ليست JSON صالح.");
  }

  const validation = AIGradingResponseSchema.safeParse(parsed);
  if (!validation.success) {
    throw new AIResponseValidationError(
      `بنية استجابة الذكاء الاصطناعي غير صالحة: ${validation.error.issues.map((i) => i.message).join(", ")}`
    );
  }

  return normalizeGradingResult(validation.data, input.totalScore);
}
