// phase1-commands.js
function processPhase1Command(command, currentValues) {
  // Try fraction equality command first (from common-commands.js)
  if (processFractionEquality(command, currentValues)) {
    return true;
  }
