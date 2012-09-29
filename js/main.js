// TODO: テトリミノのクラス作成
/**
 * enchant.jsの初期化とプラグインのエクスポート
 */
enchant();

window.onload = function(){
	// ゲーム画面の初期化
    var game = new Game(640, 480); // 幅640x高さ480
    game.fps = 15; // 15FPS
//    game.preload("chara1.png");
    
    game.onload = function(){
    	// TODO: ゲームの初期化
//        bear = new Sprite(32, 32);
//        bear.image = game.assets["chara1.png"];
//        bear.x = 0;
//        bear.y = 0;
//        bear.frame = 5;
//        game.rootScene.addChild(bear);

// - "touchstart" : タッチ/クリックされたとき
// - "touchmove" : タッチ座標が動いた/ドラッグされたとき
// - "touchend" : タッチ/クリックが離されたとき
// - "enterframe" : 新しいフレームが描画される前
// - "exitframe" : 新しいフレームが描画された後
//        bear.addEventListener("enterframe", function(){
//            this.x += 1;
//            this.frame = this.age % 2 + 6;
//        });

//        bear.addEventListener("touchstart", function(){
//            game.rootScene.removeChild(bear);
//        });
//    };

    game.start();
//    game.debug();
//    game.pause();
//    game.resume();
};