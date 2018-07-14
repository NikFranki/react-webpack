import React, { Component } from 'react';
import { Api } from '../../utils';
import Toast from '../../components/toast/toast';
import Popup from '../../components/popup/popup';
import { getSingerInfo } from "../../api/singer";
import { getSongVKey } from "../../api/song"
import { CODE_SUCCESS } from '../../api/config';
import * as SingerModel from '../../model/singer';
import * as SongModel from '../../model/song';
import Progress from "./play/progress";
import './happymusic.less';

export default class HappyMusic extends Component {

    state = {
        isPlay: false, // 当前播放状态
        currentPlayMode: 0, // 默认是0 循环模式 1  单曲模式 2 随机模式
        isLiked: false, // 默认是不喜欢
        songObj: {}, // 歌词对象
        currentTime: 0, // 当前已经播放的时间
        songs: [], // 歌曲
        singer: {}, // 歌手
        currentPlayIndex: 0, // 默认播放第一首
        playProgress: 0, // 播放进度
    }

    constructor(props) {
        super(props);
        this.playmodes = ['loop', 'single', 'random']; // 播放模式
        //拖拽进度
        this.dragProgress = 0;
        this.playRef = React.createRef();
        this.prevRef = React.createRef();
        this.audioRef = React.createRef();
        this.nextRef = React.createRef();
        this.innerRef = React.createRef();
        this.basebarRef = React.createRef();
        this.leftProgressRef = React.createRef();
        this.progressbarRef = React.createRef();
        this.rightProgressRef = React.createRef();
        this.popupRef = React.createRef();
        this.toastRef = React.createRef();
    }

    componentWillMount() {
        // 获取歌曲
        this.getQQMusic();
    }

