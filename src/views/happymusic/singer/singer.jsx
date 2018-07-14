import React, { Component } from 'react';
import ReactDOM from "react-dom";
import {getSingerInfo} from "../../../api/singer";
import {getSongVKey} from "../../../api/song"
import {CODE_SUCCESS} from '../../../api/config';
import * as SingerModel from '../../../model/singer';
import * as SongModel from '../../../model/song';
import Header from "../../../components/header/header";
import Scroll from "../../../components/scroll/scroll";

import "./singer.less";

export default class Singer extends Component {
    state = {
        songs: [],
        singer: {},
        loading: true,
        refreshScroll: false
    }

    constructor(props) {
        super(props);
    }

    // 组件加载完
    componentDidMount() {
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
        albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";
        const id = '0025NhlN2yWrP4'; // 歌手id(默认是周杰伦)
        getSingerInfo(id).then(res => {
            console.log(res);
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
                    loading: false,
                    songs: songs,
                    singer: singer
                }, () => {
                    //刷新scroll
                    this.setState({refreshScroll:true});
                });
            }
        });
    }

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
     * 选择歌曲
     */
    selectSong(song) {
        return (e) => {
            console.log('选择的歌曲是: '+song.url);
        };
    }

    /**
     * 监听scroll
     */
    scroll = ({y}) => {
        let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
        let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg);
        let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
        if (y < 0) {
            if (Math.abs(y) + 55 > albumBgDOM.offsetHeight) {
                albumFixedBgDOM.style.display = "block";
            } else {
                albumFixedBgDOM.style.display = "none";
            }
        } else {
            let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
            albumBgDOM.style["webkitTransform"] = transform;
            albumBgDOM.style["transform"] = transform;
            playButtonWrapperDOM.style.marginTop = `${y}px`;
        }
    }

    render() {
        const {
            singer,
            songs,
            refreshScroll
        } = this.state;

        let songDOM = songs.map((song) => {
            return (
                <div className="song" key={song.id} onClick={this.selectSong(song)}>
                    <div className="song-name">{song.name}</div>
                    <div className="song-singer">{song.singer}</div>
                </div>
            );
        });

        return (
            <div>
                <div className="music-singer">
                    <Header title={singer.name} ref="header"></Header>
                    <div style={{position:"relative"}}>
                        <div ref="albumBg" className="singer-img" style={{backgroundImage: `url(${singer.img})`}}>
                            <div className="filter"></div>
                        </div>
                        <div ref="albumFixedBg" className="singer-img fixed" style={{backgroundImage: `url(${singer.img})`}}>
                            <div className="filter"></div>
                        </div>
                        <div className="play-wrapper" ref="playButtonWrapper">
                            <div className="play-button" onClick={this.playAll}>
                                <i className="icon-play"></i>
                                <span>播放全部</span>
                            </div>
                        </div>
                    </div>
                    <div ref="albumContainer" className="singer-container">
                        <div className="singer-scroll" style={this.state.loading === true ? {display:"none"} : {}}>
                            <Scroll refresh={refreshScroll} onScroll={this.scroll}>
                                <div className="singer-wrapper skin-detail-wrapper">
                                    <div className="song-count">歌曲 共{songs.length}首</div>
                                    <div className="song-list">
                                        {songDOM}
                                    </div>
                                </div>
                            </Scroll>
                        </div>
                        {/*<Loading title="正在加载..." show={this.state.loading}/>*/}
                    </div>
                </div>
            </div>
        )
    }
}
