let game = null;
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
  const instructions = document.getElementById("instructions");
  instructions.style="display: none;"

  const mainGame = document.getElementById("main-game");
  mainGame.style="";
  
  ctx = setupCanvas();
  game = new Game(ctx);
  document.onkeydown = function(e) {
    if(game !== null) {
      game.handleKeyPress(e.keyCode)
    }
   
  };

  //redraw the game every 20 miliseconds
  setInterval(() => {
    if(game !== null) {
      game.update();
    game.draw();
    game.checkWin();
    }
    
  }, 20);
};

const restartGame = () => {
  document.activeElement.blur();
  game = new Game(ctx);
};

const init = () => {
  const btn = document.getElementById("start-button");
  btn.onclick = initGame;
  const tryAgainButton = document.getElementById("try-again");
  tryAgainButton.onclick = restartGame;
};

// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", init);
