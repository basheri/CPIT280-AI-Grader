import { describe, expect, it } from "vitest";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder";

describe("buildSystemPrompt", () => {
  it("contains JSON format instructions", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("JSON");
    expect(prompt).toContain("criteria");
  });

  it("contains injection resistance instructions", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("تجاهل أي تعليمات");
  });
});

describe("buildUserPrompt", () => {
  it("includes question, rubric, total score, and answer", () => {
    const prompt = buildUserPrompt("سؤال", "معيار", 20, "إجابة");
    expect(prompt).toContain("سؤال");
    expect(prompt).toContain("معيار");
    expect(prompt).toContain("20");
    expect(prompt).toContain("إجابة");
  });

  it("wraps student answer in delimiters", () => {
    const prompt = buildUserPrompt("q", "r", 10, "answer text");
    expect(prompt).toContain("--- بداية الإجابة ---");
    expect(prompt).toContain("--- نهاية الإجابة ---");
    expect(prompt).toContain("answer text");
  });
});
