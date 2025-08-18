// Format seconds as MM:SS
export function fmtMMSS(sec: number, sep = ":") {
    const clamped = Math.max(0, Math.floor(sec));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${String(m).padStart(2, "0")}${sep}${String(s).padStart(2, "0")}`;
  };