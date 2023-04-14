const canvas = document.querySelector(".game-area");
const ctx = canvas.getContext("2d");
canvas.style.border = "3px solid black";

const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".high-score");
const showRetryMenu = document.querySelector(".hide");
const retryBtn = document.querySelector(".retry__button");

let highScore = 0;
let intervalId = 0;
let intervalTime = 500;
const scale = 50;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

function showEndMenu() {
  showRetryMenu.classList.remove("hide");
  retryBtn.classList.remove("hide");
  retryBtn.addEventListener("click", function () {
    location.reload();
  });
}

function setup() {
  fruit.pickLocation();

  intervalId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    fruit.draw();

    if (snake.eat(fruit)) {
      fruit.pickLocation();
      updateScore();
      snake.draw();
    }

    snake.checkCollision();
    updateScore();
  }, intervalTime);
}

function updateScore() {
  scoreEl.innerHTML = `score: ${snake.total}`;

  let highScore = localStorage.getItem("high-score") || 0;
  highScoreEl.innerHTML = `high score: ${highScore}`;

  if (snake.total > highScore) {
    highScore = snake.total;
    localStorage.setItem("high-score", highScore);
  }
}

class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];
  }

  draw() {
    ctx.fillStyle = "#000";

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
  }

  update() {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x > canvas.width - scale) {
      this.x = 0;
    }

    if (this.x < 0) {
      this.x = canvas.width - scale;
    }

    if (this.y > canvas.height - scale) {
      this.y = 0;
    }

    if (this.y < 0) {
      this.y = canvas.height - scale;
    }
  }

  changeDirection(direction) {
    if (
      (direction === "Left" && this.xSpeed !== scale) ||
      (direction === "Right" && this.xSpeed !== -scale) ||
      (direction === "Up" && this.ySpeed !== scale) ||
      (direction === "Down" && this.ySpeed !== -scale)
    ) {
      switch (direction) {
        case "Up":
          this.xSpeed = 0;
          this.ySpeed = -scale;
          break;
        case "Down":
          this.xSpeed = 0;
          this.ySpeed = scale;
          break;
        case "Left":
          this.xSpeed = -scale;
          this.ySpeed = 0;
          break;
        case "Right":
          this.xSpeed = scale;
          this.ySpeed = 0;
          break;
      }
    }
  }

  eat(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  checkCollision() {
    if (
      this.x < 0 ||
      this.x >= canvas.width - scale ||
      this.y < 0 ||
      this.y >= canvas.height - scale
    ) {
      this.total = 0;
      this.tail = [];
      updateScore();
      clearInterval(intervalId);
      showEndMenu();
    }
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.total = 0;
        this.tail = [];
        updateScore();
        clearInterval(intervalId);
        showEndMenu();
      }
    }
  }

  grow() {
    this.total++;
  }
}

class Fruit {
  constructor() {
    this.x;
    this.y;
  }

  pickLocation() {
    this.x = Math.floor(Math.random() * columns) * scale;
    this.y = Math.floor(Math.random() * rows) * scale;
  }

  draw() {
    ctx.fillStyle = "#333";
    ctx.fillRect(this.x, this.y, scale, scale);
  }
}

function addEventListener() {
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        snake.changeDirection("Up");
        break;
      case "KeyS":
      case "ArrowDown":
        snake.changeDirection("Down");
        break;
      case "KeyA":
      case "ArrowLeft":
        snake.changeDirection("Left");
        break;
      case "KeyD":
      case "ArrowRight":
        snake.changeDirection("Right");
        break;
    }
  });

  retryBtn.addEventListener("click", () => {
    setup();
  });
}

snake = new Snake();
fruit = new Fruit();
addEventListener();

window.onload = () => {
  setup();
};
