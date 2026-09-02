import { kv } from "@vercel/kv";

export { computeScore } from "./score";

const BOARD_KEY = "memory-match:leaderboard"; // sorted set: member=name, score=best score
const META_KEY = "memory-match:meta"; // hash: name -> JSON { theme, difficulty, moves, seconds, updatedAt }

// Only overwrites a player's stored score if the new one is higher, so the
// leaderboard always reflects each name's personal best.
export async function submitScore(name, score, theme, difficulty, moves, seconds) {
  const key = name.trim();
  const current = await kv.zscore(BOARD_KEY, key);

  if (current === null || current === undefined || score > current) {
    await kv.zadd(BOARD_KEY, { score, member: key });
    await kv.hset(META_KEY, {
      [key]: JSON.stringify({ theme, difficulty, moves, seconds, updatedAt: Date.now() }),
    });
  }

  const rank = await kv.zrevrank(BOARD_KEY, key);
  const best = await kv.zscore(BOARD_KEY, key);
  return { best, rank: rank === null || rank === undefined ? null : rank + 1 };
}

export async function getLeaderboard(limit = 20) {
  const raw = await kv.zrange(BOARD_KEY, 0, limit - 1, {
    rev: true,
    withScores: true,
  });

  const entries = [];
  if (raw.length && typeof raw[0] === "object" && raw[0] !== null && "member" in raw[0]) {
    for (const row of raw) entries.push({ name: row.member, score: Number(row.score) });
  } else {
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ name: raw[i], score: Number(raw[i + 1]) });
    }
  }

  const names = entries.map((e) => e.name);
  const metaMap = names.length ? await kv.hmget(META_KEY, ...names) : {};

  return entries.map((entry, i) => {
    let meta = null;
    const metaRaw = Array.isArray(metaMap) ? metaMap[i] : metaMap?.[entry.name];
    if (metaRaw) {
      try {
        meta = JSON.parse(metaRaw);
      } catch {
        meta = null;
      }
    }
    return { ...entry, meta, rank: i + 1 };
  });
}
