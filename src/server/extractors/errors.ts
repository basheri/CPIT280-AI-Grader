export type ExtractionErrorCode =
  | "UNSUPPORTED_TYPE"
  | "FILE_TOO_LARGE"
  | "EXTRACTION_FAILED"
  | "EMPTY_CONTENT";

export class ExtractionError extends Error {
  readonly code: ExtractionErrorCode;

  constructor(code: ExtractionErrorCode, message: string) {
    super(message);
    this.name = "ExtractionError";
    this.code = code;
  }
}
