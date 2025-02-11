// main-commands.js (new main command processing file)
function processCommand(command, currentValues) {
  // Determine which phase we're in
  const isPhase1 = evaluateFraction(currentValues.a, currentValues.b) !== 1 || 
                   evaluateFraction(currentValues.g, currentValues.h) !== 1;
  
  if (isPhase1) {
    return processPhase1Command(command, currentValues);
  } else {
    return processPhase2Command(command, currentValues);
  }
}
