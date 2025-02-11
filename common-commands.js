// common-commands.js
function areEquivalentFractions(n1, d1, n2, d2) {
  const absN1 = Math.abs(n1);
  const absD1 = Math.abs(d1);
  const absN2 = Math.abs(n2);
  const absD2 = Math.abs(d2);
  
  const r1 = absN2 / absN1;
  const r2 = absD2 / absD1;
  
  return Math.abs(r1 - r2) < 1e-10;
}

function updateIfEquivalent(num, den, n, m, p, q) {
  if (areEquivalentFractions(Math.abs(num), Math.abs(den), n, m)) {
    const sign = Math.sign(num);
    return [sign * p, q];
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
    
    // Convert strings to numbers
    const nVal = parseInt(n);
    const mVal = parseInt(m);
    const pVal = parseInt(p);
    const qVal = parseInt(q);
    
    // Calculate effective signs
    const leftNegative = (sign1 === '-') !== (sign2 === '-');
    const rightNegative = (sign3 === '-') !== (sign4 === '-');
    
    // Apply the transformation to all fraction pairs
    [currentValues.a, currentValues.b] = updateIfEquivalent(
      currentValues.a, currentValues.b, 
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.c, currentValues.d] = updateIfEquivalent(
      currentValues.c, currentValues.d,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.e, currentValues.f] = updateIfEquivalent(
      currentValues.e, currentValues.f,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.g, currentValues.h] = updateIfEquivalent(
      currentValues.g, currentValues.h,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.i, currentValues.j] = updateIfEquivalent(
      currentValues.i, currentValues.j,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    [currentValues.k, currentValues.l] = updateIfEquivalent(
      currentValues.k, currentValues.l,
      leftNegative ? -nVal : nVal, mVal,
      rightNegative ? -pVal : pVal, qVal
    );
    
    return true;
  }
  
  // Handle n/m=p format (convert to n/m=p/1)
  else if ((match = command.match(fractionToIntFormat))) {
    const [, sign1, n, sign2, m, sign3, p] = match;
    return processFractionEquality(
      `${sign1}${n}/${sign2}${m}=${sign3}${p}/1`
    );
  }
  
  // Handle n=p/q format (convert to n/1=p/q)
  else if ((match = command.match(intToFractionFormat))) {
    const [, sign1, n, sign2, p, sign3, q] = match;
    return processFractionEquality(
      `${sign1}${n}/1=${sign2}${p}/${sign3}${q}`
    );
  }
  
  return false;
}

