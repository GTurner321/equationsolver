// game-init.js - Handles all game initialization and setup

// Define the global game state
window.gameState = {
    isActive: false,
    currentEquation: null,
    history: [],
    constants: {},
    currentPhase: 1  // Track which phase we're in
};

// Reset game state to initial values
function resetGameState() {
    console.log('[DEBUG] Resetting game state');
    window.gameState = {
        isActive: false,
        currentEquation: null,
        history: [],
        constants: {},
        currentPhase: 1
    };
    
    // Clear UI elements
    const elementsToReset = [
        'history-container',
        'original-constants',
        'simplified-constants',
        'initial-equation',
        'input-container'
    ];
    
    elementsToReset.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
}

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM Content Loaded');
    if (window.MathJax) {
        window.MathJax.startup.promise.then(() => {
            console.log('[DEBUG] MathJax ready, initializing game');
            initializeGame();
        });
    } else {
        console.warn('[DEBUG] MathJax not found');
        initializeGame();
    }
});

// Main game initialization function
function initializeGame() {
    console.log('[DEBUG] Initializing game');
    resetGameState();
}

// Start a new game at specified level
function startGame(level = 1) {
    console.log(`[DEBUG] Starting game with level ${level}`);
    resetGameState();
    
    // Clear previous game state
    document.getElementById('history-container').innerHTML = '';
    document.getElementById('original-constants').innerHTML = '';
    document.getElementById('simplified-constants').innerHTML = '';
    document.getElementById('initial-equation').innerHTML = '';
    
    // Randomly select format for levels that have multiple formats
    let format = 1;
    if (level === 1 || level === 4) {
        format = Math.random() < 0.5 ? 1 : 2;
    } else if (level === 2) {
        format = Math.floor(Math.random() * 3) + 1;
    }
    
    console.log(`[DEBUG] Using format ${format} for level ${level}`);
    
    // Check if required functions exist
    if (!window.generateNewEquation) {
        console.error('[DEBUG] generateNewEquation function not found');
        return;
    }
    
    // Generate new equation
    const values = window.generateNewEquation(level, format);
    console.log('[DEBUG] Generated values:', values);
    
    if (values) {
        window.gameState.currentEquation = window.createEquation(values);
        window.gameState.isActive = true;
        
        // Initialize display
        window.displayEquation(window.gameState.currentEquation);
        window.displayConstants();
        
        // Create input box after a short delay to ensure equation is rendered
        setTimeout(() => createInputBox(), 100);
    } else {
        console.error('[DEBUG] Failed to generate equation values');
    }
}

// Initialize equation display with given values
function initializeEquationDisplay(values) {
    console.log('[DEBUG] Initializing equation display with values:', values);
    if (!values) {
        console.error('[DEBUG] No values provided for equation display');
        return;
    }
    
    const equation = window.createEquation(values);
    window.displayEquation(equation);
    window.displayConstants();
}

// Create and set up the command input box
function createInputBox() {
    console.log('[DEBUG] Creating input box');
    const inputContainer = document.getElementById('input-container');
    if (!inputContainer) {
        console.error('[DEBUG] Input container not found');
        return;
    }
    
    inputContainer.innerHTML = `
        <div class="input-box">
            <input type="text" id="command-input" placeholder="Enter your command...">
        </div>
    `;
    
    const input = document.getElementById('command-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleCommand(this.value);
                this.value = '';
            }
        });
        // Focus the input box
        input.focus();
    }
}

// Handle user commands
function handleCommand(command) {
    console.log('[DEBUG] Handling command:', command);
    if (!command || !window.gameState.isActive) {
        console.log('[DEBUG] Game not active or empty command');
        return;
    }

    // Check if currentValues exists and is an object
    if (!window.currentValues || typeof window.currentValues !== 'object') {
        console.error('[DEBUG] currentValues is not properly initialized');
        return;
    }

    // Check which phase we're in and process accordingly
    try {
        let result = false;
        
        // Determine which phase we're in based on fractions
        const isPhase1 = evaluateFraction(window.currentValues.a, window.currentValues.b) !== 1 || 
                         evaluateFraction(window.currentValues.g, window.currentValues.h) !== 1;

        if (isPhase1 && window.processPhase1Command) {
            result = window.processPhase1Command(command, window.currentValues);
        } else if (!isPhase1 && window.processPhase2Command) {
            result = window.processPhase2Command(command, window.currentValues);
        } else if (window.processCommand) {
            result = window.processCommand(command);
        }

        // Add the command to history if it was successful
        if (result && window.gameState.currentEquation) {
            window.addHistoryEntry(command, window.gameState.currentEquation);
        }
    } catch (error) {
        console.error('[DEBUG] Error processing command:', error);
    }
}
// Add history entry
function addHistoryEntry(command, equation) {
    const historyContainer = document.getElementById('history-container');
    if (!historyContainer) return;

    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `
        <div class="command">Command: ${command}</div>
        <div class="equation">${equation.toTeX()}</div>
    `;

    historyContainer.appendChild(entry);
    if (window.MathJax) {
        window.MathJax.typesetPromise([entry]).catch(err => {
            console.error('[DEBUG] MathJax typesetting failed:', err);
        });
    }
}

// Error handler for debugging
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('[DEBUG] Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
    return false;
};

// Make functions available globally
window.startGame = startGame;
window.initializeGame = initializeGame;
window.createInputBox = createInputBox;
window.initializeEquationDisplay = initializeEquationDisplay;
window.resetGameState = resetGameState;
window.handleCommand = handleCommand;
window.addHistoryEntry = addHistoryEntry;
