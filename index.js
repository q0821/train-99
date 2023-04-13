// 創建 PixiJS Application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000
});

// 將 PixiJS Application 加入 HTML 頁面
document.body.appendChild(app.view);

// 加載圖像資源
PIXI.Loader.shared.load(setup);

function setup() {
    // 創建精靈（Sprite）
    const airplane = new PIXI.Text("士", {fontFamily: "Arial", fontSize: 24, fill: 0xffffff});
    airplane.anchor.set(0.5, 0.5); // 將 anchor 設定為中心點
    
    const bullets = [];
    // 加速度及摩擦力
    const airplaneAcceleration = 0.5;
    const airplaneFriction = 0.98;
    let velocity = { x: 0, y: 0 };
    
    let bulletCountdown = 0;
    let bulletInterval = 3000;
    // 定義 delta
    let delta = 100;


    // 設置精靈的位置
    airplane.position.set(app.view.clientWidth / 2, app.view.clientHeight / 2);

    // 將精靈添加到場景中
    app.stage.addChild(airplane);

    // 監聽方向鍵事件
    window.addEventListener("keydown", (e) => {
    if (e.key === "a") {
        velocity.x -= airplaneAcceleration;
    } else if (e.key === "d") {
        velocity.x += airplaneAcceleration;
    } else if (e.key === "w") {
        velocity.y -= airplaneAcceleration;
    } else if (e.key === "s") {
        velocity.y += airplaneAcceleration;
    }
    });
    // 在遊戲循環中更新飛機位置
    function gameLoop() {
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
        });

        // 定期新增子彈
        bulletCountdown -= delta;
        if (bulletCountdown <= 0) {
            bullets.push(new Bullet());
            bulletCountdown = bulletInterval;
            bulletInterval *= 0.95;
        }
    }
    // 開始遊戲循環
    app.ticker.add(() => {
        // TODO: 編寫遊戲邏輯
        gameLoop();
    });

    class Bullet {
        constructor() {
          // 設置子彈起始位置和速度
          const x = Math.random() < 0.5 ? 0 : app.screen.width;
          const y = Math.random() * app.screen.height;
          const speed = Math.random() * 10 + 5;
          const angle = Math.atan2(airplane.y - y, airplane.x - x);
          this.sprite = new PIXI.Text("彈", {fontFamily: "Arial", fontSize: 24, fill: 0xEEC356});
          this.sprite.anchor.set(0.5, 0.5); // 將 anchor 設定為中心點
          this.sprite.tint = 0xff0000;
          this.sprite.width = 20;
          this.sprite.height = 20;
          this.sprite.position.set(x, y);
          this.velocity = { x: speed * Math.cos(angle), y: speed * Math.sin(angle) };
          
          app.stage.addChild(this.sprite);
        }
      
        update() {
            this.sprite.x += this.velocity.x;
            this.sprite.y += this.velocity.y;
          
            // 檢查子彈是否超出螢幕範圍
            if (this.sprite.x < -this.sprite.width ||
                this.sprite.x > app.renderer.screen.width ||
                this.sprite.y < -this.sprite.height ||
                this.sprite.y > app.renderer.screen.height) {
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
}

