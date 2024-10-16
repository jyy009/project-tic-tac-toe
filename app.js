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

  const checkTie = () => {};
  initializeBoard();

  return {
    initializeBoard,
    getBoard,
    setCell,
    resetBoard,
    isCellMarked,
    checkWinner,
  };
};

//Player factory funtion
const Player = () => {
  let currentPlayer = "X";

  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  const switchPlayer = () => {
    const resultingPlayer = currentPlayer === "X" ? "O" : "X";
    return console.log("next player's marker:", resultingPlayer);
  };

  return { createPlayer, switchPlayer };
};

const GameController = (board, play) => {
  const playRound = (row, col, player) => {
    if (board.setCell(row, col, player.marker)) {
      board.getBoard();

      let currentPlayer = player.marker;
      return console.log("current player:", currentPlayer);
    } else {
      return "invalid move";
    }
  };

  const playGame = (row, col, player) => {
    const roundResult = playRound(row, col, player);

    if (typeof roundResult === "string") {
      return roundResult;
    }
    play.switchPlayer();
    console.log("next player");

    if (board.checkWinner(player.marker)) {
      return console.log(`${player.marker} wins`);
    }
  };

  return { playRound, playGame };
};

const gameboard = Gameboard();
const player = Player();
const control = GameController(gameboard, player);
