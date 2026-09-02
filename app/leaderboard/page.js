import { getLeaderboard } from "@/lib/kv";
import { THEMES } from "@/lib/decks";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  let entries = [];
  let loadError = null;
  try {
    entries = await getLeaderboard(20);
  } catch {
    loadError = "Leaderboard storage isn't configured yet. See the README for Vercel KV setup.";
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <a href="/" className="text-sm text-cream/50 hover:text-cream/80">
        &larr; Memory Lane
      </a>

      <h1 className="display mt-4 text-5xl text-cream">Leaderboard</h1>
      <p className="mt-2 text-sm text-cream/50">
        Ranked by a mix of fewer moves and faster time. Bigger board = harder to beat.
      </p>

      {loadError && <p className="mt-6 text-coral">{loadError}</p>}

      {!loadError && entries.length === 0 && (
        <p className="mt-6 text-cream/60">No scores yet — be the first to clear a board.</p>
      )}

      {!loadError && entries.length > 0 && (
        <ol className="mt-6 divide-y divide-feltLine overflow-hidden rounded-2xl border-2 border-feltLine">
          {entries.map((e) => (
            <li key={e.name} className="flex items-center justify-between bg-feltPanel px-4 py-3">
              <div className="flex items-center gap-4">
                <span className="display w-8 text-2xl text-coral">{e.rank}</span>
                <div>
                  <p className="text-cream">{e.name}</p>
                  {e.meta && (
                    <p className="text-xs text-cream/40">
                      {THEMES[e.meta.theme]?.icon} {THEMES[e.meta.theme]?.label} &middot;{" "}
                      <span className="capitalize">{e.meta.difficulty}</span> &middot;{" "}
                      {e.meta.moves} moves &middot; {e.meta.seconds}s
                    </p>
                  )}
                </div>
              </div>
              <span className="display text-3xl text-butter">{e.score}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-8 text-center">
        <a href="/" className="text-coral underline underline-offset-4">
          Play a round
        </a>
      </div>
    </main>
  );
}
