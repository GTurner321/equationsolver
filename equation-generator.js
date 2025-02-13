// Global state for current values
window.currentValues = {};

// Utility functions for equation generation
function evaluateFraction(num, den) {
    if (den === 0) return undefined;
    return num / den;
}

function getRandomInteger(includeZero = true) {
    let value;
    do {
        value = Math.floor(Math.random() * 21) - 10;
    } while (!includeZero && value === 0);
    console.log(`Generated random integer: ${value} (includeZero: ${includeZero})`);
    return value;
}

function getRandomPair() {
    let numerator = getRandomInteger(false);
    let denominator = getRandomInteger(false);
    if (denominator < 0) {
        numerator = -numerator;
        denominator = -denominator;
    }
    console.log(`Generated random pair: ${numerator}/${denominator}`);
    return [numerator, denominator];
}

function generateBaseValues() {
    console.log('Generating base values...');
    let [a, b] = getRandomPair();
    let [c, d] = getRandomPair();
    let [e, f] = getRandomPair();
    let [g, h] = getRandomPair();
    let [i, j] = getRandomPair();
    let [k, l] = getRandomPair();
    
    // Ensure c/d ≠ i/j to avoid x terms canceling
    while ((c * j) === (i * d)) {
        console.log('Regenerating i,j pair due to equality with c,d');
        [i, j] = getRandomPair();
    }
    
    return { a, b, c, d, e, f, g, h, i, j, k, l };
}

// Level-specific constraint generators
const levelConstraints = {
    // Level 1: Simple equations like "4x = 10" or "x + 7 = 12"
    generateLevel1Format1: () => {
        console.log('Generating Level 1 Format 1 (ax = k)');
        let values = generateBaseValues();
        // Format: 4x = 10
        values.a = values.b; // reduces to 1
        values.c = values.d; // reduces to 1
        values.e = 0;
        values.f = 1; // no constant term on left
        values.g = values.h; // reduces to 1
        values.i = 0;
        values.j = 1; // no x term on right
        values.k = getRandomInteger(false);
        values.l = 1;
        return values;
    },

    generateLevel1Format2: () => {
        console.log('Generating Level 1 Format 2 (x + a = k)');
        let values = generateBaseValues();
        // Format: x + 7 = 12
        values.a = values.b = values.c = values.d = 1; // coefficient of x is 1
        values.e = getRandomInteger(false);
        values.f = 1;
        values.g = values.h = 1; // reduces to 1
        values.i = 0;
        values.j = 1; // no x term on right
        values.k = getRandomInteger(false);
        values.l = 1;
        return values;
    },

    // Level 2: Equations with integer coefficients and constants
    generateLevel2Format1: () => {
        console.log('Generating Level 2 Format 1 (ax + b = k)');
        let values = generateBaseValues();
        // Format: 3x + 1 = 13
        values.a = values.b; // reduces to 1
        values.c = getRandomInteger(false); // integer coefficient
        values.d = 1;
        values.e = getRandomInteger(); // integer constant
        values.f = 1;
        values.g = values.h; // reduces to 1
        values.i = 0;
        values.j = 1; // no x term on right
        values.k = getRandomInteger(false);
        values.l = 1;
        return values;
    },

    generateLevel2Format2: () => {
        console.log('Generating Level 2 Format 2 (x/a + b = k)');
        let values = generateBaseValues();
        // Format: x/4 + 6 = 10
        values.a = values.b; // reduces to 1
        values.c = 1;
        values.d = getRandomInteger(false); // non-zero integer denominator
        values.e = getRandomInteger(); // integer constant
        values.f = 1;
        values.g = values.h; // reduces to 1
        values.i = 0;
        values.j = 1; // no x term on right
        values.k = getRandomInteger(false);
        values.l = 1;
        return values;
    },

    generateLevel2Format3: () => {
        console.log('Generating Level 2 Format 3 (a(x + b) = k)');
        let values = generateBaseValues();
        // Format: 4(x + 2) = 15
        values.a = values.b; // reduces to 1
        values.c = values.d = 1; // coefficient inside parentheses is 1
        values.e = getRandomInteger(); // integer constant inside parentheses
        values.f = 1;
        values.g = values.h; // reduces to 1
        values.i = 0;
        values.j = 1; // no x term on right
        values.k = getRandomInteger(false);
        values.l = 1;
        return values;
    },

    // Level 3: Equations with variables on both sides
    generateLevel3: () => {
        console.log('Generating Level 3 (ax + b = cx + d)');
        let values = generateBaseValues();
        // Format: 2x + 10 = 3x + 2
        values.a = values.b; // reduces to 1
        values.c = getRandomInteger(false); // left coefficient integer
        values.d = 1;
        values.e = getRandomInteger(); // left constant integer
        values.f = 1;
        values.g = values.h; // reduces to 1
        do {
            values.i = getRandomInteger(false); // right coefficient integer
            values.j = 1;
        } while ((values.c / values.d) === (values.i / values.j)); // ensure x terms don't cancel
        values.k = getRandomInteger(); // right constant integer
        values.l = 1;
        return values;
    },

    // Level 4: Complex expressions with parentheses and fractions
    generateLevel4Format1: () => {
        console.log('Generating Level 4 Format 1 (a(bx + c) = d(ex + f))');
        let values = generateBaseValues();
        // Format: 5(3x + 1) = 4(4x - 1)
        values.a = values.b; // reduces to 1
        values.c = getRandomInteger(false); // integer
        values.d = 1;
        values.e = getRandomInteger(); // integer
        values.f = 1;
        values.g = values.h; // reduces to 1
        do {
            values.i = getRandomInteger(false); // integer
            values.j = 1;
        } while ((values.c / values.d) === (values.i / values.j)); // ensure x terms don't cancel
        values.k = getRandomInteger(); // integer
        values.l = 1;
        return values;
    },

    generateLevel4Format2: () => {
        console.log('Generating Level 4 Format 2 (a/b(cx + d) = ex + f)');
        let values = generateBaseValues();
        // Format: 5/2(3x + 1) = 4x - 1
        [values.a, values.b] = getRandomPair(); // fraction allowed
        values.c = getRandomInteger(false); // integer
        values.d = 1;
        values.e = getRandomInteger(); // integer
        values.f = 1;
        values.g = values.h; // reduces to 1
        do {
            values.i = getRandomInteger(false); // integer
            values.j = 1;
        } while (((values.a * values.c) / (values.b * values.d)) === (values.i / values.j));
        values.k = getRandomInteger(); // integer
        values.l = 1;
        return values;
    },

    // Level 5: Fully general form with fractions everywhere
    generateLevel5: () => {
        console.log('Generating Level 5 (fully general form)');
        let values = generateBaseValues();
        // Ensure no numerators are zero
        while (values.a === 0 || values.c === 0 || values.e === 0 || 
               values.g === 0 || values.i === 0 || values.k === 0) {
            values = generateBaseValues();
        }
        return values;
    }
};

// Main function to generate equation based on level and format
function generateNewEquation(level = 1, format = 1) {
    console.log(`Generating new equation for level ${level}, format ${format}`);
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
    return simplifyAllFractions(values);
}

// Helper function to simplify fractions
function simplifyAllFractions(values) {
    console.log('Simplifying all fractions:', values);
    let simplified = {...values};
    // ... any fraction simplification logic here ...
    return simplified;
}

// Export all necessary functions to window object
window.generateNewEquation = generateNewEquation;
window.simplifyAllFractions = simplifyAllFractions;
window.evaluateFraction = evaluateFraction;
window.currentValues = currentValues;
