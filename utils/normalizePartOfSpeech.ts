// export function normalizePartOfSpeech(pos: string | undefined): string {
//   if (!pos) return "";

//   const lowerPos = pos.toLowerCase();

//   const posMap: Record<string, string> = {
//     noun: "n.",
//     verb: "v.",
//     adjective: "adj.",
//     adverb: "adv.",
//     preposition: "prep.",
//     conjunction: "conj.",
//     interjection: "interj.",
//     pronoun: "pron.",
//     determiner: "det.",
//     article: "art.",
//     "auxiliary verb": "aux.",
//     "modal verb": "modal.",
//   };

//   return posMap[lowerPos] || `${lowerPos}.`;
// }


export function abbreviatePartOfSpeech(pos: string | undefined): string {
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

  // Loop and check with startsWith
  for (const key in posMap) {
    if (lowerPos.startsWith(key)) {
      return posMap[key];
    }
  }

  // fallback
  return `${lowerPos}.`;
}



export function normalizePartOfSpeech(pos: string | undefined): string {
  if (!pos) return "";

  const lowerPos = pos.toLowerCase();

  const posMap: Record<string, string> = {
    noun: "noun",
    verb: "verb",
    adjective: "adjective",
    adverb: "adverb",
    preposition: "preposition",
    conjunction: "conjunction",
    interjection: "interjection",
    pronoun: "pronoun",
    determiner: "determiner",
    article: "article",
    "auxiliary verb": "auxiliary verb",
    "modal verb": "modal verb",
  };

  // Loop and check with startsWith
  for (const key in posMap) {
    if (lowerPos.startsWith(key)) {
      return posMap[key];
    }
  }

  // fallback
  return `${lowerPos}.`;
}
