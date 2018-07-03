import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { showSekeleton, hideSekeleton } from '../../components/loading/loading';
import './home.less';

@withRouter @inject('store') @observer
class Home extends Component {

    state = {
        init: true // 默认是在初始化
    };

    constructor(props) {
        super(props);
        this.jumpPage = this.jumpPage.bind(this);
        this.fbld = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({init: false});
            hideSekeleton();
        }, 1500);
    }

    jumpPage = () => {
        this.props.history.push('/about');
    }

    jumpToMusic = () => {
        this.props.history.push('/music');
    }

    renderHomeItem = (store) => {
        const ele = <div>
                        <div className="ss">
                        </div>
                        <div>牛掰啊，franki</div>
                        <br />
                        <a onClick={this.jumpPage}>跳转about</a>
                        <br />
                        <a onClick={this.jumpToMusic}>进入<strong>开心音乐</strong></a>
                        <br />
                        <p>
                            <button onClick={() => store.default.plus()}>+</button>
                            <button onClick={() => store.default.minus()}>-</button>
                        </p>
                        <p>当前的数字为{store.default.num}</p>
                    </div>;
        return ele;
    }

    render() {
        const {
            store
        } = this.props;

        const {
            init
        } = this.state;

        return (
            <div className="haha">
               {init ? showSekeleton() : this.renderHomeItem(store)}
            </div>
        );
    }
};

export default Home;
