import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import AppContainer from './containers/AppContainer';

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}

const MOUNT_NODE = document.getElementById('root');

render(<AppContainer />, MOUNT_NODE);

