const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const pauseResumeButton = document.querySelector("#pause-resume");

const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

let xDirection = -2;
let yDirection = 2;
let isPaused = false;
let ballSpeed = 30;
let timerId;
let score = 0;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

class Block {
  constructor(x, y) {
    this.bottomLeft = [x, y];
    this.bottomRight = [x + blockWidth, y];
    this.topLeft = [x, y + blockHeight];
    this.topRight = [x + blockWidth, y + blockHeight];
  }
}

const blocks = [];
const rows = 3;
const cols = 5;
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    blocks.push(
      new Block(
        col * (blockWidth + 10) + 10,
        boardHeight - (row + 1) * (blockHeight + 10)
      )
    );
  }
}

function addBlocks() {
  blocks.forEach((block) => {
    const blockElement = document.createElement("div");
    blockElement.classList.add("block");
    blockElement.style.left = block.bottomLeft[0] + "px";
    blockElement.style.bottom = block.bottomLeft[1] + "px";
    grid.appendChild(blockElement);
  });
}
addBlocks();

const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();

const ball = document.createElement("div");
ball.classList.add("ball");
grid.appendChild(ball);
drawBall();

function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

function drawBall() {
  ball.style.left = ballCurrentPosition[0] + "px";
  ball.style.bottom = ballCurrentPosition[1] + "px";
}

function moveUser(e) {
  if (isPaused) return;

  if (e.key === "ArrowLeft" && currentPosition[0] > 0) {
    currentPosition[0] -= 10;
  } else if (
    e.key === "ArrowRight" &&
    currentPosition[0] < boardWidth - blockWidth
  ) {
    currentPosition[0] += 10;
  }
  drawUser();
}
document.addEventListener("keydown", moveUser);

function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}
timerId = setInterval(moveBall, ballSpeed);

function checkForCollisions() {
  blocks.forEach((block, index) => {
    if (
      ballCurrentPosition[0] > block.bottomLeft[0] &&
      ballCurrentPosition[0] < block.bottomRight[0] &&
      ballCurrentPosition[1] > block.bottomLeft[1] &&
      ballCurrentPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[index].classList.remove("block");
      blocks.splice(index, 1);
      changeDirection();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;

      if (blocks.length === 0) {
        clearInterval(timerId);
        scoreDisplay.textContent = "You Win!";
      }
    }
  });

  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0
  ) {
    xDirection *= -1;
  }
  if (ballCurrentPosition[1] >= boardHeight - ballDiameter) {
    yDirection *= -1;
  }

  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] <= currentPosition[1] + blockHeight
  ) {
    changeDirection();
    ballSpeed -= 2;
    clearInterval(timerId);
    timerId = setInterval(moveBall, ballSpeed);
  }

  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.textContent = "Game Over!";
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) yDirection = -2;
  else if (xDirection === 2 && yDirection === -2) xDirection = -2;
  else if (xDirection === -2 && yDirection === -2) yDirection = 2;
  else if (xDirection === -2 && yDirection === 2) xDirection = 2;
}

pauseResumeButton.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    timerId = setInterval(moveBall, ballSpeed);
    pauseResumeButton.textContent = "Pause";
  } else {
    isPaused = true;
    clearInterval(timerId);
    pauseResumeButton.textContent = "Resume";
  }
});
