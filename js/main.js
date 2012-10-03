/**
 * enchant.jsの初期化とプラグインのエクスポート
 */
enchant();

window.onload = function(){
	// ゲーム画面の初期化
    var game = new Game(640, 480); // 幅640x高さ480
	
	game.fps = 15; // 15FPS

	// ゲームの定数の定義
	game.BLOCK_TYPE_NUM = 8; // ブロックの種類の数
	game.FIELD_W = 10; // フィールドの幅
	game.FIELD_H = 20; // フィールドの高さ
	game.PIXEL_PER_BLOCK = 20;

	// ブロックの移動状態
	game.MOVE_STATE = {
		NO_MOVE : 0,
		MOVE_CHANGE : 1,
		MOVE_FALL : 2
	};
	
	// ブロックの種類
	game.BLOCK_TYPE = {
		NO_BLOCK : 0,
		Z_BLOCK : 1,
		L_BLOCK : 2,
		O_BLOCK : 3,
		S_BLOCK : 4,
		I_BLOCK : 5,
		J_BLOCK : 6,
		T_BLOCK : 7,
		WALL : 8
	};

	// 位置を表すクラス
	game.Position = enchant.Class.create( {
		initialize : function( x, y ) {
			if ( arguments.length === 0 ) {
				this.setXY( 0, 0 );
			}
			else if( arguments.length === 1 ) {
				this.setXY( x, x );
			}
			else if( arguments.length === 2 ) {
				this.setXY( x, y );
			}
		},
		x : {
			get : function() {
				return this._x;
			},
			set : function( x ){
				this._x = x;
			},
		},
		y : {
			get : function() {
				return this._y;
			},
			set : function( y ){
				this._y = y;
			}
		},
		setXY : function( x, y ){
			this.x.set( x );
			this.y.set( y );
		}
	} );

	// ブロッククラス
	game.Block = enchant.Class.create( {
		initialize : function( x, y, rotate ) {
			this.pos = new game.Position( x, y );
			this._rotate = rotate;
		},
		rotate : {
			get : function() {
				return this._rotate;
			},
			set : function( rotate ){
				this._rotate = rotate;
			},
		},
	} );

	// ブロックの状態を示すクラス
	game.Status = enchant.Class.create( {
		initialize : function( x, y, rotate, type ) {
			this.pos = new game.Position( x, y );
			this.rotate.set( rotate );
			this.type.set( type );
		},
		type : {
			get : function() {
				return this._type;
			},
			set : function( type ) {
				this._type = type;
			}
		},
		rotate : {
			get : function() {
				return this._rotate;
			},
			set : function( rotate ) {
				this._rotate = rotate;
			}
		}
	} );

	// ブロックを配置するフィールド
	game.Field = enchant.Class.create( Sprite, {
		initialize : function() {
			Sprite.call(this, game.FIELD_W * game.PIXEL_PER_BLOCK, game.FIELD_H * game.PIXEL_PER_BLOCK);
			this.backgroundColor = "black";
			this._field = new Array();
			// 周囲の壁の分( 2 )と壁プラス上の見えないフィールド分（ 2 + 3 ）だけ広く配列を初期化
			for( var x = 0; x < game.FIELD_W + 2; x++ ) {
				this._field[x] = new Array();
				for( var y = 0; y < game.FIELD_H + 5; y++ ) {
					// 両側面と底面を壁に
					if( x == 0 || x == game.FIELD_W + 1 || y == 0 ) {
						this._field[x][y] = game.BLOCK_TYPE.WALL;
					}
					// それ以外はブロックが無い状態
					else {
						this._field[x][y] = game.BLOCK_TYPE.NO_BLOCK;
					}
				}
			}
		}
	} );


//    game.preload("chara1.png");
    
    game.onload = function(){
    	// TODO: ゲームの初期化
		field = new game.Field();
		game.rootScene.addChild( field );
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
    };

    game.start();
//    game.debug();
//    game.pause();
//    game.resume();
};