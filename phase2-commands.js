// phase2-commands.js
function processPhase2Command(command, currentValues) {
  // Try fraction equality command first (from common-commands.js)
  if (processFractionEquality(command, currentValues)) {
    return true;
  }

  // Regular expressions for command matching
  const patterns = {
    multiply: /^\*(-?\d+)$|^x(-?\d+)$/,
    multiplyFraction: /^\*(-?\d+)\/(\d+)$|^x(-?\d+)\/(\d+)$/,
    divide: /^\/(-?\d+)$/,
    addConstant: /^\+(\d+)\/(\d+)$|^\+(\d+)$/,
    subtractConstant: /^-(\d+)\/(\d+)$|^-(\d+)$/,
    addXTerm: /^\+(\d+)\/(\d+)x$|^\+(\d+)x$/,
    subtractXTerm: /^-(\d+)\/(\d+)x$|^-(\d+)x$/,
    lhsDivide: /^lhs\/(-?\d+),\/(-?\d+)$/,
    rhsDivide: /^rhs\/(-?\d+),\/(-?\d+)$/
  };

  // Helper function to find GCD
  function findGCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  // Helper function to process fraction operations
  function processFractionOperation(num, den, n, m, operation = 'multiply') {
    if (operation === 'multiply') {
      const absN = Math.abs(n);
      const gcd = findGCD(absN, den);
      if (gcd > 1) {
        return [num * (absN / gcd), den / gcd];
      }
      return [num * absN, den];
    } else if (operation === 'divide') {
      const absN = Math.abs(n);
      const gcd = findGCD(Math.abs(num), absN);
      if (gcd > 1) {
        return [num / gcd, den * (n / gcd)];
      }
      return [num, den * n];
    }
    return [num, den];
  }

  let match;

  // Multiply command (*n or xn)
  if ((match = command.match(patterns.multiply))) {
    const n = parseInt(match[1] || match[2]);
    if (n === 0) return false; // Prevent multiplication by zero
    
    const pairs = [
      ['c', 'd'], ['e', 'f'],
      ['i', 'j'], ['k', 'l']
    ];
    
    for (const [num, den] of pairs) {
      [currentValues[num], currentValues[den]] = 
        processFractionOperation(currentValues[num], currentValues[den], n, 1, 'multiply');
    }
    return true;
  }

  // Multiply fraction command (*n/m or xn/m)
  if ((match = command.match(patterns.multiplyFraction))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || match[4]);
    if (m === 0) return false; // Prevent division by zero
    
    const pairs = [
      ['c', 'd'], ['e', 'f'],
      ['i', 'j'], ['k', 'l']
    ];
    
    for (const [num, den] of pairs) {
      currentValues[num] *= n;
      currentValues[den] *= m;
    }
    return true;
  }

  // Divide command (/n)
  if ((match = command.match(patterns.divide))) {
    const n = parseInt(match[1]);
    if (n === 0) return false; // Prevent division by zero
    
    const pairs = [
      ['c', 'd'], ['e', 'f'],
      ['i', 'j'], ['k', 'l']
    ];
    
    for (const [num, den] of pairs) {
      [currentValues[num], currentValues[den]] = 
        processFractionOperation(currentValues[num], currentValues[den], n, 1, 'divide');
    }
    return true;
  }

  // Helper function for constant term operations
  function processConstantTerm(n, m, isSubtract = false) {
    if (m === 0) return false;
    const sign = isSubtract ? -1 : 1;
    
    // Update constant terms
    currentValues.e = currentValues.e * m + sign * currentValues.f * n;
    currentValues.f *= m;
    currentValues.k = currentValues.k * m + sign * currentValues.l * n;
    currentValues.l *= m;
    
    return true;
  }

  // Add/subtract constant term
  if ((match = command.match(patterns.addConstant))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || 1);
    return processConstantTerm(n, m);
  }
  if ((match = command.match(patterns.subtractConstant))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || 1);
    return processConstantTerm(n, m, true);
  }

  // Helper function for x term operations
  function processXTerm(n, m, isSubtract = false) {
    if (m === 0) return false;
    const sign = isSubtract ? -1 : 1;
    
    // Update x coefficients
    currentValues.c = currentValues.c * m + sign * currentValues.d * n;
    currentValues.d *= m;
    currentValues.i = currentValues.i * m + sign * currentValues.j * n;
    currentValues.j *= m;
    
    return true;
  }

  // Add/subtract x term
  if ((match = command.match(patterns.addXTerm))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || 1);
    return processXTerm(n, m);
  }
  if ((match = command.match(patterns.subtractXTerm))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || 1);
    return processXTerm(n, m, true);
  }

  // Helper function for side division operations
  function processSideDivision(side, n, isNegative) {
    const absN = Math.abs(n);
    if (absN === 0) return false;
    
    const [xCoeff, xDen, const_, constDen] = side === 'lhs' ? 
      ['c', 'd', 'e', 'f'] : ['i', 'j', 'k', 'l'];
    
    const isValid = 
      (currentValues[xCoeff] % absN === 0 && currentValues[xDen] % absN === 0 && currentValues[const_] === 0) ||
      (currentValues[const_] % absN === 0 && currentValues[constDen] % absN === 0 && currentValues[xCoeff] === 0) ||
      (currentValues[xCoeff] % absN === 0 && currentValues[xDen] % absN === 0 && 
       currentValues[const_] % absN === 0 && currentValues[constDen] % absN === 0);
    
    if (isValid) {
      currentValues[xCoeff] = Math.floor(currentValues[xCoeff] / absN) * (isNegative ? -1 : 1);
      currentValues[xDen] = Math.floor(currentValues[xDen] / absN);
      currentValues[const_] = Math.floor(currentValues[const_] / absN) * (isNegative ? -1 : 1);
      currentValues[constDen] = Math.floor(currentValues[constDen] / absN);
      return true;
    }
    return false;
  }

  // Side division operations
  if ((match = command.match(patterns.lhsDivide))) {
    const n = parseInt(match[1]);
    return processSideDivision('lhs', n, n < 0);
  }
  if ((match = command.match(patterns.rhsDivide))) {
    const n = parseInt(match[1]);
    return processSideDivision('rhs', n, n < 0);
  }

  return false;
}

// Export for use in main command processor
window.processPhase2Command = processPhase2Command;
