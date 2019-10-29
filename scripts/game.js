class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.isGameOver = false;
    this.wonGame = false;
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
      const breakableBlock = new BreakableBlock();
      if (i === 0) {
        breakableBlock.setHiddenBlock(new ExitBlock());
      }
      //where to generate the breakable block - based on the randomly choosed object
      blocks[selectedEmptyPosition.i][selectedEmptyPosition.j] = breakableBlock;
      //remove the recent occupied position from the emptyPositions arry to prevent the random "choosing" the same position again
      emptyPositions.splice(emptyPositionIndex, 1);
    }
    // Bugs created based on the empty spaces array AFTER the breakableBlocks are created
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

  moveBugs() {
    this.bugs.forEach(bug => {
      let bugIOnGrid = bug.y / BLOCK_SIZE;
      let bugJOnGrid = bug.x / BLOCK_SIZE;

      const possibleDirections = [];
      if (Math.ceil(bugJOnGrid) - 1 >= 0 && blocks[Math.floor(bugIOnGrid)][Math.ceil(bugJOnGrid) - 1] === null) {
        possibleDirections.push("left");
      }
      if (
        Math.floor(bugJOnGrid) + 1 < NUM_BLOCKS_HORIZONTAL &&
        blocks[Math.floor(bugIOnGrid)][Math.floor(bugJOnGrid) + 1] === null
      ) {
        possibleDirections.push("right");
      }
      if (Math.ceil(bugIOnGrid) - 1 >= 0 && blocks[Math.ceil(bugIOnGrid) - 1][Math.floor(bugJOnGrid)] === null) {
        possibleDirections.push("up");
      }
      if (
        Math.floor(bugIOnGrid) + 1 < NUM_BLOCKS_VERTICAL &&
        blocks[Math.floor(bugIOnGrid) + 1][Math.floor(bugJOnGrid)] === null
      ) {
        possibleDirections.push("down");
      }

      if (possibleDirections.includes(bug.direction)) {
        bug.move();
      } else if (possibleDirections.length > 0) {
        const possibleDirectionsIndex = Math.floor(Math.random() * possibleDirections.length);
        const selectedDirection = possibleDirections[possibleDirectionsIndex];
        bug.changeDirection(selectedDirection);
      }
    });
  }
  //To see witch blocks explodes
  explodeBombs() {
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
          // Destroy neighbour blocks
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
          // Destroy bomb
          blocks[i][j] = null;

          // Check if character is caught in explosion
          if (
            (characterJOnGrid === j && (i - 1 <= characterIOnGrid && characterIOnGrid <= i + 1)) ||
            (characterIOnGrid === i && (j - 1 <= characterJOnGrid && characterJOnGrid <= j + 1))
          ) {
            character.die();
            this.isGameOver = true;
          }
          // Retuns a array whith the bugs that will survive
          const minXHorizontalBomb = j * BLOCK_SIZE - BLOCK_SIZE + 10;
          const maxXHorizontalBomb = j * BLOCK_SIZE + 2 * BLOCK_SIZE - 10;
          const minYHorizontalBomb = i * BLOCK_SIZE + 10;
          const maxYHorizontalBomb = i * BLOCK_SIZE + BLOCK_SIZE - 10;
          const minXVerticalBomb = j * BLOCK_SIZE + 10;
          const maxXVerticalBomb = j * BLOCK_SIZE + BLOCK_SIZE - 10;
          const minYVerticalBomb = i * BLOCK_SIZE - BLOCK_SIZE + 10;
          const maxYVerticalBomb = i * BLOCK_SIZE + 2 * BLOCK_SIZE - 10;

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
              // return false to be removed from this.bugs
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
              // return false to be removed from this.bugs
              return false;
            }
            // if don't intersect, keep in the array
            return true;
          });
        }
      }
    }
  }

  checkIfCharacterCaught() {
    this.bugs.forEach(bug => {
      if (
        rectIntersect(
          character.x,
          character.x + BLOCK_SIZE,
          character.y,
          character.y + BLOCK_SIZE,
          bug.x + 10,
          bug.x + BLOCK_SIZE - 10,
          bug.y + 10,
          bug.y + BLOCK_SIZE - 10
        )
      ) {
        character.die();
        this.isGameOver = true;
      }
    });
  }

  handleKeyPress(keyCode) {
    if (this.isGameOver === false && this.wonGame === false) {
      let i = character.y / BLOCK_SIZE;
      let j = character.x / BLOCK_SIZE;
      switch (keyCode) {
        case 37: // left
          if (character.x > 0 && (blocks[i][j - 1] === null || blocks[i][j - 1].isSolid() === false)) {
            character.x -= BLOCK_SIZE;
          }
          break;
        case 38: // up
          if (character.y > 0 && (blocks[i - 1][j] === null || blocks[i - 1][j].isSolid() === false)) {
            character.y -= BLOCK_SIZE;
          }
          break;
        case 39: // right
          if (j + 1 < NUM_BLOCKS_HORIZONTAL && (blocks[i][j + 1] === null || blocks[i][j + 1].isSolid() === false)) {
            character.x += BLOCK_SIZE;
          }
          break;
        case 40: // down
          if (i + 1 < NUM_BLOCKS_VERTICAL && (blocks[i + 1][j] === null || blocks[i + 1][j].isSolid() === false)) {
            character.y += BLOCK_SIZE;
          }
          break;
        case 32:
          const bomb = new Bomb(character.x, character.y);
          blocks[i][j] = bomb;
          break;
      }
    } 
  }

  update() {
    this.explodeBombs();
    this.moveBugs();
    this.checkIfCharacterCaught();
  }

  checkWin() {
    let i = character.y / BLOCK_SIZE;
    let j = character.x / BLOCK_SIZE;
    if (blocks[i][j] instanceof ExitBlock && this.bugs.length === 0) {
      this.wonGame = true;
      return;
    }
    //verificar que i,j do personagem é o bloco "não sólido"  ou seja instance of exit block e já nao há bug
  }
}
