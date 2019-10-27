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