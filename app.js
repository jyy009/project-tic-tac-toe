// Gameboard IIFE
const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  const initializeBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i][j] = "x";
      }
    }
  };

  const getBoard = () => {
    const result = [...board];
    return result;
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

  // const isCellMarked = (row, col) => {
  //   if (board[row][col] !== "") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

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
    checkWinner,
    checkTie,
  };
})();

//Player IIFE
const Player = (function () {
  let currentPlayer = "X";

  const createPlayer = (marker) => {
    return { marker };
  };

  const getCurrentPlayer = () => currentPlayer;

  const setCurrentPlayer = (player) => {
    currentPlayer = player;
    console.log("current player set to:", currentPlayer);
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    console.log("next player", currentPlayer);
  };

  return { createPlayer, switchPlayer, getCurrentPlayer, setCurrentPlayer };
})();

//Game flow factory function
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

const DisplayLogic = () => {
  const gameboard = Gameboard;
  const playerManager = Player;

  const gameContainer = document.querySelector(".game-container");
  // const cellContainer = gameContainer.querySelectorAll(".cell-container")

  const displayBoard = () => {
    gameContainer.innerHTML = "";
    const board = gameboard.getBoard();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellContainer = document.createElement("div");
        cellContainer.classList.add("cell-container");
        cellContainer.textContent = cell;
        cellContainer.dataset.row = rowIndex;
        cellContainer.dataset.col = colIndex;
        gameContainer.appendChild(cellContainer);

        cellContainer.addEventListener("click", (e) => {
          handleCellClick(e);
        });
      });
    });
  };

  const handleCellClick = (e) => {
    const marker = playerManager.getCurrentPlayer()
    console.log("player marker:", marker)
    const clickedCell = e.target
    console.log("clicked cell:", clickedCell)
    const row = clickedCell.dataset.row
    console.log("clicked cell row index:", row)
    const col = clickedCell.dataset.col
    console.log("clicked cell col index:", col)

    clickedCell.textContent = marker

    gameboard.setCell(row, col, marker)
    console.log(gameboard.getBoard())

    playerManager.switchPlayer()
  };

  const markerButton = () => {
    const markerContainer = document.createElement("div");
    markerContainer.classList.add("marker-container");
    gameContainer.insertAdjacentElement("afterend", markerContainer);

    const markerXButton = document.createElement("button");
    markerXButton.classList.add("button");
    markerXButton.textContent = "X";
    markerContainer.appendChild(markerXButton);

    const markerOButton = document.createElement("button");
    markerOButton.classList.add("button");
    markerOButton.textContent = "O";
    markerContainer.appendChild(markerOButton);

    const buttons = document.querySelectorAll(".button");
    buttons.forEach((button) =>
      button.addEventListener("click", (e) => {
        const buttonValue = e.target.textContent;
        console.log("button click value:", buttonValue);
        playerManager.setCurrentPlayer(buttonValue);
        console.log("current player marker:", playerManager.getCurrentPlayer());
      })
    );
  };

  displayBoard();
  markerButton();

  return { displayBoard, gameboard, playerManager, markerButton };
};

const control = GameController();
const displayLogic = DisplayLogic();
