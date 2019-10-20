//Constants
const BLOCK_SIZE = 100;
const NUM_BLOCKS_HORIZONTAL = 13;
const NUM_BLOCKS_VERTICAL = 11;
const GAME_CANVAS_WIDTH = NUM_BLOCKS_HORIZONTAL * BLOCK_SIZE;
const GAME_CANVAS_HEIGHT = NUM_BLOCKS_VERTICAL * BLOCK_SIZE;

//Main Game Class
class Game {
    constructor(ctx) {
        this.ctx = ctx;

        //initialize the blocks grid with null
        this.blocks = [];
        for (let i = 0; i < NUM_BLOCKS_VERTICAL; i++) {
            this.blocks.push([]);

            for(let j = 0; j < NUM_BLOCKS_HORIZONTAL; j++) {
                this.blocks[i].push(null);
            }
        }
    }

    draw() {
        //Draw Background
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);

        //draw blocks
        for (let i = 0; i < this.blocks.length; i++) {
            for(let j = 0; j < this.blocks[i].length; j++) {
                if(this.blocks[i][j] !== null) {
                    this.blocks[i][j].draw(this.ctx, BLOCK_SIZE * j, BLOCK_SIZE * i);
                }
            }
        }
    }
}

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
}

class BreakableBlock extends Block {
    constructor() {
        super("./images/breakable_block.jpg");
    }
}

class UnbreakableBlock extends Block {
    constructor() {
        super("./images/unbreakable_block.jpg");
    }
}

//sets the dimensions of the canvas based on game parameters and return canvas context
const setupCanvas = () => {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    canvas.width = GAME_CANVAS_WIDTH;
    canvas.height = GAME_CANVAS_HEIGHT;
    return ctx;
};

//Function called when the page is ready, which sets up the canvas and initializes a new game.
const initGame = () => {
    const ctx = setupCanvas();
    let game =  Game(ctx);
}


// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", initGame);