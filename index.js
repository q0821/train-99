let isGameStarted = false;
let isGameOver = false;
let startTime = null;
let elapsedTime = 0;
let timerElement = null;
let airplane = null;
// 加速度及摩擦力
const airplaneAcceleration = 0.5;
const airplaneFriction = 0.99;
let velocity = { x: 0, y: 0 };

let initialBulletInterval = 3000;
let bulletInterval = initialBulletInterval;
let bulletCountdown = bulletInterval;


// 定義 delta
let delta = 100;

let bullets = [];

// 監聽開始按鈕事件
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", resetGame);
const score = document.getElementById("score");


class Bullet {
  constructor() {
    // 設置子彈起始位置和速度
    const rand = Math.floor(Math.random() * 4); // 生成一個隨機整數 0, 1, 2, 3
    let x, y;
    switch (rand) {
      case 0: // 上
        x = Math.random() * app.screen.width;
        y = 0;
        break;
      case 1: // 下
        x = Math.random() * app.screen.width;
        y = app.screen.height;
        break;
      case 2: // 左
        x = 0;
        y = Math.random() * app.screen.height;
        break;
      case 3: // 右
        x = app.screen.width;
        y = Math.random() * app.screen.height;
        break;
    }

    const speed = Math.random() * 10 + 5;
    const angle = Math.atan2(airplane.y - y, airplane.x - x);
    this.sprite = new PIXI.Text('弾', {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xeec356,
    });
    this.sprite.anchor.set(0.5, 0.5); // 將 anchor 設定為中心點
    this.sprite.position.set(x, y);
    this.velocity = {
      x: speed * Math.cos(angle),
      y: speed * Math.sin(angle),
    };

    app.stage.addChild(this.sprite);
  }

  update() {
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;

    // 檢查子彈是否超出螢幕範圍
    if (
      this.sprite.x < -this.sprite.width ||
      this.sprite.x > app.renderer.screen.width ||
      this.sprite.y < -this.sprite.height ||
      this.sprite.y > app.renderer.screen.height
    ) {
      this.destroy();
    }
  }

  destroy() {
    app.stage.removeChild(this.sprite);
    // 將該子彈從 `bullets` 陣列中移除
    const index = bullets.indexOf(this);
    bullets.splice(index, 1);
  }
}

function startGame() {
  isGameStarted = true;
  startButton.classList.add('hidden');
  startTime = Date.now();
  timerElement = document.getElementById("timer");
  // TODO: 觸發開始事件
}

function endGame() {
  isGameOver = true;
  restartButton.classList.remove('hidden');
  score.innerText = timerElement.textContent;
  score.classList.remove('hidden');
  
  // TODO: 觸發結束事件
}

function resetGame() {
  isGameOver = false;
  airplane.x = app.screen.width / 2;
  airplane.y = app.screen.height / 2;
  velocity.x = 0;
  velocity.y = 0;
  // 刪除舞台上的子彈
  bullets.forEach((bullet) => {
    app.stage.removeChild(bullet.sprite);
  });
  bullets = [];
  bulletInterval = initialBulletInterval;
  bulletCountdown = bulletInterval;
  // 刪除舞台上的子彈
  
  startTime = Date.now();
  elapsedTime = 0;
  timerElement.textContent = "0:000";
  restartButton.classList.add('hidden');
  score.classList.add('hidden');
}

// 檢查兩個元素是否相撞
function isColliding(a, b) {
  const aRect = a.getBounds();
  const bRect = b.getBounds();
   // 縮小邊界框的大小
   aRect.x += aRect.width * 0.1;
   aRect.y += aRect.height * 0.1;
   aRect.width *= 0.8;
   aRect.height *= 0.8;
  return aRect.x + aRect.width > bRect.x &&
         aRect.x < bRect.x + bRect.width &&
         aRect.y + aRect.height > bRect.y &&
         aRect.y < bRect.y + bRect.height;
}

function createAirplane() {
  airplane = new PIXI.Text('士', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
  });
  airplane.anchor.set(0.5);
  airplane.x = app.screen.width / 2;
  airplane.y = app.screen.height / 2;
  app.stage.addChild(airplane);
}
// 遊戲邏輯
function gameLogic() {
  // 更新飛機位置
  airplane.x += velocity.x;
  airplane.y += velocity.y;

  // 確保飛機不會移出螢幕邊緣
  const airplaneHalfWidth = airplane.width / 2;
  const airplaneHalfHeight = airplane.height / 2;
  const maxX = app.screen.width - airplaneHalfWidth;
  const maxY = app.screen.height - airplaneHalfHeight;
  airplane.x = Math.max(airplaneHalfWidth, Math.min(maxX, airplane.x));
  airplane.y = Math.max(airplaneHalfHeight, Math.min(maxY, airplane.y));

  // 模擬摩擦力
  velocity.x *= airplaneFriction;
  velocity.y *= airplaneFriction;

  // 更新子彈位置
  bullets.forEach((bullet) => {
    bullet.update();
    // 檢查子彈是否與飛機相撞
    if (isColliding(bullet.sprite, airplane)) {
      endGame();
    }
  });

  // 定期新增子彈
  bulletCountdown -= delta;
  if (bulletCountdown <= 0) {
    bullets.push(new Bullet());
    bulletCountdown = bulletInterval;
    bulletInterval *= 0.95;
  }

  // 更新計時器
  if (startTime !== null && !isGameOver) {
    elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    timerElement.textContent = `${seconds}:${milliseconds.toString().padStart(3, "0")}`;
  }
}
// 在遊戲循環中更新飛機位置
function gameLoop() {
  if (isGameStarted && !isGameOver) {
    // TODO: 編寫遊戲邏輯
    gameLogic();
  } else if (isGameOver) {
    // TODO: 觸發結束事件
  }
}

// 創建 PixiJS Application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
});

// 將 PixiJS Application 加入 HTML 頁面
// app.view.setAttribute("id", "gameblock");
app.view.classList.add('fixed','w-screen','h-screen','inset-0');
document.body.appendChild(app.view);

// 加載圖像資源
PIXI.Loader.shared.load(setup);

function setup() {
  // 創建飛機
  createAirplane();

  // 設置精靈的位置
  airplane.position.set(app.view.clientWidth / 2, app.view.clientHeight / 2);

  // 將精靈添加到場景中
  app.stage.addChild(airplane);

  // 監聽方向鍵事件
  window.addEventListener('keydown', (e) => {
    if (e.key === 'a') {
      velocity.x -= airplaneAcceleration;
    } else if (e.key === 'd') {
      velocity.x += airplaneAcceleration;
    } else if (e.key === 'w') {
      velocity.y -= airplaneAcceleration;
    } else if (e.key === 's') {
      velocity.y += airplaneAcceleration;
    }
  });
  
  // 開始遊戲循環
  app.ticker.add(() => {
    // TODO: 編寫遊戲邏輯
    gameLoop();
  });
}
