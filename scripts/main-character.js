class MainCharacter {
    constructor() {
      this.img = new Image();
      this.img.src = "./images/amy_game.png";
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