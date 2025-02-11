// common-commands.js
function areEquivalentFractions(n1, d1, n2, d2) {
  const absN1 = Math.abs(n1);
  const absD1 = Math.abs(d1);
  const absN2 = Math.abs(n2);
  const absD2 = Math.abs(d2);
  
  const r1 = absN2 / absN1;
  const r2 = absD2 / absD1;
  
  return Math.abs(r1 - r2) < 1e-10;
}

function updateIfEquivalent(num, den, n, m, p, q) {
  if (areEquivalentFractions(Math.abs(num), Math.abs(den), n, m)) {
    const sign = Math.sign(num);
    return [sign * p, q];
  }
  return [num, den];
}

function processFractionEquality(command, currentValues) {
  // Your existing processFractionEquality function
  // Just add currentValues as a parameter
  // Rest of the code remains the same
}

