# Memory Lane — Memory Match Game

A theme-based memory match game for all ages, built with Next.js. No image
assets and no heavy libraries, so it loads fast even on low-end devices.

- **4 themes**: Animals, Food, Places (emoji-based), and Celebrities
  (name-matching: a stage name/nickname paired with the person's real name —
  text only, no photos or likenesses used).
- **3 difficulties**: Easy (6 pairs), Medium (8 pairs), Hard (12 pairs).
- **Sound**: a short synthesized chime plays on every match, plus a small
  win fanfare when the board is cleared — generated with the Web Audio API,
  so there are no audio files to host or load.
- **Leaderboard**: players enter a name (no email, no password) before
  playing. After clearing a board, they can submit their score. Score is a
  mix of fewer moves and less time — see `lib/score.js`.

## 1. Run it locally

```bash
npm install
```

You'll need a KV database for the leaderboard to work (see step 3 below for
how to create one — you can do this before or after running locally).

```bash
cp .env.example .env.local
# paste in the KV_* values from your Vercel project's Storage tab
npm run dev
```

Open http://localhost:3000. The game itself (including sound) works without
KV configured — only submitting a score or viewing the leaderboard needs it.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Memory Lane game"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/memory-lane.git
git push -u origin main
```

## 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub.
2. Import the repo you just pushed, leave the default settings, click
   **Deploy**.
3. In the deployed project, go to **Storage → Create Database → KV**
   (Upstash Redis, free tier), create it, and connect it to this project.
   Vercel adds the `KV_*` environment variables automatically.
4. Redeploy (Deployments tab → ⋯ → Redeploy) so the new env vars take
   effect.

Same flow as the NBA trivia project, if you've already been through it once.

## How it works

- **`lib/decks.js`** — theme + difficulty definitions and the board-shuffle
  logic.
- **`lib/sound.js`** — synthesized match/win sounds via Web Audio API.
- **`lib/score.js`** — turns moves + time into a single leaderboard score
  (client-safe, no server dependencies).
- **`lib/kv.js`** — Vercel KV wrapper: a sorted set for ranking + a hash for
  metadata (theme, difficulty, moves, time) per player name.
- **`lib/name.js`** — basic name validation for the "sign in with name" flow.
- **`app/page.js`** — collects the player's name, theme, and difficulty.
- **`app/game/page.js`** — the card grid, flip/match logic, timer, and the
  "submit to leaderboard" flow after winning.
- **`app/api/submit-score/route.js`** — validates and writes a score to KV.
- **`app/leaderboard/page.js`** — server component reading the top 20
  scores from KV.

## Notes & things you might want to change

- **Name collisions**: since sign-in is just a name (no email/password),
  two different people using the same name will share one leaderboard
  entry. Fine for a casual demo; if that becomes a problem, the fix is
  adding a lightweight unique identifier (e.g. appending a short random
  code to the stored key) without changing what's displayed.
- **Add more themes**: edit `THEMES` in `lib/decks.js`. Emoji themes are
  arrays of emoji; the celebrity theme is an array of
  `{ id, faceA, faceB }` fact pairs — at least 12 needed for Hard.
- **Change scoring**: tweak the formula in `lib/score.js`.
