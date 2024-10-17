const Gameboard = (function () {
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

  const getBoard = () => {
    const result = [...board];
    return console.log(result);
  };

  const setCell = (row, col, value) => {
    if (row >= 0 && row < rows && col >= 0 && col < columns) {
      board[row][col] = value;
      return board;
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

  const checkWinner = (mark) => {
    const winningCombo = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    return winningCombo.some((combo) =>
      combo.every(([row, col]) => board[row][col] === mark)
    );
  };

  const checkTie = (row, col) => {
    const result = board.every((row) => row.every((cell) => cell !== ""));
    if (result) {
      console.log("it's a tie");
    }
    return result;
  };

  initializeBoard();

  return {
    initializeBoard,
    getBoard,
    setCell,
    resetBoard,
    isCellMarked,
    checkWinner,
    checkTie,
  };
})();

//Player factory funtion
const Player = (function () {
  let currentPlayer = "X";

  const createPlayer = (marker) => {
    return { marker };
  };

  console.log("current player", currentPlayer);

  const switchPlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    console.log("next player", currentPlayer);
  };

  return { createPlayer, switchPlayer };
})();

//Game flow factory funtion

const GameController = () => {
  const gameboard = Gameboard;
  const playerManager = Player;

  const playRound = (row, col, player) => {
    if (gameboard.setCell(row, col, player.marker)) {
      gameboard.getBoard();
    } else {
      return "invalid move";
    }
  };

  const playGame = (row, col, player) => {
    const roundResult = playRound(row, col, player);

    if (typeof roundResult === "string") {
      return roundResult;
    }

    if (!gameboard.checkWinner(player.marker)) {
      playerManager.switchPlayer(player);
      console.log("next player");
    } else {
      console.log(`${player.marker} wins`);
      return gameboard.resetBoard();
    }

    gameboard.checkTie(row, col);
  };

  return { playRound, playGame, gameboard, playerManager };
};

const control = GameController();
