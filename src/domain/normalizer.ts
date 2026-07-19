import type { AIGradingResponse, NormalizedGradingResult, CriterionResult } from "@/lib/schemas";
import { clampScore, calculateTotal, rubricMatchesTotal } from "./scoring";

export function normalizeGradingResult(
  raw: AIGradingResponse,
  requestedTotal: number
): NormalizedGradingResult {
  const criteria: CriterionResult[] = raw.criteria.map((c) => {
    const proposedScore = clampScore(c.proposedScore, c.maxScore);
    const warnings: string[] = [];

    if (!c.evidence.trim()) {
      warnings.push("لم يُقدَّم دليل لهذا المعيار");
    }
    if (c.warning) {
      warnings.push(c.warning);
    }

    return {
      name: c.name,
      maxScore: c.maxScore,
      proposedScore,
      evidence: c.evidence,
      rationale: c.rationale,
      warning: warnings.length > 0 ? warnings.join(" | ") : undefined,
    };
  });

  const earnedTotal = calculateTotal(criteria.map((c) => c.proposedScore));
  const criterionMaxima = criteria.map((c) => c.maxScore);
  const rubricMismatch = !rubricMatchesTotal(criterionMaxima, requestedTotal);

  const warnings = [...raw.warnings];
  if (rubricMismatch) {
    warnings.push("مجموع معايير الـRubric لا يطابق الدرجة الكلية المطلوبة.");
  }

  return {
    criteria,
    earnedTotal,
    requestedTotal,
    rubricMismatch,
    strengths: raw.strengths,
    improvements: raw.improvements,
    finalFeedback: raw.finalFeedback,
    warnings,
  };
}
