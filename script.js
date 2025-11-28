
const cells = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const playerInput = document.getElementById('player');
const currentPlayerText = document.getElementById('currentPlayer');

let playerName = '';
let oTurn;

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

startBtn.addEventListener('click', () => {
    if(playerInput.value.trim() === '') {
        alert('Please enter your name!');
        return;
    }
    playerName = playerInput.value.trim();
    currentPlayerText.innerText = `${playerName}'s Turn (X)`;
    oTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
});

restartBtn.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    oTurn = false;
    if(playerName) {
        currentPlayerText.innerText = `${playerName}'s Turn (X)`;
    } else {
        currentPlayerText.innerText = 'Welcome!';
    }
});

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? 'o' : 'x';
    placeMark(cell, currentClass);
    if(checkWin(currentClass)) {
        endGame(false);
    } else if(isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    currentPlayerText.innerText = oTurn ? "Computer's Turn (O)" : `${playerName}'s Turn (X)`;
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

function endGame(draw) {
    if(draw) {
        currentPlayerText.innerText = "It's a Draw!";
    } else {
        currentPlayerText.innerText = oTurn ? 'O Wins!' : `${playerName} Wins!`;
    }
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}
