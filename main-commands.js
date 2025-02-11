// main-commands.js
function processCommand(command) {
  // currentValues is accessed as a global variable
  if (!command || typeof command !== 'string') return false;
  
  // Determine which phase we're in
  const isPhase1 = evaluateFraction(currentValues.a, currentValues.b) !== 1 || 
                   evaluateFraction(currentValues.g, currentValues.h) !== 1;
  
  if (isPhase1) {
    return processPhase1Command(command, currentValues);
  } else {
    return processPhase2Command(command, currentValues);
  }
}
