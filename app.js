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

  const getBoard = () => board;

  const setCell = (row, col, value) => {
    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      board[row][col] = value;
      return true;
    } else {
      return false;
    }
  };

  initializeBoard();

  return { initializeBoard, getBoard, setCell };
};

const Players = () => {
  const player1 = "X";
  const player2 = "O";

  const s = (player, marker) => {};
};

const GameController = () => {};
