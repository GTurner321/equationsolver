// game-init.js - Handles all game initialization and setup

// Define the global game state
window.gameState = {
    isActive: false,
    currentEquation: null,
    history: [],
    constants: {}
};

// Reset game state to initial values
function resetGameState() {
    console.log('[DEBUG] Resetting game state');
    window.gameState = {
        isActive: false,
        currentEquation: null,
        history: [],
        constants: {}
    };
    
    // Clear UI elements
    const elementsToReset = [
        'history-container',
        'original-constants',
        'simplified-constants',
        'initial-equation'
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
    }
});

// Main game initialization function
function initializeGame() {
    console.log('[DEBUG] Initializing game');
    resetGameState();
    createInputBox();
}

// Start a new game at specified level
function startGame(level = 1) {
    console.log(`[DEBUG] Starting game with level ${level}`);
    resetGameState();
    
    // Debug check for required functions
    console.log('[DEBUG] Checking for required functions:', {
        generateEquationForLevel: !!window.generateEquationForLevel,
        createEquation: !!window.createEquation,
        displayEquation: !!window.displayEquation,
        displayConstants: !!window.displayConstants
    });
    
    // Randomly select format for levels that have multiple formats
    let format = 1;
    if (level === 1 || level === 4) {
        format = Math.random() < 0.5 ? 1 : 2;
    } else if (level === 2) {
        format = Math.floor(Math.random() * 3) + 1;
    }
    
    console.log(`[DEBUG] Using format ${format} for level ${level}`);
    
    // Generate new equation using the correct function name
    if (!window.generateEquationForLevel) {
        console.error('[DEBUG] generateEquationForLevel function not found!');
        return;
    }
    
    const values = window.generateEquationForLevel(level, format);
    console.log('[DEBUG] Generated values:', values);
    
    if (values) {
        window.gameState.currentEquation = window.createEquation(values);
        window.gameState.isActive = true;
        
        // Initialize display
        window.displayEquation(window.gameState.currentEquation);
        window.displayConstants();
        createInputBox();
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
