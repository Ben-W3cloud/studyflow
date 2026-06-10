// Very small extractive summarizer: pick top sentences by term frequency
export function extractiveSummarize(text: string, maxSentences = 5): string {
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= maxSentences) return sentences.join(' ');

  // score sentences by length and word variety
  const scores = sentences.map((s) => {
    const words = s.toLowerCase().split(/\W+/).filter(Boolean);
    const unique = new Set(words);
    return s.length * (1 + unique.size / (words.length || 1));
  });

  const idx = scores
    .map((score, i) => ({ score, i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.i);

  return idx.map((i) => sentences[i]).join(' ');
}
