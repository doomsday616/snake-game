const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20; // size of each cell in pixels
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;

document.addEventListener('keydown', handleKey);

function handleKey(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (velocity.y === 0) {
        velocity = { x: 0, y: -1 };
      }
      break;
    case 'ArrowDown':
      if (velocity.y === 0) {
        velocity = { x: 0, y: 1 };
      }
      break;
    case 'ArrowLeft':
      if (velocity.x === 0) {
        velocity = { x: -1, y: 0 };
      }
      break;
    case 'ArrowRight':
      if (velocity.x === 0) {
        velocity = { x: 1, y: 0 };
      }
      break;
  }
}

function updateScore() {
  document.getElementById('scoreBoard').innerText = 'Score: ' + score;
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 1, y: 0 };
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
  score = 0;
  updateScore();
}

function update() {
  // compute new head position
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // check wall collision
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) {
    resetGame();
    return;
  }

  // check self collision
  for (const part of snake) {
    if (part.x === head.x && part.y === head.y) {
      resetGame();
      return;
    }
  }

  snake.unshift(head);

  // check if food eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    // reposition food not on snake
    let valid = false;
    while (!valid) {
      food.x = Math.floor(Math.random() * tileCount);
      food.y = Math.floor(Math.random() * tileCount);
      valid = !snake.some((p) => p.x === food.x && p.y === food.y);
    }
  } else {
    snake.pop();
  }
}

function draw() {
  // clear canvas
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // draw snake
  ctx.fillStyle = 'green';
  for (const part of snake) {
    ctx.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  }
}

function gameLoop() {
  update();
  draw();
}

resetGame();
updateScore();
setInterval(gameLoop, 100);
