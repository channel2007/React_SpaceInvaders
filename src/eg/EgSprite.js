//============================================================================
// EG-精靈物件.
//============================================================================
import React from 'react';
import { Sprite, Rect } from 'react-konva';

class EgSprite extends React.Component{
    //--------------------------------------------------------------------------
    // 初始變數.
    // 傳入:
    //  src="./images/ghoulsGhosts.png"  
    //  ref={node => {this.egSpriteNode = node;}}
    //  anis={this.anis}
    //--------------------------------------------------------------------------
    constructor(props) {
      super(props);
      this.state=({              
        spriteNode:null,            // 精靈節點.
        image:null,
        data:null,                  // 自帶資料.
        visible:false,
        x:this.props.x,
        y:this.props.y,        
        moveRun:false,              // 移動位置.
        mx1:0,
        my1:0,
        mx2:0,
        my2:0,
        f:0,
        speed:0.005,                // 移動速度.
        aniAction:'',               // 初始動作.
        filpH:false,                // 水平翻轉.

        spriteNodeRect:null,        // 碰撞節點.
      })
      
      //-----------------------------------------
      // 綁定函數.
      //-----------------------------------------
      // 開關動畫.
      this.visible=this.visible.bind(this);
      // 取得動畫開啟狀態.
      this.isVisible=this.isVisible.bind(this);

      // 開始動畫.
      this.start=this.start.bind(this);

      // 設定x.
      this.x=this.x.bind(this);
      // 取得x.
      this.getX=this.getX.bind(this);

      // 設定y.
      this.y=this.y.bind(this);
      // 取得x.
      this.getY=this.getY.bind(this);

      // 設定人物每秒播放幾格.
      this.frameRate = this.frameRate.bind(this);
      // 設定播放動作.
      this.animation = this.animation.bind(this);
      // 除錯模式開關.
      this.debugMode = this.debugMode.bind(this);
      
      // 設定移動位置.
      this.move  = this.move.bind(this);
      // 移動更新.
      //this.moveUpdate=this.moveUpdate.bind(this);

      // 碰撞判斷. 
      this.hitTest = this.hitTest.bind(this);
      // 取得碰撞區域.
      this.getHitRect = this.getHitRect.bind(this);

      // 水平翻轉.
      this.filpH=this.filpH.bind(this);
      // 取得水平翻轉.
      this.getFilpH=this.getFilpH.bind(this);

      // 垂直翻轉.
      this.filpV=this.filpV.bind(this);
      // 取得垂直翻轉.
      this.getFilpV=this.getFilpV.bind(this);

      // 取得自訂資料.
      this.getData = this.getData.bind(this);
      // 設定自訂資料.
      this.setData = this.setData.bind(this);

      // 取得自訂資料元素.
      this.getDataElement = this.getDataElement.bind(this);
      // 設定自訂資料元素.
      this.setDataElement = this.setDataElement.bind(this);

      // 載入圖形.
      this._loadImage=this._loadImage.bind(this);
    }
   
    //--------------------------------------------------------------------------
    // 初始.
    //--------------------------------------------------------------------------
    componentDidMount(){
      // 載入圖片.
      this._loadImage();
            
      // 判斷開關精靈.
      if (this.props.visible!==undefined)
        this.visible(this.props.visible);
      // 備份資料.
      if (this.props.data!==undefined)
        this.setState({data:this.props.data});        
              
      // 設定初始動作.
      this.setState({aniAction:this.props.aniAction});
      // 啟動動畫.
      this.state.spriteNode.start();
      
    }
  
    //--------------------------------------------------------------------------
    // 更新.
    //--------------------------------------------------------------------------
    componentDidUpdate(oldProps){
      // 傳入的圖片名稱不同就重載圖片.
      if (oldProps.src !== this.props.src) {
        this._loadImage();
      }     
      
      //alert(this.state.spriteNode.animation());
      // 更新碰撞區.
      this.state.spriteNodeRect.x(this.state.x+this.props.collisions[this.state.aniAction][0]);
      this.state.spriteNodeRect.y(this.state.y+this.props.collisions[this.state.aniAction][1]);
      this.state.spriteNodeRect.width(this.props.collisions[this.state.aniAction][2]);
      this.state.spriteNodeRect.height(this.props.collisions[this.state.aniAction][3]);
                                  
      //this.state.spriteNode.offsetY(this.state.spriteNode.height>>1);
      //this.spriteNodeRect.show();
    }
  
    //--------------------------------------------------------------------------
    // 移除.
    //--------------------------------------------------------------------------
    componentWillUnmount(){
      clearTimeout(this.state.moveTimer);
      this.image.removeEventListener('load', this._handleLoad());      
    }
  
