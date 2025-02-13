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
    if (window.MathJax) {
        window.MathJax.startup.promise.then(() => {
            initializeGame();
        });
    }
});

// Main game initialization function
function initializeGame() {
    resetGameState();
    createInputBox();
}

// Start a new game at specified level
function startGame(level = 1) {
    console.log(`Starting game with level ${level}`);
    resetGameState();
    
    // Randomly select format for levels that have multiple formats
    let format = 1;
    if (level === 1 || level === 4) {
        format = Math.random() < 0.5 ? 1 : 2;
    } else if (level === 2) {
        format = Math.floor(Math.random() * 3) + 1;
    }
    
    console.log(`Using format ${format} for level ${level}`);
    
    // Generate new equation using the correct function name
    const values = window.generateEquationForLevel(level, format);
    console.log('Generated values:', values);
    
    if (values) {
        window.gameState.currentEquation = window.createEquation(values);
        window.gameState.isActive = true;
        
        // Initialize display
        window.displayEquation(window.gameState.currentEquation);
        window.displayConstants();
        createInputBox();
    } else {
        console.error('Failed to generate equation values');
    }
}

// Initialize equation display with given values
function initializeEquationDisplay(values) {
    if (!values) {
        console.error('No values provided for equation display');
        return;
    }
    
    const equation = window.createEquation(values);
    window.displayEquation(equation);
    window.displayConstants();
}

// Create and set up the command input box
function createInputBox() {
    const inputContainer = document.getElementById('input-container');
    if (!inputContainer) {
        console.error('Input container not found');
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
    console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
    return false;
};

// Make functions available globally
window.startGame = startGame;
window.initializeGame = initializeGame;
window.createInputBox = createInputBox;
window.initializeEquationDisplay = initializeEquationDisplay;
window.resetGameState = resetGameState;
