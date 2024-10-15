const Gameboard = () => {
  const rows = 3;
  const columns = 3;
  let board = [];

  const initializeBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = "";
      }
    }
  };

  const getBoard = () => console.log(board);

  const setCell = (row, col, value) => {
    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      return (board[row][col] = value);
    } else {
      return false;
    }
  };

  const resetBoard = () => initializeBoard();

  const isCellMarked = (row, col) => {
    if (board[row][col] !== "") {
      return true;
    } else {
      return false;
    }
  };

  const checkWinner = () => {
    const winningCombo = [
  [board[0][0], board[0][1], board[0][2]],
  [board[1][0], board[1][1], board[1][2]],
  [board[2][0], board[2][1], board[2][2]],
  [board[0][0], board[1][0], board[2][0]],
  [board[0][1], board[1][1], board[2][1]],
  [board[0][2], board[1][2], board[2][2]],
  [board[0][0], board[1][1], board[2][2]],
  [board[0][2], board[1][1], board[2][0]],
  ]

  initializeBoard();

  return { initializeBoard, getBoard, setCell, resetBoard, isCellMarked };
};

const Player = () => {
  const board = Gameboard();

  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  return { createPlayer };
};

const GameController = () => {
  const board = Gameboard();


  const playRound = (row, col, player) => {
    if (board.isCellMarked(row, col)) {
      alert("Invalid choice: Cell is already marked");
    } else {
      board.setCell(row, col, player.marker);
      board.getBoard();
    }
  };

  

  return { playRound };
};
