export async function extractFromTxt(buffer: ArrayBuffer): Promise<string> {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(buffer).trim();
}
