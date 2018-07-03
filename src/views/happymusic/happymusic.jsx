import React, { Component } from 'react';
import { Api } from '../../utils';
import Toast from '../../components/toast/toast';
import './happymusic.less';

export default class HappyMusic extends Component {

    state = {
        isPlay: false, // 当前播放状态
        isLoop: true, // 默认是循环模式
        isLiked: false, // 默认是不喜欢
        songObj: {}, // 歌词对象
    }

    constructor(props) {
        super(props);
        this.playRef = React.createRef();
        this.prevRef = React.createRef();
        this.audioRef = React.createRef();
        this.nextRef = React.createRef();
        this.innerRef = React.createRef();
        this.basebarRef = React.createRef();
        this.leftProgressRef = React.createRef();
        this.progressbarRef = React.createRef();
        this.rightProgressRef = React.createRef();
        this.toastRef = React.createRef();
    }

    componentWillMount() {
        this.crossDBrestrict();
        this.cancelMeta();
        // 获取歌曲
        this.getMusic();
    }

    componentDidMount() {
        // 1 播放控制
        // 2 获取音乐
        // 3 进度条控制
        this.prevRef.current.addEventListener('click', () => {
            this.getMusic();
        }, false);

        this.audioRef.current.addEventListener('canplay', () => {
            this.parsent();
        }, false);

        this.playRef.current.addEventListener('click', () => {
            if (this.audioRef.current.paused) {
                this.play();
            } else {
                this.pause();
            }
        }, false);

        this.nextRef.current.addEventListener('click', () => {
            this.getMusic();
        }, false);

        this.basebarRef.current.addEventListener('mousedown', (ev) => {
            const posX = ev.clientX;
            const targetLeft = this.basebarRef.current.offsetLeft;
            const percentage = (posX - targetLeft) / this.basebarRef.current.clientWidth * 100;
            this.audioRef.current.currentTime = this.audioRef.current.duration * percentage / 100;
        }, false);
    }

    /**
     * 添加meta,跨越豆瓣访问限制
     */
    crossDBrestrict = () => {
        const head = document.querySelector('head');
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'referrer');
        meta.setAttribute('content', 'no-referrer');
        head.appendChild(meta);
    }

    /**
     * 删除meta的限制标签
     */
    cancelMeta = () => {
        const head = document.querySelector('head');
        const meatas = document.querySelectorAll('meta');
        head.removeChild(meatas[4]);
    }

    /**
     * @Author   Franki
     * @DateTime 2018-06-30
     * @desc     获取音乐
     */
    getMusic = () => {
        const url = "http://api.jirengu.com/fm/getSong.php";
        const options = {
            method: 'get',
            url: url,
            data: {
                'channel': 'public_shiguang_90hou',
            }
        };
        Api.fetchData(options).then(res => {
            const responese = res.song[0];
            this.setState({
                songObj: {
                    musicurl: responese.url, // 歌曲地址
                    musicname: responese.title, // 歌曲名称
                    musicer: responese.artist, // 歌手
                    musiclyric: responese.sid, // 歌词
                    musicbackground: responese.picture // 歌曲封面
                }
            }, () => {
                this.fillToInnerBackground();
                this.play();
            });
        });
    }

    /**
     * 给内圈圆复制背景图片
     */
    fillToInnerBackground = () => {
        this.innerRef.current.style.backgroundImage = `url(${this.state.songObj.musicbackground})`;
    }


    /**
     * @Author   Franki
     * @DateTime 2018-06-30
     * @desc     进度条处理
     * @return   {[type]}   [description]
     */
    parsent = () => {
        this.setStartEndTime();
        const progress = setInterval(() => {
            const audioRef = this.audioRef;
            if (!audioRef.current) return;
            const lenth = audioRef.current.currentTime/audioRef.current.duration*100;
            this.progressbarRef.current.style.width = lenth + '%';

            // 自动播放下一首歌
            if (audioRef.current.currentTime === audioRef.current.duration) {
                clearInterval(progress);
                this.getMusic();
            }
        }, 500);
    }

    setStartEndTime = () => {
        const audioRef = this.audioRef;
        this.leftProgressRef.current.innerHTML = '00:00';

        let duration = audioRef.current.duration / 60 + "";
        const index = duration.indexOf('.');
        duration = index === 1 ? "0" + duration.slice(0, (index + 3)) : duration.slice(0, (index + 3));
        this.rightProgressRef.current.innerHTML = duration;
    }

    /**
     * @Author   Franki
     * @DateTime 2018-06-30
     * @desc     播放
     */
    play = () => {
        this.setState({
            isPlay: true
        }, () => {
            this.audioRef.current.play();
        });

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
    }

    render() {
        const {
            isPlay,
            isLoop,
            isLiked,
            songObj
        } = this.state;

        // header 歌词名称 歌手
        // main 圆形区域
        // footer 喜欢收藏区 进度条 播放控制
        return (
            <div className="happy_music">
                <header>
                    <section className="musicname">{songObj.musicname}</section>
                    <section className="musicer">{songObj.musicer}</section>
                </header>
                <main>
                    <audio ref={this.audioRef} src={songObj.musicurl}></audio>
                    <div className="outer_circle">
                        <div ref={this.innerRef} className={`inner_circle ${isPlay ? "active" : ""}`}>
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
                    <section ref={this.basebarRef} className="basebar">
                        <span ref={this.leftProgressRef} className="left_progress"></span>
                        <span ref={this.progressbarRef} className="progressbar"></span>
                        <span ref={this.rightProgressRef} className="right_progress"></span>
                    </section>
                    <section className="play_control">
                        <img onClick={() => {
                            this.setState({isLoop: !isLoop})
                            this.toastRef.current.setState({show: true, mode: !isLoop ? 0 : 1})
                        }} src={require(`../../assets/images/${isLoop ? "loop" : "random"}.png`)} alt="circulation" />
                        <img ref={this.prevRef} src={require("../../assets/images/prev.png")} alt="prev" />
                        <img ref={this.playRef} src={require(`../../assets/images/${!isPlay ? 'play' : 'pause'}.png`)} alt="play" />
                        <img ref={this.nextRef} src={require("../../assets/images/next.png")} alt="next" />
                        <img src={require("../../assets/images/playlist.png")} alt="list" />
                    </section>
                </footer>
                <Toast ref={this.toastRef} />
            </div>
        )
    }
}
