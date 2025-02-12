// Formatting functions
function formatXCoefficient(coeff) {
  if (coeff === 0) return "0";
  if (coeff === 1) return "x";
  if (coeff === -1) return "-x";
  return `${coeff}x`;
}

function formatCombinedNumerator(coeff, constant) {
  let result = "";
  if (coeff !== 0) {
    if (coeff === 1) {
      result += "x";
    } else if (coeff === -1) {
      result += "-x";
    } else {
      result += `${coeff}x`;
    }
    if (constant > 0) result += "+";
  }
  if (constant !== 0 || coeff === 0) {
    result += `${constant}`;
  }
  return result;
}

function formatFraction(num, den, isCombined = false) {
  if (num === 0) return "0";
  
  const isNegative = (num * den) < 0;
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  
  if (absDen === 1 && !isCombined) {
    return isNegative ? `-${absNum}` : `${absNum}`;
  }
  
  if (isCombined) {
    // For combined fractions, keep negative sign with denominator
    const signedDen = den < 0 ? -absDen : absDen;
    const signedNum = num < 0 ? -absNum : absNum;
    return `\\frac{${signedNum}}{${signedDen}}`;
  } else {
    // For regular fractions, keep current behavior
    return `${isNegative ? '-' : ''}\\frac{${absNum}}{${absDen}}`;
  }
}

function formatExpression(outer1, outer2, c, d, e, f) {
  if (c === 0 && e === 0) return "0";

  const outerValue = evaluateFraction(outer1, outer2);
  let result = "";

  if (outerValue === -1) {
    result += "-";
  } else if (outerValue !== 1) {
    result += formatFraction(outer1, outer2);
  }

  if (d === f && !(d === 1 && f === 1)) {
    const numerator = formatCombinedNumerator(c, e);
    const fraction = formatFraction(1, d, true).replace('1', numerator);
    
    if (outerValue === -1 || outerValue !== 1) {
      return `${result}\\left(${fraction}\\right)`;
    }
    return `${result}${fraction}`;
  }

  if (c === 0) return `${result}${formatFraction(e, f)}`;
  if (e === 0) {
    return d === 1 ? `${result}${formatXCoefficient(c)}` : `${result}${formatFraction(c, d)}x`;
  }

  const isEFNegative = (e * f) < 0;
  const fractionEF = formatFraction(Math.abs(e), Math.abs(f));
  const sign = isEFNegative ? "-" : "+";
  const cTerm = d === 1 ? formatXCoefficient(c) : `${formatFraction(c, d)}x`;

  const innerExpression = `${cTerm} ${sign} ${fractionEF}`;
  
  if (outerValue === -1 || outerValue !== 1) {
    return `${result}\\left(${innerExpression}\\right)`;
  }
  return `${result}${innerExpression}`;
}

function formatConstants(values) {
  return `a=${values.a}, b=${values.b}, c=${values.c}, d=${values.d}, ` +
         `e=${values.e}, f=${values.f}, g=${values.g}, h=${values.h}, ` +
         `i=${values.i}, j=${values.j}, k=${values.k}, l=${values.l}`;
}

function generateEquation() {
  let { a, b, c, d, e, f, g, h, i, j, k, l } = currentValues;
  let leftExpression = formatExpression(a, b, c, d, e, f);
  let rightExpression = formatExpression(g, h, i, j, k, l);
  return `\\[ ${leftExpression} = ${rightExpression} \\]`;
}

// UI functions
function addHistoryEntry(command) {
  const historyEntry = document.createElement('div');
  historyEntry.className = 'history-entry';
  historyEntry.innerHTML = `
    <div class="command">Command: ${command}</div>
    <div class="constants">Constants: ${formatConstants(currentValues)}</div>
    <div class="equation">${generateEquation()}</div>
  `;

  const historyContainer = document.getElementById('history-container');
  historyContainer.appendChild(historyEntry);

  MathJax.typesetPromise([historyEntry]).catch((err) => {
    console.error('MathJax typesetting failed:', err);
  });
}

function addInputBox() {
  const inputContainer = document.getElementById('input-container');
  inputContainer.innerHTML = `
    <div class="input-box">
      <input type="text" id="user-input" value="" placeholder="Enter your command here">
    </div>
  `;

  const input = document.getElementById('user-input');
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const command = this.value.trim();
      const success = processCommand(command);

      if (success) {
        addHistoryEntry(command);

        const winCondition = checkWinCondition(currentValues);
        if (winCondition && winCondition.won) {
          displayWinMessage(winCondition);
          inputContainer.innerHTML = '';
        } else {
          this.value = '';
        }

        MathJax.typesetPromise().then(() => {
          const newInput = document.getElementById('user-input');
          if (newInput) {
            newInput.focus();
            newInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }).catch((err) => {
          console.error('MathJax typesetting failed:', err);
        });
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Invalid command. Please try again.';
        input.parentNode.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
      }
    }
  });

  input.focus();
}

function startGame() {
  // Clear previous content
  document.getElementById('history-container').innerHTML = '';
  document.getElementById('initial-equation').innerHTML = '';
  document.getElementById('input-container').innerHTML = '';
  document.getElementById('original-constants').innerHTML = '';
  document.getElementById('simplified-constants').innerHTML = '';

  // Generate and store new values
  currentValues = generateBaseValues();
  
  // Display original constants
  const originalConstantsDiv = document.getElementById('original-constants');
  originalConstantsDiv.innerHTML = `Original constants: ${formatConstants(currentValues)}`;
  
  // Simplify and display simplified constants
  currentValues = simplifyAllFractions(currentValues);
  const simplifiedConstantsDiv = document.getElementById('simplified-constants');
  simplifiedConstantsDiv.innerHTML = `Simplified constants: ${formatConstants(currentValues)}`;
  
  // Generate and display initial equation
  const equation = generateEquation();
  const initialEquationDiv = document.getElementById('initial-equation');
  initialEquationDiv.innerHTML = `<div class="equation">${equation}</div>`;

  // Add input box
  addInputBox();

  // Ensure MathJax rendering
  if (window.MathJax) {
    MathJax.typesetPromise([
      originalConstantsDiv,
      simplifiedConstantsDiv,
      initialEquationDiv
    ]).then(() => {
      const userInput = document.getElementById('user-input');
      if (userInput) userInput.focus();
    }).catch(err => {
      console.error('MathJax typesetting failed:', err);
    });
  }
}

// Export functions for use in other files
window.formatConstants = formatConstants;
window.generateEquation = generateEquation;
window.addHistoryEntry = addHistoryEntry;
window.addInputBox = addInputBox;
window.startGame = startGame;
