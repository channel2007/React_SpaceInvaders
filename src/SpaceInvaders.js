//============================================================================
// 太空侵略者.
//============================================================================
import React from 'react';
import { Stage, Layer, Text, Rect} from 'react-konva';

import EgSprite from "./eg/EgSprite";
import SpaceInvadersAudio from "./SpaceInvadersAudio";

class SpaceInvaders extends React.Component{
  
  //--------------------------------------------------------------------------
  // 初始變數.
  //--------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state=({        
      const_bullet_max:12,                          // 常數-敵人子彈數.

      set_enemy_move_tick:500,                      // 變數-敵機移動時間(1/1000).
      set_bullet_born_tick:60,                      // 變數-敵機發射子彈時間(1sec 60，依照遊戲主迴圈設定為主).
      set_bullet_speed:4,                           // 變數-敵機發射子彈速度(越大越快).

      set_character_fire_tick:60,                   // 變數-主角飛機子彈發射時間(1sec 60，依照遊戲主迴圈設定為主).
      set_character_speed:8,                        // 變數-主角飛機發射子彈速度(越大越快).


      game_main_interval:null,                      // 遊戲主迴圈時脈.
      collision_interval:null,                      // 判斷碰撞.
      rebirth_interval:null,                        // 重生.

      text_messages:null,                           // 文字-訊息.
      text_total_score:null,                        // 文字-總分.
      text_hi_score:null,                           // 文字-高分.

      game_mode:0,                                  // 0:GameOver 1:遊戲中.
      total_score:0,                                // 總分.
      hi_score:0,                                   // 最高分數.

      //----------------------------------------------------------------------
      enemy_5:[],                                   // 敵人列數. 
      enemy_4:[],
      enemy_3:[],
      enemy_2:[],
      enemy_1:[],        
      enemy_bullet_1:[],                            // 敵人子彈.
      enemy_bullet_2:[],
      enemy_bullet_3:[],        

      enemy_move_direction:[],                      // 敵人移動方向.
      enemy_move_row_interval:null,                 // 計時器-敵機移動.
      enemy_bullet_born_tick:0,                     // 敵機發射子彈時間.
      enemy_move_row:0,                             // 敵機移動列.

      enemy_nmber:55,                               // 敵機數量.

      background_interval:null,                     // 計時器-背景.
      background_roll:0,                            // 背景滾動.
      background_1:null,                            // 背景-1.
      background_2:null,                            // 背景-2.


      //----------------------------------------------------------------------
      boom:[],                                      // 爆炸.
      character:[],                                 // 主角飛機.
      character_bullet:[],                          // 主角子彈.
      character_fire_tick:0,                        // 主角飛機發射子彈時間.      
      
      character_number:2,                           // 主角飛機數量.
      
      keyCode:[],                                   // 按鍵狀態.            
      audio:null,                                   // 音效物件.

