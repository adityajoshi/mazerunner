const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const timerDisplay = document.getElementById('timer');

canvas.width = 600;
canvas.height = 400;

const cellSize = 20;
const cols = canvas.width / cellSize;
const rows = canvas.height / cellSize;
let maze = [];
let player = { x: 0, y: 0 };
let startTime, timerInterval;

// Maze Generation using DFS
function generateMaze() {
    maze = new Array(rows).fill(0).map(() => new Array(cols).fill(1));
    const stack = [];
    let current = { x: 0, y: 0 };
    maze[current.y][current.x] = 0;
    stack.push(current);

    while (stack.length > 0) {
        const neighbors = getNeighbors(current);
        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[next.y][next.x] = 0;
            maze[(next.y + current.y) / 2][(next.x + current.x) / 2] = 0;
            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }
}

function getNeighbors(cell) {
    const directions = [
        { x: -2, y: 0 }, // Left
        { x: 2, y: 0 },  // Right
        { x: 0, y: -2 }, // Up
        { x: 0, y: 2 }   // Down
    ];
    return directions
        .map(d => ({ x: cell.x + d.x, y: cell.y + d.y }))
        .filter(n => n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows && maze[n.y][n.x] === 1);
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();
        if (player.x === cols - 1 && player.y === rows - 1) {
            clearInterval(timerInterval);
            alert(`Congratulations! You completed the maze in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds.`);
        }
    }
}

function startGame() {
    generateMaze();
    player = { x: 0, y: 0 };
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        timerDisplay.textContent = `Time: ${elapsedTime}`;
    }, 100);
    drawMaze();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
});

startButton.addEventListener('click', startGame);
