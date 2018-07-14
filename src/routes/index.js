import React from 'react';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

// 组件
import Home from '../views/home/home';
import About from '../views/about/about';
import HappyMusic from '../views/happymusic/happymusic';
import Singer from '../views/happymusic/singer/singer.jsx';
import Topics from '../views/topics/topics';


// 注意：react-router打包后无法通过路由进入到页面，
// 是因为当我们使用react-router-dom里的BrowserRouter as Router时，
// 是用浏览器history对象的方法去请求服务器，BrowserRouter会变成类似这样的路径  http://localhost:8000/detail/9459469
// 所以这时候必须使用HashRouter，这时候访问具体页面时就是http://localhost:8000/#/detail/9459469

const routes = <Router basename="/" >
    <div>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/music" component={HappyMusic} />
            <Route path="/singer" component={Singer} />
            <Redirect from="/accounts" to="/about" />
            <Route path="/topics" component={Topics} />
        </Switch>
    </div>
</Router>;

export default routes;
