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
        cellWrapper.appendChild(cellContainer);

        cellContainer.addEventListener("click", (e) => {
          handleCellClick(e);
        });
      });
    });
  };

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

  const playButton = () => {
    const playButton = document.createElement("button");
    playButton.classList.add("play-button");
    playButton.textContent = "Play";
    gameContainer.insertAdjacentElement("afterend", playButton);

    playButton.addEventListener("click", () => {
      displayBoard();
      playerManager.setCurrentPlayer("X");
      control.resetWinner("");

      gameTextElement = createGameInfoContainer("Player X, make your move");
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

    control.playGame(row, col, marker);
    clickedCell.textContent = marker;
    const gameWinner = control.getWinner();

    if (gameWinner !== "") {
      gameTextElement.textContent = `${gameWinner} wins`;
    } else if (marker === "X") {
      gameTextElement.textContent = "Player O, make your move";
    } else {
      gameTextElement.textContent = "Player X, make your move";
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
      displayBoard();
      playerManager.setCurrentPlayer("X");
      control.resetWinner("");

      if (gameTextElement) {
        gameTextElement.textContent = "Player X, make your move";
      } else {
        gameTextElement = createGameInfoContainer("Player X, make your move");
      }
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
displayLogic.displayBoard();
