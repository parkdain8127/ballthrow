const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

let players = [
  {name: "You", x: 300, y: 350, color: "blue"},
  {name: "P2", x: 100, y: 100, color: "red"},
  {name: "P3", x: 500, y: 100, color: "green"}
];

let ball = {x: 300, y: 350, radius: 10, heldBy: 0}; 
let throws = 0;
let maxThrows = 30;

// 설정: inclusion(포함) 또는 exclusion(배척)
let condition = "inclusion"; // <- "exclusion" 으로 바꿔서 배척 버전 생성 가능

function throwBall() {
  if (throws >= maxThrows) {
    document.getElementById("info").innerText = "Game Over";
    return;
  }

  let current = ball.heldBy;
  let target;

  if (condition === "inclusion") {
    // 참여자가 1/3~1/2 정도 받음
    if (Math.random() < 0.4) {
      target = 0; // 참가자
    } else {
      target = Math.random() < 0.5 ? 1 : 2;
    }
  } else {
    // exclusion: 초반 20%만 참가자 -> 이후 거의 없음
    if (throws < 5) {
      target = Math.random() < 0.2 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    } else {
      target = Math.random() < 0.05 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    }
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

  let steps = 30;
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
  }, 30);
}

function drawPlayers() {
  players.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(p.name, p.x - 10, p.y + 40);
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
}

function startGame() {
  document.getElementById("loading-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  drawPlayers();
  drawBall();
  setTimeout(throwBall, 1000);
}

// 로딩 화면 3초 후 시작
setTimeout(startGame, 3000);
