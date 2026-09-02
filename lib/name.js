export function isValidName(name) {
  const trimmed = String(name || "").trim();
  return trimmed.length >= 2 && trimmed.length <= 24;
}

export function cleanName(name) {
  return String(name).trim().slice(0, 24);
}
