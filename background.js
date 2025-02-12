// background.js
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = 1;
        this.element = document.createElement('div');
        this.element.className = 'cell s1';
        this.isMarked = false;
    }

    setState(newState) {
        if (this.isMarked && newState === 8) {
            newState = 7;
        }
        this.state = newState;
        this.element.className = `cell s${newState}`;
    }

    setMarked() {
        this.isMarked = true;
    }
}

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.gridElement = document.getElementById('background-container');
        this.iterationCount = 0;
        this.lowerBound = 0;
        this.upperBound = height - 1;
        this.isUpdating = true;
        this.initialize();
        this.markRandomCells();
        this.setupScrollHandling();
    }

    initialize() {
        // Clear any existing content
        this.gridElement.innerHTML = '';
        
        const gridDiv = document.createElement('div');
        gridDiv.id = 'grid';
        gridDiv.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.width}, 1fr);
            width: 100%;
            height: 360vh;
            gap: 0;
            position: fixed;
            top: 0;
            left: 0;
            will-change: transform;
            pointer-events: none;
            z-index: -1;
        `;
        this.gridElement.appendChild(gridDiv);
        
        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = new Cell(x, y);
                this.cells[y][x] = cell;
                gridDiv.appendChild(cell.element);
            }
        }
    }

    setupScrollHandling() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const grid = document.getElementById('grid');
        if (grid) {
            const translateY = -scrollPercentage * (360 * window.innerHeight - window.innerHeight);
            grid.style.transform = `translateY(${translateY}px)`;
        }
        this.updateBoundaries();
    }

    updateBoundaries() {
        const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const visibleCenter = Math.floor(this.height * scrollPercentage);
        const bufferSize = Math.ceil(window.innerHeight / 20);
        
        this.lowerBound = Math.max(0, visibleCenter - bufferSize);
        this.upperBound = Math.min(this.height - 1, visibleCenter + bufferSize);
    }

    getNeighbors(x, y, isDiagonal) {
        const neighbors = [];
        const directions = isDiagonal ? 
            [[-1, -1], [-1, 1], [1, -1], [1, 1]] :
            [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
                neighbors.push(this.cells[newY][newX]);
            }
        }
        return neighbors;
    }

    getTwoAboveCell(x, y) {
        return y >= 2 ? this.cells[y - 2][x] : null;
    }

    markRandomCells() {
        const targetMarkedCells = Math.floor(this.width * this.height * 0.1);
        let markedCount = 0;
        while (markedCount < targetMarkedCells) {
            const cell = this.cells[Math.floor(Math.random() * this.height)][Math.floor(Math.random() * this.width)];
            if (!cell.isMarked) {
                cell.setMarked();
                markedCount++;
            }
        }
    }

    hasInfectiousCells() {
        for (let y = this.lowerBound; y <= this.upperBound; y++) {
            if (this.cells[y].some(cell => cell.state >= 2 && cell.state <= 6)) {
                return true;
            }
        }
        return false;
    }

    allCellsInS1orS8() {
        for (let y = this.lowerBound; y <= this.upperBound; y++) {
            if (!this.cells[y].every(cell => cell.state === 1 || cell.state === 8)) {
                return false;
            }
        }
        return true;
    }

    update() {
        if (!this.isUpdating) return;
        
        this.iterationCount++;
        const newStates = Array(this.height).fill().map(() => Array(this.width).fill(null));

        for (let y = this.lowerBound; y <= this.upperBound; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                
                switch (cell.state) {
                    case 1:
                        if (this.allCellsInS1orS8()) {
                            newStates[y][x] = (y < this.upperBound - 10 && Math.random() < 1/180) ? 2 : 1;
                        } else if (this.hasInfectiousCells()) {
                            const directInfectious = this.getNeighbors(x, y, false)
                                .filter(n => n.state >= 2 && n.state <= 5).length;
                            const diagonalInfectious = this.getNeighbors(x, y, true)
                                .filter(n => n.state >= 2 && n.state <= 5).length;
                            const twoAbove = this.getTwoAboveCell(x, y);
                            
                            if ((directInfectious > 0 && Math.random() < 1/14) ||
                                (diagonalInfectious > 0 && Math.random() < 1/15) ||
                                (twoAbove?.state >= 2 && twoAbove?.state <= 4 && Math.random() < 1/12)) {
                                newStates[y][x] = 2;
                            } else {
                                newStates[y][x] = 1;
                            }
                        } else {
                            newStates[y][x] = 1;
                        }
                        break;
                    case 2: newStates[y][x] = 3; break;
                    case 3: newStates[y][x] = 4; break;
                    case 4: newStates[y][x] = 5; break;
                    case 5: newStates[y][x] = 6; break;
                    case 6: newStates[y][x] = 7; break;
                    case 7: newStates[y][x] = cell.isMarked ? 7 : 8; break;
                    case 8: newStates[y][x] = 8; break;
                    default: newStates[y][x] = cell.state;
                }
            }
        }

        for (let y = this.lowerBound; y <= this.upperBound; y++) {
            for (let x = 0; x < this.width; x++) {
                if (newStates[y][x] !== null) {
                    this.cells[y][x].setState(newStates[y][x]);
                }
            }
        }
    }

    startUpdating() {
        this.isUpdating = true;
    }

    stopUpdating() {
        this.isUpdating = false;
    }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .cell {
        aspect-ratio: 1;
        transition: background-color 0.3s ease;
    }

    .s1 { background-color: #f0f8ff; }
    .s2 { background-color: #f0f8ff; }
    .s3 { background-color: #e0ebf5; }
    .s4 { background-color: #d0e1f2; }
    .s5 { background-color: #c0d7ef; }
    .s6 { background-color: #d0e1f2; }
    .s7 { background-color: #e0ebf5; }
    .s8 { background-color: #f0f8ff; }

    #background-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
    }

    .container {
        position: relative;
        z-index: 1;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(5px);
        border-radius: 8px;
        margin: 20px auto;
    }
`;
document.head.appendChild(style);

// Initialize grid
const GRID_WIDTH = 36;
const GRID_HEIGHT = 360;

function initializeBackground() {
    const grid = new Grid(GRID_WIDTH, GRID_HEIGHT);
    
    let lastTime = 0;
    const targetInterval = 1000; // 1 second

    function updateLoop(currentTime) {
        if (currentTime - lastTime >= targetInterval) {
            grid.update();
            lastTime = currentTime;
        }
        requestAnimationFrame(updateLoop);
    }

    requestAnimationFrame(updateLoop);
}

// Start when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBackground);
} else {
    initializeBackground();
}
