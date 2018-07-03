import React, { Component } from 'react';
import './toast.less';

export default class Toast extends Component {
    state = {
        mode: 0, // 0 代表循环模式 1 代表随机模式
        show: false,
    }

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let toastInterval = null;
        if (nextState.show || nextState.mode !== this.state.mode) {
            clearInterval(toastInterval);
            toastInterval = setTimeout(() => {
                this.setState({show: false});
            },2000);
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

        const msg = mode === 0 ? '循环模式' : '随机模式';

        return (
            <div className={`${show ? "toast" : "no_toast"}`} >
                {msg}
            </div>
        )
    }
}
