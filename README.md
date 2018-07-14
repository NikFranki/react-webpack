<p align="center">
  <a href="https://github.com/facebook/react"><img src="https://img.shields.io/badge/react-v16.4.1-blue.svg" alt="react"></a>
  <a href="https://github.com/facebook/react-dom"><img src="https://img.shields.io/badge/react--dom-v16.4.1-blue.svg" alt="react-dom"></a>
  <a href="https://reacttraining.com/react-router"><img src="https://img.shields.io/badge/react--router--dom-v4.3.1-blue.svg" alt="react-router-dom"></a>
  <a href="https://github.com/mobxjs/mobx"><img src="https://img.shields.io/badge/mobx-v5.0.3-blue.svg" alt="mobx"></a>
  <a href="https://github.com/mobxjs/mobx-react"><img src="https://img.shields.io/badge/mobx--react-v5.2.3-blue.svg" alt="mobx-react"></a>
  <a href="https://github.com/less/less.js"><img src="https://img.shields.io/badge/less-v3.0.4-blue.svg" alt="less"></a>
  <a href="https://github.com/axios/axios"><img src="https://img.shields.io/badge/axios-v0.18.0-blue.svg" alt="axios"></a>
  <a href="https://github.com/webpack/webpack"><img src="https://img.shields.io/badge/webpack-v4.12.0-blue.svg" alt="webpack"></a>
</p>

# 尝试特性，从”新“开始

这是一个基于 webpack + react + react-router-dom + mobx + mobx-react 搭建的项目

## 安装

可以运用yarn管理工具

```
yarn install
或者
npm install
```

## 开发环境

```
yarn dev
或者
npm run dev
```

## 生产环境

```
yarn prod
yarn build
或者
npm run prod
npm run build
```

## 目录结构

```
react-webpack
|   yarn.lock yarn记录的依赖版本号
│   README.md 说明
│   package.json 项目依赖
|   .babelrc 项目插件配置
│
└───config webpack打包配置
│   │   webpack.config.dev.js  开发环境配置
│   │   webpack.config.prod.js 生产环境配置
|   |   webpackDevServer.config.js 挂载服务器配置
│
└───dist 打包出来的文件
|    |
|    │   index.html
|    │
|    └───static
|    |   │
|    |   └───css
|    |   │
|    |   └───js
|    |   |
|    |   └───media
|
└───node_modules 项目依赖
|
└───public
|   |
|   └───index.html 模板文件
|
└───src
|   |
|   └───assets 静态文件
|   |
|   └───components 公用组件
|   |
|   └───containers 容器组件
|   |
|   └───routes 路由
|   |
|   └───store 状态数据
|   |
|   └───styles 公用样式
|   |
|   └───utils 工具
|   |
|   └───views 业务组件
```

## 效果

<img src="http://p2bmmf3zh.bkt.clouddn.com/hp.png" alt="image" width="375" height="667" />>

## License

MIT (c) 2018