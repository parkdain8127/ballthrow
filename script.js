const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// 플레이어 설정
let players = [
  {name: "You", x: 300, y: 350, state: "idle"},
  {name: "P2", x: 150, y: 150, state: "idle"},
  {name: "P3", x: 450, y: 150, state: "idle"}
];

const playerStates = ['idle', 'active', 'throw', 'catch'];
let avatars = [];

// 이미지 preload
let imagesLoaded = 0;
const totalImages = 3 * playerStates.length + 1; // 3명 * 4상태 + 공

for (let i = 0; i < 3; i++) {
  avatars[i] = {};
  playerStates.forEach(state => {
    avatars[i][state] = new Image();
    avatars[i][state].src = `assets/player/${state}/${i+1}.png`;
    avatars[i][state].onload = () => { imagesLoaded++; };
  });
}

// 공 이미지
let ballImg = new Image();
ballImg.src = 'assets/ball.png';
ballImg.onload = () => { imagesLoaded++; };

// 공 정보
let ball = {x: 300, y: 350, radius: 10, heldBy: 0};
let throws = 0;
const maxThrows = 30;

// 조건 설정
let condition = "inclusion"; // 배척 버전은 "exclusion"

// 게임 시작 체크
function checkLoadingAndStart() {
  if (imagesLoaded === totalImages) {
    setTimeout(() => {
      document.getElementById("loading-screen").classList.add("hidden");
      document.getElementById("game-screen").classList.remove("hidden");
      drawPlayers();
      drawBall();
      setTimeout(throwBall, 1000);
    }, 3000); // 최소 3초 로딩 화면
  } else {
    requestAnimationFrame(checkLoadingAndStart);
  }
}
checkLoadingAndStart();

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
    if (throws < 6) target = Math.random() < 0.2 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    else target = Math.random() < 0.05 ? 0 : (Math.random() < 0.5 ? 1 : 2);
  }

  animateThrow(current, target);
  ball.heldBy = target;
  throws++;
}

// 공 애니메이션
function animateThrow(from, to) {
  players[from].state = "throw"; // 던지는 사람 throw

  const startX = players[from].x;
  const startY = players[from].y;
  const endX = players[to].x;
  const endY = players[to].y;

  const ballSpeed = 500; // ms
  const steps = 30;
  const intervalTime = ballSpeed / steps;
  let step = 0;

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();

    ball.x = startX + (endX - startX) * (step / steps);
    ball.y = startY + (endY - startY) * (step / steps);
    drawBall();

    step++;
    if (step > steps) {
      clearInterval(interval);

      // 받는 사람 catch → 1초 후 idle
      players[to].state = "catch";
      setTimeout(() => { players[to].state = "idle"; }, 1000);

      // 던진 사람 idle
      players[from].state = "idle";

      setTimeout(throwBall, 1000);
    }
  }, intervalTime);
}

// 플레이어 그리기
function drawPlayers() {
  for (let i = 0; i < players.length; i++) {
    const state = players[i].state;
    ctx.drawImage(avatars[i][state], players[i].x - 40, players[i].y - 40, 80, 80); // 캐릭터 크기 확대
    ctx.fillStyle = "black";
    ctx.fillText(players[i].name, players[i].x - 20, players[i].y + 60);
  }
}

// 공 그리기
function drawBall() {
  ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}
