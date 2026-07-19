import { AITimeoutError, AIProviderError, AIConnectionError } from "./errors";

const AI_TIMEOUT_MS = 30_000;

export async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const baseUrl = process.env.AI_API_BASE_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;

  if (!baseUrl || !apiKey || !model) {
    throw new AIProviderError(500, "إعدادات الذكاء الاصطناعي غير مكتملة. تحقق من متغيرات البيئة.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AIProviderError(response.status);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new AIProviderError(502, "استجابة فارغة من مزود الذكاء الاصطناعي.");
    }

    return content;
  } catch (err) {
    if (err instanceof AIProviderError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new AITimeoutError();
    }
    throw new AIConnectionError();
  } finally {
    clearTimeout(timeout);
  }
}
