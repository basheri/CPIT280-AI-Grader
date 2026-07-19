import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { callAI } from "./ai-adapter";
import { AITimeoutError, AIProviderError, AIConnectionError } from "./errors";

describe("callAI", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.AI_API_BASE_URL = "https://api.example.com/v1";
    process.env.AI_API_KEY = "test-key";
    process.env.AI_MODEL = "test-model";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("returns content on successful API call", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: '{"result": "ok"}' } }],
          }),
      })
    );

    const result = await callAI("system", "user");
    expect(result).toBe('{"result": "ok"}');
  });

  it("throws AIProviderError on 401 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401 })
    );

    await expect(callAI("system", "user")).rejects.toThrow(AIProviderError);
    await expect(callAI("system", "user")).rejects.toMatchObject({ status: 401 });
  });

  it("throws AIConnectionError on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    await expect(callAI("system", "user")).rejects.toThrow(AIConnectionError);
  });

  it("throws AITimeoutError on abort", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"))
    );

    await expect(callAI("system", "user")).rejects.toThrow(AITimeoutError);
  });

  it("throws AIProviderError when env vars are missing", async () => {
    delete process.env.AI_API_KEY;
    await expect(callAI("system", "user")).rejects.toThrow(AIProviderError);
  });
});
