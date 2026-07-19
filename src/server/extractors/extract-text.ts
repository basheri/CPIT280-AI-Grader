import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/constants";
import { ExtractionError } from "./errors";
import { extractFromTxt } from "./txt";
import { extractFromPdf } from "./pdf";
import { extractFromDocx } from "./docx";

function stripNullBytes(text: string): string {
  return text.replace(/\0/g, "");
}

export async function extractText(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new ExtractionError(
      "UNSUPPORTED_TYPE",
      `نوع الملف غير مدعوم: ${file.type || "غير معروف"}. الأنواع المدعومة: TXT, PDF, DOCX.`
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ExtractionError(
      "FILE_TOO_LARGE",
      `حجم الملف يتجاوز الحد المسموح (${Math.round(MAX_FILE_SIZE_BYTES / 1024 / 1024)} ميجابايت).`
    );
  }

  const buffer = await file.arrayBuffer();
  let text: string;

  switch (file.type) {
    case "text/plain":
      text = await extractFromTxt(buffer);
      break;
    case "application/pdf":
      text = await extractFromPdf(buffer);
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      text = await extractFromDocx(buffer);
      break;
    default:
      throw new ExtractionError("UNSUPPORTED_TYPE", "نوع الملف غير مدعوم.");
  }

  text = stripNullBytes(text).trim();

  if (!text) {
    throw new ExtractionError("EMPTY_CONTENT", "الملف لا يحتوي على نص قابل للقراءة.");
  }

  return text;
}
