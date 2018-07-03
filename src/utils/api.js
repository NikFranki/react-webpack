import axios from 'axios';

export default {
    async fetchData(options) {
        let { data } = await axios(options);
        return data;
    }
}