    //--------------------------------------------------------------------------
    // 內部函數相關.
    //--------------------------------------------------------------------------
    //---------------------------
    // 開關動畫.
    //---------------------------
    visible(v){
      this.setState({visible:v});
      this.state.spriteNode.visible(v);
    }
    //---------------------------
    // 開關動畫.
    //---------------------------
    isVisible(){
      return this.state.visible;
    }

    //---------------------------
    // 開始動畫.
    //---------------------------
    start(){
      this.state.spriteNode.start();
    }

    //---------------------------
    // 設定x.
    //---------------------------
    x(dx){
      this.setState({x:dx});
      this.state.spriteNode.x(dx);                
    }
    //---------------------------
    // 取得x.
    //---------------------------
    getX(){
      return this.state.x;
    }

    //---------------------------
    // 設定y.
    //---------------------------
    y(dy){
      this.setState({y:dy});
      this.state.spriteNode.y(dy);
    }
    //---------------------------
    // 取得y.
    //---------------------------
    getY(){
      return this.state.y;
    }

    //---------------------------
    // 設定人物每秒播放幾格.
    //---------------------------
    frameRate(f){
      this.state.spriteNode.frameRate(f);
    }
    //---------------------------
    // 設定播放動作.
    //---------------------------    
    animation(name){
      this.setState({aniAction:name});
      this.state.spriteNode.animation(name);
    }

    //---------------------------
    // 除錯模式開關.
    //---------------------------    
    debugMode(v){      
      this.state.spriteNodeRect.visible(v);
    }

    //---------------------------
    // 設定移動位置.
    //---------------------------        
    move(mx, my, speed){      
      //.      
      clearInterval(this.state.moveTimer);
      this.setState({moveRun:false, mx1:0, my1:0, mx2:0, my2:0, speed:0, f:0, moveTimer:null});
      
      // 計算出移動速度.      
      let d;      
      let dx = Math.abs(mx-this.state.x);
      let dy = Math.abs(my-this.state.y);      
      if(dx>dy)
        d = dx;
      else 
        d = dy;
      d = (1/d)*speed;
      this.setState({moveRun:true, mx1:this.state.x, my1:this.state.y, mx2:mx, my2:my, speed:d});
        
      // 參考資料:https://www.796t.com/post/ZmV4a3M=.html
      this.setState({moveTimer:setInterval(() => {        
        // 防呆.
        if(!this.state.visible){
          clearInterval(this.state.moveTimer);
          this.setState({moveRun:false, mx1:0, my1:0, mx2:0, my2:0, speed:0, f:0, moveTimer:null});
          return;
        }
              
        // 更新.      
        if((this.state.moveRun)&& ((this.state.x !== this.state.mx2)||(this.state.y !== this.state.my2)) ){        
          this.setState({ 
            x:this.state.mx1 + (this.state.mx2 - this.state.mx1) * this.state.f,
            y:this.state.my1 + (this.state.my2 - this.state.my1) * this.state.f
          });
          this.x(this.state.x);
          this.y(this.state.y);

          if (this.state.f < 1) {          
            this.setState({f:this.state.f + this.state.speed});
            //let arr = this.getHitRect();
            //console.log(this.state.f);            
          }else{
            clearInterval(this.state.moveTimer);
            this.setState({moveRun:false, mx1:0, my1:0, mx2:0, my2:0, speed:0, f:0, moveTimer:null});              
          }
        }          
      }, 17)}); // fps:60.      
    }
    

    /*
    //---------------------------
    // 設定移動位置.
    //---------------------------        
    move(mx, my, speed){
      // 初始變數.      
      this.setState({moveRun:false, moveTimer:null, mx1:0, my1:0, mx2:0, my2:0, f:0, speed:0});      

      // 計算出移動速度.      
      let d;      
      let dx = Math.abs(mx-this.state.x);
      let dy = Math.abs(my-this.state.y);      
      if(dx>dy)
        d = dx;
      else 
        d = dy;
      d = (1/d)*speed;
      this.setState({moveRun:true, mx1:this.state.x, my1:this.state.y, mx2:mx, my2:my, speed:d});        
    }    
    //---------------------------
    // 更新(移動...).
    //---------------------------        
    moveUpdate(){
      // 防呆.
      if(!this.state.visible){        
        this.setState({moveRun:false, mx1:0, my1:0, mx2:0, my2:0, speed:0, f:0, moveTimer:null});
        return false;
      }
            
      // 更新.      
      if((this.state.moveRun) && ((this.state.x !== this.state.mx2)||(this.state.y !== this.state.my2)) ){        
        this.setState({ 
          x:this.state.mx1 + (this.state.mx2 - this.state.mx1) * this.state.f,
          y:this.state.my1 + (this.state.my2 - this.state.my1) * this.state.f
        });
        this.x(this.state.x);
        this.y(this.state.y);

        //console.log("1:"+this.state.f+"="+this.state.moveRun);
        
        if (this.state.f < 1) {          
          this.setState({f:this.state.f + this.state.speed});
        }else{
          this.setState({moveRun:false, mx1:0, my1:0, mx2:0, my2:0, speed:0, f:0, moveTimer:null});              
        }

        //console.log("2:"+this.state.f+"="+this.state.moveRun);
      }
      return true;
    }
    */

