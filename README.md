# 遊戲影片
<a href="https://youtu.be/MrzM8fdGfKw" target="_blank"><img src="https://github.com/channel2007/React_SpaceInvaders/blob/master/public/images/screen_1.jpg" 
alt="播放影片" width="640" height="480" border="10" /></a>

# 前言
  趁連假給自己定了一個目標，就是學一套網頁框架，google了一下大概就三個比較多人用，分別為angular、react、vue，沒想太多直接選react，依照之前學程式語言的經驗，習慣以實作一款遊戲來當作入門練習，二話不說選我最熟悉的"太空侵略者"，以下大致列一下每天的進度：
* 第一天：
  * 搜尋react文章並了解其運作，並找一套繪圖套件(評估後決定用konvajs)配合製作遊戲
  * 搜尋網路圖片、音效資源
* 第二天：
  * 擴充konvajs的Sprite(加入碰撞功能)
  * 處理所有"太空侵略者"圖片
  * 將處理好的圖片透過react秀在網頁上
* 第三天：
  * 處理所有"太空侵略者"遊戲運作
    * 敵機移動、敵機子彈碰撞主角飛機處理
    * 主角飛機鍵盤移動、主角子彈碰撞敵機處理
    * 分數處理
* 第四天：
  * 處理所有"太空侵略者"遊戲運作
    * 背景捲動
    * 最高分數處理
    * 螢幕自動適應處理

# 安裝方法
* STEP 1:建立專案.
  * create-react-app react_space_invaders

* STEP 2:進入目錄
  * cd react_space_invaders

* STEP 3:安裝套件.
  * npm install react-konva konva --save
  * npm install --save react-howler
 
* STEP 4:將本下載檔案解壓覆蓋掉原本的目錄

* STEP 5:執行
  * npm start

# 控制方法
* Enter、空白鍵：開始遊戲
* 左右鍵：左右移動角色
* M鍵：音樂、音效開關
  
# 使用網路資源
* [角色](https://www.spriters-resource.com/mobile/arkanoidvsspaceinvaders/sheet/115283/)
* [背景](https://www.spriters-resource.com/arcade/galagaarrangement/sheet/62554/)
* [音效](https://downloads.khinsider.com/game-soundtracks/album/space-invaders-1997-snes)

# 版權宣告
* 僅供學術研究用，請勿使用在商業用途上

# 官方粉絲團
[無限升級](https://www.facebook.com/unlimited.upgrade)
