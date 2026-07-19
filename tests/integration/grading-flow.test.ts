import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("pdf-parse", () => ({
  PDFParse: class {
    async getText() {
      return { text: "PDF text content" };
    }
    async destroy() {}
  },
}));

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn().mockResolvedValue({ value: "DOCX text content", messages: [] }),
  },
}));

const validAIResponse = JSON.stringify({
  criteria: [
    {
      name: "شرح البروتوكول",
      maxScore: 10,
      proposedScore: 8,
      evidence: "ذكر الطالب تعريف HTTP",
      rationale: "إجابة جيدة",
    },
    {
      name: "الأمثلة",
      maxScore: 10,
      proposedScore: 6,
      evidence: "قدم مثالاً واحداً",
      rationale: "يحتاج أمثلة أكثر",
    },
  ],
  strengths: "معرفة أساسية جيدة",
  improvements: "إضافة أمثلة عملية",
  finalFeedback: "إجابة مقبولة",
  warnings: [],
});

function makeFormData(overrides?: Record<string, string | File>): FormData {
  const form = new FormData();
  form.set("questionText", "ما هو HTTP؟");
  form.set("rubricText", "شرح البروتوكول: 10, الأمثلة: 10");
  form.set("totalScore", "20");
  form.set("answerText", "HTTP هو بروتوكول نقل النص التشعبي");

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      if (value === "") {
        form.delete(key);
      } else {
        form.set(key, value);
      }
    }
  }

  return form;
}

describe("Grading flow integration", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.AI_API_BASE_URL = "https://api.example.com/v1";
    process.env.AI_API_KEY = "test-key";
    process.env.AI_MODEL = "test-model";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: validAIResponse } }],
          }),
      })
    );
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  async function callRoute(body: FormData) {
    const { POST } = await import("@/app/api/grade/route");
    const request = new Request("http://localhost/api/grade", {
      method: "POST",
      body,
    });
    return POST(request);
  }

  it("happy path: returns valid grading result", async () => {
    const response = await callRoute(makeFormData());
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.earnedTotal).toBe(14);
    expect(data.requestedTotal).toBe(20);
    expect(data.criteria).toHaveLength(2);
    expect(data.rubricMismatch).toBe(false);
  });

  it("returns 400 when question is missing", async () => {
    const form = makeFormData({ questionText: "" });
    const response = await callRoute(form);
    expect(response.status).toBe(400);
  });

  it("returns 400 when rubric is missing", async () => {
    const form = makeFormData({ rubricText: "" });
    const response = await callRoute(form);
    expect(response.status).toBe(400);
  });

  it("returns 400 when answer is missing", async () => {
    const form = makeFormData({ answerText: "" });
    const response = await callRoute(form);
    expect(response.status).toBe(400);
  });

  it("returns 400 when total score is invalid", async () => {
    const form = makeFormData({ totalScore: "0" });
    const response = await callRoute(form);
    expect(response.status).toBe(400);
  });

  it("returns 502 for malformed AI JSON response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: "not json {{{" } }],
          }),
      })
    );

    const response = await callRoute(makeFormData());
    expect(response.status).toBe(502);
  });

  it("returns 504 for AI timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"))
    );

    const response = await callRoute(makeFormData());
    expect(response.status).toBe(504);
  });

  it("clamps criterion score exceeding max in AI response", async () => {
    const overScoreResponse = JSON.stringify({
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

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: overScoreResponse } }],
          }),
      })
    );

    const form = makeFormData({ totalScore: "10" });
    const response = await callRoute(form);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.criteria[0].proposedScore).toBe(10);
  });

  it("detects rubric-total mismatch", async () => {
    const response = await callRoute(makeFormData({ totalScore: "30" }));
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.rubricMismatch).toBe(true);
  });
});
