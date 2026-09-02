// Combines moves and time into a single score where fewer moves and less
// time both score higher. Clamped at 0. Kept separate from lib/kv.js so
// client components can compute a score without bundling the server-only
// @vercel/kv package.
export function computeScore(moves, seconds) {
  return Math.max(0, Math.round(1000 - moves * 10 - seconds * 2));
}
