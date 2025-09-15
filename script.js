const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

let players = [
  {name: "You", x: 300, y: 350},
  {name: "P2", x: 150, y: 150},
  {name: "P3", x: 450, y: 150}
];

let playerStates = ['idle', 'active', 'throw', 'catch'];
let avatars = [];

// 이미지 preload
let imagesToLoad = 0;

for (let i = 0; i < 3; i++) {
  avatars[i] = {};
  playerStates.forEach(state => {
    avatars[i][state] = new Image();
    avatars[i][state].src = `assets/player/${state}/${i+1}.png`;
    imagesToLoad++;
    avatars[i][state].onload = () => {
      imagesToLoad--;
      if (imagesToLoad === 0) startGame();  // 모든 이미지 로드 후 게임 시작
    };
  });
}

let ballImg = new Image();
ballImg.src = 'assets/ball.png';
imagesToLoad++;
ballImg.onload = () => {
  imagesToLoad--;
  if (imagesToLoad === 0) startGame();
};

let ball = {x: 300, y: 350, radius: 10, heldBy: 0};
let throws = 0;
let maxThrows = 30;
let condition = "inclusion"; // "exclusion"으로 배척 버전

function throwBall() {
  if (throws >= maxThrows) {
    document.getElementById("info").innerText = "Game Over";
    return;
  }

  let current = ball.heldBy;
  let target;

  if (condition === "inclusion") {
    target = Math.random() < 0.4 ? 0 : (Math.random() < 0.5 ? 1 : 2);
  } else {
    if (throws < 6) target = Math.random() < 0.2 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    else target = Math.random() < 0.05 ? 0 : (Math.random() < 0.5 ? 1 : 2);
  }

  animateThrow(current, target);
  ball.heldBy = target;
  throws++;
}

function animateThrow(from, to) {
  let startX = players[from].x;
  let startY = players[from].y;
  let endX = players[to].x;
  let endY = players[to].y;

  let ballSpeed = 500;
  let steps = 30;
  let intervalTime = ballSpeed / steps;
  let step = 0;

  let interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
    ball.x = startX + (endX - startX) * (step / steps);
    ball.y = startY + (endY - startY) * (step / steps);
    drawBall();

    step++;
    if (step > steps) {
      clearInterval(interval);
      setTimeout(throwBall, 1000);
    }
  }, intervalTime);
}

function drawPlayers() {
  for (let i = 0; i < players.length; i++) {
    ctx.drawImage(avatars[i]['idle'], players[i].x - 20, players[i].y - 20, 40, 40);
    ctx.fillStyle = "black";
    ctx.fillText(players[i].name, players[i].x - 10, players[i].y + 40);
  }
}

function drawBall() {
  ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius*2, ball.radius*2);
}

function startGame() {
  document.getElementById("loading-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  drawPlayers();
  drawBall();
  setTimeout(throwBall, 1000);
}
