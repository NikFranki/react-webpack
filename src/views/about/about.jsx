import React, { Component } from 'react';
import {
    Route,
    Link,
    NavLink,
    withRouter
} from 'react-router-dom';

class About extends Component {

    constructor(props) {
        super(props);
        this.mountChild = this.mountChild.bind(this);
    }

    mountChild = () => {
        this.props.history.push(`${this.props.match.path}/haha`);
    }

    componentWillUnmount() {
        this.curLocation = "";
    }

    render() {
        return (
            <div>
                <div>我是about啊</div>
                <div><Link to="/topics">跳转topics</Link></div>
                <div onClick={this.mountChild}>
                    我是about下的路由组件
                    {/*<NavLink activeClassName="selected" activeStyle={{color: 'red'}} to={`${this.props.match.path}/haha`}>我是about下的路由组件</NavLink>*/}
                </div>
                <Route exact path={`${this.props.match.path}/haha`} component={() => <div>haha</div>} />
            </div>
        );
    }
}

export default withRouter(About);
