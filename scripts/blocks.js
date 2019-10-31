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
    isSolid() {
      return true;
    }
  }

  //extends the class block - the breakable block has an image source
class BreakableBlock extends Block {
    constructor() {
      super("./images/tile_rock_brown@3x.png");
      this.hiddenBlock = null;
    }
    onExplosion() {
      return this.hiddenBlock;
    }
    setHiddenBlock(block) {
      this.hiddenBlock = block;
    }
  }
  
  //extends the class block - the unbreakable block has an image source
  class UnbreakableBlock extends Block {
    constructor() {
      super("./images/tile_wall@3x.png");
    }
  }

  class ExitBlock extends Block {
    constructor() {
      super("./images/git.png");
    }
    isSolid() {
      return false;
    }
  }

  class Bomb extends Block {
    constructor(x, y) {
      super("./images/bomb.jpg");
      this.hiddenBlock = null;
      this.x = x;
      this.y = y;
      this.isTimerFinished = false;
      setTimeout(() => {
        this.isTimerFinished = true;
      }, TIME_TO_EXPLODE);
    }
    onExplosion() {
      this.isTimerFinished = true;
      return this.hiddenBlock;
    }
    shouldExplode() {
      return this.isTimerFinished;
    }
    setHiddenBlock(block) {
      this.hiddenBlock = block;
    }
    draw(ctx, x, y) {
      if(this.hiddenBlock !== null){
        this.hiddenBlock.draw(ctx, x, y);
      }
      super.draw(ctx, x, y);
    }
  }