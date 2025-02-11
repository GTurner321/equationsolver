// Helper function to check if two fractions are equivalent with a ratio
function areEquivalentFractions(n1, d1, n2, d2) {
  // Convert to absolute values for comparison
  const absN1 = Math.abs(n1);
  const absD1 = Math.abs(d1);
  const absN2 = Math.abs(n2);
  const absD2 = Math.abs(d2);
  
  // Check if there exists an r where n1*r = n2 and d1*r = d2
  const r1 = absN2 / absN1;
  const r2 = absD2 / absD1;
  
  return Math.abs(r1 - r2) < 1e-10; // Using small epsilon for float comparison
}

// Helper function to update fraction if equivalent
function updateIfEquivalent(num, den, n, m, p, q) {
  if (areEquivalentFractions(Math.abs(num), Math.abs(den), n, m)) {
    // Preserve original sign when updating
    const sign = Math.sign(num);
    return [sign * p, q];
  }
  return [num, den];
}

// Main fraction equality command processing
function processFractionEquality(command) {
  // Handle all formats of fraction equality commands
  const standardFormat = /^(-?)(\d+)\/(-?)(\d+)=(-?)(\d+)\/(-?)(\d+)$/;
  const fractionToIntFormat = /^(-?)(\d+)\/(-?)(\d+)=(-?)(\d+)$/;
  const intToFractionFormat = /^(-?)(\d+)=(-?)(\d+)\/(-?)(\d+)$/;
  
  let match;
  
  if ((match = command.match(standardFormat))) {
    // Extract all components including signs
    const [, sign1, n, sign2, m, sign3, p, sign4, q] = match;
    
    // Convert strings to numbers
    const nVal = parseInt(n);
    const mVal = parseInt(m);
    const pVal = parseInt(p);
    const qVal = parseInt(q);
    
    // Calculate effective signs
    const leftNegative = (sign1 === '-') !== (sign2 === '-');
    const rightNegative = (sign3 === '-') !== (sign4 === '-');
    
    // Apply the transformation to all fraction pairs
    [currentValues.a, currentValues.b] = updateIfEquivalent(
      currentValues.a, currentValues.b, 
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.c, currentValues.d] = updateIfEquivalent(
      currentValues.c, currentValues.d,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.e, currentValues.f] = updateIfEquivalent(
      currentValues.e, currentValues.f,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.g, currentValues.h] = updateIfEquivalent(
      currentValues.g, currentValues.h,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.i, currentValues.j] = updateIfEquivalent(
      currentValues.i, currentValues.j,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.k, currentValues.l] = updateIfEquivalent(
      currentValues.k, currentValues.l,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    return true;
  }
  
  // Handle n/m=p format (convert to n/m=p/1)
  else if ((match = command.match(fractionToIntFormat))) {
    const [, sign1, n, sign2, m, sign3, p] = match;
    return processFractionEquality(
      `${sign1}${n}/${sign2}${m}=${sign3}${p}/1`
    );
  }
  
  // Handle n=p/q format (convert to n/1=p/q)
  else if ((match = command.match(intToFractionFormat))) {
    const [, sign1, n, sign2, p, sign3, q] = match;
    return processFractionEquality(
      `${sign1}${n}/1=${sign2}${p}/${sign3}${q}`
    );
  }
  
  return false;
}

// Command processing functions
function processCommand(command) {
  // First check if we need different command sets
  const needsBracketCommands = evaluateFraction(currentValues.a, currentValues.b) !== 1 || 
                              evaluateFraction(currentValues.g, currentValues.h) !== 1;
  
  if (needsBracketCommands) {
    return processBracketCommand(command);
  } else {
    document.getElementById('command-status').innerHTML = 'New commands required';
    return false;
  }
}

function processBracketCommand(command) {
  // Try fraction equality command first
  if (processFractionEquality(command)) {
    return true;
  }

  // Regular expressions for command matching
  const multiplyRegex = /^\*(-?\d+)$|^x(-?\d+)$/;
  const multiplyFractionRegex = /^\*(-?\d+)\/(\d+)$|^x(-?\d+)\/(\d+)$/;
  const divideRegex = /^\/(-?\d+)$/;
  const lhsBracketRegex = /^lhs\*\(\)(-?\d+)$|^lhsx\(\)(-?\d+)$|^lhs\*br(-?\d+)$|^lhsxbr(-?\d+)$/;
  const lhsBracketFractionRegex = /^lhs\*\(\)(-?\d+)\/(\d+)$|^lhsx\(\)(-?\d+)\/(\d+)$|^lhs\*br(-?\d+)\/(\d+)$|^lhsxbr(-?\d+)\/(\d+)$/;
  const rhsBracketRegex = /^rhs\*\(\)(-?\d+)$|^rhsx\(\)(-?\d+)$|^rhs\*br(-?\d+)$|^rhsxbr(-?\d+)$/;
  const rhsBracketFractionRegex = /^rhs\*\(\)(-?\d+)\/(\d+)$|^rhsx\(\)(-?\d+)\/(\d+)$|^rhs\*br(-?\d+)\/(\d+)$|^rhsxbr(-?\d+)\/(\d+)$/;
  const lhsDivideRegex = /^lhs\/(\d+),\/(\d+)$|^lhs\/-(\d+),\/-(\d+)$/;
  const rhsDivideRegex = /^rhs\/(\d+),\/(\d+)$|^rhs\/-(\d+),\/-(\d+)$/;

  let match;

// Multiply command
if ((match = command.match(multiplyRegex))) {
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
  if ((match = command.match(multiplyFractionRegex))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || match[4]);
    currentValues.a *= n;
    currentValues.b *= m;
    currentValues.g *= n;
    currentValues.h *= m;
    return true;
  }

 // Divide each side separately by n
if ((match = command.match(/^\/(-?\d+)$/))) {
  const n = parseInt(match[1]);

  // Handle 'a' and 'b'
  if (currentValues.a % n === 0) {
    currentValues.a /= n;
  } else {
    currentValues.b *= n;
  }

  // Handle 'g' and 'h'
  if (currentValues.g % n === 0) {
    currentValues.g /= n;
  } else {
    currentValues.h *= n;
  }

  return true;
}


  // LHS bracket operations
  if ((match = command.match(lhsBracketRegex))) {
    const n = parseInt(match[1] || match[2] || match[3] || match[4]);
    const absN = Math.abs(n);
    if (currentValues.a % absN === 0) {
      currentValues.a /= n;
      currentValues.c *= n;
      currentValues.e *= n;
      return true;
    }
    return false;
  }

  // LHS bracket fraction operations
  if ((match = command.match(lhsBracketFractionRegex))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || match[4]);
    const absN = Math.abs(n);
    if (currentValues.a % absN === 0 && currentValues.b % m === 0) {
      currentValues.a /= n;
      currentValues.b /= m;
      currentValues.c *= n;
      currentValues.d *= m;
      currentValues.e *= n;
      currentValues.f *= m;
      return true;
    }
    return false;
  }

  // RHS bracket operations
  if ((match = command.match(rhsBracketRegex))) {
    const n = parseInt(match[1] || match[2] || match[3] || match[4]);
    const absN = Math.abs(n);
    if (currentValues.g % absN === 0) {
      currentValues.g /= n;
      currentValues.i *= n;
      currentValues.k *= n;
      return true;
    }
    return false;
  }

  // RHS bracket fraction operations
  if ((match = command.match(rhsBracketFractionRegex))) {
    const n = parseInt(match[1] || match[3]);
    const m = parseInt(match[2] || match[4]);
    const absN = Math.abs(n);
    if (currentValues.g % absN === 0 && currentValues.h % m === 0) {
      currentValues.g /= n;
      currentValues.h /= m;
      currentValues.i *= n;
      currentValues.j *= m;
      currentValues.k *= n;
      currentValues.l *= m;
      return true;
    }
    return false;
  }

  // LHS divide operations
  if ((match = command.match(lhsDivideRegex))) {
    const n = parseInt(match[1] || match[2]);
    const isNegative = command.includes('/-');
    if (currentValues.a % n === 0 && currentValues.b % n === 0) {
      currentValues.a /= n;
      currentValues.b /= n;
      if (isNegative) {
        currentValues.a *= -1;
        currentValues.b *= -1;
      }
      return true;
    }
    return false;
  }

  // RHS divide operations
  if ((match = command.match(rhsDivideRegex))) {
    const n = parseInt(match[1] || match[2]);
    const isNegative = command.includes('/-');
    if (currentValues.g % n === 0 && currentValues.h % n === 0) {
      currentValues.g /= n;
      currentValues.h /= n;
      if (isNegative) {
        currentValues.g *= -1;
        currentValues.h *= -1;
      }
      return true;
    }
    return false;
  }

  return false;
}

// Add event listener for user input
document.getElementById('user-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const command = this.value.trim();
    const success = processCommand(command);
    
    // Update display
    document.getElementById('current-constants').innerHTML = 
      `Current constants: ${formatConstants(currentValues)}`;
    
    // Generate and display new equation
    const equation = generateEquation();
    document.getElementById('equation-container').innerHTML = `\\[ ${equation} \\]`;
    
    // Check if new commands are needed
    const needsNewCommands = 
      evaluateFraction(currentValues.a, currentValues.b) === 1 && 
      evaluateFraction(currentValues.g, currentValues.h) === 1;
    
    if (needsNewCommands) {
      document.getElementById('command-status').innerHTML = 'New commands required';
    }
    
    // Clear input after processing
    this.value = '';
    
    // Refresh MathJax rendering
    MathJax.typesetPromise();
  }
});
