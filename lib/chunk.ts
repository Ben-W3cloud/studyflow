export function splitIntoChunks(text: string, maxChars = 30000, overlap = 2000): string[] {
  const chunks: string[] = [];
  let start = 0;
  const len = text.length;

  while (start < len) {
    let end = Math.min(start + maxChars, len);

    if (end < len) {
      // try to break at sentence boundary
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const splitAt = Math.max(lastPeriod, lastNewline);
      if (splitAt > start) {
        end = splitAt + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);

    start = end - overlap;
    if (start < 0) start = 0;
  }

  return chunks;
}
