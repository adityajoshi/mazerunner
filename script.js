const canvas = document.getElementById("mazeCanvas");
const pen = canvas.getContext("2d");

const playerColor = "red";
const endColor = "blue";
let cellSize, cols, rows;
let cells = [];

const player1 = { x: 0, y: 0 };
const end = {};

// Responsive maze size
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const logicalSize = Math.min(window.innerWidth * 0.9, 420);

    canvas.width = logicalSize * dpr;
    canvas.height = logicalSize * dpr;

    // Recalculate cell size and redraw if the game is already initialized
    if (cols) {
        cellSize = canvas.width / cols;
        draw();
    }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function setup() {
    const difficulty = document.getElementById("difficulty").value;
    let gridSize;

    switch (difficulty) {
        case "easy":
            gridSize = 10;
            break;
        case "medium":
            gridSize = 20;
            break;
        case "hard":
            gridSize = 30;
            break;
        default:
            gridSize = 10;
    }

    cols = gridSize;
    rows = gridSize;
    cellSize = canvas.width / cols;

    end.x = cols - 1;
    end.y = rows - 1;

    cells = [];
    for (let x = 0; x < cols; x++) {
        cells[x] = [];
        for (let y = 0; y < rows; y++) {
            cells[x][y] = new Cell(x, y);
        }
    }

    genMaze(0, 0);
    player1.x = 0;
    player1.y = 0;
    draw();
}


class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = { top: true, right: true, bottom: true, left: true };
    }

    show() {
        const x = this.x * cellSize;
        const y = this.y * cellSize;
        pen.beginPath();
        pen.strokeStyle = "#4e6227";
        pen.lineWidth = 3;

        if (this.walls.top) {
            pen.moveTo(x, y);
            pen.lineTo(x + cellSize, y);
        }
        if (this.walls.right) {
            pen.moveTo(x + cellSize, y);
            pen.lineTo(x + cellSize, y + cellSize);
        }
        if (this.walls.bottom) {
            pen.moveTo(x + cellSize, y + cellSize);
            pen.lineTo(x, y + cellSize);
        }
        if (this.walls.left) {
            pen.moveTo(x, y + cellSize);
            pen.lineTo(x, y);
        }
        pen.stroke();
    }
}

function randomize(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function genMaze(x, y) {
    const cell = cells[x][y];
    cell.visited = true;
    const dirs = randomize(["top", "right", "bottom", "left"]);

    for (const dir of dirs) {
        const dx = { top: 0, right: 1, bottom: 0, left: -1 }[dir];
        const dy = { top: -1, right: 0, bottom: 1, left: 0 }[dir];
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            const ncell = cells[nx][ny];
            if (!ncell.visited) {
                cell.walls[dir] = false;
                ncell.walls[
                    { top: "bottom", right: "left", bottom: "top", left: "right" }[
                    dir
                    ]
                ] = false;
                genMaze(nx, ny);
            }
        }
    }
}

function clearScreen() {
    pen.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clearScreen();
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            cells[x][y].show();
        }
    }
    drawEnd();
    drawPlayer();
}

function drawPlayer() {
    const x = player1.x * cellSize + cellSize / 2;
    const y = player1.y * cellSize + cellSize / 2;
    pen.beginPath();
    pen.arc(x, y, cellSize / 4, 0, 2 * Math.PI);
    pen.fillStyle = playerColor;
    pen.fill();
}

function drawEnd() {
    const x = end.x * cellSize + cellSize / 2;
    const y = end.y * cellSize + cellSize / 2;
    pen.beginPath();
    pen.arc(x, y, cellSize / 4, 0, 2 * Math.PI);
    pen.fillStyle = endColor;
    pen.fill();
}

function movePlayer(dir) {
    const cell = cells[player1.x][player1.y];
    switch (dir) {
        case "ArrowUp":
            if (player1.y > 0 && !cell.walls.top) player1.y--;
            break;
        case "ArrowDown":
            if (player1.y < rows - 1 && !cell.walls.bottom) player1.y++;
            break;
        case "ArrowLeft":
            if (player1.x > 0 && !cell.walls.left) player1.x--;
            break;
        case "ArrowRight":
            if (player1.x < cols - 1 && !cell.walls.right) player1.x++;
            break;
    }
    checkWin();
    draw();
}

function checkWin() {
    if (player1.x === end.x && player1.y === end.y) {
        const msg = document.querySelector(".msgbox");
        msg.innerHTML = "<h2>You Won!</h2><button onclick='restart()'>Play Again</button>";
        msg.style.visibility = "visible";
    }
}

function restart() {
    document.querySelector(".msgbox").style.visibility = "hidden";
    player1.x = 0;
    player1.y = 0;
    setup();
}

document.querySelector(".startbtn").addEventListener("click", setup);
document.addEventListener("keydown", (e) => movePlayer(e.key));

document.getElementById("btnUp").addEventListener("click", () => movePlayer("ArrowUp"));
document.getElementById("btnDown").addEventListener("click", () => movePlayer("ArrowDown"));
document.getElementById("btnLeft").addEventListener("click", () => movePlayer("ArrowLeft"));
document.getElementById("btnRight").addEventListener("click", () => movePlayer("ArrowRight"));

setup();
