//Constants
const BLOCK_SIZE = 60;
const NUM_BLOCKS_HORIZONTAL = 15;
const NUM_BLOCKS_VERTICAL = 10;
const GAME_CANVAS_WIDTH = NUM_BLOCKS_HORIZONTAL * BLOCK_SIZE;
const GAME_CANVAS_HEIGHT = NUM_BLOCKS_VERTICAL * BLOCK_SIZE;
const BACKGROUND_COLOR = "#EEEEEE";
const FRACTION_BREAKABLE_BLOCKS = 0.4;
const CHARACTER_SIZE = 60;
const ACTIVE_BOMB_SIZE = 60;
const TIME_TO_EXPLODE = 3000;
const BUG_SIZE = 60;
const NUM_BUGS = 10;

class MainCharacter {
  constructor() {
    this.img = new Image();
    this.img.src = "./images/character.jpg";
    this.width = CHARACTER_SIZE;
    this.height = CHARACTER_SIZE;
    this.x = 0;
    this.y = 0;
    this.isAlive = true;
  }
  draw(ctx) {
    if (this.isAlive) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
  die() {
    this.isAlive = false;
  }
}

class Bug {
  constructor(x, y) {
    this.img = new Image();
    this.img.src = "./images/bug.png";
    this.width = BUG_SIZE;
    this.height = BUG_SIZE;
    this.x = x;
    this.y = y;
    this.direction = "right";
  }
  move() {
    switch (this.direction) {
      case "left":
        this.x -= 1;
        break;
      case "right":
        this.x += 1;
        break;
      case "up":
        this.y -= 1;
        break;
      case "down":
        this.y += 1;
        break;
    }
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  changeDirection(direction) {
    this.direction = direction;
  }
}

let character = new MainCharacter();

let blocks = [];
let ctx;

//Main Game Class
class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.isGameOver = false;
    this.bugs = [];
    //initialize the array (of arrays) - game board (where the blocks are!)

