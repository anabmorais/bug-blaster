let game = null;
let ctx;

const initGame = () => {
  const instructions = document.getElementById("instructions");
  //hides the instructions
  instructions.style = "display: none;";

  const mainGame = document.getElementById("main-game");
  //displays the main game
  mainGame.style = "";

  game = new Game(ctx);

  //listens to keyboard event and passes the keycode to game
  document.onkeydown = function(e) {
    if (game !== null) {
      game.handleKeyPress(e.keyCode);
    }
  };

  //if there is a game, update and redraw the game every 20 miliseconds
  setInterval(() => {
    if (game !== null) {
      game.update();
      game.draw();
    }
  }, 20);
};

//Sets a new game when try again button is pressed
const restartGame = () => {
  //Remove the focus of the active element - for example the try again button
  document.activeElement.blur();
  game = new Game(ctx);
};

//sets the dimensions of the canvas based on game parameters
const setupCanvas = () => {
  const canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  canvas.width = GAME_CANVAS_WIDTH;
  canvas.height = GAME_CANVAS_HEIGHT;
};

//sets the on-click actions for the buttons
const setupButtons = () => {
  const startButton = document.getElementById("start-button");
  startButton.onclick = initGame;

  const tryAgainButton = document.getElementById("try-again");
  tryAgainButton.onclick = restartGame;
};

//Sets up the app buttons and canvas
const setupApp = () => {
  setupCanvas();
  setupButtons();
};

// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", setupApp);
