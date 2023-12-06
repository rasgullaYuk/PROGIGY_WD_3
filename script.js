let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill('');
let gameMode = 'human';

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner() {
  for (const [a, b, c] of winningConditions) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameActive = false;
      return boardState[a];
    }
  }

  if (!boardState.includes('')) {
    gameActive = false;
    return 'tie';
  }

  return null;
}

function handleCellClick(index) {
  if (!gameActive || boardState[index] !== '') return;

  boardState[index] = currentPlayer;
  const cell = document.getElementById(`cell${index}`);
  cell.innerText = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  const winner = checkWinner();
  if (winner) {
    if (winner === 'tie') {
      alert('It\'s a tie!');
    } else {
      alert(`Player ${winner} wins!`);
      applyWinningEffects(winningConditions);
    }
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // If AI mode is selected and it's the AI's turn
  if (gameMode === 'ai' && currentPlayer === 'O') {
    makeAIMove();
  }
}

function applyWinningEffects(winningConditions) {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    const cells = [document.getElementById(`cell${a}`), document.getElementById(`cell${b}`), document.getElementById(`cell${c}`)];
    
    cells.forEach(cell => cell.classList.add('winning'));
  }
}

function createGameBoard() {
  const gameBoard = document.getElementById('gameBoard');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('id', `cell${i}`);
    cell.addEventListener('click', () => handleCellClick(i));
    gameBoard.appendChild(cell);
  }
}

function restartGame() {
  currentPlayer = 'X';
  gameActive = true;
  boardState = Array(9).fill('');
  document.querySelectorAll('.cell').forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('winning', 'x', 'o');
  });

 
  if (gameMode === 'ai' && currentPlayer === 'O') {
    makeAIMove();
  }
}

function makeAIMove() {
  const emptyCells = boardState.reduce((acc, val, index) => {
    if (!val) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const aiMoveIndex = emptyCells[randomIndex];
    handleCellClick(aiMoveIndex);
  }
}


document.getElementById('mode').addEventListener('change', function () {
  gameMode = this.value;
  restartGame();
});

window.onload = () => {
  createGameBoard();
  const restartBtn = document.getElementById('restartBtn');
  restartBtn.addEventListener('click', restartGame);
};
