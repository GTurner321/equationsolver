// Level-specific constraint generators
const levelConstraints = {
  // Level 1 constraints
  generateLevel1Format1: () => {
    let values = generateBaseValues();
    // Format: 4x = 10
    values.a = values.b;  // reduces to 1
    values.c = values.d;  // reduces to 1
    values.e = values.f = 0;  // no constant term on left
    values.g = values.h;  // reduces to 1
    values.i = values.j = 0;  // no x term on right
    // Ensure k/l is non-zero integer
    do {
      values.k = getRandomInteger(false);
      values.l = 1;
    } while (values.k === 0);
    return values;
  },

  generateLevel1Format2: () => {
    let values = generateBaseValues();
    // Format: x + 7 = 12
    values.a = values.b = values.c = values.d = 1;  // coefficient of x is 1
    // e/f is non-zero integer
    values.e = getRandomInteger(false);
    values.f = 1;
    values.g = values.h;  // reduces to 1
    values.i = values.j = 0;  // no x term on right
    // k/l is non-zero integer
    values.k = getRandomInteger(false);
    values.l = 1;
    return values;
  },

  // Level 2 constraints
  generateLevel2Format1: () => {
    let values = generateBaseValues();
    // Format: 3x + 1 = 13
    values.a = values.b;  // reduces to 1
    values.c = getRandomInteger(false);  // integer coefficient
    values.d = 1;
    values.e = getRandomInteger();  // integer constant
    values.f = 1;
    values.g = values.h;  // reduces to 1
    values.i = values.j = 0;  // no x term on right
    values.k = getRandomInteger(false);  // non-zero integer
    values.l = 1;
    return values;
  },

  generateLevel2Format2: () => {
    let values = generateBaseValues();
    // Format: x/4 + 6 = 10
    values.a = values.b;  // reduces to 1
    values.c = 1;
    values.d = getRandomInteger(false);  // non-zero integer denominator
    values.e = getRandomInteger();  // integer constant
    values.f = 1;
    values.g = values.h;  // reduces to 1
    values.i = values.j = 0;  // no x term on right
    values.k = getRandomInteger(false);
    values.l = 1;
    return values;
  },

  generateLevel2Format3: () => {
    let values = generateBaseValues();
    // Format: 4(x + 2) = 15
    values.a = values.b;  // reduces to 1
    values.c = values.d = 1;  // coefficient inside parentheses is 1
    values.e = getRandomInteger();  // integer constant inside parentheses
    values.f = 1;
    values.g = values.h;  // reduces to 1
    values.i = values.j = 0;  // no x term on right
    values.k = getRandomInteger(false);
    values.l = 1;
    return values;
  },

  // Level 3 constraints
  generateLevel3: () => {
    let values = generateBaseValues();
    // Format: 2x + 10 = 3x + 2
    values.a = values.b;  // reduces to 1
    values.c = getRandomInteger(false);  // left coefficient integer
    values.d = 1;
    values.e = getRandomInteger();  // left constant integer
    values.f = 1;
    values.g = values.h;  // reduces to 1
    do {
      values.i = getRandomInteger(false);  // right coefficient integer
      values.j = 1;
    } while ((values.c / values.d) === (values.i / values.j));  // ensure x terms don't cancel
    values.k = getRandomInteger();  // right constant integer
    values.l = 1;
    return values;
  },

  // Level 4 constraints
  generateLevel4Format1: () => {
    let values = generateBaseValues();
    // Format: 5(3x + 1) = 4(4x - 1)
    values.a = values.b;  // reduces to 1
    values.c = getRandomInteger(false);  // integer
    values.d = 1;
    values.e = getRandomInteger();  // integer
    values.f = 1;
    values.g = values.h;  // reduces to 1
    do {
      values.i = getRandomInteger(false);  // integer
      values.j = 1;
    } while ((values.c / values.d) === (values.i / values.j));  // ensure x terms don't cancel
    values.k = getRandomInteger();  // integer
    values.l = 1;
    return values;
  },

  generateLevel4Format2: () => {
    let values = generateBaseValues();
    // Format: 5/2(3x + 1) = 4x - 1
    [values.a, values.b] = getRandomPair();  // fraction allowed
    values.c = getRandomInteger(false);  // integer
    values.d = 1;
    values.e = getRandomInteger();  // integer
    values.f = 1;
    values.g = values.h;  // reduces to 1
    do {
      values.i = getRandomInteger(false);  // integer
      values.j = 1;
    } while (((values.a * values.c) / (values.b * values.d)) === (values.i / values.j));
    values.k = getRandomInteger();  // integer
    values.l = 1;
    return values;
  },

  // Level 5 constraints
  generateLevel5: () => {
    let values = generateBaseValues();
    // Ensure no numerators are zero
    while (values.a === 0 || values.c === 0 || values.e === 0 || 
           values.g === 0 || values.i === 0 || values.k === 0) {
      values = generateBaseValues();
    }
    return values;
  }
};

// Function to generate equation based on level and format
function generateEquationForLevel(level, format = 1) {
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

window.generateEquationForLevel = generateEquationForLevel;
window.levelConstraints = levelConstraints;
