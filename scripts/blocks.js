class Block {
  constructor(src) {
    this.img = new Image();
    this.img.src = src;
    this.width = BLOCK_SIZE;
    this.height = BLOCK_SIZE;
  }
  update() {
    return this;
  }
  draw(ctx, x, y) {
    ctx.drawImage(this.img, x, y, this.width, this.height);
  }
  onExplosion() {
    return this;
  }
  isSolid() {
    return true;
  }
}

class UnbreakableBlock extends Block {
  constructor() {
    super("./images/tile_wall@3x.png");
  }
}

class BreakableBlock extends Block {
  constructor() {
    super("./images/tile_rock_brown@3x.png");
    this.hiddenBlock = null;
  }
  //when hit by an explosion the breakableBlock is replaced by an explosion block and its hiddenBlock becomes the explosion hiddenBlock
  onExplosion() {
    const explosion = new Explosion();
    explosion.setHiddenBlock(this.hiddenBlock);
    return explosion;
  }
  setHiddenBlock(block) {
    this.hiddenBlock = block;
  }
}

class ExitBlock extends Block {
  constructor() {
    super("./images/git.png");
  }
  //when hit by an explosion the ExitBlock is replaced by an explosion block. The explosion hiddenBlock, is the exit block(this) so it reapears when the explosion finishes
  onExplosion() {
    const explosion = new Explosion();
    explosion.setHiddenBlock(this);
    return explosion;
  }
  isSolid() {
    return false;
  }
}

class Bomb extends Block {
  constructor() {
    super("./images/bomb.png");
    this.explosionSound = new Audio("./sounds/boom.wav");
    this.hiddenBlock = null;
    this.isTimerFinished = false;
    //only play the explosion sound once - if the timer was already finished (because a neighbour bomb exploded) the code isn't executed.
    setTimeout(() => {
      if(!this.isTimerFinished) {
      this.isTimerFinished = true;
      const explosion = new Explosion();
      explosion.setHiddenBlock(this.hiddenBlock);
      this.hiddenBlock = explosion;
      this.explosionSound.play();
      }
    }, TIME_TO_EXPLODE);
  }
  //Only to avoid the exit block from disapearing - hiddenBlock can be exit block or null
  onExplosion() {
    this.isTimerFinished = true;
    const explosion = new Explosion();
    explosion.setHiddenBlock(this.hiddenBlock);
    this.hiddenBlock = explosion;
    return this;
  }
  shouldExplode() {
    return this.isTimerFinished;
  }
  setHiddenBlock(block) {
    this.hiddenBlock = block;
  }
  update(){
    if(!this.isTimerFinished) {
      return this;
    } else {
      return this.hiddenBlock;
    }
  }
  //To allow to draw the bomb OVER the exit block
  draw(ctx, x, y) {
    if (this.hiddenBlock !== null) {
      this.hiddenBlock.draw(ctx, x, y);
    }
    super.draw(ctx, x, y);
  }
}

class Explosion extends Block {
  constructor() {
    super("./images/explosion.png");
    this.hiddenBlock = null;
    this.isTimerFinished = false;
    setTimeout(() => {
      this.isTimerFinished = true;
    }, EXPLOSION_DURATION);
  }
  setHiddenBlock(block) {
    this.hiddenBlock = block;
  }
  update(){
    if(!this.isTimerFinished) {
      return this;
    } else {
      return this.hiddenBlock;
    }
  }
 }