    componentDidMount() {
        // 1 播放控制
        // 2 获取音乐
        // 3 进度条控制
        this.prevRef.current.addEventListener('click', () => {
            this.previous();
        }, false);

        this.nextRef.current.addEventListener('click', () => {
            this.next();
        }, false);

        this.audioRef.current.addEventListener('canplay', () => {
            // this.parsent();
        }, false);

        this.audioRef.current.addEventListener('timeupdate', () => {
            if (this.state.isPlay) {
                this.setState({
                    playProgress: this.audioRef.current.currentTime / this.audioRef.current.duration,
                    currentTime: this.audioRef.current.currentTime
                });
            }
        }, false);

        this.audioRef.current.addEventListener('ended', () => {
            this.setState({
                currentTime: 0,
            });
            this.next();
        }, false);

        this.playRef.current.addEventListener('click', () => {
            if (this.audioRef.current.paused) {
                this.play();
            } else {
                this.pause();
            }
        }, false);

        // this.basebarRef.current.addEventListener('mousedown', (ev) => {
        //     const posX = ev.clientX;
        //     const percentage = (posX - this.basebarRef.current.offsetLeft) / this.basebarRef.current.offsetWidth * 100;
        //     if (this.audioRef.current.duration > 0) {
        //         this.audioRef.current.currentTime = this.audioRef.current.duration * percentage / 100;
        //     }
        // }, false);
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-05
     * @desc     获取qq音乐
     * @return   {[type]}   [description]
     */
    getQQMusic = () => {
        const id = '0025NhlN2yWrP4'; // 歌手id(默认是周杰伦)
        getSingerInfo(id).then(res => {
            // 组装歌手详情信息
            if (res.code === CODE_SUCCESS) {
                let singer = SingerModel.createSingerByDetail(res.data);
                singer.desc = res.data.desc ? res.data.desc : "暂无";

                let songList = res.data.list;
                let songs = [];
                songList.forEach(item => {
                    if (item.musicData.pay.payplay === 1) { return }
                    let song = SongModel.createSong(item.musicData);

                    this.getSongUrl(song, song.mId);
                    songs.push(song);
                });
                this.setState({
                    songs: songs,
                    singer: singer
                });
            }
        });
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-05
     * @desc     填充url
     * @param    {[type]}   song [description]
     * @param    {[type]}   mId  [description]
     * @return   {[type]}        [description]
     */
    getSongUrl = (song, mId) => {
        getSongVKey(mId).then(res => {
            if (res) {
                if (res.code === CODE_SUCCESS) {
                    if (res.data.items) {
                        let item = res.data.items[0];
                        song.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
                    }
                }
            }
        });
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-05
     * @desc     上一首
     * @return   {[type]}   [description]
     */
    previous = () => {
        this.pause();

        const {
            songs,
            currentPlayMode,
            currentPlayIndex
        } = this.state;

        if (songs.length > 0 && songs.length !== 1) {
            let index = currentPlayIndex;
            if (currentPlayMode === 0) { // 列表循环
                if (currentPlayIndex === 0) {
                    index = songs.length - 1;
                } else {
                    index = currentPlayIndex - 1;
                }
            } else if (currentPlayMode === 1) { // 单曲播放
                index = currentPlayIndex;
            } else { // 随机播放
                index = parseInt(Math.random() * (songs.length));
            }

            this.setState({
                currentPlayIndex: index
            }, () => {
                this.play();
            });
        }
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-05
     * @desc     下一首
     * @return   {[type]}   [description]
     */
    next = () => {
        this.pause();

        const {
            songs,
            currentPlayMode,
            currentPlayIndex
        } = this.state;

        if (songs.length > 0 && songs.length !== 1) {
            let index = currentPlayIndex;
            if (currentPlayMode === 0) { // 列表循环
                if (currentPlayIndex === songs.length - 1) {
                    index = 0;
                } else {
                    index++;
                }
            } else if (currentPlayMode === 1) { // 单曲播放
                index = currentPlayIndex;
            } else { // 随机播放
                index = parseInt(Math.random() * (songs.length));
            }

            this.setState({currentPlayIndex: index}, () => {
                this.play();
            });
        }
    }

    /**
     * @Author   Franki
     * @DateTime 2018-06-30
     * @desc     进度条处理
     * @return   {[type]}   [description]
     */
    parsent = () => {
        const progress = setInterval(() => {
            const audioRef = this.audioRef;
            if (!audioRef.current) return;
            const lenth = audioRef.current.currentTime/audioRef.current.duration*100;
            this.progressbarRef.current.style.width = lenth + '%';

            // 自动播放下一首歌
            if (audioRef.current.currentTime === audioRef.current.duration) {
                clearInterval(progress);
            }
        }, 500);
    }

    /**
     * @Author   Franki
     * @DateTime 2018-06-30
     * @desc     播放
     */
    play = () => {
        this.setState({
            isPlay: true
        });
        this.audioRef.current.play();
        this.startInnerrefRotate();
    }

    /**
     * @Author   Franki
     * @DateTime 2018-06-30
     * @desc     暂停
     */
    pause = () => {
        this.setState({
            isPlay: false
        });
        this.audioRef.current.pause();
        this.stopInnerrefRotate();
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-04
     * @desc     开始旋转图片
     * @return   {[type]}   [description]
     */
    startInnerrefRotate = () => {
        if (this.innerRef.current.className.indexOf('rotate') === -1) {
            this.innerRef.current.classList.add("rotate");
        } else {
            this.innerRef.current.style["webkitAnimationPlayState"] = "running";
            this.innerRef.current.style["animationPlayState"] = "running";
        }
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-04
     * @desc     停止旋转图片
     * @return   {[type]}   [description]
     */
    stopInnerrefRotate = () => {
        this.innerRef.current.style["webkitAnimationPlayState"] = "paused";
        this.innerRef.current.style["animationPlayState"] = "paused";
    }

    /**
     * @Author   Franki
     * @DateTime 2018-07-05
     * @desc     更改播放模式
     * @return   {[type]}   [description]
     */
    changePlayMode = () => {
        let mode = 0;
        const {
            currentPlayMode
        } = this.state;
        const length = this.playmodes.length - 1;
        if (currentPlayMode === length) {
            this.setState({
                currentPlayMode: 0
            });
            mode = 0;
        } else {
            this.setState({
                currentPlayMode: currentPlayMode + 1
            });
            mode = currentPlayMode + 1;
        }

        this.toastRef.current.setState({
            show: true,
            mode: mode
        });
    }

    /**
     * 开始拖拽
     */
    handleDrag = (progress) => {
        if (this.audioRef.current.duration > 0) {
            this.pause();
            this.dragProgress = progress;
        }
    }
    /**
     * 拖拽结束
     */
    handleDragEnd = () => {
        if (this.audioRef.current.duration > 0) {
            let currentTime = this.audioRef.current.duration * this.dragProgress;
            this.setState({
                playProgress: this.dragProgress,
                currentTime: currentTime
            }, () => {
                this.audioRef.current.currentTime = currentTime;
                this.play();
                this.dragProgress = 0;
            });
        }
    }

    render() {
        const {
            isPlay,
            currentPlayMode,
            isLiked,
            songObj,
            currentTime,
            songs,
            singer,
            currentPlayIndex
        } = this.state;

        console.log(this.state.songs, this.state.singer);
        const duration = songs.length > 0 ? songs[currentPlayIndex].duration : '';
        const musicname = songs.length > 0 ? songs[currentPlayIndex].name : '';
        const musicer = songs.length > 0 ? songs[currentPlayIndex].singer : '';
        const music = songs.length > 0 ? songs[currentPlayIndex].url : '';
        const innerBg = songs.length > 0 ? songs[currentPlayIndex].img : '';

        // header 歌词名称 歌手
        // main 圆形区域
        // footer 喜欢收藏区 进度条 播放控制
        return (
            <div className="happy_music">
                <header>
                    <section className="musicname">{musicname}</section>
                    <section className="musicer">{musicer}</section>
                </header>
                <main>
                    <audio ref={this.audioRef} src={music}></audio>
                    <div className="outer_circle">
                        <div ref={this.innerRef} style={{backgroundImage: `url(${innerBg})`}} className={`inner_circle`}>
                        </div>
                    </div>
                </main>
                <footer>
                    <section className="like_control">
                        <img onClick={() => {this.setState({isLiked: !isLiked})}} src={require(`../../assets/images/${isLiked ? "like_red" : "like"}.png`)} alt="like" />
                        <img src={require("../../assets/images/download.png")} alt="download" />
                        <img src={require("../../assets/images/comments.png")} alt="comments" />
                        <img src={require("../../assets/images/more.png")} alt="more" />
                    </section>
                    {/*<section ref={this.basebarRef} className="basebar">
                        <span ref={this.leftProgressRef} className="left_progress">{getTime(currentTime)}</span>
                        <span ref={this.progressbarRef} className="progressbar"></span>
                        <span ref={this.rightProgressRef} className="right_progress">{getTime(duration)}</span>
                    </section>*/}
                    <div className="controller-wrapper">
                        <div className="progress-wrapper">
                            <span className="current-time">{getTime(currentTime)}</span>
                            <div className="play-progress">
                                <Progress progress={this.state.playProgress}
                                onDrag={this.handleDrag}
                                onDragEnd={this.handleDragEnd}/>
                            </div>
                            <span className="total-time">{getTime(duration)}</span>
                        </div>
                    </div>
                    <section className="play_control">
                        <img onClick={() => {
                            this.changePlayMode()
                        }} src={require(`../../assets/images/${this.playmodes[currentPlayMode]}.png`)} alt="circulation" />
                        <img ref={this.prevRef} src={require("../../assets/images/prev.png")} alt="prev" />
                        <img ref={this.playRef} src={require(`../../assets/images/${!isPlay ? 'play' : 'pause'}.png`)} alt="play" />
                        <img ref={this.nextRef} src={require("../../assets/images/next.png")} alt="next" />
                        <img src={require("../../assets/images/playlist.png")} alt="list" onClick={() => {this.popupRef.current.setState({show: true})}} />
                    </section>
                    <Popup currentPlayIndex={currentPlayIndex} onSelectSong={(index) => {this.setState({currentPlayIndex: index})}} songs={songs} ref={this.popupRef} />
                </footer>
                <section className="player_bg" style={{backgroundImage: `url(${innerBg})`}}>
                </section>
                <Toast ref={this.toastRef} />
            </div>
        )
    }
}

function getTime(second){
    second = Math.floor(second);
    let minute = Math.floor(second / 60);
    second = second - minute * 60;
    return minute  + ":" + formatTime(second);
}

function formatTime(time){
    let timeStr = "00";
    if(time > 0 && time < 10){
        timeStr = "0" + time;
    }else if(time >= 10){
        timeStr = time;
    }
    return timeStr;
}
