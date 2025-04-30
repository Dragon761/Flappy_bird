let frame = 0;
const frame_time = 150

let pipes = [];
let pipe_gap = 250;
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
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }

    bird_dy = -7;
  }
});

function startGame() {
  if (gameInterval !== null) return; // Prevent multiple intervals

  gameInterval = setInterval(() => {
    applyGravitiy();
    movePipes();
    frame++;
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
    pipe.style.left = pipe.offsetleft - 3 + "px";

    if (pipe.offsetleft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}// Remove old pipes from the array

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - 3 + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}