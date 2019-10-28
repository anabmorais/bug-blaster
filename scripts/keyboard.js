document.onkeydown = function(e) {
  // character position on the grid
  let i = character.y / BLOCK_SIZE;
  let j = character.x / BLOCK_SIZE;
  switch (e.keyCode) {
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
};
