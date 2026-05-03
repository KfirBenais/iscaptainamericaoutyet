const reviewPhrases = [
  "Perfect quality!",
  "Amazing quality, super happy with this!",
  "Looks great on my desk!",
  "הדפסה ברמה גבוהה מאוד",
  "Fast shipping and great finish.",
  "Exactly what I needed.",
  "The finish is super smooth.",
  "Colors are exactly like the pictures.",
  "Strong and durable material.",
  "מוצר מעולה, ממליץ בחום!",
  "Great gift idea!",
  "My kids love it!",
  "Perfect print!",
  "איכות מדהימה",
  "Exceeded my expectations.",
  "Will definitely order again.",
  "Great for the price!",
  "ממש שווה את המחיר",
  "Beautifully made, very impressed.",
  "מהיר ומקצועי, תודה!",
  "", // Star-only review
  "", // Star-only review
  "", // Star-only review
];

const authorNames = [
  "M***r", "K***b", "T***l", "A***n", "D***i",
  "R***h", "Y***v", "S***a", "N***e", "O***r",
  "L***a", "E***n", "G***l", "I***t", "B***s",
  "H***i", "Z***v", "C***e", "J***s", "F***r",
];

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

// LCG seeded PRNG — deterministic, consistent across refreshes
function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return function () {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function generateReviews(productName) {
  const seed = hashStr(productName);
  const rng = seededRandom(seed);
  const count = Math.floor(rng() * 10) + 1; // 1–10 reviews
  return Array.from({ length: count }).map(() => ({
    rating: rng() > 0.3 ? 5 : 4,
    text: reviewPhrases[Math.floor(rng() * reviewPhrases.length)],
    author: authorNames[Math.floor(rng() * authorNames.length)],
  }));
}

export function getAverageRating(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
