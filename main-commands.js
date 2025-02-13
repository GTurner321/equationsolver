// main-commands.js
window.processCommand = function(command) {
    console.log('[DEBUG] Processing command in main-commands:', command);
    console.log('[DEBUG] Available global functions:', Object.keys(window).filter(key => typeof window[key] === 'function'));
    console.log('[DEBUG] processPhase1Command exists:', typeof window.processPhase1Command === 'function');
    
    // Validate command
    if (!command || typeof command !== 'string') {
        console.error('Invalid command:', command);
        return false;
    }
    
    // Log the current state of currentValues for debugging
    console.log('[DEBUG] Current Values at processCommand:', window.currentValues);
    
    // Validate currentValues
    if (!window.currentValues || typeof window.currentValues !== 'object') {
        console.error('currentValues is not properly initialized', window.currentValues);
        return false;
    }
    
    // Ensure all required properties exist
    const requiredProps = ['a', 'b', 'g', 'h', 'c', 'd', 'e', 'f', 'i', 'j', 'k', 'l'];
    const missingProps = requiredProps.filter(prop => typeof window.currentValues[prop] === 'undefined');
    
    if (missingProps.length > 0) {
        console.error('Missing required properties in currentValues:', missingProps);
        return false;
    }
    
    // Determine which phase we're in
    const isPhase1 = evaluateFraction(window.currentValues.a, window.currentValues.b) !== 1 || 
                     evaluateFraction(window.currentValues.g, window.currentValues.h) !== 1;
    
    try {
        if (isPhase1) {
            return window.processPhase1Command(command, window.currentValues);
        } else {
            return window.processPhase2Command(command, window.currentValues);
        }
    } catch (error) {
        console.error('Error processing command:', error);
        console.log('Current values at error:', window.currentValues);
        return false;
    }
}
