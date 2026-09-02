import { NextResponse } from "next/server";
import { submitScore } from "@/lib/kv";
import { isValidName, cleanName } from "@/lib/name";
import { THEMES, DIFFICULTIES } from "@/lib/decks";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, theme, difficulty, moves, seconds, score } = body || {};

  if (!isValidName(name)) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (!THEMES[theme]) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }
  if (!DIFFICULTIES[difficulty]) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }
  if (typeof moves !== "number" || moves < 0 || typeof seconds !== "number" || seconds < 0) {
    return NextResponse.json({ error: "Invalid stats" }, { status: 400 });
  }
  if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1000) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }

  try {
    const result = await submitScore(cleanName(name), score, theme, difficulty, moves, seconds);
    return NextResponse.json(result);
  } catch (err) {
    console.error("submit-score error", err);
    return NextResponse.json(
      { error: "Storage is not configured. See README for Vercel KV setup." },
      { status: 500 }
    );
  }
}
