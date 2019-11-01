const backgroundSound = new  Audio("/bug-blaster/sounds/sound1.mp3");
backgroundSound.loop = true;
backgroundSound.volume = 0.5;

function playSong () {
    backgroundSound.currentTime = 0;
    backgroundSound.play();
}

function stopSong () {
    backgroundSound.pause();
}

const gameOverSound = new  Audio("/bug-blaster/sounds/game-over-sound.mp3");

function playGameOver () {
    gameOverSound.play();
}

const gameWinSound = new  Audio("/bug-blaster/sounds/game-win-sound.mp3");

function playGameWin () {
    gameWinSound.play();
}

