const cells = document.querySelectorAll('[data-cell]');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const playerInput = document.getElementById('player');
const currentPlayerText = document.getElementById('currentPlayer');
const xScoreSpan = document.getElementById('xScore');
const oScoreSpan = document.getElementById('oScore');
const drawScoreSpan = document.getElementById('drawScore');

let playerName = '';
let oTurn = false; // false = player's turn (X), true = AI's turn (O)
let xScore = 0;
let oScore = 0;
let drawScore = 0;

const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

// Start Game
startBtn.addEventListener('click', startGame);

function startGame() {
    if(playerInput.value.trim() === '') {
        alert('Please enter your name!');
        return;
    }
    playerName = playerInput.value.trim();
    oTurn = false;
    resetBoard();
    currentPlayerText.innerText = `${playerName}'s Turn (X)`;
}

// Restart Game
restartBtn.addEventListener('click', () => {
    oTurn = false;
    resetBoard();
    currentPlayerText.innerText = playerName ? `${playerName}'s Turn (X)` : 'Welcome!';
});

function resetBoard() {
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.removeEventListener('click', handleClick);
        cell.removeEventListener('touchstart', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
        cell.addEventListener('touchstart', handleClick, { once: true });
    });
}

// Handle Player Click / Touch
function handleClick(e) {
    e.preventDefault();
    const cell = e.target;
    if(cell.classList.contains('x') || cell.classList.contains('o')) return;
    placeMark(cell, 'x');
    if(checkWin('x')) {
        endGame(false, 'x');
    } else if(isDraw()) {
        endGame(true);
    } else {
        oTurn = true;
        currentPlayerText.innerText = "AI's Turn (O)";
        setTimeout(aiMove, 500);
    }
}

// AI Move (Random Easy AI)
function aiMove() {
    const emptyCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
    if(emptyCells.length === 0) return;

    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    placeMark(move, 'o');

    if(checkWin('o')) {
        endGame(false, 'o');
    } else if(isDraw()) {
        endGame(true);
    } else {
        oTurn = false;
        currentPlayerText.innerText = `${playerName}'s Turn (X)`;
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function endGame(draw, winnerClass) {
    if(draw) {
        currentPlayerText.innerText = "It's a Draw!";
        drawScore++;
        drawScoreSpan.innerText = drawScore;
    } else {
        if(winnerClass === 'x') {
            currentPlayerText.innerText = `${playerName} Wins!`;
            xScore++;
            xScoreSpan.innerText = xScore;
        } else {
            currentPlayerText.innerText = "AI Wins!";
            oScore++;
            oScoreSpan.innerText = oScore;
        }
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.removeEventListener('touchstart', handleClick);
    });
}
