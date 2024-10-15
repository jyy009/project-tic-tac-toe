/*
You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself. 
*/

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
      board[row][col] = value;
      return true;
    } else {
      return false;
    }
  };

  const resetBoard = () => initializeBoard();

  initializeBoard();

  return { initializeBoard, getBoard, setCell, resetBoard };
};


const Player = () => {
  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  const makeMove = (board, row, col, value) => {
    return board.setCell(row, col, value);
  };

  return { createPlayer, makeMove };
};


const GameController = () => {
  const board = Gameboard()
  const players = Player()

  const playRound = (player, row, col) => {
    players.makeMove(board, row, col, player.marker);
    board.getBoard();
  };

  return { playRound };
};
