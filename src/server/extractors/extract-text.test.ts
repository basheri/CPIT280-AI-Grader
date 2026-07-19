import { describe, expect, it, vi } from "vitest";
import { extractText } from "./extract-text";
import { ExtractionError } from "./errors";

vi.mock("pdf-parse", () => ({
  PDFParse: class {
    async getText() {
      return { text: "PDF content" };
    }
    async destroy() {}
  },
}));

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn().mockResolvedValue({ value: "DOCX content", messages: [] }),
  },
}));

function makeFile(content: string, name: string, type: string): File {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
}

describe("extractText", () => {
  it("extracts text from a .txt file", async () => {
    const file = makeFile("Hello World", "test.txt", "text/plain");
    const result = await extractText(file);
    expect(result).toBe("Hello World");
  });

  it("trims whitespace from .txt files", async () => {
    const file = makeFile("  spaced  ", "test.txt", "text/plain");
    const result = await extractText(file);
    expect(result).toBe("spaced");
  });

  it("strips null bytes from extracted text", async () => {
    const file = makeFile("hello\0world", "test.txt", "text/plain");
    const result = await extractText(file);
    expect(result).toBe("helloworld");
  });

  it("throws UNSUPPORTED_TYPE for disallowed MIME types", async () => {
    const file = makeFile("data", "test.exe", "application/x-msdownload");
    await expect(extractText(file)).rejects.toThrow(ExtractionError);
    await expect(extractText(file)).rejects.toMatchObject({ code: "UNSUPPORTED_TYPE" });
  });

  it("throws FILE_TOO_LARGE for oversized files", async () => {
    const file = makeFile("x", "big.txt", "text/plain");
    Object.defineProperty(file, "size", { value: 100 * 1024 * 1024 });
    await expect(extractText(file)).rejects.toThrow(ExtractionError);
    await expect(extractText(file)).rejects.toMatchObject({ code: "FILE_TOO_LARGE" });
  });

  it("throws EMPTY_CONTENT for empty .txt file", async () => {
    const file = makeFile("", "empty.txt", "text/plain");
    await expect(extractText(file)).rejects.toThrow(ExtractionError);
    await expect(extractText(file)).rejects.toMatchObject({ code: "EMPTY_CONTENT" });
  });

  it("extracts text from a .docx file", async () => {
    const file = makeFile(
      "fake-docx",
      "test.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    const result = await extractText(file);
    expect(result).toBe("DOCX content");
  });

  it("extracts text from a .pdf file", async () => {
    const file = makeFile("fake-pdf", "test.pdf", "application/pdf");
    const result = await extractText(file);
    expect(result).toBe("PDF content");
  });
});
