// equation-generator.js - Handles equation generation and value management

// Global state for current values
window.currentValues = {};

// Utility functions for equation generation
function evaluateFraction(num, den) {
    if (den === 0) {
        console.error('Cannot evaluate fraction with zero denominator');
        return undefined;
    }
    return num / den;
}

function getRandomInteger(includeZero = true) {
    let value;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
        value = Math.floor(Math.random() * 21) - 10;
        attempts++;
        if (attempts > maxAttempts) {
            console.error('Failed to generate valid random integer');
            return includeZero ? 0 : 1;
        }
    } while (!includeZero && value === 0);
    
    console.log(`Generated random integer: ${value} (includeZero: ${includeZero})`);
    return value;
}

function getRandomPair() {
    let numerator = getRandomInteger(false);  // Never include zero
    let denominator = getRandomInteger(false);  // Never include zero
    
    // Ensure denominator is positive
    if (denominator < 0) {
        numerator = -numerator;
        denominator = -denominator;
    }
    
    console.log(`Generated random pair: ${numerator}/${denominator}`);
    return [numerator, denominator];
}

function generateBaseValues() {
    console.log('Generating base values...');
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        let [a, b] = getRandomPair();
        let [c, d] = getRandomPair();
        let [e, f] = getRandomPair();
        let [g, h] = getRandomPair();
        let [i, j] = getRandomPair();
        let [k, l] = getRandomPair();
        
        // Ensure c/d ≠ i/j to avoid x terms canceling
        if ((c * j) !== (i * d)) {
            const values = { a, b, c, d, e, f, g, h, i, j, k, l };
            console.log('Generated base values:', values);
            return values;
        }
        attempts++;
    }
    
    console.error('Could not generate valid base values after', maxAttempts, 'attempts');
    return null;
}

// Fraction simplification functions
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function simplifyFraction(numerator, denominator) {
    if (denominator === 0) {
        console.error('Cannot simplify fraction with zero denominator');
        return [numerator, 1];
    }
    
    if (numerator === 0) {
        return [0, 1];  // Always return 0/1 for zero numerator
    }
    
    // Make sure negative sign is in numerator
    if (denominator < 0) {
        numerator = -numerator;
        denominator = -denominator;
    }
    
    const divisor = gcd(numerator, denominator);
    return [numerator / divisor, denominator / divisor];
}

function simplifyAllFractions(values) {
    if (!values) {
        console.error('Cannot simplify null values');
        return null;
    }
    
    console.log('Simplifying all fractions:', values);
    let simplified = {...values};
    [simplified.a, simplified.b] = simplifyFraction(simplified.a, simplified.b);
    [simplified.c, simplified.d] = simplifyFraction(simplified.c, simplified.d);
    [simplified.e, simplified.f] = simplifyFraction(simplified.e, simplified.f);
    [simplified.g, simplified.h] = simplifyFraction(simplified.g, simplified.h);
    [simplified.i, simplified.j] = simplifyFraction(simplified.i, simplified.j);
    [simplified.k, simplified.l] = simplifyFraction(simplified.k, simplified.l);
    
    console.log('Simplified fractions:', simplified);
    return simplified;
}

