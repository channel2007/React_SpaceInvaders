//============================================================================
// 太空侵略者-音樂、音效撥放.
//============================================================================
import React from 'react'
import { Howl } from 'howler';

import sound_shoot from './sounds/shoot.mp3';
import sound_enemy_move_1 from './sounds/enemy_move_1.mp3';
import sound_enemy_move_2 from './sounds/enemy_move_1.mp3';
import sound_enemy_move_3 from './sounds/enemy_move_1.mp3';
import sound_player_down from './sounds/player_down.mp3';
import sound_invader_down from './sounds/invader_down.mp3';

class SpaceInvadersAudio extends React.Component{
    constructor(props) {
        super(props);
        this.state=({        
            audio:[],
            mute:false,
        })

        this.audio_data={      
            shoot: [0,4,0,],
            invader_down:[9,11,9],
        }

        let id=0;            
        for (let i=0; i<5; i++){
            this.state.audio[id] = null;
            this.state.audio[id] = new Howl({src: [sound_shoot]});
            id++;
        }
        this.state.audio[id] = null;
        this.state.audio[id] = new Howl({src: [sound_enemy_move_1]});
        id++;
        this.state.audio[id] = null;
        this.state.audio[id] = new Howl({src: [sound_enemy_move_2]});
        id++;
        this.state.audio[id] = null;
        this.state.audio[id] = new Howl({src: [sound_enemy_move_3]});
        id++;
        this.state.audio[id] = null;
        this.state.audio[id] = new Howl({src: [sound_player_down]});
        id++;
        for (let i=9; i<12; i++){
            this.state.audio[id] = null;
            this.state.audio[id] = new Howl({src: [sound_invader_down]});
            id++;
        }
                    
        //------------------------------------------------------------------------
        // 綁定函數.
        //------------------------------------------------------------------------
        // 播放音樂音效.
        this.play=this.play.bind(this);
        // 暫停音樂音效.    
        this.stop=this.stop.bind(this);
        // 開關音樂音效.
        this.mute=this.mute.bind(this);
        // 取得音樂音效開關狀態.
        this.getMute=this.getMute.bind(this);
    }

    //--------------------------------------------------------------------------
    // 播放音樂音效.
    //--------------------------------------------------------------------------
    play(name){        

        // 主角飛機子彈.
        if(name==='shoot'){
            this.stop();
            this.state.audio[this.audio_data.shoot[2]].play();
            this.audio_data.shoot[2]++;
            if(this.audio_data.shoot[2]>this.audio_data.shoot[1]){
                this.audio_data.shoot[2] = this.audio_data.shoot[0];
            }
        // 敵機移動-1.
        }else if(name==='enemy_move_1'){
            this.stop();
            this.state.audio[5].play();            
        // 敵機移動-2.
        }else if(name==='enemy_move_2'){
            this.stop();
            this.state.audio[6].play();            
        // 敵機移動-3.
        }else if(name==='enemy_move_3'){
            this.stop();
            this.state.audio[7].play();
        // 主角飛機爆炸.
        }else if(name==='player_down'){
            this.stop();
            this.state.audio[8].play();            
        // 敵機爆炸.
        }else if(name==='invader_down'){
            this.stop();
            this.state.audio[this.audio_data.invader_down[2]].play();
            this.audio_data.invader_down[2]++;
            if(this.audio_data.invader_down[2]>this.audio_data.invader_down[1]){
                this.audio_data.invader_down[2] = this.audio_data.invader_down[0];
            }
        }        
        
    }

    //--------------------------------------------------------------------------
    // 暫停音樂音效.
    //--------------------------------------------------------------------------
    stop(){
        //this.state.audio[0].pause();
        this.state.audio[0].stop();
    }

    //--------------------------------------------------------------------------
    // 開關音樂音效.
    //--------------------------------------------------------------------------
    mute(v){
        this.setState({mute:v});
        window.Howler.mute(v);
    }
    
    //--------------------------------------------------------------------------
    // 取得音樂音效開關狀態.
    //--------------------------------------------------------------------------
    getMute(){
        return this.state.mute;
    }

    //--------------------------------------------------------------------------
    render () {
        return (null);
    }

}
export default SpaceInvadersAudio;