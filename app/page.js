"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES, DIFFICULTIES } from "@/lib/decks";
import { isValidName } from "@/lib/name";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [theme, setTheme] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    const stored = localStorage.getItem("memory-match-name");
    if (stored) setName(stored);
  }, []);

  function start() {
    if (!isValidName(name)) {
      setNameError("Enter a name (2-24 characters) to play and get on the leaderboard.");
      return;
    }
    if (!theme) return;
    localStorage.setItem("memory-match-name", name.trim());
    router.push(`/game?theme=${theme}&difficulty=${difficulty}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12">
      <p className="display text-sm tracking-wide text-butter">A game for all ages</p>
      <h1 className="display text-6xl leading-none text-cream sm:text-7xl">Memory Lane</h1>
      <p className="mt-3 max-w-md text-center text-cream/70">
        Flip two cards at a time. Find every pair to clear the board.
      </p>

      <section className="mt-10 w-full">
        <h2 className="display text-lg text-cream/80">1. Your name</h2>
        <input
          type="text"
          maxLength={24}
          placeholder="e.g. Lanz"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError("");
          }}
          className="mt-3 w-full rounded-xl border-2 border-feltLine bg-feltPanel px-4 py-3 text-cream placeholder:text-cream/30 outline-none focus:border-butter"
        />
        {nameError && <p className="mt-1 text-sm text-coral">{nameError}</p>}
        <p className="mt-1 text-xs text-cream/40">
          Shown as-is on the public leaderboard — no email or password needed.
        </p>
      </section>

      <section className="mt-8 w-full">
        <h2 className="display text-lg text-cream/80">2. Pick a theme</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              style={{ borderColor: theme === key ? t.accent : undefined }}
              className={[
                "flex flex-col items-center gap-2 rounded-2xl border-2 bg-feltPanel px-3 py-5 transition-transform",
                theme === key ? "scale-105" : "border-feltLine hover:border-cream/30",
              ].join(" ")}
            >
              <span className="text-4xl">{t.icon}</span>
              <span className="text-sm font-medium text-cream">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 w-full">
        <h2 className="display text-lg text-cream/80">3. Pick a difficulty</h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {Object.entries(DIFFICULTIES).map(([key, d]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={[
                "rounded-2xl border-2 bg-feltPanel px-3 py-4 text-center transition-colors",
                difficulty === key ? "border-butter" : "border-feltLine hover:border-cream/30",
              ].join(" ")}
            >
              <span className="display block text-2xl text-cream">{d.label}</span>
              <span className="block text-xs text-cream/50">{d.pairCount} pairs</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={start}
        disabled={!theme}
        className="mt-10 w-full max-w-xs rounded-full bg-coral py-3 font-medium text-cream transition-colors hover:bg-coralDark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {theme ? "Start game" : "Choose a theme first"}
      </button>

      <a href="/leaderboard" className="mt-4 text-sm text-butter underline underline-offset-4">
        View leaderboard
      </a>
    </main>
  );
}
