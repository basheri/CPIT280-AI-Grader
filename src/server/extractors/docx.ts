import mammoth from "mammoth";
import { ExtractionError } from "./errors";

export async function extractFromDocx(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
    const text = result.value.trim();
    if (!text) {
      throw new ExtractionError("EMPTY_CONTENT", "ملف DOCX لا يحتوي على نص.");
    }
    return text;
  } catch (err) {
    if (err instanceof ExtractionError) throw err;
    throw new ExtractionError("EXTRACTION_FAILED", "فشل استخراج النص من ملف DOCX.");
  }
}
