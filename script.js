const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// 플레이어 설정 (3명)
let players = [
  {name: "You", x: 300, y: 350},
  {name: "P2", x: 100, y: 100},
  {name: "P3", x: 500, y: 100}
];

// assets 구조 기반 이미지 로드
let playerStates = ['idle', 'active', 'throw', 'catch'];
let avatars = [];

// 각 플레이어마다 상태별 이미지 로드
for (let i = 0; i < 3; i++) {
  avatars[i] = {};
  playerStates.forEach(state => {
    avatars[i][state] = new Image();
    // 예: assets/player/idle/1.png, 2.png, 3.png
    avatars[i][state].src = `assets/player/${state}/${i+1}.png`;
  });
}

// 공 이미지
let ballImg = new Image();
ballImg.src = 'assets/ball.png';

// 공 정보
let ball = {x: 300, y: 350, radius: 10, heldBy: 0}; 

// throw 횟수
let throws = 0;
let maxThrows = 30;

// 조건 설정: "inclusion" / "exclusion"
let condition = "inclusion"; // 배척 버전은 "exclusion"

// 공 던지기
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
    if (throws < 6) {
      target = Math.random() < 0.2 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    } else {
      target = Math.random() < 0.05 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    }
  }

  animateThrow(current, target);
  ball.heldBy = target;
  throws++;
}

// 공 애니메이션 (500ms)
function animateThrow(from, to) {
  let startX = players[from].x;
  let startY = players[from].y;
  let endX = players[to].x;
  let endY = players[to].y;

  let ballSpeed = 500; // ms
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

// 플레이어 그리기
function drawPlayers() {
  for (let i = 0; i < players.length; i++) {
    // 현재는 idle 상태 사용 (필요 시 active/throw/catch로 변경 가능)
    ctx.drawImage(avatars[i]['idle'], players[i].x - 20, players[i].y - 20, 40, 40);
    ctx.fillStyle = "black";
    ctx.fillText(players[i].name, players[i].x - 10, players[i].y + 40);
  }
}

// 공 그리기
function drawBall() {
  ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius*2, ball.radius*2);
}

// 게임 시작
function startGame() {
  document.getElementById("loading-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  drawPlayers();
  drawBall();
  setTimeout(throwBall, 1000);
}

// 로딩 화면 3초 후 시작
setTimeout(startGame, 3000);
