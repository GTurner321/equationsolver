// common-commands.js
function evaluateFraction(num, den) {
  return num / den;
}

function areEquivalentFractions(n1, d1, n2, d2) {
  // Handle zero cases
  if (n1 === 0 && n2 === 0) return true;
  if (n1 === 0 || n2 === 0) return false;

  const absN1 = Math.abs(n1);
  const absD1 = Math.abs(d1);
  const absN2 = Math.abs(n2);
  const absD2 = Math.abs(d2);
  
  // Cross multiply to avoid division
  return Math.abs(absN1 * absD2 - absN2 * absD1) < 1e-10;
}

function updateIfEquivalent(num, den, n, m, p, q) {
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
    
    if (mVal === 0 || qVal === 0) return false; // Prevent division by zero
    
    // Calculate effective signs - combine multiple signs properly
    const leftNegative = ((sign1 === '-') !== (sign2 === '-'));
    const rightNegative = ((sign3 === '-') !== (sign4 === '-'));
    
    // Create arrays for all value pairs to make the code more maintainable
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
  
  return false;
}
