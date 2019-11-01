class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.character = new MainCharacter();
    this.isGameOver = false;
    this.isGameWon = false;
    //initialize an array that stores the positions of the bugs (in the form of objects)
    this.bugs = [];
    //initialize the array (of arrays) - game board
    this.blocks = [];
    this.deadCharacter = new Image();
    this.deadCharacter.src = "./images/amy_dead.png";
    this.winCharacter = new Image();
    this.winCharacter.src = "./images/amy_win.png";
    //Start playing the background music every time a new game is generated
    playSong();

    //initialize an array that stores the positions that are not occupied (in the form of objects)
    const emptyPositions = [];
    //Iterates over the vertical this.blocks and generates that number of arrays (in the "main" array)
    for (let i = 0; i < NUM_BLOCKS_VERTICAL; i++) {
      this.blocks.push([]);
      // Iterates over the horizontal this.blocks and if both indexes are odd genereate unbreakable this.blocks
      for (let j = 0; j < NUM_BLOCKS_HORIZONTAL; j++) {
        if (i % 2 !== 0 && j % 2 !== 0) {
          this.blocks[i].push(new UnbreakableBlock());
          // "else" push null into the array of this.blocks
        } else {
          this.blocks[i].push(null); // fills the array of this.blocks with null where there are no unbreakable this.blocks

          //To prevent boxing in the player without escape during the first iteration, the positions [0,0], [0,1] and [1,0] can't be ocupied by breakable this.blocks
          //To do that, this positions will be excluded from the emptyPositions array - the position for the breakable block will be randomly choosed from there.
          if (i > 1 || j > 1) {
            //stores the empty position in the emptyPositions array - an object {i, j}
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
      const breakableBlock = new BreakableBlock();
      //The exit block is placed under the first (i===0) randomly choosed breakable block
      if (i === 0) {
        breakableBlock.setHiddenBlock(new ExitBlock());
      }
      //where to generate the breakable block - based on the randomly choosed object
      this.blocks[selectedEmptyPosition.i][selectedEmptyPosition.j] = breakableBlock;
      //remove the recent occupied position from the emptyPositions arry to prevent the random "choosing" the same position again
      emptyPositions.splice(emptyPositionIndex, 1);
    }
    // Bugs created based on the empty spaces array AFTER the breakableBlocks are created
    for (let i = 0; i < NUM_BUGS; i++) {
      const emptyPositionIndex = Math.floor(Math.random() * emptyPositions.length);
      const selectedEmptyPosition = emptyPositions[emptyPositionIndex];
      this.bugs.push(new Bug(selectedEmptyPosition.j * BLOCK_SIZE, selectedEmptyPosition.i * BLOCK_SIZE));
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

    //draw character (see class Main Character)
    this.character.draw(this.ctx);

    //draw bugs (see class Bug) - for each one in the bugs array
    this.bugs.forEach(bug => {
      bug.draw(this.ctx);
    });
    // draw the win or lose screen
    if (this.isGameWon) {
      this.drawWinScreen();
    } else if (this.isGameOver) {
      this.drawLoseScreen();
    }
  }

  // what appears in the canvas after Game Over
  drawLoseScreen() {
    ctx.fillStyle = "#f06067";
    ctx.fillRect(
      2.2 * BLOCK_SIZE,
      2.2 * BLOCK_SIZE,
      GAME_CANVAS_WIDTH - 4.4 * BLOCK_SIZE,
      GAME_CANVAS_HEIGHT - 4.4 * BLOCK_SIZE
    );
    ctx.drawImage(this.deadCharacter, 150, 200, 450, 450);
    ctx.fillStyle = "#620200";
    ctx.font = "60px Verdana";
    ctx.fillText("Game Over", 250, 300);
    ctx.font = "30px Verdana";
    ctx.fillText("Amy couldn't debug", 650, 350);
    ctx.fillText("her code and escape", 650, 400);
    ctx.fillText("the bombs ...", 650, 450);
    ctx.fillText("Let's drink a coffee", 650, 530);
    ctx.fillText("and try again!", 650, 580);
  }

  // what appears in the canvas after Game Win
  drawWinScreen() {
    ctx.fillStyle = "#aade9b";
    ctx.fillRect(
      2.2 * BLOCK_SIZE,
      2.2 * BLOCK_SIZE,
      GAME_CANVAS_WIDTH - 4.4 * BLOCK_SIZE,
      GAME_CANVAS_HEIGHT - 4.4 * BLOCK_SIZE
    );
    ctx.drawImage(this.winCharacter, 200, 200, 450, 450);
    ctx.fillStyle = "#620200";
    ctx.font = "60px Verdana";
    ctx.fillText("Win", 350, 300);
    ctx.font = "30px Verdana";
    ctx.fillText("Amy's code don't", 650, 350);
    ctx.fillText("have more bugs", 650, 400);
    ctx.fillText("and it's git commited", 650, 450);
    ctx.fillText("Thank you", 650, 530);
    ctx.fillText("Do you want to", 650, 580);
    ctx.fillText("try again?", 650, 630);
  }

  moveBugs() {
    this.bugs.forEach(bug => {
      let bugIOnGrid = bug.y / BLOCK_SIZE;
      let bugJOnGrid = bug.x / BLOCK_SIZE;

      //Stores the empty positions for where each bug can go
      const possibleDirections = [];

      //checks if the bug stays in the limits of the canvas and if the next position in that direction is null
      //!!Try & error to fix the ceil and floor
      if (Math.ceil(bugJOnGrid) - 1 >= 0 && this.blocks[Math.floor(bugIOnGrid)][Math.ceil(bugJOnGrid) - 1] === null) {
        possibleDirections.push("left");
      }
      if (
        Math.floor(bugJOnGrid) + 1 < NUM_BLOCKS_HORIZONTAL &&
        this.blocks[Math.floor(bugIOnGrid)][Math.floor(bugJOnGrid) + 1] === null
      ) {
        possibleDirections.push("right");
      }
      if (Math.ceil(bugIOnGrid) - 1 >= 0 && this.blocks[Math.ceil(bugIOnGrid) - 1][Math.floor(bugJOnGrid)] === null) {
        possibleDirections.push("up");
      }
      if (
        Math.floor(bugIOnGrid) + 1 < NUM_BLOCKS_VERTICAL &&
        this.blocks[Math.floor(bugIOnGrid) + 1][Math.floor(bugJOnGrid)] === null
      ) {
        possibleDirections.push("down");
      }

      //if the bug didin't colide... (all bugs start to move left)
      if (possibleDirections.includes(bug.direction)) {
        bug.move();
        //if there are other possible directions
      } else if (possibleDirections.length > 0) {
        const possibleDirectionsIndex = Math.floor(Math.random() * possibleDirections.length);
        const selectedDirection = possibleDirections[possibleDirectionsIndex];
        bug.changeDirection(selectedDirection);
      }
    });
  }

  //To see witch blocks explodes
  explodeBombs() {
    let characterIOnGrid = this.character.y / BLOCK_SIZE;
    let characterJOnGrid = this.character.x / BLOCK_SIZE;

    //iterates over the rows in the blocks array of arrays
    for (let i = 0; i < this.blocks.length; i++) {
      //iterates over the columns in that row
      for (let j = 0; j < this.blocks[i].length; j++) {
        //block at i, j
        const block = this.blocks[i][j];
        if (this.blocks[i][j] !== null) {
        this.blocks[i][j] = this.blocks[i][j].update();
        }
        // if the position is a bomb and the time is up
        if (block instanceof Bomb && block.shouldExplode()) {
          // Destroy neighbour blocks (calls method onExplosion of a block)
          if (j + 1 < NUM_BLOCKS_HORIZONTAL && this.blocks[i][j + 1] !== null) {
            this.blocks[i][j + 1] = this.blocks[i][j + 1].onExplosion();
          }
          if (j - 1 >= 0 && this.blocks[i][j - 1] !== null) {
            this.blocks[i][j - 1] = this.blocks[i][j - 1].onExplosion();
          }
          if (i + 1 < NUM_BLOCKS_VERTICAL && this.blocks[i + 1][j] !== null) {
            this.blocks[i + 1][j] = this.blocks[i + 1][j].onExplosion();
          }
          if (i - 1 >= 0 && this.blocks[i - 1][j] !== null) {
            this.blocks[i - 1][j] = this.blocks[i - 1][j].onExplosion();
          }

          // Destroy the bomb (inside the if that states the [i][j] is an instance of bomb)
          this.blocks[i][j] = this.blocks[i][j].onExplosion();

          // Check if character is caught in explosion (vertical region and horizontal region)
          if (
            (characterJOnGrid === j && (i - 1 <= characterIOnGrid && characterIOnGrid <= i + 1)) ||
            (characterIOnGrid === i && (j - 1 <= characterJOnGrid && characterJOnGrid <= j + 1))
          ) {
            this.character.die();
            this.setGameOver();
          }

          // Positions next to a bomb - 10 pixels to adjust buffer zone
          const minXHorizontalBomb = j * BLOCK_SIZE - BLOCK_SIZE + 10;
          const maxXHorizontalBomb = j * BLOCK_SIZE + 2 * BLOCK_SIZE - 10;
          const minYHorizontalBomb = i * BLOCK_SIZE + 10;
          const maxYHorizontalBomb = i * BLOCK_SIZE + BLOCK_SIZE - 10;
          const minXVerticalBomb = j * BLOCK_SIZE + 10;
          const maxXVerticalBomb = j * BLOCK_SIZE + BLOCK_SIZE - 10;
          const minYVerticalBomb = i * BLOCK_SIZE - BLOCK_SIZE + 10;
          const maxYVerticalBomb = i * BLOCK_SIZE + 2 * BLOCK_SIZE - 10;

          // Retuns a array whith the bugs that will survive (rectIntersect - utils)
          this.bugs = this.bugs.filter(bug => {
            //return true if rect horizontal Intresect
            if (
              rectIntersect(
                minXHorizontalBomb,
                maxXHorizontalBomb,
                minYHorizontalBomb,
                maxYHorizontalBomb,
                bug.x,
                bug.x + BLOCK_SIZE,
                bug.y,
                bug.y + BLOCK_SIZE
              )
            ) {
              // return false to be removed from bugs array
              return false;
            }
            //return true if rect vertical Intresect
            if (
              rectIntersect(
                minXVerticalBomb,
                maxXVerticalBomb,
                minYVerticalBomb,
                maxYVerticalBomb,
                bug.x,
                bug.x + BLOCK_SIZE,
                bug.y,
                bug.y + BLOCK_SIZE
              )
            ) {
              // return false to be removed from bugs array
              return false;
            }
            // if don't intersect, keep in the array
            return true;
          });
        }
      }
    }
  }

  //
  checkIfCharacterCaught() {
    this.bugs.forEach(bug => {
      if (
        rectIntersect(
          this.character.x,
          this.character.x + BLOCK_SIZE,
          this.character.y,
          this.character.y + BLOCK_SIZE,
          bug.x + 10,
          bug.x + BLOCK_SIZE - 10,
          bug.y + 10,
          bug.y + BLOCK_SIZE - 10
        )
      ) {
        this.character.die();
        this.setGameOver();
      }
    });
  }

  handleKeyPress(keyCode) {
    //Only "listens" keybord if the game isn't won or lost
    if (this.isGameOver === false && this.isGameWon === false) {
      let i = this.character.y / BLOCK_SIZE;
      let j = this.character.x / BLOCK_SIZE;
      switch (keyCode) {
        case 37: // left
          if (this.character.x > 0 && (this.blocks[i][j - 1] === null || this.blocks[i][j - 1].isSolid() === false)) {
            this.character.x -= BLOCK_SIZE;
          }
          break;
        case 38: // up
          if (this.character.y > 0 && (this.blocks[i - 1][j] === null || this.blocks[i - 1][j].isSolid() === false)) {
            this.character.y -= BLOCK_SIZE;
          }
          break;
        case 39: // right
          if (
            j + 1 < NUM_BLOCKS_HORIZONTAL &&
            (this.blocks[i][j + 1] === null || this.blocks[i][j + 1].isSolid() === false)
          ) {
            this.character.x += BLOCK_SIZE;
          }
          break;
        case 40: // down
          if (
            i + 1 < NUM_BLOCKS_VERTICAL &&
            (this.blocks[i + 1][j] === null || this.blocks[i + 1][j].isSolid() === false)
          ) {
            this.character.y += BLOCK_SIZE;
          }
          break;
        case 32:
          const bomb = new Bomb();
          //After the bomb explodes stores the position as hidden block (if in that position is an exit block)
          bomb.setHiddenBlock(this.blocks[i][j]);
          this.blocks[i][j] = bomb;
          break;
      }
    }
  }

  //"Moves" the game
  update() {
    this.explodeBombs();
    this.moveBugs();
    if (!(this.isGameWon || this.isGameOver)) {
      this.checkIfCharacterCaught();
      this.checkWin();
    }
  }

  //Checks if the position of the character is an exit block and there are no more bugs
  checkWin() {
    let i = this.character.y / BLOCK_SIZE;
    let j = this.character.x / BLOCK_SIZE;
    if (this.blocks[i][j] instanceof ExitBlock && this.bugs.length === 0) {
      this.setGameWon();
      return;
    }
  }

  //Only executes ONCE if the game is won
  setGameWon() {
    if (!this.isGameWon) {
      this.isGameWon = true;
      stopSong();
      playGameWin();
    }
  }

  //Only executes ONCE if the game is lost
  setGameOver() {
    if (!this.isGameOver) {
      this.isGameOver = true;
      stopSong();
      playGameOver();
    }
  }
}
