//Constants
const BLOCK_SIZE = 60;
const NUM_BLOCKS_HORIZONTAL = 15;
const NUM_BLOCKS_VERTICAL = 10;
const GAME_CANVAS_WIDTH = NUM_BLOCKS_HORIZONTAL * BLOCK_SIZE;
const GAME_CANVAS_HEIGHT = NUM_BLOCKS_VERTICAL * BLOCK_SIZE;
const BACKGROUND_COLOR = "#EEEEEE";
const FRACTION_BREAKABLE_BLOCKS = 0.4;

//Main Game Class
class Game {
  constructor(ctx) {
    this.ctx = ctx;
    //initialize the array (of arrays) - game board (where the blocks are!)
    this.blocks = []; 

    //initialize an array that stores the positions that are not occupied (in the form of objects)
    const emptyPositions = []; 
    //Iterates over the vertical blocks and generates that number of arrays (in the "main" array)
    for (let i = 0; i < NUM_BLOCKS_VERTICAL; i++) { 
      this.blocks.push([]);
      // Iterates over the horizontal blocks and if both indexes are odd genereate unbreakable blocks
      for (let j = 0; j < NUM_BLOCKS_HORIZONTAL; j++) { 
        if (i % 2 !== 0 && j % 2 !== 0) { 
          this.blocks[i].push(new UnbreakableBlock()); 
          // "else" push null into the array of blocks
        } else { 
            this.blocks[i].push(null); // fills the array of blocks with null where there are no unbreakable blocks
            
          //To prevent boxing in the player without escape during the first iteration, the positions [0,0], [0,1] and [1,0] can't be ocupied by breakable blocks
          //To do that, this positions will be excluded from the emptyPositions array - the position for the breakable block will be randomly choosed from there.
          if (i > 1 || j > 1) {
            //stores the empty position in the emptyPositions array
            emptyPositions.push({ i, j });
          }
        }
      }
    }

    //Determine how many breakable blocks are generated, based on the percentage of ocupation of empty spaces.
    const numBreakableBlock = Math.floor(FRACTION_BREAKABLE_BLOCKS * emptyPositions.length);
    //iterates over each breakable block
    for (let i = 0; i < numBreakableBlock; i++) {
      //Determines a random index in the emptyPositions array - between 0 and the initial length of the array  
      const emptyPositionIndex = Math.floor(Math.random() * emptyPositions.length);
      // Selects the object in the emptyPositions array on the random index determined
      const selectedEmptyPosition = emptyPositions[emptyPositionIndex];
      //where to generate the breakable block - based on the randomly choosed object
      this.blocks[selectedEmptyPosition.i][selectedEmptyPosition.j] = new BreakableBlock();
      //remove the recent occupied position from the emptyPositions arry to prevent the random "choosing" the same position again
      emptyPositions.splice(emptyPositionIndex, 1);
    }
  }

  draw() {
    //draw background
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);

    //draw blocks
    //iterates over the rows in the blocks array of arrays
    for (let i = 0; i < this.blocks.length; i++) {
       //iterates over the columns in that row 
      for (let j = 0; j < this.blocks[i].length; j++) {
         //block at i, j
         const block = this.blocks[i][j]; 
        // if the position is not free
        if (block !== null) {
          //draw the block (see class Block)
          block.draw(this.ctx, BLOCK_SIZE * j, BLOCK_SIZE * i);
        }
      }
    }
  }
}

//Main class of blocks. Has 1 method - draw()
class Block {
  constructor(src) {
    this.img = new Image();
    this.img.src = src;
    this.width = BLOCK_SIZE;
    this.height = BLOCK_SIZE;
  }

  draw(ctx, x, y) {
    ctx.drawImage(this.img, x, y, this.width, this.height);
  }
}

//extends the class block - the breakable block has an image source
class BreakableBlock extends Block {
  constructor() {
    super("./images/breakable_block.jpg");
  }
}

//extends the class block - the unbreakable block has an image source
class UnbreakableBlock extends Block {
  constructor() {
    super("./images/unbreakable_block.jpg");
  }
}

//sets the dimensions of the canvas based on game parameters and return canvas context
const setupCanvas = () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  canvas.width = GAME_CANVAS_WIDTH;
  canvas.height = GAME_CANVAS_HEIGHT;
  return ctx;
};

//function called when the page is ready, which sets up the canvas and initializes a new game.
const initGame = () => {
  const ctx = setupCanvas();
  let game = new Game(ctx);

  //redraw the game every 20 miliseconds
  setInterval(() => game.draw(), 20);
};

// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", initGame);
