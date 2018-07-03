import {
    observable,
    action,
    computed,
    configure
} from 'mobx';

import axios from "axios";

// 使用严格模式，只有动作之中才可以修改状态
configure({
    enforceActions: true
});

class HomeStore {
    @observable num = 0;

    @computed get msg() {
        return 'num: ' + this.num
    }

    @action plus = () => {
        this.num++
    }

    @action minus = () => {
        this.num--
    }

    // 数据请求
    @action
    fetchData = (url, options) => {
        const result = fetch(url, options).then(
            res => {return res.json()}
            // action('fetchRes', res => {
            //     return res.json()
            // })
        )
        return result;
    }
}

export default new HomeStore();
