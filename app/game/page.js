"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { THEMES, DIFFICULTIES, buildBoard } from "@/lib/decks";
import { playMatchSound, playWinSound } from "@/lib/sound";
import { computeScore } from "@/lib/score";

export default function GamePage() {
  return (
    <Suspense fallback={null}>
      <GameInner />
    </Suspense>
  );
}

function GameInner() {
  const router = useRouter();
  const params = useSearchParams();
  const themeKey = params.get("theme");
  const difficultyKey = params.get("difficulty") || "easy";

  const theme = THEMES[themeKey];
  const difficulty = DIFFICULTIES[difficultyKey];

  const [name, setName] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices currently face-up (max 2)
  const [matchedPairIds, setMatchedPairIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitState, setSubmitState] = useState("idle"); // idle | saving | saved | error
  const [rankInfo, setRankInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("memory-match-name");
    if (!stored) {
      router.replace("/");
      return;
    }
    setName(stored);
  }, [router]);

  useEffect(() => {
    if (!theme || !difficulty) {
      router.replace("/");
      return;
    }
    setCards(buildBoard(themeKey, difficultyKey));
    setFlipped([]);
    setMatchedPairIds(new Set());
    setMoves(0);
    setSeconds(0);
    setRunning(true);
    setSubmitState("idle");
    setRankInfo(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey, difficultyKey]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const totalPairs = difficulty?.pairCount ?? 0;
  const won = totalPairs > 0 && matchedPairIds.size === totalPairs;

  useEffect(() => {
    if (won) {
      setRunning(false);
      playWinSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  function handleFlip(index) {
    if (locked) return;
    if (flipped.includes(index)) return;
    if (matchedPairIds.has(cards[index].pairId)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [i1, i2] = next;
      const isMatch = cards[i1].pairId === cards[i2].pairId;

      if (isMatch) playMatchSound();

      setTimeout(
        () => {
          if (isMatch) {
            setMatchedPairIds((prev) => new Set(prev).add(cards[i1].pairId));
          }
          setFlipped([]);
          setLocked(false);
        },
        isMatch ? 500 : 900
      );
    }
  }

  function restart() {
    setCards(buildBoard(themeKey, difficultyKey));
    setFlipped([]);
    setMatchedPairIds(new Set());
    setMoves(0);
    setSeconds(0);
    setRunning(true);
    setSubmitState("idle");
    setRankInfo(null);
  }

  async function submitScore() {
    setSubmitState("saving");
    try {
      const score = computeScore(moves, seconds);
      const res = await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme: themeKey, difficulty: difficultyKey, moves, seconds, score }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setRankInfo(data);
      setSubmitState("saved");
    } catch {
      setSubmitState("error");
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const gridColsClass = useMemo(() => {
    const cols = difficulty?.cols ?? 4;
    return { 4: "grid-cols-4", 6: "grid-cols-6" }[cols] || "grid-cols-4";
  }, [difficulty]);

  if (!theme || !difficulty || !name) return null;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="/" className="text-sm text-cream/50 hover:text-cream/80">
          &larr; Memory Lane
        </a>
        <div className="flex items-center gap-6 text-sm text-cream/70">
          <span>
            {theme.icon} {theme.label} &middot; {difficulty.label}
          </span>
          <span className="display text-xl text-butter">
            {mm}:{ss}
          </span>
          <span className="display text-xl text-cream">{moves} moves</span>
        </div>
      </header>

      {!won && (
        <div
          className={`grid ${gridColsClass} gap-3 sm:gap-4`}
          style={{ gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))` }}
        >
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matchedPairIds.has(card.pairId);
            const isMatched = matchedPairIds.has(card.pairId);
            return (
              <button
                key={card.cardKey}
                onClick={() => handleFlip(i)}
                className="flip-card aspect-square"
                aria-label="Memory card"
              >
                <div className={`flip-inner ${isFlipped ? "is-flipped" : ""}`}>
                  <div
                    className="flip-face rounded-xl border-2 border-feltLine bg-feltPanel text-2xl"
                    style={{ color: theme.accent }}
                  >
                    ?
                  </div>
                  <div
                    className={[
                      "flip-face flip-back flex-col gap-1 rounded-xl border-2 px-1 text-center text-sm sm:text-base",
                      isMatched ? "border-butter bg-butter/10" : "border-cream/20 bg-cream",
                    ].join(" ")}
                  >
                    {card.cardIcon && <span className="text-xl leading-none">{card.cardIcon}</span>}
                    <span
                      className={
                        typeof card.face === "string" && card.face.length <= 2
                          ? "text-3xl sm:text-4xl"
                          : "display font-medium text-felt"
                      }
                    >
                      {card.face}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {won && (
        <section className="mt-16 flex flex-col items-center text-center">
          <p className="display text-lg text-butter">Board cleared!</p>
          <p className="display text-2xl text-cream">
            {moves} moves &middot; {mm}:{ss}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            {submitState !== "saved" && (
              <button
                onClick={submitScore}
                disabled={submitState === "saving"}
                className="w-full max-w-xs rounded-full bg-coral py-3 font-medium text-cream hover:bg-coralDark disabled:opacity-60"
              >
                {submitState === "saving" ? "Saving…" : "Submit to leaderboard"}
              </button>
            )}

            {submitState === "saved" && rankInfo && (
              <p className="text-cream/70">
                Your best score is <span className="text-butter">{rankInfo.best}</span> — ranked
                {" #"}
                {rankInfo.rank ?? "—"} on the leaderboard.
              </p>
            )}
            {submitState === "error" && (
              <p className="text-sm text-coral">Couldn&apos;t save your score. Try again.</p>
            )}

            <div className="flex flex-wrap justify-center gap-4 pt-2 text-sm">
              <button onClick={restart} className="text-butter underline underline-offset-4">
                Play again
              </button>
              <a href="/" className="text-cream/60 underline underline-offset-4">
                Change theme / difficulty
              </a>
              <a href="/leaderboard" className="text-cream/60 underline underline-offset-4">
                Leaderboard
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
