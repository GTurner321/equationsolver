// common-commands.js - Basic command processing and fraction manipulation

// Fraction evaluation and manipulation functions
function evaluateFraction(num, den) {
    if (den === 0) {
        console.error('[DEBUG] Attempted division by zero');
        return undefined;
    }
    return num / den;
}

function areEquivalentFractions(n1, d1, n2, d2) {
    console.log('[DEBUG] Checking fraction equivalence:', `${n1}/${d1} vs ${n2}/${d2}`);
    // Handle zero cases
    if (n1 === 0 && n2 === 0) return true;
    if (n1 === 0 || n2 === 0) return false;
    
    const absN1 = Math.abs(n1);
    const absD1 = Math.abs(d1);
    const absN2 = Math.abs(n2);
    const absD2 = Math.abs(d2);
    
    // Cross multiply to avoid division
    const equivalent = Math.abs(absN1 * absD2 - absN2 * absD1) < 1e-10;
    console.log('[DEBUG] Fractions are', equivalent ? 'equivalent' : 'not equivalent');
    return equivalent;
}

function updateIfEquivalent(num, den, n, m, p, q) {
    console.log('[DEBUG] Updating fraction if equivalent:', 
                `Current: ${num}/${den}, Test: ${n}/${m}, New: ${p}/${q}`);
    
    if (num === 0) {
        return [0, 1]; // Always normalize zero to 0/1
    }
    
    if (areEquivalentFractions(Math.abs(num), Math.abs(den), n, m)) {
        const sign = Math.sign(num) * Math.sign(den); // Preserve original fraction sign
        return [sign * Math.abs(p), Math.abs(q)];
    }
    return [num, den];
}

function processFractionEquality(command, currentValues) {
    console.log('[DEBUG] Processing fraction equality:', command);
    
    // Handle all formats of fraction equality commands
    const standardFormat = /^(-?)(\d+)\/(-?)(\d+)=(-?)(\d+)\/(-?)(\d+)$/;
    const fractionToIntFormat = /^(-?)(\d+)\/(-?)(\d+)=(-?)(\d+)$/;
    const intToFractionFormat = /^(-?)(\d+)=(-?)(\d+)\/(-?)(\d+)$/;
    
    let match;
    
    if ((match = command.match(standardFormat))) {
        // Extract all components including signs
        const [, sign1, n, sign2, m, sign3, p, sign4, q] = match;
        
        // Convert strings to numbers and validate
        const nVal = parseInt(n);
        const mVal = parseInt(m);
        const pVal = parseInt(p);
        const qVal = parseInt(q);
        
        if (mVal === 0 || qVal === 0) {
            console.error('[DEBUG] Division by zero attempt');
            return false;
        }
        
        // Calculate effective signs - combine multiple signs properly
        const leftNegative = ((sign1 === '-') !== (sign2 === '-'));
        const rightNegative = ((sign3 === '-') !== (sign4 === '-'));
        
        // Create arrays for all value pairs
        const valuePairs = [
            ['a', 'b'], ['c', 'd'], ['e', 'f'],
            ['g', 'h'], ['i', 'j'], ['k', 'l']
        ];
        
        // Apply the transformation to all fraction pairs
        for (const [numKey, denKey] of valuePairs) {
            [currentValues[numKey], currentValues[denKey]] = updateIfEquivalent(
                currentValues[numKey],
                currentValues[denKey],
                leftNegative ? -nVal : nVal,
                mVal,
                rightNegative ? -pVal : pVal,
                qVal
            );
        }
        
        return true;
    }
    
    // Handle n/m=p format (convert to n/m=p/1)
    else if ((match = command.match(fractionToIntFormat))) {
        const [, sign1, n, sign2, m, sign3, p] = match;
        return processFractionEquality(
            `${sign1}${n}/${sign2}${m}=${sign3}${p}/1`,
            currentValues
        );
    }
    
    // Handle n=p/q format (convert to n/1=p/q)
    else if ((match = command.match(intToFractionFormat))) {
        const [, sign1, n, sign2, p, sign3, q] = match;
        return processFractionEquality(
            `${sign1}${n}/1=${sign2}${p}/${sign3}${q}`,
            currentValues
        );
    }
    
    console.log('[DEBUG] No matching fraction equality format found');
    return false;
}

// Command processing function
function processCommand(command) {
    console.log('[DEBUG] Processing command:', command);
    if (!command || !window.gameState.isActive) {
        console.log('[DEBUG] Game not active or empty command');
        return;
    }

    // First try fraction equality
    if (processFractionEquality(command, window.gameState.currentEquation.values)) {
        // If successful, update display and history
        window.displayEquation(window.gameState.currentEquation);
        window.addHistoryEntry(command, window.gameState.currentEquation);
        return;
    }

    // Then try phase-specific processors
    if (window.gameState.currentPhase === 1 && window.processPhase1Command) {
        console.log('[DEBUG] Using Phase 1 processor');
        window.processPhase1Command(command);
    } else if (window.gameState.currentPhase === 2 && window.processPhase2Command) {
        console.log('[DEBUG] Using Phase 2 processor');
        window.processPhase2Command(command);
    } else {
        // Handle basic commands
        if (command.toLowerCase() === 'help') {
            displayHelp();
        } else if (command.toLowerCase() === 'reset') {
            window.resetGameState();
        } else {
            console.log('[DEBUG] Unknown command:', command);
            window.addHistoryEntry(command, window.gameState.currentEquation, 'Unknown command. Type "help" for available commands.');
        }
    }
}

function displayHelp() {
    console.log('[DEBUG] Displaying help');
    const helpText = `Available commands:
    - Fraction equality: n/m=p/q, n/m=p, n=p/q
    - help: Show this help message
    - reset: Reset the current game
    Phase-specific commands will be shown based on current phase`;
    
    const historyContainer = document.getElementById('history-container');
    if (historyContainer) {
        const helpEntry = document.createElement('div');
        helpEntry.className = 'history-entry';
        helpEntry.innerHTML = `<div class="command">Help</div><div>${helpText}</div>`;
        historyContainer.appendChild(helpEntry);
    }
}

// Export to window object
Object.assign(window, {
    processCommand,
    displayHelp,
    evaluateFraction,
    areEquivalentFractions,
    updateIfEquivalent,
    processFractionEquality
});
