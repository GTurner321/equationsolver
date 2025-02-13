// game-init.js - Handles all game initialization and setup

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.MathJax) {
        window.MathJax.startup.promise.then(() => {
            initializeGame();
        });
    }
});

function initializeGame() {
    resetGameState();
    createInputBox();
}

function startGame(level = 1) {
    console.log(`Starting game with level ${level}`);
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
    
    console.log(`Using format ${format} for level ${level}`);
    
    // Generate new equation
    const values = generateNewEquation(level, format);
    console.log('Generated values:', values);
    
    if (values) {
        gameState.currentEquation = createEquation(values);
        gameState.isActive = true;
        
        // Initialize display
        displayEquation(gameState.currentEquation);
        displayConstants();
        createInputBox();
    }
}

function initializeEquationDisplay(values) {
    if (!values) return;
    
    const equation = createEquation(values);
    displayEquation(equation);
    displayConstants();
}

function createInputBox() {
    const inputContainer = document.getElementById('input-container');
    if (!inputContainer) return;
    
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

// Make functions available globally
window.startGame = startGame;
window.initializeGame = initializeGame;
window.createInputBox = createInputBox;
window.initializeEquationDisplay = initializeEquationDisplay;
