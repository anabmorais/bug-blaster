//Constants
const BLOCK_SIZE = 100;
const NUM_BLOCKS_HORIZONTAL = 13;
const NUM_BLOCKS_VERTICAL = 11;
const GAME_CANVAS_WIDTH = NUM_BLOCKS_HORIZONTAL * BLOCK_SIZE;
const GAME_CANVAS_HEIGHT = NUM_BLOCKS_VERTICAL * BLOCK_SIZE;

//sets the dimensions of the canvas based on game parameters and fills it green
const setupCanvas = () => {
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    canvas.width = GAME_CANVAS_WIDTH;
    canvas.height = GAME_CANVAS_HEIGHT;
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
};


// Wait for document to load before executing
document.addEventListener("DOMContentLoaded", setupCanvas);