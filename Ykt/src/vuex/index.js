/**
 * Created by Administrator on 2017/6/29.
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    state: {        //相当于store的data数据
        Loading: false
    },
    getters: {          //相当于store的computed计算属性
        NoLoad: state => {
            return !state.Loading;
        }
    },
    mutations: {        //相当于store的methods方法,不支持异步操作
        LoadTrue(state){
            state.Loading = true;
        },
        LoadFalse(state){
            state.Loading = false;
        }
    },
    actions: {      //相当于store的methods方法,支持异步操作
        Async(context){
            setTimeout(() => {
                context.state.Loading = !context.state.Loading;
            }, 1000);
        }
    }
});
