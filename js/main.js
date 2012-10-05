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
			this._x = x;
			this._y = y;
		}
	} );

	// ブロッククラス
	game.Block = enchant.Class.create( {
		initialize : function( type ) {
			this.pos = new Array();
			this.pos[0] = new game.Position();
			this.pos[1] = new game.Position();
			this.pos[2] = new game.Position();
			this._rotate = rotate;
			this.init( type );
		},
		init : function( type ){
			switch( type ) {
				case game.BLOCK_TYPE.NO_BLOCK :
					this._rotate = 1;
					this.pos[0].setXY( 0, 0 );
					this.pos[1].setXY( 0, 0 );
					this.pos[2].setXY( 0, 0 );
					break;
				case game.BLOCK_TYPE.Z_BLOCK :
					this._rotate = 2;
					this.pos[0].setXY( 0, -1 );
					this.pos[1].setXY( -1, 0 );
					this.pos[2].setXY( -1, 1 );
					break;
				case game.BLOCK_TYPE.L_BLOCK :
					this._rotate = 4;
					this.pos[0].setXY( 0, -1 );
					this.pos[1].setXY( 0, 1 );
					this.pos[2].setXY( -1, 1 );
					break;
				case game.BLOCK_TYPE.O_BLOCK :
					this._rotate = 1;
					this.pos[0].setXY( 0, 1 );
					this.pos[1].setXY( 1, 0 );
					this.pos[2].setXY( 1, 1 );
					break;
				case game.BLOCK_TYPE.S_BLOCK :
					this._rotate = 2;
					this.pos[0].setXY( 0, -1 );
					this.pos[1].setXY( 1, 0 );
					this.pos[2].setXY( 1, 1 );
					break;
				case game.BLOCK_TYPE.I_BLOCK :
					this._rotate = 2;
					this.pos[0].setXY( 0, -1 );
					this.pos[1].setXY( 0, 1 );
					this.pos[2].setXY( 0, 2 );
					break;
				case game.BLOCK_TYPE.J_BLOCK :
					this._rotate = 4;
					this.pos[0].setXY( 0, -1 );
					this.pos[1].setXY( 0, 1 );
					this.pos[2].setXY( 1, 1 );
					break;
				case game.BLOCK_TYPE.T_BLOCK :
					this._rotate = 4;
					this.pos[0].setXY( 0, -1 );
					this.pos[1].setXY( 1, 0 );
					this.pos[2].setXY( -1, 0 );
					break;
				
			};
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

	game.blocks = new Array();
	for( var type; type < game.BLOCK_TYPE_NUM; type++ ) {
		game.blocks[type] = new game.Block( type );
	}

	// ブロックの状態を示すクラス
	game.Status = enchant.Class.create( {
		initialize : function( x, y, rotate, type ) {
			this.pos = new game.Position( x, y );
			this._rotate = rotate;
			this._type = type;
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
			for( var x = 0; x < game.FIELD_W + 2; x++ ) {
				this._field[x] = new Array();
			}
			this.init();
		},
		init : function() {
			// 周囲の壁の分( 2 )と壁プラス上の見えないフィールド分（ 2 + 3 ）だけ広く配列を初期化
			for( var x = 0; x < game.FIELD_W + 2; x++ ) {
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
		},
		
		/**
		 * ブロックを置く
		 * @param {game.Status} [status] 設置するブロックの状態
		 * @param {Boolean} [action] 実際にブロックを置くかどうか。trueの場合は設置、falseの場合は設置できるか確認後設置
		 * @return {Boolean} ブロックが置けた場合はtrue、そうでなければfalse
		 */
		putBlock : function( status, action ) {
			// 既にブロックが置かれている場合は終了
			if( game.BLOCK_TYPE.NO_BLOCK < this._field[status.x][status.y] &&
				this._field[status.x][status.y] <= game.BLOCK_TYPE.WALL ) return false;

			if( action ) {
				this._field[status.x][status.y] = status.type;
			}
			for( var i = 0; i < 3; i++ ) {
				var dx = game.blocks[status.type].pos[i].x;
				var dy = game.blocks[status.type].pos[i].y;
				// typeのブロックがとりうる回転のパターン数で割って回転させる数を求める
				var rot = status.rotate % game.blocks[status.type].rotate;
				// 現在の状態まで回転させる
				// 理屈的には90°(1/2pi)ずつアフィン変換で回転させていく
				// x =  x * cos( 1/2pi ) + y * sin( 1/2pi ) = y
				// y = -x * sin( 1/2pi ) + y * cos( 1/2pi ) = -x
				// ※cos( 1/2pi ) は0, sin( 1/2pi )は1
				// なので計算を省略してx = y, y = -xと簡単に書ける
				for( var j = 0; j < rot; j++ ) {
					var nx = dx;
					var ny = dy;
					dx = ny;
					dy = -nx;
				}
				// 既にブロックが置かれている場合は終了
				if( game.BLOCK_TYPE.NO_BLOCK < this._field[status.x + dx][status.y + dy] &&
					this._field[status.x + dx][status.y + dy] <= game.BLOCK_TYPE.WALL ) return false;
				if( action ) {
					this._field[status.x + dx][status.y + dy] = game.BLOCK_TYPE.NO_BLOCK;
				}
			}

			// actionがfalseの時にここまで来たら、今度はtrueにして本当に置く
			if( !action ) {
				this.putBlock( status, true );
			}

			return true;
		},
		deleteBlock : function( status ) {
			this._field[x][y] = game.BLOCK_TYPE.NO_BLOCK;
			for( var i = 0; i < 3; i++ ) {
				var dx = game.blocks[status.type].pos[i].x;
				var dy = game.blocks[status.type].pos[i].y;
				var rot = status.rotate % game.blocks[status.type].rotate;
				// 現在の状態まで回転させる
				// 理屈的には90°(1/2pi)ずつアフィン変換で回転させていく
				// x =  x * cos( 1/2pi ) + y * sin( 1/2pi ) = y
				// y = -x * sin( 1/2pi ) + y * cos( 1/2pi ) = -x
				// ※cos( 1/2pi ) は0, sin( 1/2pi )は1
				// なので計算を省略してx = y, y = -xと簡単に書ける
				for( var j = 0; j < rot; j++ ) {
					var nx = dx;
					var ny = dy;
					dx = ny;
					dy = -nx;
				}
				this._field[status.x + dx][status.y + dy] = game.BLOCK_TYPE.NO_BLOCK;
			}
		}
	} );

	// ゲームのメインクラス
	game.Sirtet = enchant.Class.create( {
		// ゲームの初期化をする
		initialize : function() {
			this.field = new game.Field();
			this.putFlg = false;
			this.gameOverFlg = false;
			this.current = new game.Status();
		},
		init : function() {
			this.field.init();
			this.putFlg = false;
			this.gameOverFlg = false;
			this.generateBlock();
		},
		// ブロックを生成する
		generateBlock : function() {
			if( this.gameOverFlg ) return;
			this.current.pos.x = Math.floor( game.FIELD_W / 2 );
			this.current.pos.y = game.FIELD_H + 1;
			this.current.type = Math.floor( Math.random() * ( game.BLOCK_TYPE_NUM - 1 ) ) + 1;
			this.current.rotate = Math.floor( Math.random() * 4 );

			// 生成したブロックを置けるか試して、置けない場合はゲームオーバー
			if( !this.putBlock( this.current, false ) && this.putFlg ) {
				this.gameOver();
			}
			this.putFlg = true;
		},
		// ブロックをフィールドに設置する
		putBlock : function( status, action ) {
			if( this.gameOverFlg ) return false;
			return this.field.putBlock( status, action );
		},
		// ブロックを落下させる
		fallDownBlock : function() {
			// TODO: 実装
		},
		// ブロックを削除する
		deleteBlock : function( status ) {
			if( this.gameOverFlg ) return;
			this.field.deleteBlock( status );
		},
		// ラインを削除する
		deleteLine : function() {
			if( this.gameOverFlg ) return;
			// TODO: 実装
		},
		processGame : function() {
			
		},
		gameOver : function() {
			// TODO: 実装
		},
		onEnterFrame : function() {
			while( !this.gameOverFlg ) {
				this.processGame();
			}
		}
	} );
	


//    game.preload("chara1.png");
    
    game.onload = function(){
		sirtet = new game.Sirtet();
		
		game.rootScene.addChild( sirtet.field );
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