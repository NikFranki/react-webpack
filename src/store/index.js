import { observable, action } from 'mobx';

class HomeStore {
    @observable ss = 'hello world';

    @observable num = 0;

    @action plus = () => {
        this.num = ++this.num
    }

    @action minus = () => {
        this.num = --this.num
    }
}

export default new HomeStore();
