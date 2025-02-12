// phase1-commands.js

function processPhase1Command(command, currentValues) {
  // Try fraction equality command first (from common-commands.js)
  if (processFractionEquality(command, currentValues)) {
    return true;
  }

  // Regular expressions for command matching
  const commandPatterns = {
    multiply: /^\*(-?\d+)$|^x(-?\d+)$/,
    divide: /^\/(-?\d+)$/,
    multiplyFraction: /^\*(-?\d+)\/(\d+)$|^x(-?\d+)\/(\d+)$/,
    lhsBracket: /^lhs\*\(\)(-?\d+)$|^lhsx\(\)(-?\d+)$|^lhs\*br(-?\d+)$|^lhsxbr(-?\d+)$/,
    lhsBracketFraction: /^lhs\*\(\)(-?\d+)\/(\d+)$|^lhsx\(\)(-?\d+)\/(\d+)$|^lhs\*br(-?\d+)\/(\d+)$|^lhsxbr(-?\d+)\/(\d+)$/,
    rhsBracket: /^rhs\*\(\)(-?\d+)$|^rhsx\(\)(-?\d+)$|^rhs\*br(-?\d+)$|^rhsxbr(-?\d+)$/,
    rhsBracketFraction: /^rhs\*\(\)(-?\d+)\/(\d+)$|^rhsx\(\)(-?\d+)\/(\d+)$|^rhs\*br(-?\d+)\/(\d+)$|^rhsxbr(-?\d+)\/(\d+)$/,
    lhsDivide: /^lhs\/(\d+),\/(\d+)$|^lhs\/-(\d+),\/-(\d+)$/,
    rhsDivide: /^rhs\/(\d+),\/(\d+)$|^rhs\/-(\d+),\/-(\d+)$/
  };

  let match;

  // Helper functions
  function isFactor(number, factorCandidate) {
    return number % factorCandidate === 0;
  }

  function hcf(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  function handleMultiply(n, currentValues) {
    if (n === 0) return false;

    const leftSideValue = evaluateFraction(currentValues.a, currentValues.b);
    const rightSideValue = evaluateFraction(currentValues.g, currentValues.h);

    // Case 1: Left side is 1, right side isn't 1
    if (leftSideValue === 1 && rightSideValue !== 1) {
      const hcfHN = hcf(currentValues.h, Math.abs(n));
      const multiplier = n / hcfHN;
      currentValues.h = currentValues.h / hcfHN;
      currentValues.g = currentValues.g * multiplier;
      
      // Handle c/d
      const hcfND = hcf(n, currentValues.d);
      currentValues.c = currentValues.c * (n / hcfND);
      currentValues.d = currentValues.d / hcfND;
      
      // Handle e/f
      const hcfNF = hcf(n, currentValues.f);
      currentValues.e = currentValues.e * (n / hcfNF);
      currentValues.f = currentValues.f / hcfNF;
    }
    // Case 2: Right side is 1, left side isn't 1
    else if (rightSideValue === 1 && leftSideValue !== 1) {
      const hcfBN = hcf(currentValues.b, Math.abs(n));
      const multiplier = n / hcfBN;
      currentValues.b = currentValues.b / hcfBN;
      currentValues.a = currentValues.a * multiplier;
      
      // Handle i/j
      const hcfNJ = hcf(n, currentValues.j);
      currentValues.i = currentValues.i * (n / hcfNJ);
      currentValues.j = currentValues.j / hcfNJ;
      
      // Handle k/l
      const hcfNL = hcf(n, currentValues.l);
      currentValues.k = currentValues.k * (n / hcfNL);
      currentValues.l = currentValues.l / hcfNL;
    }
    // Case 3: Neither side is 1
    else if (leftSideValue !== 1 && rightSideValue !== 1) {
      // Handle left side
      if (isFactor(currentValues.b, Math.abs(n))) {
        currentValues.b = currentValues.b / n;
      } else {
        currentValues.a = currentValues.a * n;
      }
      
      // Handle right side
      if (isFactor(currentValues.h, Math.abs(n))) {
        currentValues.h = currentValues.h / n;
      } else {
        currentValues.g = currentValues.g * n;
      }
    }
    return true;
  }

  function handleDivide(n, currentValues) {
    if (n === 0) return false;

    const leftSideValue = evaluateFraction(currentValues.a, currentValues.b);
    const rightSideValue = evaluateFraction(currentValues.g, currentValues.h);

    // Case 1: Left side is 1, right side isn't 1
    if (leftSideValue === 1 && rightSideValue !== 1) {
      const hcfGN = hcf(currentValues.g, Math.abs(n));
      const multiplier = n / hcfGN;
      currentValues.g = currentValues.g / hcfGN;
      currentValues.h = currentValues.h * multiplier;
      
      // Handle c/d
      const hcfNC = hcf(n, currentValues.c);
      currentValues.d = currentValues.d * (n / hcfNC);
      currentValues.c = currentValues.c / hcfNC;
      
      // Handle e/f
      const hcfNE = hcf(n, currentValues.e);
      currentValues.f = currentValues.f * (n / hcfNE);
      currentValues.e = currentValues.e / hcfNE;
    }
    // Case 2: Right side is 1, left side isn't 1
    else if (rightSideValue === 1 && leftSideValue !== 1) {
      const hcfAN = hcf(currentValues.a, Math.abs(n));
      const multiplier = n / hcfAN;
      currentValues.a = currentValues.a / hcfAN;
      currentValues.b = currentValues.b * multiplier;
      
      // Handle i/j
      const hcfNI = hcf(n, currentValues.i);
      currentValues.j = currentValues.j * (n / hcfNI);
      currentValues.i = currentValues.i / hcfNI;
      
      // Handle k/l
      const hcfNK = hcf(n, currentValues.k);
      currentValues.l = currentValues.l * (n / hcfNK);
      currentValues.k = currentValues.k / hcfNK;
    }
    // Case 3: Neither side is 1
    else if (leftSideValue !== 1 && rightSideValue !== 1) {
      // Handle left side
      if (isFactor(currentValues.a, Math.abs(n))) {
        currentValues.a = currentValues.a / n;
      } else {
        currentValues.b = currentValues.b * n;
      }
      
      // Handle right side
      if (isFactor(currentValues.g, Math.abs(n))) {
        currentValues.g = currentValues.g / n;
      } else {
        currentValues.h = currentValues.h * n;
      }
    }
    return true;
  }

  // Try basic multiply command
  if ((match = command.match(commandPatterns.multiply))) {
    const n = parseInt(match[1] || match[2]);
    return handleMultiply(n, currentValues);
  }

  // Try basic divide command
  if ((match = command.match(commandPatterns.divide))) {
    const n = parseInt(match[1]);
    return handleDivide(n, currentValues);
  }
  
  // Multiply fraction command
  if ((match = command.match(commandPatterns.multiplyFraction))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || match[4]);
    if (m === 0) return false; // Prevent division by zero
    
    currentValues.a *= n;
    currentValues.b *= m;
    currentValues.g *= n;
    currentValues.h *= m;
    return true;
  }
  
  // Process bracket operations
  function processBracketOp(side, match, isRhs) {
    const n = parseInt(match[1] || match[2] || match[3] || match[4]);
    const absN = Math.abs(n);
    const [outerNum, xCoeff, constant] = isRhs ? 
      ['g', 'i', 'k'] : ['a', 'c', 'e'];
    
    if (currentValues[outerNum] % absN === 0) {
      currentValues[outerNum] /= n;
      currentValues[xCoeff] *= n;
      currentValues[constant] *= n;
      return true;
    }
    return false;
  }

  // Process bracket fraction operations
  function processBracketFractionOp(side, match, isRhs) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || match[4]);
    if (m === 0) return false;
    
    const absN = Math.abs(n);
    const [outerNum, outerDen, xCoeff, xDen, constant, constDen] = isRhs ?
      ['g', 'h', 'i', 'j', 'k', 'l'] : ['a', 'b', 'c', 'd', 'e', 'f'];
    
    if (currentValues[outerNum] % absN === 0 && currentValues[outerDen] % m === 0) {
      currentValues[outerNum] /= n;
      currentValues[outerDen] /= m;
      currentValues[xCoeff] *= n;
      currentValues[xDen] *= m;
      currentValues[constant] *= n;
      currentValues[constDen] *= m;
      return true;
    }
    return false;
  }

  // Handle bracket operations
  if ((match = command.match(commandPatterns.lhsBracket))) {
    return processBracketOp('lhs', match, false);
  }
  if ((match = command.match(commandPatterns.rhsBracket))) {
    return processBracketOp('rhs', match, true);
  }
  if ((match = command.match(commandPatterns.lhsBracketFraction))) {
    return processBracketFractionOp('lhs', match, false);
  }
  if ((match = command.match(commandPatterns.rhsBracketFraction))) {
    return processBracketFractionOp('rhs', match, true);
  }

  // Handle divide operations
  function processDivideOp(match, isRhs) {
    const n = parseInt(match[1] || match[2]);
    if (n === 0) return false;
    
    const isNegative = command.includes('/-');
    const [num, den] = isRhs ? ['g', 'h'] : ['a', 'b'];
    
    if (currentValues[num] % n === 0 && currentValues[den] % n === 0) {
      currentValues[num] /= n;
      currentValues[den] /= n;
      if (isNegative) {
        currentValues[num] *= -1;
        currentValues[den] *= -1;
      }
      return true;
    }
    return false;
  }

  if ((match = command.match(commandPatterns.lhsDivide))) {
    return processDivideOp(match, false);
  }
  if ((match = command.match(commandPatterns.rhsDivide))) {
    return processDivideOp(match, true);
  }

  return false;
}

// Export for use in main command processor
window.processPhase1Command = processPhase1Command;
