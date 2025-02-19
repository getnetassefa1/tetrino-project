// Generate a random number between min and max
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let timer;
let moving = false;
let scoreCounter = 0;
let score = document.querySelector("#score");
let myButton = document.querySelector("#myButton");
let gridDiv = document.querySelector(".grid");
let miniGrid = document.querySelector(".mini-grid");

let width = 7;
let nextRandom = 0;

// Creating the main grid (7x25)
for (let i = 0; i < 175; i++) {
    let newDiv = document.createElement("div");
    gridDiv.appendChild(newDiv);
}

// Creating the mini preview grid (5x4)
for (let i = 0; i < 20; i++) {
    let newDiv = document.createElement("div");
    miniGrid.appendChild(newDiv);
}

let squares = Array.from(document.querySelectorAll(".grid div"));

// Marking the bottom row as "taken" to prevent falling below grid
for (let i = squares.length - width; i < squares.length; i++) {
    squares[i].classList.add("taken");
}

// Define Tetromino shapes and their rotations
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];
const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];
const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1]
];
const oTetromino = [
    [0, 1, width, width + 1]
];
const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

// Mini grid preview
const displaySquares = document.querySelectorAll(".mini-grid div");
const displayWidth = 5;
let displayIndex = 1;

const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // L
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // Z
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // T
    [0, 1, displayWidth, displayWidth + 1], // O
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // I
];

let currentRandom = randomNumber(0, theTetrominoes.length - 1);
let currentPosition = 2;
let currentRotation = 0;
let currentTetrominoIndex = theTetrominoes[currentRandom];
let current = currentTetrominoIndex[currentRotation];

displayShape();

function draw() {
    current.forEach(index => squares[currentPosition + index].classList.add("tetromino"));
}

function undraw() {
    current.forEach(index => squares[currentPosition + index].classList.remove("tetromino"));
}

function freeze() {
    if (current.some(index => squares[index + currentPosition].classList.contains("taken"))) {
        current.forEach(index => squares[index + currentPosition].classList.add("taken"));

        addScore();
        currentRandom = nextRandom;
        nextRandom = randomNumber(0, theTetrominoes.length - 1);
        currentTetrominoIndex = theTetrominoes[currentRandom];
        current = currentTetrominoIndex[currentRotation];
        currentPosition = 2;

        draw();
        displayShape();
    }
}

function moveDown() {
    if (moving) {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }
}

function moveLeft() {
    if (moving) {
        undraw();
        let leftEdge = current.some(index => (index + currentPosition) % width === 0);
        if (!leftEdge) currentPosition -= 1;
        draw();
    }
}

function moveRight() {
    if (moving) {
        undraw();
        let rightEdge = current.some(index => (index + currentPosition) % width === width - 1);
        if (!rightEdge) currentPosition += 1;
        draw();
    }
}

// Controlling function
function controller(ev) {
    let myButtonId = ev.target.id;
    if (myButtonId == "toLeft") moveLeft();
    else if (myButtonId == "toRight") moveRight();
    else if (myButtonId == "rotate") rotate();
    else if (myButtonId == "toDown") moveDown();
}

function rotate() {
    undraw();
    currentRotation = (currentRotation + 1) % currentTetrominoIndex.length;
    current = currentTetrominoIndex[currentRotation];
    draw();
}

function startPause() {
    if (myButton.innerHTML === "Start") {
        moving = true;
        draw();
        timer = setInterval(moveDown, 300);
        myButton.innerHTML = "Pause";
    } else {
        moving = false;
        clearInterval(timer);
        myButton.innerHTML = "Start";
    }
}

function displayShape() {
    displaySquares.forEach(square => square.classList.remove("tetromino"));
    upNextTetrominoes[nextRandom].forEach(index => displaySquares[index + displayIndex].classList.add("tetromino"));
}

function addScore() {
    for (let i = 0; i < 175; i += width) {
        let rows = [...Array(width)].map((_, j) => i + j);
        if (rows.every(index => squares[index].classList.contains("taken"))) {
            scoreCounter += 10;
            score.innerHTML = scoreCounter;
            rows.forEach(index => squares[index].classList.remove("taken"));
        }
    }
}