    //---------------------------
    // 取得碰撞區域.
    // (x,y,w,h).
    // 參考資料:
    // https://blog.csdn.net/qq_41499782/article/details/113847152
    //---------------------------        
    getHitRect(){
      return {
          x:this.state.x+this.props.collisions[this.state.aniAction][0],
          y:this.state.y+this.props.collisions[this.state.aniAction][1],
          w:this.props.collisions[this.state.aniAction][2],
          h:this.props.collisions[this.state.aniAction][3]
      };
    }

    //---------------------------
    // 取得自訂資料(整個取出).
    //---------------------------        
    getData(){
      return this.state.data;
    }

    //---------------------------
    // 設定自訂資料(整個寫入).
    //---------------------------        
    setData(d){
      this.setState({data:d});
    }

    //---------------------------
    // 取得自訂資料元素.
    // 回傳:
    //   非null:成功.
    //---------------------------        
    getDataElement(elm){
      if(this.state.data[elm]===undefined){return null;}
      return this.state.data[elm];
    }

    //---------------------------
    // 設定自訂資料元素.
    // 回傳:
    //   true:成功.
    //  false:失敗.
    //---------------------------        
    setDataElement(elm,value){
      if(this.state.data[elm]===undefined){return false;}

      let d = this.state.data;
      d[elm] = value;
      this.setState({data:d});

      return true;
    }

    //---------------------------
    // 碰撞判斷.
    //---------------------------        
    hitTest(rect){
      if(!this.state.visible){return false;}
        
      if((this.state.x)>(rect.x+rect.w)||
         (this.state.y)>(rect.y+rect.h)||
         (this.state.x+this.props.collisions[this.state.aniAction][2])<(rect.x)||
         (this.state.y+this.props.collisions[this.state.aniAction][3])<(rect.y)
      ){
        return false;
      }
      return true;
    }
    
    //---------------------------
    // 水平翻轉.
    //---------------------------        
    filpH(f){
      this.setState({filpH:f});
      if(f){
        this.state.spriteNode.offsetX(this.props.anis[this.state.aniAction][2]);
        this.state.spriteNode.scaleX(-1.0);
      }else{
        this.state.spriteNode.offsetX(0);
        this.state.spriteNode.scaleX(1.0);
      }

    }
    //---------------------------
    // 取得水平翻轉.
    //---------------------------
    getFilpH(){
      return this.state.filpH;
    }

    //---------------------------
    // 垂直翻轉.
    //---------------------------        
    filpV(f){
      this.setState({filpV:f});
      if(f){      
        this.state.spriteNode.offsetY(this.props.anis[this.state.aniAction][3]);
        this.state.spriteNode.scaleY(-1.0);
      }else{
        this.state.spriteNode.offsetY(0);
        this.state.spriteNode.scaleY(1.0);
      }
    }
    //---------------------------
    // 取得垂直翻轉.
    //---------------------------        
    getFilpV(f){
      return this.state.filpV;
    }

    //---------------------------
    // 載入圖片.
    //---------------------------
    _loadImage(){
      // save to "this" to remove "load" handler on unmount
      this.image = new window.Image();
      this.image.src = this.props.src;
      this.image.addEventListener('load', this._handleLoad());
    }
    _handleLoad(){
      this.setState({
        image: this.image
      });    
    }
  
    //--------------------------------------------------------------------------
    // 成像.
    //--------------------------------------------------------------------------
    render(){      
      let renderList = [];
      renderList.push(                
        <Sprite
          key={0}
          image={this.state.image}
          visible={false}
          ref={node => {
            this.state.spriteNode = node;
          }}            
          x={this.props.x}
          y={this.props.y}
          scaleX={1.0}
          scaleY={1.0}
          animation = {this.props.aniAction}
          animations= {this.props.anis}
          frameRate ={12} 
          frameIndex= {0}            
        />
      );
      renderList.push(
        <Rect
          key={1}
          visible={false}
          x={0}
          y={0}
          width={0}
          height={0}
          stroke={'red'} 
          strokeWidth={1}
          ref={(node) => {
            this.state.spriteNodeRect = node;
          }}
        />
      );      
      return (renderList);

    }
  }
  export default EgSprite;