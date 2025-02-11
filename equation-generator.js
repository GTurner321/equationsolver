// Global state
let currentValues = {};

// Random number generation functions
function getRandomInteger(includeZero = true) {
  let value;
  do {
    value = Math.floor(Math.random() * 21) - 10;
  } while (!includeZero && value === 0);
  return value;
}

function getRandomPair() {
  let numerator = getRandomInteger(false);
  let denominator = getRandomInteger(false);
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  return [numerator, denominator];
}

// Value generation and manipulation
function generateBaseValues() {
  let [a, b] = getRandomPair();
  let [c, d] = getRandomPair();
  let [e, f] = getRandomPair();
  let [g, h] = getRandomPair();
  let [i, j] = getRandomPair();
  let [k, l] = getRandomPair();

  // Ensure c/d ≠ i/j
  while ((c * j) === (i * d)) {
    [i, j] = getRandomPair();
  }

  return { a, b, c, d, e, f, g, h, i, j, k, l };
}

function evaluateFraction(num, den) {
  if (den === 0) return NaN;
  return num / den;
}

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(num, den) {
  if (num === 0) return [0, 1];
  const divisor = gcd(Math.abs(num), Math.abs(den));
  let [newNum, newDen] = [num / divisor, den / divisor];
  if (newDen < 0) {
    newNum = -newNum;
    newDen = -newDen;
  }
  return [newNum, newDen];
}

function simplifyAllFractions(values) {
  let simplified = {...values};
  [simplified.a, simplified.b] = simplifyFraction(simplified.a, simplified.b);
  [simplified.c, simplified.d] = simplifyFraction(simplified.c, simplified.d);
  [simplified.e, simplified.f] = simplifyFraction(simplified.e, simplified.f);
  [simplified.g, simplified.h] = simplifyFraction(simplified.g, simplified.h);
  [simplified.i, simplified.j] = simplifyFraction(simplified.i, simplified.j);
  [simplified.k, simplified.l] = simplifyFraction(simplified.k, simplified.l);
  return simplified;
}

// Export functions for use in other files
window.currentValues = currentValues;
window.generateBaseValues = generateBaseValues;
window.simplifyAllFractions = simplifyAllFractions;
window.evaluateFraction = evaluateFraction;
