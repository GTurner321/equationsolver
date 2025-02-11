// game-end.js

function checkWinCondition(values) {
  // Check if we're in phase 2 first
  const isPhase2 = evaluateFraction(values.a, values.b) === 1 && 
                   evaluateFraction(values.g, values.h) === 1;
  
  if (!isPhase2) return null;

  // Check first win condition: c=d=1 and e=i=0
  if (values.c === 1 && values.d === 1 && values.e === 0 && values.i === 0) {
    return {
      won: true,
      solution: evaluateFraction(values.k, values.l)
    };
  }
  
  // Check second win condition: i=j=1 and c=k=0
  if (values.i === 1 && values.j === 1 && values.c === 0 && values.k === 0) {
    return {
      won: true,
      solution: evaluateFraction(values.e, values.f)
    };
  }
  
  return null;
}

function formatSolution(value) {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  // Format decimal numbers to a reasonable precision
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function displayWinMessage(solution) {
  const historyContainer = document.getElementById('history-container');
  const winMessage = document.createElement('div');
  winMessage.className = 'win-message';
  winMessage.innerHTML = `
    <div class="congratulations">
      Well done! You have solved the equation. x=${formatSolution(solution)}
    </div>
  `;
  historyContainer.appendChild(winMessage);
}
