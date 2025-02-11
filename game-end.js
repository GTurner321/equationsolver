// game-end.js
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
  if (den === 1) return num.toString();
  
  // Format as fraction using MathJax
  return `\\frac{${num}}{${den}}`;
}

function displayWinMessage(winCondition) {
  const historyContainer = document.getElementById('history-container');
  if (!historyContainer) return;

  const winMessage = document.createElement('div');
  winMessage.className = 'win-message';

  // Format the solution
  let solutionDisplay;
  if (Number.isInteger(winCondition.solution)) {
    solutionDisplay = winCondition.solution;
  } else {
    solutionDisplay = formatSolution(winCondition.num, winCondition.den);
  }

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

  // Process MathJax for the new content
  if (window.MathJax) {
    MathJax.typesetPromise([winMessage]).catch((err) => {
      console.error('MathJax typesetting failed:', err);
    });
  }
}
