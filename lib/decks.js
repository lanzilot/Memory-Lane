// Each theme is a list of "pairs". A pair has a faceA and faceB shown on the
// two matching cards. For emoji themes faceA === faceB (find the twin). For
// the celebrity theme faceA is a stage name/nickname and faceB is the
// person's real name — a text-only fact pair, no photos or likenesses used.

export const THEMES = {
  animals: {
    label: "Animals",
    icon: "🐾",
    accent: "#4CA771",
    pairs: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊",
      "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
    ].map((e, i) => ({ id: `an${i}`, faceA: e, faceB: e })),
  },
  food: {
    label: "Food",
    icon: "🍔",
    accent: "#E0553F",
    pairs: [
      "🍎", "🍕", "🍔", "🍟", "🌭", "🍿",
      "🍩", "🍪", "🍇", "🍓", "🍒", "🥑",
    ].map((e, i) => ({ id: `fd${i}`, faceA: e, faceB: e })),
  },
  places: {
    label: "Places",
    icon: "🗺️",
    accent: "#3E7CB1",
    pairs: [
      "🗼", "🗽", "🏰", "🏯", "⛩️", "🕌",
      "🏟️", "🎡", "⛲", "🌋", "🏔️", "🏝️",
    ].map((e, i) => ({ id: `pl${i}`, faceA: e, faceB: e })),
  },
  celebrities: {
    label: "Celebrities",
    icon: "🎬",
    accent: "#B15FBE",
    // Text-only fact pairs: a well-known stage name/nickname matched with
    // the person's real name, plus a generic category icon (music/film/
    // sports/host). No photos, images, or likenesses are used anywhere.
    pairs: [
      { id: "c1", faceA: "The Rock", faceB: "Dwayne Johnson", cardIcon: "🎬" },
      { id: "c2", faceA: "J.Lo", faceB: "Jennifer Lopez", cardIcon: "🎤" },
      { id: "c3", faceA: "Lady Gaga", faceB: "Stefani Germanotta", cardIcon: "🎤" },
      { id: "c4", faceA: "Katy Perry", faceB: "Katheryn Hudson", cardIcon: "🎤" },
      { id: "c5", faceA: "Slim Shady", faceB: "Marshall Mathers", cardIcon: "🎤" },
      { id: "c6", faceA: "The Fresh Prince", faceB: "Will Smith", cardIcon: "🎬" },
      { id: "c7", faceA: "Marilyn Monroe", faceB: "Norma Jeane Mortenson", cardIcon: "🎬" },
      { id: "c8", faceA: "King of Pop", faceB: "Michael Jackson", cardIcon: "🎤" },
      { id: "c9", faceA: "Pambansang Kamao", faceB: "Manny Pacquiao", cardIcon: "🏆" },
      { id: "c10", faceA: "Megastar", faceB: "Sharon Cuneta", cardIcon: "🎬" },
      { id: "c11", faceA: "Asia's Songbird", faceB: "Regine Velasquez", cardIcon: "🎤" },
      { id: "c12", faceA: "Vice Ganda", faceB: "Jose Marie Viceral", cardIcon: "🎙️" },
    ],
  },
};

export const DIFFICULTIES = {
  easy: { label: "Easy", pairCount: 6, cols: 4 },
  medium: { label: "Medium", pairCount: 8, cols: 4 },
  hard: { label: "Hard", pairCount: 12, cols: 6 },
};

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildBoard(themeKey, difficultyKey) {
  const theme = THEMES[themeKey];
  const { pairCount } = DIFFICULTIES[difficultyKey];
  const chosenPairs = shuffle(theme.pairs).slice(0, pairCount);

  const cards = [];
  chosenPairs.forEach((pair) => {
    cards.push({
      cardKey: `${pair.id}-a`,
      pairId: pair.id,
      face: pair.faceA,
      cardIcon: pair.cardIcon || null,
    });
    cards.push({
      cardKey: `${pair.id}-b`,
      pairId: pair.id,
      face: pair.faceB,
      cardIcon: pair.cardIcon || null,
    });
  });

  return shuffle(cards);
}
