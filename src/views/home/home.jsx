import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import './home.less';
// import '../../styles/app.less';

@withRouter @inject('store') @observer
class Home extends Component {

    constructor(props) {
        super(props);
        this.jumpPage = this.jumpPage.bind(this);
    }

    jumpPage = () => {
        this.props.history.push('/about');
    }

    render() {
        const {
            store
        } = this.props;
        console.log('使用mobx得到的值：', store.default.ss);
        console.log('使用mobx得到的值：', store.default.num);
        return (
            <div className="haha">
                <div className="ss">
                </div>
                <div>牛掰啊，franki</div>
                <br />
                <a onClick={this.jumpPage}>跳转about</a>
                <br />
                <p>
                    <button onClick={() => store.default.plus()}>+</button>
                    <button onClick={() => store.default.minus()}>-</button>
                </p>
                <p>当前的数字为{store.default.num}</p>
            </div>
        );
    }
};

export default Home;
