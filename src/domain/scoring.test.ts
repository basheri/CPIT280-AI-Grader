import { describe, expect, it } from "vitest";
import { calculateTotal, clampScore, roundToQuarter, rubricMatchesTotal } from "./scoring";

describe("scoring", () => {
  it("rounds to the nearest quarter", () => {
    expect(roundToQuarter(3.62)).toBe(3.5);
    expect(roundToQuarter(3.63)).toBe(3.75);
  });

  it("clamps scores to criterion boundaries", () => {
    expect(clampScore(-1, 4)).toBe(0);
    expect(clampScore(5, 4)).toBe(4);
    expect(clampScore(3.62, 4)).toBe(3.5);
  });

  it("calculates a deterministic total", () => {
    expect(calculateTotal([3.5, 4.25, 2])).toBe(9.75);
  });

  it("detects rubric total mismatch", () => {
    expect(rubricMatchesTotal([4, 6, 10], 20)).toBe(true);
    expect(rubricMatchesTotal([4, 6, 8], 20)).toBe(false);
  });
});
