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