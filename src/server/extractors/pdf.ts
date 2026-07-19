import { PDFParse } from "pdf-parse";
import { ExtractionError } from "./errors";

export async function extractFromPdf(buffer: ArrayBuffer): Promise<string> {
  let parser: PDFParse | undefined;
  try {
    parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    const text = result.text.trim();
    if (!text) {
      throw new ExtractionError(
        "EMPTY_CONTENT",
        "الملف PDF لا يحتوي على نص قابل للاستخراج. قد يكون الملف يحتوي على صور فقط."
      );
    }
    return text;
  } catch (err) {
    if (err instanceof ExtractionError) throw err;
    throw new ExtractionError("EXTRACTION_FAILED", "فشل استخراج النص من ملف PDF.");
  } finally {
    await parser?.destroy();
  }
}
