// Command processing functions
function processCommand(command) {
  // First check if we need different command sets
  const needsBracketCommands = evaluateFraction(currentValues.a, currentValues.b) !== 1 || 
                              evaluateFraction(currentValues.g, currentValues.h) !== 1;
  
  if (needsBracketCommands) {
    return processBracketCommand(command);
  } else {
    return false; // For now, returning false to indicate new commands needed
  }
}

function processBracketCommand(command) {
  // Regular expressions for command matching
  const multiplyRegex = /^\*(-?\d+)$|^x(-?\d+)$/;
  const multiplyFractionRegex = /^\*(-?\d+)\/(\d+)$|^x(-?\d+)\/(\d+)$/;
  const divideRegex = /^\/(-?\d+)$/;
  const lhsBracketRegex = /^lhs\*\(\)(\d+)$|^lhsx\(\)(\d+)$|^lhs\*br(\d+)$|^lhsxbr(\d+)$/;
  const lhsBracketFractionRegex = /^lhs\*\(\)(\d+)\/(\d+)$|^lhsx\(\)(\d+)\/(\d+)$|^lhs\*br(\d+)\/(\d+)$|^lhsxbr(\d+)\/(\d+)$/;
  const rhsBracketRegex = /^rhs\*\(\)(\d+)$|^rhsx\(\)(\d+)$|^rhs\*br(\d+)$|^rhsxbr(\d+)$/;
  const rhsBracketFractionRegex = /^rhs\*\(\)(\d+)\/(\d+)$|^rhsx\(\)(\d+)\/(\d+)$|^rhs\*br(\d+)\/(\d+)$|^rhsxbr(\d+)\/(\d+)$/;
  const fractionEqualityRegex = /^(\d+)\/(\d+)=(\d+)\/(\d+)$/;
  const lhsDivideRegex = /^lhs\/(\d+),\/(\d+)$|^lhs\/-(\d+),\/-(\d+)$/;
  const rhsDivideRegex = /^rhs\/(\d+),\/(\d+)$|^rhs\/-(\d+),\/-(\d+)$/;

  let match;

  // Multiply command
  if ((match = command.match(multiplyRegex))) {
    const n = parseInt(match[1] || match[2]);
    currentValues.a *= n;
    currentValues.g *= n;
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

  // Divide command
  if ((match = command.match(divideRegex))) {
    const n = parseInt(match[1]);
    if (currentValues.a % n === 0 && currentValues.g % n === 0) {
      currentValues.a /= n;
      currentValues.g /= n;
    } else {
      currentValues.b *= Math.abs(n);
      currentValues.h *= Math.abs(n);
      if (n < 0) {
        currentValues.a *= -1;
        currentValues.g *= -1;
      }
    }
    return true;
  }

  // LHS bracket operations
  if ((match = command.match(lhsBracketRegex))) {
    const n = parseInt(match[1] || match[2] || match[3]);
    if (currentValues.a % n === 0) {
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
    if (currentValues.a % n === 0 && currentValues.b % m === 0) {
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
    const n = parseInt(match[1] || match[2] || match[3]);
    if (currentValues.g % n === 0) {
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
    if (currentValues.g % n === 0 && currentValues.h % m === 0) {
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

  // Fraction equality command
  if ((match = command.match(fractionEqualityRegex))) {
    const n = parseInt(match[1]);
    const m = parseInt(match[2]);
    const p = parseInt(match[3]);
    const q = parseInt(match[4]);
    
    const checkAndUpdateFraction = (num, den) => {
      if (num === n && den === m) {
        const k = p / n;
        if (k === q / m) {
          return [p, q];
        }
      }
      return [num, den];
    };

    [currentValues.a, currentValues.b] = checkAndUpdateFraction(currentValues.a, currentValues.b);
    [currentValues.c, currentValues.d] = checkAndUpdateFraction(currentValues.c, currentValues.d);
    [currentValues.e, currentValues.f] = checkAndUpdateFraction(currentValues.e, currentValues.f);
    [currentValues.g, currentValues.h] = checkAndUpdateFraction(currentValues.g, currentValues.h);
    [currentValues.i, currentValues.j] = checkAndUpdateFraction(currentValues.i, currentValues.j);
    [currentValues.k, currentValues.l] = checkAndUpdateFraction(currentValues.k, currentValues.l);
    
    return true;
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
