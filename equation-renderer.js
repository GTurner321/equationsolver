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
    
    // Handle denominators of 1 or -1
    if (Math.abs(den) === 1) {
        const result = den === -1 ? -num : num;
        return `${result}`;
    }
    
    const isNegative = (num * den) < 0;
    const absNum = Math.abs(num);
    const absDen = Math.abs(den);
    
    if (isCombined) {
        return `\\frac{${num}}{${absDen}}`;
    } else {
        return `${isNegative ? '-' : ''}\\frac{${absNum}}{${absDen}}`;
    }
}

function formatExpression(outer1, outer2, c, d, e, f) {
    if (c === 0 && e === 0) return "0";

    let result = "";
    // Check if outer fraction evaluates to 1 or -1
    const isOne = outer1 === outer2;
    const isNegOne = outer1 === -outer2;
    const needsBrackets = !isOne;  // Need brackets unless outer fraction is exactly 1

    // Handle outer fraction
    if (isOne) {
        // Don't add anything for coefficient of 1
        result = "";
    } else if (isNegOne) {
        // Add just the minus sign for coefficient of -1
        result = "-";
    } else if (Math.abs(outer2) === 1) {
        // Handle cases where denominator is 1 or -1
        result = `${outer2 === -1 ? -outer1 : outer1}`;
    } else {
        // Regular fraction case
        result = formatFraction(outer1, outer2);
    }

    // Handle combined fractions
    if (d === f) {
        if (Math.abs(d) === 1) {
            const numerator = formatCombinedNumerator(c * Math.sign(d), e * Math.sign(d));
            return needsBrackets ? `${result}\\left(${numerator}\\right)` : `${result}${numerator}`;
        }
        
        const numerator = formatCombinedNumerator(c, e);
        const fraction = formatFraction(1, d, true).replace('1', numerator);
        return needsBrackets ? `${result}\\left(${fraction}\\right)` : `${result}${fraction}`;
    }

    // Handle regular expressions
    if (c === 0) {
        return `${result}${formatFraction(e, f)}`;
    }
    if (e === 0) {
        return d === 1 ? 
            `${result}${formatXCoefficient(c)}` : 
            `${result}${formatFraction(c, d)}x`;
    }

    const isEFNegative = (e * f) < 0;
    const fractionEF = formatFraction(Math.abs(e), Math.abs(f));
    const sign = isEFNegative ? "-" : "+";
    const cTerm = d === 1 ? formatXCoefficient(c) : `${formatFraction(c, d)}x`;

    const innerExpression = `${cTerm} ${sign} ${fractionEF}`;
    return needsBrackets ? `${result}\\left(${innerExpression}\\right)` : `${result}${innerExpression}`;
}

function formatConstants(values) {
    return `a=${values.a}, b=${values.b}, c=${values.c}, d=${values.d}, ` +
           `e=${values.e}, f=${values.f}, g=${values.g}, h=${values.h}, ` +
           `i=${values.i}, j=${values.j}, k=${values.k}, l=${values.l}`;
}

function createEquation(values) {
    return {
        values: values,
        toTeX: function() {
            let leftExpression = formatExpression(
                this.values.a, this.values.b,
                this.values.c, this.values.d,
                this.values.e, this.values.f
            );
            let rightExpression = formatExpression(
                this.values.g, this.values.h,
                this.values.i, this.values.j,
                this.values.k, this.values.l
            );
            return `\\[ ${leftExpression} = ${rightExpression} \\]`;
        }
    };
}

function displayEquation(equation) {
    if (!equation) return;
    
    const initialEquationDiv = document.getElementById('initial-equation');
    initialEquationDiv.innerHTML = `
        <div class="equation">
            Initial equation: ${equation.toTeX()}
        </div>
    `;
    
    if (window.MathJax) {
        window.MathJax.typesetPromise([initialEquationDiv]);
    }
}

function displayConstants() {
    // Display original constants
    const originalConstantsDiv = document.getElementById('original-constants');
    if (originalConstantsDiv) {
        originalConstantsDiv.innerHTML = `Original constants: ${formatConstants(gameState.currentEquation.values)}`;
    }
    
    // Display simplified constants
    const simplifiedConstantsDiv = document.getElementById('simplified-constants');
    if (simplifiedConstantsDiv) {
        simplifiedConstantsDiv.innerHTML = `Simplified constants: ${formatConstants(gameState.currentEquation.values)}`;
    }
    
    // Ensure MathJax rendering
    if (window.MathJax) {
        window.MathJax.typesetPromise([originalConstantsDiv, simplifiedConstantsDiv]).catch(err => {
            console.error('MathJax typesetting failed:', err);
        });
    }
}

function addHistoryEntry(command) {
    const historyEntry = document.createElement('div');
    historyEntry.className = 'history-entry';
    historyEntry.innerHTML = `
        <div class="command">Command: ${command}</div>
        <div class="constants">Constants: ${formatConstants(gameState.currentEquation.values)}</div>
        <div class="equation">${gameState.currentEquation.toTeX()}</div>
    `;

    const historyContainer = document.getElementById('history-container');
    historyContainer.appendChild(historyEntry);

    if (window.MathJax) {
        MathJax.typesetPromise([historyEntry]).catch((err) => {
            console.error('MathJax typesetting failed:', err);
        });
    }
}

// Export functions for use in other files
window.formatConstants = formatConstants;
window.createEquation = createEquation;
window.displayEquation = displayEquation;
window.displayConstants = displayConstants;
window.addHistoryEntry = addHistoryEntry;
