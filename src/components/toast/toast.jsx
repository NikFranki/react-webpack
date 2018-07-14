import React, { Component } from 'react';
import './toast.less';

export default class Toast extends Component {
    state = {
        mode: 0, // 0 代表列表循环模式 1 代表单曲循环 2 代表随机模式
        show: false,
    }

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let toastInterval = null;
        if (nextState.show || parseInt(nextState.mode) !== parseInt(this.state.mode)) {
            clearInterval(toastInterval);
            toastInterval = setTimeout(() => {
                this.setState({
                    show: false
                });
            }, 800);
        }
        return true;
    }

    getValue = () => {
        return {
            mode: this.state.mode
        }
    }

    render() {
        const {
            mode,
            show
        } = this.state;

        const msg = mode === 0 ? '循环模式' : mode === 1 ? '单曲循环' : '随机模式';

        return (
            <div className={`${show ? "toast" : "no_toast"}`} >
                {msg}
            </div>
        )
    }
}
