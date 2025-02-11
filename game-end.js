function checkWinCondition(values) {
  // Check if we're in phase 2 first
  const isPhase2 = evaluateFraction(values.a, values.b) === 1 && 
                   evaluateFraction(values.g, values.h) === 1;
  
  if (!isPhase2) return null;

  // Helper function to simplify and evaluate fractions
  function simplifyAndEvaluate(num, den) {
    const [simpNum, simpDen] = simplifyFraction(num, den);
    return {
      value: evaluateFraction(simpNum, simpDen),
      num: simpNum,
      den: simpDen
    };
  }

  // Check first win condition: c=d=1 and e=i=0
  if (values.c === 1 && values.d === 1 && values.e === 0 && values.i === 0) {
    const solution = simplifyAndEvaluate(values.k, values.l);
    return {
      won: true,
      solution: solution.value,
      num: solution.num,
      den: solution.den,
      form: "right"
    };
  }
  
  // Check second win condition: i=j=1 and c=k=0
  if (values.i === 1 && values.j === 1 && values.c === 0 && values.k === 0) {
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
  if (num > den) {
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

function displayWinMessage(winCondition) {
  const historyContainer = document.getElementById('history-container');
  if (!historyContainer) return;
  
  const winMessage = document.createElement('div');
  winMessage.className = 'win-message';
  
  // Format the solution as fraction or mixed number
  const solutionDisplay = formatSolution(winCondition.num, winCondition.den);
  
  // Create the message with MathJax formatting
  winMessage.innerHTML = `
    <div class="congratulations">
      Well done! You have solved the equation.
    </div>
    <div class="solution">
      \\[x = ${solutionDisplay}\\]
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
  
  // Process MathJax for the new content and scroll into view
  if (window.MathJax) {
    MathJax.typesetPromise([winMessage]).then(() => {
      // Scroll the win message into view with smooth animation
      winMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }).catch((err) => {
      console.error('MathJax typesetting failed:', err);
    });
  }
}
