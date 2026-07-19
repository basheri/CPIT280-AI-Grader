export function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

export function clampScore(score: number, maxScore: number): number {
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore < 0) {
    throw new Error("Invalid score values");
  }
  return roundToQuarter(Math.min(Math.max(score, 0), maxScore));
}

export function calculateTotal(scores: number[]): number {
  return Math.round(scores.reduce((total, score) => total + score, 0) * 100) / 100;
}

export function rubricMatchesTotal(criterionMaxima: number[], requestedTotal: number): boolean {
  return calculateTotal(criterionMaxima) === requestedTotal;
}
