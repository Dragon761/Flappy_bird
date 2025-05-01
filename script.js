let highScore = localStorage.getItem("flappyHighScore") || 0;
let frame = 0;
const frame_time = 150;

let pipes = [];
let pipe_gap = 300;
let gravity = 0.25;
let bird_dy = 0;
let score = 0;
let game_state = "Start";

let gameInterval = null;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("start-btn");

function applyGravitiy() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);

  bird.style.top = birdTop + "px";

  let angle = Math.min(Math.max(bird_dy * 2, -30), 90);
  bird.style.transform = `rotate(${angle}deg)`;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

    flapSound.play();

    bird_dy = -7;
  }
});

function startGame() {
  if (gameInterval !== null) return; // Prevent multiple intervals

  backgroundMusic.play();

  start_btn.style.visibility = "hidden";

  highScore = localStorage.getItem("flappyHighScore") || 0;
  score_display.textContent = "Score: " + score + " | Best: " + highScore;

  gameInterval = setInterval(() => {
    applyGravitiy();
    movePipes();
    checkCollision();
    frame++;
    getDifficultySettings();
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

function onStartButtonClick() {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
}

function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;

  let top_pipe = document.createElement("div");
  top_pipe.className = "pipe top-pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);

  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = "pipe bottom-pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    console.log(pipeSpeed);
    pipe.style.left = pipe.offsetLeft - pipeSpeed + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}

function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }
  // Collision with top and bottom
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }
  // Increase score when bird passes pipes (pipes are paired)
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      // Only check once for each top-bottom pair
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

function setScore(newScore) {
  if (newScore > score) {
    scoreSound.play();
  }
  score = newScore;
  score_display.textContent = "Score: " + score;
  " Best: " + highScore;
}

function endGame() {
  if (Number(score) > Number(highScore)) {
    localStorage.setItem("flappyHighScore", score);
  }
  hitSound.play();
  clearInterval(gameInterval);
  gameInterval = null;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  alert("You LOST! Your Score:" + score);
  resetGame();
}

function resetGame() {
  start_btn.style.visibility = "visible";

  bird.style.top = "50%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  score_display.textContent = "";

  bird.style.transform = `rotate(${0}deg)`;
}

let pipeSpeed = 3;

function getDifficultySettings() {
  const selected = document.getElementById("difficulty-select").value;
  if (selected === "unskilled") {
    pipeSpeed = 5;
  } else if (selected === "mid") {
    pipeSpeed = 7;
  } else if (selected === "skilled") {
    pipeSpeed = 15;
  } else if (selected === "impossible") {
    pipeSpeed = 1;
  }
}

const flapSound = new Audio("");
const scoreSound = new Audio("");
const hitSound = new Audio("");

const backgroundMusic = new Audio("");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.play();

const muteBtn = document.getElementById("mute-btn");

let musicMuted = false;

muteBtn.addEventListener("click", () => {
  if (musicMuted) {
    backgroundMusic.play();
    muteBtn.textContent = "Mute Music";
  } else {
    backgroundMusic.pause();
    muteBtn.textContent = "Play Music";
  }
  musicMuted = !musicMuted;
});
