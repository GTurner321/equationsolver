// game-end.js
function checkWinCondition(values) {
  if (!values) return null;

  // Helper function to check if a fraction equals a specific value
  function fractionEquals(num, den, value) {
    if (den === 0) return false;
    return Math.abs(evaluateFraction(num, den) - value) < 1e-10;
  }

  // Helper function to validate fraction pair is in simplified form
  function isSimplifiedFraction(num, den) {
    if (den === 0) return false;
    if (num === 0) return den === 1;
    return findGCD(Math.abs(num), Math.abs(den)) === 1;
  }

  // Check if we're in phase 2 first
  const isPhase2 = fractionEquals(values.a, values.b, 1) && 
                   fractionEquals(values.g, values.h, 1);
  
  if (!isPhase2) return null;

  // Ensure all fractions are in simplified form
  const fractionPairs = [
    [values.c, values.d],
    [values.e, values.f],
    [values.i, values.j],
    [values.k, values.l]
  ];

  for (const [num, den] of fractionPairs) {
    if (!isSimplifiedFraction(num, den)) {
      return {
        won: false,
        message: "Fractions must be simplified before checking win condition"
      };
    }
  }

  // Check first win condition: x = constant (LHS solved)
  // c/d = 1, e/f is the solution, i/j = 0, k/l = e/f
  if (fractionEquals(values.c, values.d, 1) && 
      fractionEquals(values.i, values.j, 0)) {
    const lhsSolution = evaluateFraction(values.e, values.f);
    const rhsConstant = evaluateFraction(values.k, values.l);
    
    if (Math.abs(lhsSolution - rhsConstant) < 1e-10) {
      return {
        won: true,
        solution: lhsSolution,
        form: "LHS"
      };
    }
  }
  
  // Check second win condition: x = constant (RHS solved)
  // i/j = 1, k/l is the solution, c/d = 0, e/f = k/l
  if (fractionEquals(values.i, values.j, 1) && 
      fractionEquals(values.c, values.d, 0)) {
    const rhsSolution = evaluateFraction(values.k, values.l);
    const lhsConstant = evaluateFraction(values.e, values.f);
    
    if (Math.abs(rhsSolution - lhsConstant) < 1e-10) {
      return {
        won: true,
        solution: rhsSolution,
        form: "RHS"
      };
    }
  }
  
  return {
    won: false,
    message: "Equation not yet solved"
  };
}

function formatSolution(value) {
  if (value === undefined || value === null || isNaN(value)) {
    return "undefined";
  }

  // Handle integer values
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Handle special cases
  if (!isFinite(value)) {
    return value > 0 ? "∞" : "-∞";
  }

  // For decimal numbers, start with 6 decimal places
  let formatted = value.toFixed(6);
  
  // Remove trailing zeros after decimal point
  formatted = formatted.replace(/\.?0+$/, '');
  
  // If the number is very close to an integer, return the integer
  const nearestInt = Math.round(value);
  if (Math.abs(value - nearestInt) < 1e-10) {
    return nearestInt.toString();
  }

  // If the decimal part is very long, try to find a rational approximation
  if (formatted.length > 8) {
    const fraction = findRationalApproximation(value);
    if (fraction) {
      return `${fraction.num}/${fraction.den}`;
    }
  }

  return formatted;
}

function findRationalApproximation(x, tolerance = 1e-10) {
  if (!isFinite(x)) return null;
  
  let a = Math.floor(x);
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let y = x - a;
  
  // Continue until we find a good approximation or hit iteration limit
  for (let i = 0; i < 100 && Math.abs(y) > tolerance; i++) {
    y = 1 / y;
    const b = Math.floor(y);
    const h = b * h1 + h2;
    const k = b * k1 + k2;
    
    // Check if this fraction is a good approximation
    if (Math.abs(x - h / k) < tolerance) {
      return { num: h, den: k };
    }
    
    h2 = h1; h1 = h;
    k2 = k1; k1 = k;
    y -= b;
  }
  
  return null;
}

function displayWinMessage(solution) {
  const historyContainer = document.getElementById('history-container');
  if (!historyContainer) return;

  const winMessage = document.createElement('div');
  winMessage.className = 'win-message';
  
  let messageContent;
  if (solution.won) {
    const formattedSolution = formatSolution(solution.solution);
    messageContent = `
      <div class="congratulations">
        Well done! You have solved the equation.
      </div>
      <div class="solution">
        x = ${formattedSolution}
      </div>
      <div class="solved-form">
        Solved from ${solution.form} side of the equation
      </div>
    `;
  } else {
    messageContent = `
      <div class="message">
        ${solution.message || "Keep trying!"}
      </div>
    `;
  }
  
  winMessage.innerHTML = messageContent;
  historyContainer.appendChild(winMessage);
}
