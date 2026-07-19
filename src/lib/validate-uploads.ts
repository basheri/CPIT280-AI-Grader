import { MAX_TOTAL_UPLOAD_BYTES } from "./constants";
import { ExtractionError } from "@/server/extractors/errors";

export function validateTotalUploadSize(files: File[]): void {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
    throw new ExtractionError(
      "FILE_TOO_LARGE",
      `الحجم الإجمالي للملفات يتجاوز الحد المسموح (${Math.round(MAX_TOTAL_UPLOAD_BYTES / 1024 / 1024)} ميجابايت).`
    );
  }
}
