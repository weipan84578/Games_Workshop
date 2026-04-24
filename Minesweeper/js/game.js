const DIFFICULTY_SETTINGS = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
};

const CELL_STATES = {
    COVERED: 'covered',
    REVEALED: 'revealed',
    FLAGGED: 'flagged',
    QUESTIONED: 'questioned',
    EXPLODED: 'exploded'
};

class Game {
    constructor() {
        this.rows = 0;
        this.cols = 0;
        this.mineCount = 0;
        this.board = [];
        this.isFirstClick = true;
        this.gameState = 'ready'; // ready, playing, won, lost
        this.flagsPlaced = 0;
    }

    init(difficulty, customSettings = null) {
        const settings = difficulty === 'custom' ? customSettings : DIFFICULTY_SETTINGS[difficulty];
        this.rows = settings.rows;
        this.cols = settings.cols;
        this.mineCount = settings.mines;
        this.isFirstClick = true;
        this.gameState = 'ready';
        this.flagsPlaced = 0;
        this.createBoard();
    }

    createBoard() {
        this.board = Array.from({ length: this.rows }, (_, r) => 
            Array.from({ length: this.cols }, (_, c) => ({
                row: r,
                col: c,
                isMine: false,
                adjacentMines: 0,
                state: CELL_STATES.COVERED
            }))
        );
    }

    placeMines(startRow, startCol) {
        const forbidden = new Set();
        for (let r = startRow - 1; r <= startRow + 1; r++) {
            for (let c = startCol - 1; c <= startCol + 1; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    forbidden.add(`${r},${c}`);
                }
            }
        }

        const availableCells = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!forbidden.has(`${r},${c}`)) {
                    availableCells.push({ r, c });
                }
            }
        }

        for (let i = 0; i < this.mineCount && availableCells.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const { r, c } = availableCells.splice(randomIndex, 1)[0];
            this.board[r][c].isMine = true;
        }

        this.calculateAdjacentMines();
    }

    calculateAdjacentMines() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[r][c].isMine) continue;
                
                let count = 0;
                this.getNeighbors(r, c).forEach(neighbor => {
                    if (this.board[neighbor.r][neighbor.c].isMine) count++;
                });
                this.board[r][c].adjacentMines = count;
            }
        }
    }

    getNeighbors(r, c) {
        const neighbors = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    neighbors.push({ r: nr, c: nc });
                }
            }
        }
        return neighbors;
    }

    revealCell(r, c) {
        const cell = this.board[r][c];
        if (cell.state !== CELL_STATES.COVERED && cell.state !== CELL_STATES.QUESTIONED) return [];

        if (this.isFirstClick) {
            this.placeMines(r, c);
            this.isFirstClick = false;
            this.gameState = 'playing';
        }

        if (cell.isMine) {
            this.gameState = 'lost';
            cell.state = CELL_STATES.EXPLODED;
            return this.revealAllMines();
        }

        const revealed = [];
        this.floodFill(r, c, revealed);
        
        if (this.checkWin()) {
            this.gameState = 'won';
        }

        return revealed;
    }

    floodFill(r, c, revealed) {
        const queue = [{ r, c }];
        const cell = this.board[r][c];
        cell.state = CELL_STATES.REVEALED;
        revealed.push(cell);

        if (cell.adjacentMines > 0) return;

        while (queue.length > 0) {
            const curr = queue.shift();
            this.getNeighbors(curr.r, curr.c).forEach(n => {
                const neighbor = this.board[n.r][n.c];
                if (neighbor.state === CELL_STATES.COVERED || neighbor.state === CELL_STATES.QUESTIONED) {
                    if (!neighbor.isMine) {
                        neighbor.state = CELL_STATES.REVEALED;
                        revealed.push(neighbor);
                        if (neighbor.adjacentMines === 0) {
                            queue.push({ r: n.r, c: n.c });
                        }
                    }
                }
            });
        }
    }

    toggleFlag(r, c, questionMarkEnabled = true) {
        const cell = this.board[r][c];
        if (cell.state === CELL_STATES.REVEALED) return cell.state;

        if (cell.state === CELL_STATES.COVERED) {
            cell.state = CELL_STATES.FLAGGED;
            this.flagsPlaced++;
        } else if (cell.state === CELL_STATES.FLAGGED) {
            if (questionMarkEnabled) {
                cell.state = CELL_STATES.QUESTIONED;
            } else {
                cell.state = CELL_STATES.COVERED;
            }
            this.flagsPlaced--;
        } else if (cell.state === CELL_STATES.QUESTIONED) {
            cell.state = CELL_STATES.COVERED;
        }

        return cell.state;
    }

    chord(r, c) {
        const cell = this.board[r][c];
        if (cell.state !== CELL_STATES.REVEALED || cell.adjacentMines === 0) return [];

        const neighbors = this.getNeighbors(r, c);
        const flagCount = neighbors.filter(n => this.board[n.r][n.c].state === CELL_STATES.FLAGGED).length;

        if (flagCount === cell.adjacentMines) {
            const toReveal = neighbors.filter(n => 
                this.board[n.r][n.c].state === CELL_STATES.COVERED || 
                this.board[n.r][n.c].state === CELL_STATES.QUESTIONED
            );

            let revealed = [];
            for (const n of toReveal) {
                const results = this.revealCell(n.r, n.c);
                revealed = revealed.concat(results);
                if (this.gameState === 'lost') break;
            }
            return revealed;
        }
        return [];
    }

    revealAllMines() {
        const results = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.board[r][c];
                if (cell.isMine && cell.state !== CELL_STATES.FLAGGED) {
                    if (cell.state !== CELL_STATES.EXPLODED) {
                        cell.state = CELL_STATES.REVEALED;
                    }
                    results.push(cell);
                } else if (!cell.isMine && cell.state === CELL_STATES.FLAGGED) {
                    results.push({ ...cell, wrongFlag: true });
                }
            }
        }
        return results;
    }

    checkWin() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.board[r][c];
                if (!cell.isMine && cell.state !== CELL_STATES.REVEALED) {
                    return false;
                }
            }
        }
        return true;
    }

    getRemainingMines() {
        return this.mineCount - this.flagsPlaced;
    }
}

window.DIFFICULTY_SETTINGS = DIFFICULTY_SETTINGS;
window.CELL_STATES = CELL_STATES;
window.Game = Game;