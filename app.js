// Gameboard IIFE
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
    return [...board];
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

  // initializeBoard();

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

  const playRound = (row, col, marker) => {
    if (gameboard.setCell(row, col, marker)) {
      playerManager.setCurrentPlayer(marker);
    } else {
      return "invalid move";
    }
  };

  const playGame = (row, col, marker) => {
    const roundResult = playRound(row, col, marker);

    if (typeof roundResult === "string") {
      return roundResult;
    }

    if (!gameboard.checkWinner(marker)) {
      playerManager.switchPlayer();
    } else {
      return
      // console.log(`${marker} is the winner`)
      // gameboard.resetBoard();
    }

    gameboard.checkTie(row, col);
  };

  return { playRound, playGame, gameboard, playerManager };
};

const DisplayLogic = () => {
  const gameboard = Gameboard;
  const playerManager = Player;
  let gameTextElement;
let winner;

  const gameContainer = document.querySelector(".game-container");

  const displayBoard = () => {
    gameContainer.innerHTML = "";
   gameboard.initializeBoard();
    const board = gameboard.getBoard();

    const cellWrapper = document.createElement("div");
    cellWrapper.classList.add("cell-wrapper");
    gameContainer.appendChild(cellWrapper);

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellContainer = document.createElement("div");
        cellContainer.classList.add("cell-container");
        // cellContainer.textContent = cell;
        cellContainer.dataset.row = rowIndex;
        cellContainer.dataset.col = colIndex;
        cellWrapper.appendChild(cellContainer);

        cellContainer.addEventListener("click", (e) => {
          handleCellClick(e);
        });
      });
    });
  };

  const createGameInfoContainer = () => {
    const gameInfoContainer = document.createElement("div");
    gameInfoContainer.classList.add("text-container");

    const gameText = document.createElement("p");
    gameText.classList.add("text");
    gameText.textContent = "Player X, make your move";
    gameInfoContainer.appendChild(gameText);

    gameContainer.insertAdjacentElement("afterend", gameInfoContainer);

    if (gameText.textContent !== "") {
      gameText.textContent = "";
    }

    return { container: gameInfoContainer, text: gameText };
  };

  const playButton = () => {
    const playButton = document.createElement("button");
    playButton.classList.add("play-button");
    playButton.textContent = "Play";
    gameContainer.insertAdjacentElement("afterend", playButton);

    playButton.addEventListener("click", () => {
      displayBoard();
      const gameInfo = createGameInfoContainer();
      gameTextElement = gameInfo.text;
    });
  };

  const handleCellClick = (e) => {
    const clickedCell = e.target;
    console.log("clicked cell:", clickedCell);

    if (clickedCell.textContent !== "") {
      return console.log("spot taken");
    }

    const row = clickedCell.dataset.row;
    const col = clickedCell.dataset.col;
    const marker = playerManager.getCurrentPlayer();
    console.log("player marker:", marker);

    clickedCell.textContent = marker;

    if (marker === "X") {
      gameTextElement.textContent = "Player O, make your move";
    } else {
      gameTextElement.textContent = "Player X, make your move";
    }

    control.playGame(row, col, marker);
    
    if (gameboard.checkWinner) {
      gameTextElement.textContent = "X wins!"
    } else {
      gameTextElement.textContent = "O wins!"
    }
  };

  const restartGame = () => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("restart-container");
    gameContainer.insertAdjacentElement("afterend", buttonContainer);

    const button = document.createElement("button");
    button.classList.add("restart-button");
    button.textContent = "Restart";
    buttonContainer.appendChild(button);

    button.addEventListener("click", () => {
      gameboard.resetBoard();

      displayBoard(gameboard.getBoard);
    });
  };

  restartGame();
  playButton();

  return {
    displayBoard,
    gameboard,
    playerManager,
    playButton,
    restartGame,
    createGameInfoContainer,
  };
};

const control = GameController();
const displayLogic = DisplayLogic();
