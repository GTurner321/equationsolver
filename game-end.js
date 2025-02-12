// Game End Logic Module

/**
 * Evaluates a fraction given a numerator and denominator
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {number|undefined} The evaluated fraction or undefined if denominator is 0
 */
function evaluateFraction(num, den) {
  if (den === 0) return undefined;
  return num / den;
}

/**
 * Simplifies a fraction to its lowest terms
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {[number, number]} Array containing [simplified numerator, simplified denominator]
 */
function simplifyFraction(num, den) {
  // Handle the case where either number is 0
  if (num === 0) return [0, 1];
  if (den === 0) return [num, 0];
  
  // Make sure we're working with absolute values for GCD
  const a = Math.abs(num);
  const b = Math.abs(den);
  
  // Calculate GCD using Euclidean algorithm
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(a, b);
  
  // Preserve original sign
  const sign = (num * den) < 0 ? -1 : 1;
  return [sign * Math.abs(num / divisor), Math.abs(den / divisor)];
}

/**
 * Checks if the current game state meets win conditions
 * @param {Object} values - Object containing current game values (a through l)
 * @returns {Object|null} Win condition object or null if not in phase 2
 */
function checkWinCondition(values) {
  // Check if we're in phase 2 first
  const isPhase2 = Math.abs(evaluateFraction(values.a, values.b) - 1) < 1e-10 && 
                   Math.abs(evaluateFraction(values.g, values.h) - 1) < 1e-10;
  
  if (!isPhase2) return null;

  // Helper function to check if fraction evaluates to 1
  function isOne(num, den) {
    if (den === 0) return false;
    return Math.abs(num / den - 1) < 1e-10;
  }

  // Helper function to simplify and evaluate fractions
  function simplifyAndEvaluate(num, den) {
    const [simpNum, simpDen] = simplifyFraction(num, den);
    return {
      value: evaluateFraction(simpNum, simpDen),
      num: simpNum,
      den: simpDen
    };
  }

  // Check first win condition: c/d = 1 and e=i=0
  if (isOne(values.c, values.d) && values.e === 0 && values.i === 0) {
    const solution = simplifyAndEvaluate(values.k, values.l);
    return {
      won: true,
      solution: solution.value,
      num: solution.num,
      den: solution.den,
      form: "right"
    };
  }
  
  // Check second win condition: i/j = 1 and c=k=0
  if (isOne(values.i, values.j) && values.c === 0 && values.k === 0) {
    const solution = simplifyAndEvaluate(values.e, values.f);
    return {
      won: true,
      solution: solution.value,
      num: solution.num,
      den: solution.den,
      form: "left"
    };
  }
  
  return {
    won: false,
    message: "Equation not yet solved"
  };
}

/**
 * Formats a solution as a LaTeX fraction or mixed number
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {string} LaTeX formatted fraction
 */
function formatSolution(num, den) {
  // Handle special cases
  if (den === 0) return "undefined";
  if (num === 0) return "0";
  
  // For negative fractions, make numerator negative and denominator positive
  let isNegative = (num * den) < 0;
  num = Math.abs(num);
  den = Math.abs(den);
  
  // If denominator is 1, just return the number
  if (den === 1) {
    return isNegative ? `-${num}` : `${num}`;
  }
  
  // Check if it's an improper fraction
  if (num >= den) {
    const wholePart = Math.floor(num / den);
    const remainder = num % den;
    
    // If there's no remainder, just return the whole number
    if (remainder === 0) {
      return isNegative ? `-${wholePart}` : `${wholePart}`;
    }
    
    // Format as mixed number
    return `${isNegative ? '-' : ''}${wholePart}\\frac{${remainder}}{${den}}`;
  }
  
  // Regular fraction
  return `${isNegative ? '-' : ''}\\frac{${num}}{${den}}`;
}

/**
 * Displays the win message when the game is solved
 * @param {Object} winCondition - Object containing win condition details
 */
function displayWinMessage(winCondition) {
  const historyContainer = document.getElementById('history-container');
  if (!historyContainer) return;
  
  const winMessage = document.createElement('div');
  winMessage.className = 'win-message';
  
  // Format both fraction representations
  const simpleFraction = formatSolution(winCondition.num, winCondition.den);
  const mixedNumber = formatSolution(winCondition.num, winCondition.den);
  
  // Create the message with MathJax formatting
  winMessage.innerHTML = `
    <div class="congratulations">
      Well done! You have solved the equation.
    </div>
    <div class="solution">
      \\[x = ${simpleFraction} = ${mixedNumber}\\]
    </div>
    <div class="method">
      Solution found from the ${winCondition.form} side of the equation
    </div>
  `;
  
  // Add the message to the container
  historyContainer.appendChild(winMessage);
  
  // Remove the input container
  const inputContainer = document.getElementById('input-container');
  if (inputContainer) {
    inputContainer.remove();
  }
  
  // Process MathJax for the new content
  if (window.MathJax) {
    MathJax.typesetPromise([winMessage]).then(() => {
      winMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }).catch((err) => {
      console.error('MathJax typesetting failed:', err);
    });
  }
}

// Export functions if using as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    evaluateFraction,
    simplifyFraction,
    checkWinCondition,
    formatSolution,
    displayWinMessage
  };
}
