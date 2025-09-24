export function normalizePartOfSpeech(pos: string | undefined): string {
  if (!pos) return "";

  const lowerPos = pos.toLowerCase();

  const posMap: Record<string, string> = {
    noun: "n.",
    verb: "v.",
    adjective: "adj.",
    adverb: "adv.",
    preposition: "prep.",
    conjunction: "conj.",
    interjection: "interj.",
    pronoun: "pron.",
    determiner: "det.",
    article: "art.",
    "auxiliary verb": "aux.",
    "modal verb": "modal.",
  };

  return posMap[lowerPos] || `${lowerPos}.`; // fallback: "xyz." (e.g., "participle." etc.)
}