    //initialize an array that stores the positions that are not occupied (in the form of objects)
    const emptyPositions = [];
    //Iterates over the vertical blocks and generates that number of arrays (in the "main" array)
    for (let i = 0; i < NUM_BLOCKS_VERTICAL; i++) {
      blocks.push([]);
      // Iterates over the horizontal blocks and if both indexes are odd genereate unbreakable blocks
      for (let j = 0; j < NUM_BLOCKS_HORIZONTAL; j++) {
        if (i % 2 !== 0 && j % 2 !== 0) {
          blocks[i].push(new UnbreakableBlock());
          // "else" push null into the array of blocks
        } else {
          blocks[i].push(null); // fills the array of blocks with null where there are no unbreakable blocks

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
      blocks[selectedEmptyPosition.i][selectedEmptyPosition.j] = new BreakableBlock();
      //remove the recent occupied position from the emptyPositions arry to prevent the random "choosing" the same position again
      emptyPositions.splice(emptyPositionIndex, 1);
    }
    for (let i = 0; i < NUM_BUGS; i++) {
      const emptyPositionIndex = Math.floor(Math.random() * emptyPositions.length);
      const selectedEmptyPosition = emptyPositions[emptyPositionIndex];
      this.bugs.push(new Bug(selectedEmptyPosition.j * BLOCK_SIZE, selectedEmptyPosition.i * BLOCK_SIZE));
      emptyPositions.splice(emptyPositionIndex, 1);
    }
  }

  draw() {
    //draw background
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);

    //draw blocks
    //iterates over the rows in the blocks array of arrays
    for (let i = 0; i < blocks.length; i++) {
      //iterates over the columns in that row
      for (let j = 0; j < blocks[i].length; j++) {
        //block at i, j
        const block = blocks[i][j];
        // if the position is not free
        if (block !== null) {
          //draw the block (see class Block)
          block.draw(this.ctx, BLOCK_SIZE * j, BLOCK_SIZE * i);
        }
      }
    }
    character.draw(this.ctx);
    this.bugs.forEach(bug => {
      bug.draw(this.ctx);
    });
  }
  update() {
    let characterIOnGrid = character.y / BLOCK_SIZE;
    let characterJOnGrid = character.x / BLOCK_SIZE;

    //iterates over the rows in the blocks array of arrays
    for (let i = 0; i < blocks.length; i++) {
      //iterates over the columns in that row
      for (let j = 0; j < blocks[i].length; j++) {
        //block at i, j
        const block = blocks[i][j];
        // if the position is a bomb
        if (block instanceof Bomb && block.shouldExplode()) {
          if (j + 1 < NUM_BLOCKS_HORIZONTAL && blocks[i][j + 1] !== null) {
            blocks[i][j + 1] = blocks[i][j + 1].onExplosion();
          }
          if (j - 1 >= 0 && blocks[i][j - 1] !== null) {
            blocks[i][j - 1] = blocks[i][j - 1].onExplosion();
          }
          if (i + 1 < NUM_BLOCKS_VERTICAL && blocks[i + 1][j] !== null) {
            blocks[i + 1][j] = blocks[i + 1][j].onExplosion();
          }
          if (i - 1 >= 0 && blocks[i - 1][j] !== null) {
            blocks[i - 1][j] = blocks[i - 1][j].onExplosion();
          }
          if (blocks[i][j] !== null) {
            blocks[i][j] = blocks[i][j].onExplosion();
          }
          if (
            (characterJOnGrid === j && (i - 1 <= characterIOnGrid && characterIOnGrid <= i + 1)) ||
            (characterIOnGrid === i && (j - 1 <= characterJOnGrid && characterJOnGrid <= j + 1))
          ) {
            character.die();
            this.isGameOver = true;
          }
        }
      }
    }
    this.bugs.forEach(bug => {
      let bugIOnGrid = bug.y / BLOCK_SIZE;
      let bugJOnGrid = bug.x / BLOCK_SIZE;

      const possibleDirections = [];
      if (Math.ceil(bugJOnGrid) - 1 >= 0 && blocks[Math.floor(bugIOnGrid)][Math.ceil(bugJOnGrid) - 1] === null) {
        possibleDirections.push("left");
      }
      if (Math.floor(bugJOnGrid) + 1 < NUM_BLOCKS_HORIZONTAL && blocks[Math.floor(bugIOnGrid)][Math.floor(bugJOnGrid) + 1] === null) {
        possibleDirections.push("right");
      }
      if (Math.ceil(bugIOnGrid) - 1 >= 0 && blocks[Math.ceil(bugIOnGrid) - 1][Math.floor(bugJOnGrid)] === null) {
        possibleDirections.push("up");
      }
      if (Math.floor(bugIOnGrid) + 1 < NUM_BLOCKS_VERTICAL && blocks[Math.floor(bugIOnGrid) + 1][Math.floor(bugJOnGrid)] === null) {
        possibleDirections.push("down");
      }
      

      if(possibleDirections.includes(bug.direction)) {
        bug.move();
      } else if (possibleDirections.length >0) {
        const possibleDirectionsIndex = Math.floor(Math.random() * possibleDirections.length);
        const selectedDirection = possibleDirections[possibleDirectionsIndex];
        bug.changeDirection(selectedDirection);

      }
    });
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
  onExplosion() {
    return this;
  }
}

class Bomb extends Block {
  constructor(x, y) {
    super("./images/bomb.jpg");
    this.x = x;
    this.y = y;
    this.isTimerFinished = false;
    setTimeout(() => {
      this.isTimerFinished = true;
    }, TIME_TO_EXPLODE);
  }
  onExplosion() {
    return null;
  }
  shouldExplode() {
    return this.isTimerFinished;
  }
}

//extends the class block - the breakable block has an image source
class BreakableBlock extends Block {
  constructor() {
    super("./images/tile_rock_brown@3x.png");
  }
  onExplosion() {
    return null;
  }
}

//extends the class block - the unbreakable block has an image source
class UnbreakableBlock extends Block {
  constructor() {
    super("./images/tile_wall5@3x.png");
  }
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: // left
      if (character.x > 0 && blocks[character.y / BLOCK_SIZE][character.x / BLOCK_SIZE - 1] === null) {
        character.x -= BLOCK_SIZE;
      }
      break;
    case 38: // up
      if (character.y > 0 && blocks[character.y / BLOCK_SIZE - 1][character.x / BLOCK_SIZE] === null) {
        character.y -= BLOCK_SIZE;
      }
      break;
    case 39: // right
      if (
        character.x < GAME_CANVAS_WIDTH - BLOCK_SIZE &&
        blocks[character.y / BLOCK_SIZE][character.x / BLOCK_SIZE + 1] === null
      ) {
        character.x += BLOCK_SIZE;
      }
      break;
    case 40: // down
      if (
        character.y < GAME_CANVAS_HEIGHT - BLOCK_SIZE &&
        blocks[character.y / BLOCK_SIZE + 1][character.x / BLOCK_SIZE] === null
      ) {
        character.y += BLOCK_SIZE;
      }
      break;
    case 32:
      const bomb = new Bomb(character.x, character.y);
      let i = character.y / BLOCK_SIZE;
      let j = character.x / BLOCK_SIZE;
      blocks[i][j] = bomb;
      break;
  }
};

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

  //redraw the game every 20 miliseconds
  setInterval(() => {
    game.update();
    game.draw();
  }, 20);
};

// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", initGame);