      //----------------------------------------------------------------------
      _stage: null,
      _width: window.innerWidth,
      _height: window.innerHeight,
    })

    //------------------------------------------------------------------------
    // * 敵人3.
    this.anisEnemy_3={      
        idle: [
          350,10,44,44,
          426,10,44,44,
        ]
    }
    this.collsEnemy_3={
        idle: [
          9,10,25,25,
          9,10,25,25
        ]
    }  
    // * 敵人2.
    this.anisEnemy_2={      
        idle: [
          180,10,53,44,
          264,10,53,44,
        ]
    }
    this.collsEnemy_2={
        idle: [
          10,10,34,25,
          10,10,34,25
        ]
    }  
    // * 敵人1.
    this.anisEnemy_1={      
        idle: [
          10,10,55,44,
          94,10,55,44,
        ]
    }
    this.collsEnemy_1={
        idle: [
          10,10,37,25,
          10,10,37,25
        ]
    }  

    //------------------------------------------------------------------------
    // * 敵人子彈.
    this.aniEnemyBullet={
      idle: [
         0, 0,12,24,
        12, 0,12,24,
      ]
    }
    // 碰撞.
    this.collsEnemyBullet={
      idle: [
        2,2,8,19,
        2,2,8,19
      ]
    }  
    
    //------------------------------------------------------------------------
    // * 主角飛機.
    this.aniCharacter={
      idle: [
         0,0,36,20
      ]
    }
    // 碰撞.
    this.collsCharacter={
      idle: [
        2,2,32,18
      ]
    }  
      
    //------------------------------------------------------------------------
    // * 主角飛機-子彈.
    this.aniCharacterBullet={
      idle: [
         0,0,3,20
      ]
    }
    // 碰撞.
    this.collsCharacterBullet={
      idle: [
        0,0,3,20
      ]
    }  

    //------------------------------------------------------------------------
    // * 爆炸.
    this.anisBoom={      
      idle: [
       506,10,55,44,
      ]
    }
    this.collsBoom={
        idle: [
          5,10,42,26,
        ]
    }  

    //------------------------------------------------------------------------
    // * 背景.
    this.anisBackground={      
      idle: [
       0,0,800,600,
      ]
    }
    this.collsBackground={
        idle: [
          0,0,800,600,
        ]
    }  

    //------------------------------------------------------------------------
    // 初始變數.
    //------------------------------------------------------------------------
    // 按鍵狀態(0:左 1:右).
    this.state.keyCode = [false,false];
    // 敵人移動方向.
    // true:右  false:左.
    this.state.enemy_move_direction = [true,true,true,true,true];

    //------------------------------------------------------------------------
    // 綁定函數.
    //------------------------------------------------------------------------
    // 處理視窗自適.
    this.checkSize=this.checkSize.bind(this);

    // 搜尋可用敵人子彈.
    this.enemy_bullet_fire_move=this.enemy_bullet_fire_move.bind(this);
    // 敵人發射子彈.  
    this.enemy_bullet_fire=this.enemy_bullet_fire.bind(this);    
    // 敵人移動.
    this.enemy_move=this.enemy_move.bind(this);
    // 主角飛機發射子彈.
    this.character_bullet_fire=this.character_bullet_fire.bind(this); 
    // 初始爆炸.
    this.boom_init=this.boom_init.bind(this);

    // 設定(gameplay)定時器.
    this.gameplay_set_interval=this.gameplay_set_interval.bind(this);
    // 清除(gameplay)定時器.
    this.gameplay_clear_interval=this.gameplay_clear_interval.bind(this);

    // 重新開始遊戲.
    this.restart=this.restart.bind(this); 
    // 重生.
    this.rebirth=this.rebirth.bind(this); 

    // 更新隻數.
    this.update_character=this.update_character.bind(this);
    // 更新分數.
    this.update_total_score=this.update_total_score.bind(this);

    // 定時器-遊戲主迴圈.    
    this.game_main_interval=this.game_main_interval.bind(this);
    // 定時器-主角飛機子彈碰撞判斷.
    this.collision_interval=this.collision_interval.bind(this);
    // 主角飛機子彈碰撞判斷.
    this.collision_character_bullet=this.collision_character_bullet.bind(this);
    // 敵機子彈擊中玩家飛機.
    this.collision_character_boom=this.collision_character_boom.bind(this);

    // 定時器-爆炸.
    this.boom_interval=this.boom_interval.bind(this);
    // 定時器-背景滾動.
    this.background_roll_interval=this.background_roll_interval.bind(this);    
    // 定時器-敵機移動.
    this.enemy_move_row_interval=this.enemy_move_row_interval.bind(this);

  }
 
  //--------------------------------------------------------------------------
  // 初始.
  //--------------------------------------------------------------------------
  componentDidMount(){    
    this.state.background_1.filpV(true);
    this.state.background_2.filpV(true);
    this.state.background_1.y(-600);    
    this.state.background_2.y(0);

    this.checkSize();
    this.update_character();    
  }

  //--------------------------------------------------------------------------
  // 更新.
  //--------------------------------------------------------------------------
  componentDidUpdate(oldProps){ }

  //--------------------------------------------------------------------------
  // 移除.
  //--------------------------------------------------------------------------
  componentWillUnmount(){
    this.gameplay_clear_interval();

    window.removeEventListener( "resize", this._checkSize);
    window.removeEventListener("keydown", this.inputKeyDown);
    window.removeEventListener("keyup", this.inputKeyUp);
  }

  //--------------------------------------------------------------------------
  // 自動縮放視窗.
  //--------------------------------------------------------------------------
  checkSize(){    
    this.setState({
      _width: window.innerWidth,
      _height: window.innerHeight
    });        
    let x= (this.state._width-(800*this.state._stage.scaleX()))/2;
    this.state._stage.x(x);
  }

  //--------------------------------------------------------------------------
  // 鍵盤事件-按下.
  //--------------------------------------------------------------------------
  inputKeyDown = (e) => {
    let k = this.state.keyCode;
    
    if(this.state.game_mode===1){
      if(e.keyCode===37){
        k[0] = true;
        this.setState({keyCode:k});
      }else if(e.keyCode===39){
        k[1] = true;
        this.setState({keyCode:k});
      }
    }    
  }  

  //--------------------------------------------------------------------------
  // 鍵盤事件-放開.
  //--------------------------------------------------------------------------
  inputKeyUp = (e) => {
    let k = this.state.keyCode;
    let m;

    if(this.state.game_mode===0){
      k[0] = false; k[1] = false;
      // 空白鍵、Enter.
      if(e.keyCode===32 || e.keyCode===13){
        this.setState({game_mode:1});
        this.restart(false);
        this.background_roll_interval();
      }

    }else if(this.state.game_mode===1){
      // 按鍵-左.
      if(e.keyCode===37){
        k[0] = false;
        this.setState({keyCode:k});
        
      // 按鍵-右.
      }else if(e.keyCode===39){
        k[1] = false;
        this.setState({keyCode:k});
      }  
    }

    // (M)音樂、音效開關.
    if(e.keyCode===77){      
      m = this.state.audio.getMute();
      this.state.audio.mute(!m);      
    }
  }  

  //--------------------------------------------------------------------------
  // 遊戲主迴圈-定時器.
  //--------------------------------------------------------------------------
  game_main_interval(){    
    this.setState({game_main_interval:setInterval(() => {
      let p = this.state.character;
      if(this.state.keyCode[0]){
        p[0].x(p[0].getX()-2);
        if(p[0].getX()<0)
          p[0].x(0);
        
      }else if(this.state.keyCode[1]){
        p[0].x(p[0].getX()+2);
        if(p[0].getX()>(this.props.width_base-this.aniCharacter.idle[2]))
          p[0].x(this.props.width_base-this.aniCharacter.idle[2]);        
      }
      
      let t = this.state.enemy_bullet_born_tick + 1;
      this.setState({enemy_bullet_born_tick:t});
      if(this.state.enemy_bullet_born_tick>=this.state.set_bullet_born_tick){        
        this.setState({enemy_bullet_born_tick:0});
        this.enemy_bullet_fire();
        for (let i=0; i<this.state.const_bullet_max; i++){
          if(this.state.enemy_bullet_1[i].getY()>=this.props.height_base)
            this.state.enemy_bullet_1[i].visible(false);           
          if(this.state.enemy_bullet_2[i].getY()>=this.props.height_base)
            this.state.enemy_bullet_2[i].visible(false);                      
          if(this.state.enemy_bullet_3[i].getY()>=this.props.height_base)
            this.state.enemy_bullet_3[i].visible(false);
          if(this.state.character_bullet[i].getY() < (-this.aniCharacterBullet.idle[3]))
            this.state.character_bullet[i].visible(false);
        }
      }

      t = this.state.character_fire_tick + 1;
      this.setState({character_fire_tick:t});
      if(this.state.character_fire_tick>=this.state.set_character_fire_tick){
        this.setState({character_fire_tick:0});
        this.character_bullet_fire();
      }

    }, 17)}); // fps:60.

  }

  //--------------------------------------------------------------------------
  // 設定(gameplay)定時器.
  //--------------------------------------------------------------------------  
  gameplay_set_interval(){
    this.game_main_interval();    
    this.collision_interval();
    this.boom_interval();    
    this.enemy_move_row_interval();
  }

  //--------------------------------------------------------------------------
  // 清除(gameplay)定時器.
  //--------------------------------------------------------------------------  
  gameplay_clear_interval(){
    clearInterval(this.state.game_main_interval);
    clearInterval(this.state.collision_interval);
    clearInterval(this.state.boom_interval);
    clearInterval(this.state.enemy_move_row_interval);
  }

  //--------------------------------------------------------------------------
  // 敵機移動.
  //--------------------------------------------------------------------------  
  enemy_move_row_interval(){
    this.setState({enemy_move_row_interval:setInterval(() => {    
      if(this.state.enemy_move_row===0){
        this.state.audio.play('enemy_move_1');
        this.enemy_move(this.state.enemy_1, this.state.enemy_move_row);
      }else if(this.state.enemy_move_row===1){
        this.state.audio.play('enemy_move_1');
        this.enemy_move(this.state.enemy_2, this.state.enemy_move_row);
      }else if(this.state.enemy_move_row===2){
        this.state.audio.play('enemy_move_2');
        this.enemy_move(this.state.enemy_3, this.state.enemy_move_row);
      }else if(this.state.enemy_move_row===3){
        this.state.audio.play('enemy_move_2');
        this.enemy_move(this.state.enemy_4, this.state.enemy_move_row);
      }else if(this.state.enemy_move_row===4){
        this.state.audio.play('enemy_move_3');
        this.enemy_move(this.state.enemy_5, this.state.enemy_move_row);
      }

      let m = this.state.enemy_move_row + 1;
      this.setState({enemy_move_row:m});
      if(this.state.enemy_move_row>4)
        this.setState({enemy_move_row:0});
    },this.state.set_enemy_move_tick)});
    
  }

  //--------------------------------------------------------------------------
  // 背景滾動-定時器.
  //--------------------------------------------------------------------------  
  background_roll_interval(){    
    this.setState({background_interval:setInterval(() => {    
      let r=this.state.background_roll;
      r +=0.5;
      if(r===600){
        r=0;
      }
      this.setState({background_roll:r}); 
      this.state.background_1.y(-600+r);    
      this.state.background_2.y(   0+r);
    }, 33)});
  }

  //--------------------------------------------------------------------------
  // 更新分數.
  //--------------------------------------------------------------------------  
  update_total_score(score){
    let s=this.state.total_score;
    let z="";

    s += score;    
    if(s>999999)
      s=999999;
    this.setState({total_score:s}); 

    for(let i=String(s).length; i<6; i++){
      z+='0';
    }
    z = z + String(s);
    this.state.text_total_score.text(z);

    if(s>this.state.text_hi_score.text()){
      this.setState({text_hi_score:s});
      this.state.text_hi_score.text(z);
    }
  }

  //--------------------------------------------------------------------------
  // 重新開始遊戲.
  //--------------------------------------------------------------------------  
  restart(nextLevel){
    if(!nextLevel){
      this.gameplay_clear_interval();
      this.gameplay_set_interval();
      this.setState({character_number:2, total_score:0});
      this.state.character[0].x(400);
      this.state.character[0].y(570);
      this.update_character();
      this.update_total_score(0);
    }

    this.state.text_messages.visible(false);

    let x = 115;
    let y = 100;
    this.setState({enemy_nmber:55});
    for (let i=0; i<11; i++){
      this.state.enemy_5[i].x(x);
      this.state.enemy_5[i].y(y+(45*0));
      this.state.enemy_5[i].visible(true);

      this.state.enemy_4[i].x(x);
      this.state.enemy_4[i].y(y+(45*1));
      this.state.enemy_4[i].visible(true);

      this.state.enemy_3[i].x(x);
      this.state.enemy_3[i].y(y+(45*2));
      this.state.enemy_3[i].visible(true);

      this.state.enemy_2[i].x(x);
      this.state.enemy_2[i].y(y+(45*3));
      this.state.enemy_2[i].visible(true);

      this.state.enemy_1[i].x(x);
      this.state.enemy_1[i].y(y+(45*4));
      this.state.enemy_1[i].visible(true);

      x += 52;
    }
  }

  //--------------------------------------------------------------------------
  // 重生.
  //--------------------------------------------------------------------------
  rebirth(){
    this.gameplay_clear_interval();
    this.boom_interval();

    this.state.audio.play('player_down');

    let en = this.state.character_number-1;
    this.setState({character_number:en});
    this.update_character();
    this.state.character[0].visible(false);
    this.boom_init(this.state.character[0].getX()-8,this.state.character[0].getY()-10);
    
    if(this.state.character_number<0){
      clearInterval(this.state.background_interval);      
      this.state.text_messages.visible(true);
      this.setState({game_mode:0});

    }else{
      for (let i=0; i<this.state.const_bullet_max; i++){
        this.state.enemy_bullet_1[i].visible(false);
        this.state.enemy_bullet_2[i].visible(false);
        this.state.enemy_bullet_3[i].visible(false);
      }
      this.setState({rebirth_interval:setInterval(() => {    
        clearInterval(this.state.rebirth_interval);
        clearInterval(this.state.boom_interval);
        this.gameplay_set_interval();
        this.state.character[0].visible(true);

      }, 1500)});
    }
  }

  //--------------------------------------------------------------------------
  // 更新隻數.
  //--------------------------------------------------------------------------  
  update_character(){    
    for (let i=0; i<6; i++){
      if(i<=this.state.character_number){
        this.state.character[i].visible(true);
      }else{
        this.state.character[i].visible(false);
      }      
    }    
  }

  //--------------------------------------------------------------------------
  // 初始爆炸.
  //--------------------------------------------------------------------------  
  boom_init(x,y){
    for (let i=0; i<this.state.const_bullet_max; i++){
      if(!this.state.boom[i].isVisible()){        
        this.state.boom[i].setDataElement('closure', 0);
        this.state.boom[i].visible(true);
        this.state.boom[i].x(x);
        this.state.boom[i].y(y);
        return true;
      }
    }
    return false;
  }

  //--------------------------------------------------------------------------
  // 爆炸-定時器.
  //--------------------------------------------------------------------------  
  boom_interval(){
    this.setState({collision_interval:setInterval(() => {
      let n=0;
      for (let i=0; i<this.state.const_bullet_max; i++){
        if(this.state.boom[i].isVisible()){
          n = this.state.boom[i].getDataElement('closure') + 1;
          this.state.boom[i].setDataElement('closure', n);
          if(this.state.boom[i].getDataElement('closure')===2){
            this.state.boom[i].visible(false);
          }
        }
      }  
    }, 500)}); // fps:2.
  }

  //--------------------------------------------------------------------------
  // 主角飛機子彈碰撞判斷.
  //--------------------------------------------------------------------------
  collision_character_bullet( enemy, character_bullet){    
    let en=0;    
    if(enemy.isVisible()){
      if(character_bullet.hitTest(enemy.getHitRect())){
        this.state.audio.play('invader_down');
        en = this.state.enemy_nmber-1;
        this.setState({enemy_nmber:en});
        character_bullet.visible(false);
        enemy.visible(false);
        this.boom_init(enemy.getX(),enemy.getY());
        this.update_total_score(enemy.getDataElement('score'));
        if(en<=0){this.restart(true);}
      }
    }
  }

  //--------------------------------------------------------------------------
  // 敵機子彈擊中玩家飛機.
  //--------------------------------------------------------------------------
  collision_character_boom(enemy_bullet){        
    if(enemy_bullet.isVisible()){
      if(this.state.character[0].hitTest(enemy_bullet.getHitRect())){
        enemy_bullet.visible(false);
        this.rebirth();              
      }
    }
  }

  //--------------------------------------------------------------------------
  // 主角飛機子彈碰撞判斷-定時器.
  //--------------------------------------------------------------------------
  collision_interval(){        
    this.setState({collision_interval:setInterval(() => {

      for (let i=0; i<this.state.const_bullet_max; i++){          
        if(this.state.character_bullet[i].isVisible()){
          for (let j=0; j<11; j++){
            this.collision_character_bullet( this.state.enemy_1[j], this.state.character_bullet[i]);
            this.collision_character_bullet( this.state.enemy_2[j], this.state.character_bullet[i]);
            this.collision_character_bullet( this.state.enemy_3[j], this.state.character_bullet[i]);
            this.collision_character_bullet( this.state.enemy_4[j], this.state.character_bullet[i]);
            this.collision_character_bullet( this.state.enemy_5[j], this.state.character_bullet[i]);
          }                            
        }        
        if(this.state.character[0].isVisible()){
            this.collision_character_boom(this.state.enemy_bullet_1[i]);
            this.collision_character_boom(this.state.enemy_bullet_2[i]);
            this.collision_character_boom(this.state.enemy_bullet_3[i]);      
        }
      }  
      
    }, 83)}); // fps:12.    
  }

  //--------------------------------------------------------------------------
  // 主角飛機發射子彈.
  //--------------------------------------------------------------------------
  character_bullet_fire(){
    for (let i=0; i<this.state.const_bullet_max; i++){
      if(!this.state.character_bullet[i].isVisible()){
        this.state.audio.play('shoot');        
        this.state.character_bullet[i].visible(true);
        this.state.character_bullet[i].x(this.state.character[0].getX()+17);
        this.state.character_bullet[i].y(this.state.character[0].getY()-20);
        this.state.character_bullet[i].move(this.state.character[0].getX(), (-this.aniCharacterBullet.idle[3]), this.state.set_character_speed);
        return true;
      }
    }
    return false;
  }

  //--------------------------------------------------------------------------
  // 敵人移動.
  //--------------------------------------------------------------------------
  enemy_move(enemy, pos){
    let d=this.state.enemy_move_direction;
        
    if(this.state.enemy_move_direction[pos]){
      for (let i=10; i>=0; i--){
        enemy[i].x(enemy[i].getX()+20);        
        if(enemy[i].isVisible() && (enemy[i].getX() >= (this.props.width_base-this.anisEnemy_1.idle[2]-5)) ){          
          d[pos] = !d[pos];
          this.setState({enemy_move_direction:d});          
        }        
      }
    }else{
      for (let i=0; i<11; i++){
        enemy[i].x(enemy[i].getX()-20);
        if(enemy[i].isVisible() && (enemy[i].getX() <= 5) ){          
          d[pos] = !d[pos];
          this.setState({enemy_move_direction:d});          
        }        
      }
    }
  }

  //--------------------------------------------------------------------------
  // 搜尋可用敵人子彈.
  //--------------------------------------------------------------------------
  enemy_bullet_fire_move(enemy, enemy_bullet){    
    if(enemy.isVisible()){            
      for(let k=0; k<this.state.const_bullet_max; k++){
        if(!enemy_bullet[k].isVisible()){
          enemy_bullet[k].visible(true);
          enemy_bullet[k].x(enemy.getX()+24);
          enemy_bullet[k].y(enemy.getY()+32);
          enemy_bullet[k].move(enemy_bullet[k].getX(), 800, this.state.set_bullet_speed);
          return true;
        }
      }      
    }
    return false;
  }

  //--------------------------------------------------------------------------
  // 敵人發射子彈.
  //--------------------------------------------------------------------------
  enemy_bullet_fire(){    
    if(this.state.enemy_nmber<=0){return;}

    let enemyRowPos = [0,1,2,3,4];
    let enemyIdPos  = [0,1,2,3,4,5,6,7,8,9,10];
    let a,b,a1,b1;      
    
    for(let i=0; i<100; i++){
      a  = Math.floor(Math.random()*5);
      b  = Math.floor(Math.random()*5);
      if(a!==b){
        enemyRowPos[a] ^= enemyRowPos[b];
        enemyRowPos[b] ^= enemyRowPos[a];
        enemyRowPos[a] ^= enemyRowPos[b];  
      }

      a1 = Math.floor(Math.random()*11);
      b1 = Math.floor(Math.random()*11);
      if(a1!==b1){
        enemyIdPos[a1] ^= enemyIdPos[b1];
        enemyIdPos[b1] ^= enemyIdPos[a1];
        enemyIdPos[a1] ^= enemyIdPos[b1];  
      }
    }        
    
    for(let j=0; j<5; j++){        
      for(let i=0; i<11; i++){        
        if(enemyRowPos[j]===0){          
          return this.enemy_bullet_fire_move( this.state.enemy_1[enemyIdPos[i]], this.state.enemy_bullet_1);

        }else if(enemyRowPos[j]===1){
          return this.enemy_bullet_fire_move( this.state.enemy_2[enemyIdPos[i]], this.state.enemy_bullet_1);

        }else if(enemyRowPos[j]===2){
          return this.enemy_bullet_fire_move( this.state.enemy_3[enemyIdPos[i]], this.state.enemy_bullet_2);

        }else if(enemyRowPos[j]===3){
          return this.enemy_bullet_fire_move( this.state.enemy_4[enemyIdPos[i]], this.state.enemy_bullet_2);

        }else if(enemyRowPos[j]===4){
          return this.enemy_bullet_fire_move( this.state.enemy_5[enemyIdPos[i]], this.state.enemy_bullet_3);

        } 
      }    
    }
    return false;
  }

  //--------------------------------------------------------------------------
  //.
  //--------------------------------------------------------------------------
  render(){
    const scale = Math.min(
        this.state._width  / this.props.width_base,
        this.state._height / this.props.height_base
    )              
    window.addEventListener("resize", this.checkSize);
    window.addEventListener("keydown", this.inputKeyDown);
    window.addEventListener("keyup", this.inputKeyUp);
    
    let enemyList_5 = [];
    let enemyList_4 = [];
    let enemyList_3 = [];
    let enemyList_2 = [];
    let enemyList_1 = [];    
    let x = 115;
    let y = 100;
    for (let i=0; i<11; i++){
      enemyList_5.push(
        <EgSprite 
          key={i}
          src="./images/enemy_3.png"
          ref={node => {this.state.enemy_5[i] = node;}}
          visible={true}
          aniAction='idle'
          anis={this.anisEnemy_3}
          collisions={this.collsEnemy_3}
          x={x}
          y={y+(45*0)}
          data={{score:30}}
        />
      );
      enemyList_4.push(
        <EgSprite 
          key={i}
          src="./images/enemy_2.png"
          ref={node => {this.state.enemy_4[i] = node;}}
          visible={true}
          aniAction='idle'
          anis={this.anisEnemy_2}
          collisions={this.collsEnemy_2}
          x={x}
          y={y+(45*1)}
          data={{score:30}}
        />
      );
      enemyList_3.push(
        <EgSprite 
          key={i}
          src="./images/enemy_2.png"
          ref={node => {this.state.enemy_3[i] = node;}}
          visible={true}
          aniAction='idle'
          anis={this.anisEnemy_2}
          collisions={this.collsEnemy_2}
          x={x}
          y={y+(45*2)}
          data={{score:20}}
        />
      );
      enemyList_2.push(
        <EgSprite 
          key={i}
          src="./images/enemy_1.png"
          ref={node => {this.state.enemy_2[i] = node;}}
          visible={true}
          aniAction='idle'
          anis={this.anisEnemy_1}
          collisions={this.collsEnemy_1}
          x={x}
          y={y+(45*3)}
          data={{score:20}}
        />
      );
      enemyList_1.push(
        <EgSprite 
          key={i}
          src="./images/enemy_1.png"
          ref={node => {this.state.enemy_1[i] = node;}}
          visible={true}
          aniAction='idle'
          anis={this.anisEnemy_1}
          collisions={this.collsEnemy_1}
          x={x}
          y={y+(45*4)}
          data={{score:10}}
        />
      );
      x += 52;
    }
    
    //------------------------------------------------------------------------
    let enemyBulletList_1 = [];
    let enemyBulletList_2 = [];
    let enemyBulletList_3 = [];
    let characterBulletList = [];
    let boom = [];
    x = 0;
    for (let i=0; i<this.state.const_bullet_max; i++){
      enemyBulletList_1.push(
        <EgSprite 
          key={i}
          src="./images/enemy_bullet_1_1.png"
          ref={node => {this.state.enemy_bullet_1[i] = node;}}
          visible={false}
          aniAction='idle'
          anis={this.aniEnemyBullet}
          collisions={this.collsEnemyBullet}
          x={0}
          y={0}
          data={{use:false}}
        />
      );
      enemyBulletList_2.push(
        <EgSprite 
          key={i}
          src="./images/enemy_bullet_2_2.png"
          ref={node => {this.state.enemy_bullet_2[i] = node;}}
          visible={false}
          aniAction='idle'
          anis={this.aniEnemyBullet}
          collisions={this.collsEnemyBullet}
          x={0}
          y={0}
          data={{use:false}}
        />
      );
      enemyBulletList_3.push(
        <EgSprite 
          key={i}
          src="./images/enemy_bullet_3_3.png"
          ref={node => {this.state.enemy_bullet_3[i] = node;}}
          visible={false}
          aniAction='idle'
          anis={this.aniEnemyBullet}
          collisions={this.collsEnemyBullet}
          x={0}
          y={0}
          data={{use:false}}
        />
      );
      characterBulletList.push(
        <EgSprite 
          key={i}
          src="./images/character_bullet_1.png"
          ref={node => {this.state.character_bullet[i] = node;}}
          visible={false}
          aniAction='idle'
          anis={this.aniCharacterBullet}
          collisions={this.collsCharacterBullet}
          x={0}
          y={0}
          data={{use:false}}
        />
      );          
      boom.push(
        <EgSprite 
          key={i}
          src="./images/enemy_1.png"
          ref={node => {this.state.boom[i] = node;}}
          visible={false}
          aniAction='idle'
          anis={this.anisBoom}
          collisions={this.collsBoom}
          x={x}
          y={50}
          data={{closure:0}}
        />
      );
      x += 60;
    }

    //------------------------------------------------------------------------
    // 主角飛機.
    let characterList = [];
    x = 530;
    for (let i=0; i<6; i++){
      characterList.push(
        <EgSprite 
          key={i}
          src="./images/character_1.png"
          ref={node => {this.state.character[i] = node;}}
          visible={true}
          aniAction='idle'
          anis={this.aniCharacter}
          collisions={this.collsCharacter}
          x={x}
          y={8}
          data={{use:false}}
        />
      );
      x += 45;
    }

    //------------------------------------------------------------------------
    let content = [];
    content.push(
      <Stage 
        key={0}
        ref={node => {this.state._stage = node;}}
        x={0} 
        y={0}       
        width={this.state._width}
        height={this.state._height}
        scaleX={scale}
        scaleY={scale}>

        <Layer>
          <EgSprite 
            key={30}
            src="./images/background_5.jpg" 
            ref={node => {this.state.background_1 = node;}}
            visible={true}
            aniAction='idle'
            anis={this.anisBackground}
            collisions={this.collsBackground}
            x={0}
            y={0}
            data={{use:false}}
          />
          <EgSprite 
            key={31}
            src="./images/background_5.jpg" 
            ref={node => {this.state.background_2 = node;}}
            visible={true}
            aniAction='idle'
            anis={this.anisBackground}
            collisions={this.collsBackground}
            x={0}
            y={0}
            data={{use:false}}
          />

          {enemyList_5}
          {enemyList_4}
          {enemyList_3}
          {enemyList_2}
          {enemyList_1}

          {enemyBulletList_1}
          {enemyBulletList_2}
          {enemyBulletList_3}

          {characterList}
          {characterBulletList}

          {boom}
        </Layer>

        <Layer>
            <Text key={2} text="SCORE<1>" x={60} y={10} letterSpacing={8} fill={'#33ffff'}  fontSize={24} />
            <Text key={3} text="000000"   x={90} y={34} 
            ref={node => {this.state.text_total_score = node;}}
            letterSpacing={6} fill={'#ffffff'}  
            fontSize={24} />

            <Text key={4} text="HI-SCORE" x={310} y={10} letterSpacing={8} fill={'#0066ff'}  fontSize={24} />
            <Text key={5} text="000000"   x={340} y={34}
            ref={node => {this.state.text_hi_score = node;}} 
            letterSpacing={6} fill={'#0066ff'}  
            fontSize={24} />

            <Text key={6} text="GAME OVER" x={285} y={400} 
              ref={node => {this.state.text_messages = node;}}
              letterSpacing={8} 
              fill={'#ffffff'}  
              fontSize={24} 
            />

          <Rect
              key={1}
              x={0}
              y={600}            
              width ={this.props.width_base}
              height={this.props.height_base}
              fill="#000000"            
          />

        </Layer>
      </Stage>
    );

    content.push(      
      <SpaceInvadersAudio key={20} ref={node => {this.state.audio = node;}}/>      
    );
    //------------------------------------------------------------------------
    return (content);
  }
}
export default SpaceInvaders;