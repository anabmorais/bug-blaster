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