import { z } from "zod";

export const GradingInputSchema = z.object({
  questionText: z.string().min(1, "نص السؤال مطلوب"),
  rubricText: z.string().min(1, "نص الـRubric مطلوب"),
  totalScore: z.number().min(0.25, "الدرجة يجب أن تكون 0.25 على الأقل"),
  answerText: z.string().min(1, "إجابة الطالب مطلوبة"),
});

export type GradingInput = z.infer<typeof GradingInputSchema>;

export const CriterionResultSchema = z.object({
  name: z.string().min(1),
  maxScore: z.number().min(0),
  proposedScore: z.number().min(0),
  evidence: z.string(),
  rationale: z.string(),
  warning: z.string().optional(),
});

export type CriterionResult = z.infer<typeof CriterionResultSchema>;

export const AIGradingResponseSchema = z.object({
  criteria: z.array(CriterionResultSchema).min(1, "يجب وجود معيار واحد على الأقل"),
  strengths: z.string(),
  improvements: z.string(),
  finalFeedback: z.string(),
  warnings: z.array(z.string()),
});

export type AIGradingResponse = z.infer<typeof AIGradingResponseSchema>;

export const NormalizedGradingResultSchema = z.object({
  criteria: z.array(CriterionResultSchema),
  earnedTotal: z.number(),
  requestedTotal: z.number(),
  rubricMismatch: z.boolean(),
  strengths: z.string(),
  improvements: z.string(),
  finalFeedback: z.string(),
  warnings: z.array(z.string()),
});

export type NormalizedGradingResult = z.infer<typeof NormalizedGradingResultSchema>;
