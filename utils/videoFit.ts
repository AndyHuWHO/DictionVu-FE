// utils/videoFit.ts
export type VideoContentFit = "contain" | "cover";

export function fitFromWH(w?: number, h?: number, tallThreshold = 1.6): VideoContentFit {
  if (!w || !h) return "contain";
  const ratio = h / w;              
  return ratio > tallThreshold ? "cover" : "contain";
}
