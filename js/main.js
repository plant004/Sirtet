/**
 * enchant.jsの初期化とプラグインのエクスポート
 */
enchant();

window.onload = function(){
	// ゲーム画面の初期化
    var game = new Game(640, 480); // 幅640x高さ480
	
	game.fps = 12; // 30FPS
	
	// TODO: キーバインド設定
//	game.keybind( keycode, 'a' );
//	game.keybind( keycode, 'b' );
//	game.keybind( keycode, 'c' );
//	game.keybind( keycode, 'd' );
//	game.keybind( keycode, 'e' );
//	game.keybind( keycode, 'f' );

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

	// ブロックの色
	game.BLOCK_COLOR = new Array(
		"",
		"green",
		"blue",
		"yellow",
		"cyan",
		"red",
		"orange",
		"magenta",
		"gray"
	);

	// デバッグ用
	game.d = function( str ) {
		var div = document.getElementById( "debug" );
		div.innerHTML += str + "<br />";
	}

	// 入力処理を行うフレーム間隔
	game.INPUT_FRAME_SPAN = 2;
	game.FALL_FRAME_SPAN = 5;

	// 位置を表すクラス
	game.Position = enchant.Class.create({
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
			this.x = x;
			this.y = y;
		}
	} );

	// ブロッククラス
	game.Block = enchant.Class.create( {
		initialize : function( type ) {
			this.pos = new Array();
			this.pos[0] = new game.Position();
			this.pos[1] = new game.Position();
			this.pos[2] = new game.Position();
			this._rotate = 0;
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

	// ブロックの状態を示すクラス
	game.Status = enchant.Class.create( game.Position, {
		initialize : function( x, y, rotate, type ) {
			game.Position.call(this, x, y);
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
		},
		clone : function() {
			return new game.Status( this.x, this.y, this.rotate, this.type );
		}
	} );

	game.Rect = enchant.Class.create( Sprite, {
		initialize : function( x, y, type ) {
			Sprite.call(this, game.PIXEL_PER_BLOCK, game.PIXEL_PER_BLOCK );
			this.type = type;
			this.x = x * game.PIXEL_PER_BLOCK;
			this.y = y * game.PIXEL_PER_BLOCK;
		},
		type : {
			get : function() {
				return this._type;
			},
			set : function( type ){
				this._type = type;
				this.backgroundColor = game.BLOCK_COLOR[type];
			}
		}
	});

	// ブロックを配置するフィールド
	game.Field = enchant.Class.create( Sprite, {
		initialize : function() {
			Sprite.call( this, game.FIELD_W * game.PIXEL_PER_BLOCK, ( game.FIELD_H + 3 ) * game.PIXEL_PER_BLOCK  );
			this.x = game.PIXEL_PER_BLOCK;
			this.y = game.PIXEL_PER_BLOCK;
			this.backgroundColor = "black";
			this._field = new Array();
			for( var x = 0; x < game.FIELD_W + 2; x++ ) {
				this._field[x] = new Array();
				for( var y = 0; y < game.FIELD_H + 5; y++ ) {
					this._field[x][y] = new game.Rect( x, y, game.BLOCK_TYPE.WALL );
				}
			}
			this.init();
		},
		init : function() {
			// 周囲の壁の分( 2 )と壁プラス上の見えないフィールド分（ 2 + 3 ）だけ広く配列を初期化
			for( var x = 0; x < game.FIELD_W + 2; x++ ) {
				for( var y = 0; y < game.FIELD_H + 5; y++ ) {
					// 両側面と底面を壁に
					if( x == 0 || x == game.FIELD_W + 1 || y == game.FIELD_H + 4 ) {
						this._field[x][y].type = game.BLOCK_TYPE.WALL;
					}
					// それ以外はブロックが無い状態
					else {
						this._field[x][y].type = game.BLOCK_TYPE.NO_BLOCK;
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
//			game.d( "field.putBlock:x = " + status.x + ", y = " + status.y + ", type = " + status.type + ", action = " + ( action ? "true" : "false" ) );
			// 既にブロックが置かれている場合は終了
			if( game.BLOCK_TYPE.NO_BLOCK < this._field[status.x][status.y].type &&
				this._field[status.x][status.y].type <= game.BLOCK_TYPE.WALL ) return false;

			if( action ) {
				this._field[status.x][status.y].type = status.type;
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
//				game.d( status.x + dx );
				if( game.BLOCK_TYPE.NO_BLOCK < this._field[status.x + dx][status.y + dy].type &&
					this._field[status.x + dx][status.y + dy].type <= game.BLOCK_TYPE.WALL ) return false;
				if( action ) {
					this._field[status.x + dx][status.y + dy].type = status.type;
				}
			}

			// actionがfalseの時にここまで来たら、今度はtrueにして本当に置く
			if( !action ) {
				this.putBlock( status, true );
			}

			return true;
		},
		/**
		 * ブロックを消す
		 * @param {game.Status} [status] 削除するブロックの状態
		 */
		deleteBlock : function( status ) {
			this._field[status.x][status.y].type = game.BLOCK_TYPE.NO_BLOCK;
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
				this._field[status.x + dx][status.y + dy].type = game.BLOCK_TYPE.NO_BLOCK;
			}
		},
		/**
		 * 各行に空白があるかどうか調べ、空白のない行を消していく
		 */
		deleteLine : function() {
//			game.d("deleteLine");
			for( var y = 1; y < game.FIELD_H + 3; y++ ) {
				var flag = true;
				for( var x = 1; x <= game.FIELD_W; x++ ) {
					if( this._field[x][y].type == game.BLOCK_TYPE.NO_BLOCK ) {
						flag = false;
					}
				}
				
				// ここまで来てflagがtrueのままであればこの行は消せる
				if( flag ) {
				// TODO: ライン削除判定のデバッグ
			game.d("deleteLine: y = ");
					for( var j = y; 0 < j; j-- ) {
						for( var i = 1; i <= game.FIELD_W; i++ ) {
							this._field[i][j].type = this._field[i][j - 1].type;
						}
					}
					// 複数行が消えた時のためにここでyを1戻しておく
					y--;
				}
			}
		},
		/**
		 * ゲームオーバー時にブロックを赤色に変える
		 */
		onGameOver : function() {
			for( var x = 1; x <= game.FIELD_W; x++ ) {
				for( var y = 1; y <= game.FIELD_H + 3; y++ ) {
					if( this._field[x][y].type != game.BLOCK_TYPE.NO_BLOCK ) {
						this._field[x][y].type = game.BLOCK_TYPE.I_BLOCK;
					}
				}
			}
		}
	} );

	// ゲームのメインクラス
	game.Sirtet = enchant.Class.create( Entity, {
		// ゲームの初期化をする
		initialize : function() {
			game.d("new sirtet");
			Entity.call( this );
			this.field = new game.Field();
			this.putFlg = false;
			this.gameOverFlg = false;
			this.current = new game.Status();
			this.counter = 0;
		},
		init : function() {
			game.d("init sirtet");
			this.field.init();
			this.putFlg = false;
			this.gameOverFlg = false;
			this.generateBlock();
			this.counter = 0;
		},
		// ブロックを生成する
		generateBlock : function() {
//			game.d("generateBlock");
			if( this.gameOverFlg ) return;
			this.current.x = Math.floor( game.FIELD_W / 2 );
			this.current.y = 1;
			this.current.type = Math.floor( Math.random() * ( game.BLOCK_TYPE_NUM - 1 ) ) + 1;
			this.current.rotate = Math.floor( Math.random() * 4 );

			// 生成したブロックを置けるか試して、置けない場合はゲームオーバー
			if( !this.field.putBlock( this.current, false ) ) {
				this.gameOver();
			}
		},
		// ブロックを落下させる
		fallDownBlock : function() {
			if( this.gameOverFlg ) return;
			this.field.deleteBlock( this.current );
			this.current.y++;
			if( !this.field.putBlock( this.current, false ) ) { // ブロックを落とせなかったら元に戻す
				this.current.y--;
				this.field.putBlock( this.current, false );
				this.field.deleteLine();
				this.generateBlock();
			}
		},
		gameOver : function() {
			game.d("game over");
			this.gameOverFlg = true;

			this.field.onGameOver();
		},
		processInput : function() {
			var ret = game.MOVE_STATE.NO_MOVE;
			var tmp = this.current.clone();
			if( game.input.left ) {
				tmp.x--;
			}
			else if( game.input.right ) {
				tmp.x++;
			}
			else if( game.input.up ) {
				tmp.rotate++;
			}
			else if( game.input.down ) {
				tmp.y++;
				ret = game.MOVE_STATE.MOVE_FALL;
			}
			else if( game.input.a ) {
			}
			else if( game.input.b ) {
			}
			else if( game.input.c ) {
			}
			else if( game.input.d ) {
			}
			else if( game.input.e ) {
			}
			else if( game.input.f ) {
			}

			// 位置や回転が変化していたら
			if( tmp.x != this.current.x ||
				tmp.y != this.current.y ||
				tmp.rotate != this.current.rotate ) {
				// 古い位置のブロックを消して、新しい場所へブロックを置けるか試す
				this.field.deleteBlock( this.current );
				if( this.field.putBlock( tmp, false ) ) {
					// ブロックが置けたらcurrentを更新する
					this.current = tmp;
					ret |= game.MOVE_STATE.MOVE_CHANGE;
				}
				else {
					// ブロックが置けなかったら元の位置にブロックを置く
					this.field.putBlock( this.current, false );
				}
			}
			return ret;
		},
		onEnterFrame : function() {
//			if( this.counter > 20 ) this.gameOverFlg = true;
			if( !this.gameOverFlg ) {
				if( this.counter % game.INPUT_FRAME_SPAN == 0) {
					// キー入力処理
					var fallFlg = this.processInput();
					// キーによる落下と自動落下の整合性を取るための処理
					if( ( fallFlg & game.MOVE_STATE.MOVE_FALL ) != 0 ) this.counter = 0;
				}
				if( this.counter % game.FALL_FRAME_SPAN == 0 ) {
					// 自動落下処理
					this.fallDownBlock();
				}
				this.counter++;
			}
		}
	} );
	


//    game.preload("chara1.png");
    
    game.onload = function(){
		sirtet = new game.Sirtet();
		game.blocks = new Array();
		for( var type = game.BLOCK_TYPE.NO_BLOCK; type < game.BLOCK_TYPE_NUM; type++ ) {
			game.blocks[type] = new game.Block( type );
		}
		sirtet.init();

		game.rootScene.addChild( sirtet );
		game.rootScene.addChild( sirtet.field );
		for( var x = 0; x < game.FIELD_W + 2; x++ ) {
			for( var y = 1; y < game.FIELD_H + 5; y++ ) {
				game.rootScene.addChild( sirtet.field._field[x][y] );
			}
		}
		sirtet.addEventListener( "enterframe", sirtet.onEnterFrame );
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