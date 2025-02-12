// Add the cell styles to document
const style = document.createElement('style');
style.textContent = `
    .cell {
        aspect-ratio: 1;
        transition: background-color 0.3s ease;
    }

    /* State colors matching original implementation */
    .s1 { background-color: #f0f8ff; } /* Background */
    .s2 { background-color: #f0f8ff; } /* Background */
    .s3 { background-color: #e0ebf5; } /* Light blue */
    .s4 { background-color: #d0e1f2; } /* Slightly darker */
    .s5 { background-color: #c0d7ef; } /* Slightly darker still */
    .s6 { background-color: #d0e1f2; } /* Same as S4 */
    .s7 { background-color: #e0ebf5; } /* Same as old S6 */
    .s8 { background-color: #f0f8ff; } /* Background */
`;
document.head.appendChild(style);

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
        this.initialize();
        this.markRandomCells();
    }

    initialize() {
        const gridDiv = document.createElement('div');
        gridDiv.id = 'grid';
        gridDiv.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.width}, 1fr);
            width: 100%;
            height: 360vh;
            gap: 0;
            position: absolute;
            top: 0;
            left: 0;
            transform: translateY(0);
            will-change: transform;
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

    getRandomCell() {
        const y = Math.floor(Math.random() * this.height);
        const x = Math.floor(Math.random() * this.width);
        return this.cells[y][x];
    }

    markRandomCells() {
        let markedCount = 0;
        const targetMarkedCells = Math.floor(this.width * this.height * 0.1); // 10% of cells
        while (markedCount < targetMarkedCells) {
            const cell = this.getRandomCell();
            if (!cell.isMarked) {
                cell.setMarked();
                markedCount++;
            }
        }
    }

    updateBoundaries() {
        // Calculate visible area based on scroll position
        const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const visibleCenter = Math.floor(this.height * scrollPercentage);
        
        // Update bounds to focus on visible area plus buffer
        const bufferSize = Math.ceil(window.innerHeight / 20); // Adjust based on cell size
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
        if (y >= 2) {
            return this.cells[y - 2][x];
        }
        return null;
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
        this.iterationCount++;
        this.updateBoundaries();

        const newStates = Array(this.height).fill().map(() => Array(this.width).fill(null));

        for (let y = this.lowerBound; y <= this.upperBound; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.cells[y][x];
                
                switch (cell.state) {
                    case 1:
                        if (this.allCellsInS1orS8()) {
                            if (y < this.upperBound - 10) {
                                newStates[y][x] = Math.random() < 1/180 ? 2 : 1;
                            } else {
                                newStates[y][x] = 1;
                            }
                        } else if (this.hasInfectiousCells()) {
                            const directInfectiousNeighbors = this.getNeighbors(x, y, false)
                                .filter(n => n.state >= 2 && n.state <= 5);
                            
                            const diagonalInfectiousNeighbors = this.getNeighbors(x, y, true)
                                .filter(n => n.state >= 2 && n.state <= 5);
                            
                            const twoAboveCell = this.getTwoAboveCell(x, y);
                            const isTwoAboveInfectious = twoAboveCell && 
                                twoAboveCell.state >= 2 && twoAboveCell.state <= 4;

                            if (directInfectiousNeighbors.length > 0 && Math.random() < 1/14) {
                                newStates[y][x] = 2;
                            } else if (diagonalInfectiousNeighbors.length > 0 && Math.random() < 1/15) {
                                newStates[y][x] = 2;
                            } else if (isTwoAboveInfectious && Math.random() < 1/12) {
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

        // Update states for cells in visible range
        for (let y = this.lowerBound; y <= this.upperBound; y++) {
            for (let x = 0; x < this.width; x++) {
                if (newStates[y][x] !== null) {
                    this.cells[y][x].setState(newStates[y][x]);
                }
            }
        }
    }
}

// Initialize the grid with specified dimensions
const GRID_WIDTH = 36;
const GRID_HEIGHT = 360;

function initializeBackground() {
    const grid = new Grid(GRID_WIDTH, GRID_HEIGHT);
    
    // Start update loop
    setInterval(() => grid.update(), 1000);
}

// Start the background when the document is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBackground);
} else {
    initializeBackground();
}
