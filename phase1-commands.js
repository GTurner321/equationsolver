// phase1-commands.js
function processPhase1Command(command, currentValues) {
  // Try fraction equality command first (from common-commands.js)
  if (processFractionEquality(command, currentValues)) {
    return true;
  }

  // Regular expressions for command matching
  const commandPatterns = {
    multiply: /^\*(-?\d+)$|^x(-?\d+)$/,
    multiplyFraction: /^\*(-?\d+)\/(\d+)$|^x(-?\d+)\/(\d+)$/,
    divide: /^\/(-?\d+)$/,
    lhsBracket: /^lhs\*\(\)(-?\d+)$|^lhsx\(\)(-?\d+)$|^lhs\*br(-?\d+)$|^lhsxbr(-?\d+)$/,
    lhsBracketFraction: /^lhs\*\(\)(-?\d+)\/(\d+)$|^lhsx\(\)(-?\d+)\/(\d+)$|^lhs\*br(-?\d+)\/(\d+)$|^lhsxbr(-?\d+)\/(\d+)$/,
    rhsBracket: /^rhs\*\(\)(-?\d+)$|^rhsx\(\)(-?\d+)$|^rhs\*br(-?\d+)$|^rhsxbr(-?\d+)$/,
    rhsBracketFraction: /^rhs\*\(\)(-?\d+)\/(\d+)$|^rhsx\(\)(-?\d+)\/(\d+)$|^rhs\*br(-?\d+)\/(\d+)$|^rhsxbr(-?\d+)\/(\d+)$/,
    lhsDivide: /^lhs\/(\d+),\/(\d+)$|^lhs\/-(\d+),\/-(\d+)$/,
    rhsDivide: /^rhs\/(\d+),\/(\d+)$|^rhs\/-(\d+),\/-(\d+)$/
  };

  let match;

  // Multiply command
  if ((match = command.match(commandPatterns.multiply))) {
    const n = parseInt(match[1] || match[2]);
    
    if (currentValues.b % n === 0) {
      currentValues.b /= n;
    } else {
      currentValues.a *= n;
    }
    
    if (currentValues.h % n === 0) {
      currentValues.h /= n;
    } else {
      currentValues.g *= n;
    }
    
    return true;
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

  // Divide command
  if ((match = command.match(commandPatterns.divide))) {
    const n = parseInt(match[1]);
    if (n === 0) return false; // Prevent division by zero
    
    for (const [num, den] of [['a', 'b'], ['g', 'h']]) {
      if (currentValues[num] % n === 0) {
        currentValues[num] /= n;
      } else {
        currentValues[den] *= n;
      }
    }
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
