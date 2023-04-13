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
    const bullet = new PIXI.Text("彈", {fontFamily: "Arial", fontSize: 24, fill: 0xEEC356});
    // airplane.scale.set(0.5);
    // bullet.scale.set(0.5);

    // 設置精靈的位置
    airplane.position.set(app.view.clientWidth / 2, app.view.clientHeight / 2);


    // 將精靈添加到場景中
    
    app.stage.addChild(airplane);
    app.stage.addChild(bullet);

    
    const acceleration = 0.5;
    const friction = 0.98;
    let velocity = { x: 0, y: 0 };

    // 監聽方向鍵事件
    window.addEventListener("keydown", (e) => {
    if (e.key === "a") {
        velocity.x -= acceleration;
    } else if (e.key === "d") {
        velocity.x += acceleration;
    } else if (e.key === "w") {
        velocity.y -= acceleration;
    } else if (e.key === "s") {
        velocity.y += acceleration;
    }
    });

    // 在遊戲循環中更新飛機位置
    function gameLoop() {
        // 更新飛機位置
        airplane.x += velocity.x;
        airplane.y += velocity.y;
    
        // 模擬摩擦力
        velocity.x *= friction;
        velocity.y *= friction;
    }

    // 開始遊戲循環
    app.ticker.add(() => {
        // TODO: 編寫遊戲邏輯
        gameLoop();
    });
    
}