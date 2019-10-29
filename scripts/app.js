let character = new MainCharacter();

let blocks = [];
let ctx;

//sets the dimensions of the canvas based on game parameters and return canvas context
const setupCanvas = () => {
  const canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  canvas.width = GAME_CANVAS_WIDTH;
  canvas.height = GAME_CANVAS_HEIGHT;
  return ctx;
};

//function called when the page is ready, which sets up the canvas and initializes a new game.
const initGame = () => {
  const ctx = setupCanvas();
  let game = new Game(ctx);
  document.onkeydown = function(e) {
    game.handleKeyPress(e.keyCode)
  };

  //redraw the game every 20 miliseconds
  setInterval(() => {
    game.update();
    game.draw();
    game.checkWin();
  }, 20);
};

// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", initGame);