// Level-specific constraint generators
const levelConstraints = {
    // Level 1: Simple equations like "4x = 10" or "x + 7 = 12"
    generateLevel1Format1: () => {
        console.log('Generating Level 1 Format 1 (ax = k)');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = 1;  // outer coefficient
        values.b = 1;
        values.c = getRandomInteger(false);  // coefficient of x
        values.d = 1;
        values.e = 0;  // no constant term
        values.f = 1;
        values.g = 1;  // right side has no x term
        values.h = 1;
        values.i = 0;
        values.j = 1;
        values.k = getRandomInteger(false);  // right side constant
        values.l = 1;
        
        return values;
    },

    generateLevel1Format2: () => {
        console.log('Generating Level 1 Format 2 (x + a = k)');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = 1;
        values.b = 1;
        values.c = 1;  // coefficient of x is 1
        values.d = 1;
        values.e = getRandomInteger(false);  // constant term
        values.f = 1;
        values.g = 1;
        values.h = 1;
        values.i = 0;  // no x term on right
        values.j = 1;
        values.k = getRandomInteger(false);  // right side constant
        values.l = 1;
        
        return values;
    },

    // Level 2: Equations with integer coefficients and constants
    generateLevel2Format1: () => {
        console.log('Generating Level 2 Format 1 (ax + b = k)');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = 1;
        values.b = 1;
        values.c = getRandomInteger(false);  // integer coefficient
        values.d = 1;
        values.e = getRandomInteger();  // integer constant
        values.f = 1;
        values.g = 1;
        values.h = 1;
        values.i = 0;  // no x term on right
        values.j = 1;
        values.k = getRandomInteger(false);  // right side constant
        values.l = 1;
        
        return values;
    },

    generateLevel2Format2: () => {
        console.log('Generating Level 2 Format 2 (x/a + b = k)');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = 1;
        values.b = 1;
        values.c = 1;
        values.d = getRandomInteger(false);  // non-zero integer denominator
        values.e = getRandomInteger();  // integer constant
        values.f = 1;
        values.g = 1;
        values.h = 1;
        values.i = 0;  // no x term on right
        values.j = 1;
        values.k = getRandomInteger(false);  // right side constant
        values.l = 1;
        
        return values;
    },

    generateLevel2Format3: () => {
        console.log('Generating Level 2 Format 3 (a(x + b) = k)');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = getRandomInteger(false);  // outer coefficient
        values.b = 1;
        values.c = 1;  // coefficient inside parentheses is 1
        values.d = 1;
        values.e = getRandomInteger();  // constant inside parentheses
        values.f = 1;
        values.g = 1;
        values.h = 1;
        values.i = 0;  // no x term on right
        values.j = 1;
        values.k = getRandomInteger(false);  // right side constant
        values.l = 1;
        
        return values;
    },

    // Level 3: Equations with variables on both sides
    generateLevel3: () => {
        console.log('Generating Level 3 (ax + b = cx + d)');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = 1;
        values.b = 1;
        values.c = getRandomInteger(false);  // left coefficient integer
        values.d = 1;
        values.e = getRandomInteger();  // left constant integer
        values.f = 1;
        values.g = 1;
        values.h = 1;
        values.i = getRandomInteger(false);  // right coefficient integer
        values.j = 1;
        values.k = getRandomInteger();  // right constant integer
        values.l = 1;
        
        // Ensure x terms don't cancel
        while ((values.c / values.d) === (values.i / values.j)) {
            values.i = getRandomInteger(false);
        }
        
        return values;
    },

    // Level 4: Complex expressions with parentheses and fractions
    generateLevel4Format1: () => {
        console.log('Generating Level 4 Format 1 (a(bx + c) = d(ex + f))');
        let values = generateBaseValues();
        if (!values) return null;
        
        values.a = getRandomInteger(false);  // left outer coefficient
        values.b = 1;
        values.c = getRandomInteger(false);  // left inner x coefficient
        values.d = 1;
        values.e = getRandomInteger();  // left inner constant
        values.f = 1;
        values.g = getRandomInteger(false);  // right outer coefficient
        values.h = 1;
        values.i = getRandomInteger(false);  // right inner x coefficient
        values.j = 1;
        values.k = getRandomInteger();  // right inner constant
        values.l = 1;
        
        return values;
    },

    generateLevel4Format2: () => {
        console.log('Generating Level 4 Format 2 (a/b(cx + d) = ex + f)');
        let values = generateBaseValues();
        if (!values) return null;
        
        [values.a, values.b] = getRandomPair();  // fraction coefficient
        values.c = getRandomInteger(false);  // inner x coefficient
        values.d = 1;
        values.e = getRandomInteger();  // inner constant
        values.f = 1;
        values.g = 1;
        values.h = 1;
        values.i = getRandomInteger(false);  // right x coefficient
        values.j = 1;
        values.k = getRandomInteger();  // right constant
        values.l = 1;
        
        return values;
    },

    // Level 5: Fully general form with fractions everywhere
    generateLevel5: () => {
        console.log('Generating Level 5 (fully general form)');
        let values = generateBaseValues();
        if (!values) return null;
        
        // Ensure no numerators are zero
        while (values.a === 0 || values.c === 0 || values.e === 0 || 
               values.g === 0 || values.i === 0 || values.k === 0) {
            values = generateBaseValues();
            if (!values) return null;
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
    
    if (!values) {
        console.error('Failed to generate equation values');
        return null;
    }
    
    const simplified = simplifyAllFractions(values);
    window.currentValues = simplified;  // Store the current values
    return simplified;
}

// Export all necessary functions to window object
Object.assign(window, {
    generateNewEquation,
    gcd,
    simplifyFraction,
    simplifyAllFractions,
    evaluateFraction,
    currentValues,
    getRandomInteger,
    getRandomPair,
    generateBaseValues
});
