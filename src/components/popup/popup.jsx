import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scroll from "../scroll/scroll";
import './popup.less';

export default class Popup extends Component {

    state = {
        show: false,
        refreshScroll: false
    };

    constructor(props) {
        super(props);
        this.popup = React.createRef();
    }

    componentDidMount() {
        this.setState({refreshScroll: true});
    }

    scroolToCurrentItem = (index) => {
        this.refs.scroll.bScroll.scrollToElement(ReactDOM.findDOMNode(this.refs[`song-${index}`]));
    }

    hideList = () => {
        if (this.timer) {clearTimeout(this.timer)} 
        this.timer = setTimeout(() => {
            this.setState({show: false});
        }, 300);
    }
    
    renderLi = () => {
        const {
            songs,
            onSelectSong,
            currentPlayIndex
        } = this.props;

        return songs.map((item, index) => <li ref={`song-${index}`} key={`song-${index}`} onClick={() => {onSelectSong(index);this.scroolToCurrentItem(index);}}>
            <div className="left_area">
                {`${index + 1 >10 ? index : '0' + (index + 1)}`}
            </div>
            <div className="right_area">
                <div className={`${currentPlayIndex === index ? 'expression active' : 'expression'}`}>
                    <p>{item.name}</p>
                    <p>{item.singer}</p>
                </div>
                <div className="operation">
                    <img src={require('../../assets/images/delete.png')} alt="pic" />
                </div>
            </div>
        </li>)
    }

    render() {
        const {
            show,
            refreshScroll
        } = this.state;

        const classNameBg = `${show ? 'pop_bg' : 'pop_bg_hide'}`;
        const className = `${show ? 'popup_show' : 'popup_hide'}`;

        return (
            <div className='pop_up' ref={this.popup}>
                <div className={classNameBg} onClick={this.hideList}>
                    <div className={className}>
                        <div className="popup_wrap">
                            <div className="popup_head" onClick={e => {e.stopPropagation()}}>
                                <div className="head_title">
                                    播放列表
                                </div>
                                <div className="close" onClick={this.hideList}>
                                    关闭
                                </div>
                            </div>
                            <div className="popup_list" style={{height: '200px', overflowY: 'auto'}}>
                            <Scroll ref="scroll" refresh={refreshScroll}>
                                <ul>
                                    {this.renderLi()}
                                </ul>
                            </Scroll>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

