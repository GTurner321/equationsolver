// Debug helper function
function logFunctionCall(functionName, input, output) {
    console.log(`[DEBUG] ${functionName} called:`, {
        input: input,
        output: output
    });
}

// Random number generation functions
function getRandomInteger(includeZero = true) {
    const value = Math.floor(Math.random() * 21) - 10;
    logFunctionCall('getRandomInteger', { includeZero }, value);
    return value;
}

function getRandomPair() {
    let numerator = getRandomInteger(false);
    let denominator = getRandomInteger(false);
    if (denominator < 0) {
        numerator = -numerator;
        denominator = -denominator;
    }
    logFunctionCall('getRandomPair', {}, [numerator, denominator]);
    return [numerator, denominator];
}

function generateBaseValues() {
    console.log('[DEBUG] Generating base values...');
    let [a, b] = getRandomPair();
    let [c, d] = getRandomPair();
    let [e, f] = getRandomPair();
    let [g, h] = getRandomPair();
    let [i, j] = getRandomPair();
    let [k, l] = getRandomPair();
    
    // Ensure c/d ≠ i/j
    while ((c * j) === (i * d)) {
        console.log('[DEBUG] Regenerating i,j pair due to equality with c,d');
        [i, j] = getRandomPair();
    }
    
    const values = { a, b, c, d, e, f, g, h, i, j, k, l };
    logFunctionCall('generateBaseValues', {}, values);
    return values;
}

// Level-specific constraint generators
const levelConstraints = {
    generateLevel1Format1: () => {
        console.log('[DEBUG] Generating Level 1 Format 1');
        let values = generateBaseValues();
        values.a = values.b;  // reduces to 1
        values.c = values.d;  // reduces to 1
        values.e = 0;
        values.f = 1;  // no constant term on left
        values.g = values.h;  // reduces to 1
        values.i = 0;
        values.j = 1;  // no x term on right
        values.k = getRandomInteger(false);
        values.l = 1;
        logFunctionCall('generateLevel1Format1', {}, values);
        return values;
    },
    // ... [other level generators remain the same but with added logging]
};

// Main function to generate equation based on level and format
function generateEquationForLevel(level, format = 1) {
    console.log(`[DEBUG] generateEquationForLevel called with level=${level}, format=${format}`);
    
    let values;
    switch(level) {
        case 1:
            values = format === 1 ? levelConstraints.generateLevel1Format1() 
                                : levelConstraints.generateLevel1Format2();
            break;
        case 2:
            if (format === 1) values = levelConstraints.generateLevel2Format1();
            else if (format === 2) values = levelConstraints.generateLevel2Format2();
            else values = levelConstraints.generateLevel2Format3();
            break;
        case 3:
            values = levelConstraints.generateLevel3();
            break;
        case 4:
            values = format === 1 ? levelConstraints.generateLevel4Format1() 
                                : levelConstraints.generateLevel4Format2();
            break;
        case 5:
            values = levelConstraints.generateLevel5();
            break;
        default:
            values = generateBaseValues();
    }
    
    // Add final debug log before returning
    logFunctionCall('generateEquationForLevel final output', { level, format }, values);
    return values;
}

// Make sure all functions are available globally
window.generateEquationForLevel = generateEquationForLevel;
window.levelConstraints = levelConstraints;
window.getRandomInteger = getRandomInteger;
window.getRandomPair = getRandomPair;
window.generateBaseValues = generateBaseValues;
