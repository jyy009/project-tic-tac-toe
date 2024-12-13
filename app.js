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
  let winner = "";
  let gameStarted = false;

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

    if (gameboard.checkWinner(marker)) {
      winner = marker;
      console.log(`winner is ${winner}`);
      return winner;
    } else if (!gameboard.checkWinner(marker)) {
      playerManager.switchPlayer();
    }

    gameboard.checkTie(row, col);
  };

  const getWinner = () => winner;
  const resetWinner = (text) => {
    winner = text;
  };
  return {
    playRound,
    playGame,
    gameboard,
    playerManager,
    getWinner,
    resetWinner,
    gameStarted,
  };
};

//fx to display the game UI
const DisplayLogic = () => {
  const gameboard = Gameboard;
  const playerManager = Player;
  let gameTextElement;

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

        cellContainer.dataset.row = rowIndex;
        cellContainer.dataset.col = colIndex;

        if (rowIndex === 0) {
          cellContainer.classList.add("top-row");
        } else if (rowIndex === 1) {
          cellContainer.classList.add("middle-row");
        } else {
          cellContainer.classList.add("bottom-row");
        }

        if (colIndex === 2) {
          cellContainer.classList.add("right-col");
        }

        cellWrapper.appendChild(cellContainer);

        cellContainer.addEventListener("click", (e) => {
          handleCellClick(e);
        });
      });
    });
  };

  displayBoard();

  const createGameInfoContainer = (text) => {
    const existingContainer = document.querySelector(".text-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    const gameInfoContainer = document.createElement("div");
    gameInfoContainer.classList.add("text-container");
    gameContainer.insertAdjacentElement("afterend", gameInfoContainer);

    const gameText = document.createElement("p");
    gameText.classList.add("text");
    gameInfoContainer.appendChild(gameText);

    gameText.textContent = text;

    return gameText;
  };

  const handleCellClick = (e) => {
    if (!control.gameStarted) {
      return;
    }
    const clickedCell = e.target;
    console.log("clicked cell:", clickedCell);

    const existingTextP = document.querySelector(".spot-taken");
    if (existingTextP) {
      existingTextP.remove();
    }

    if (clickedCell.textContent !== "") {
      const textP = document.createElement("p");
      textP.classList.add("spot-taken");
      textP.textContent = "Spot taken!";
      const gameInfoContainer = document.querySelector(".text-container");
      gameInfoContainer.appendChild(textP);

      return;
    }

    const row = clickedCell.dataset.row;
    const col = clickedCell.dataset.col;
    const marker = playerManager.getCurrentPlayer();
    console.log("player marker:", marker);

    control.playGame(row, col, marker);
    clickedCell.textContent = marker;
    const gameWinner = control.getWinner();

    if (gameWinner !== "") {
      gameTextElement.textContent = `${gameWinner} wins!`;
    } else if (marker === "X") {
      gameTextElement.textContent = "Player O, make your move.";
    } else {
      gameTextElement.textContent = "Player X, make your move.";
    }
  };

  const playGame = () => {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("restart-container");
    gameContainer.insertAdjacentElement("afterend", buttonContainer);

    const button = document.createElement("button");
    button.classList.add("restart-button");
    button.textContent = "Start";
    buttonContainer.appendChild(button);

    button.addEventListener("click", () => {
      control.gameStarted = true;
      displayBoard();
      button.textContent = "Restart";
      playerManager.setCurrentPlayer("X");
      control.resetWinner("");

      if (gameTextElement) {
        gameTextElement.textContent = "Player X, make your move.";
      } else {
        gameTextElement = createGameInfoContainer("Player X, make your move.");
      }
    });
  };

  playGame();

  return {
    displayBoard,
    gameboard,
    playerManager,
    playButton,
    playGame,
    createGameInfoContainer,
  };
};

const control = GameController();
const displayLogic = DisplayLogic();
displayLogic.displayBoard();
