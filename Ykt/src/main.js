// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import App from './App';
import router from './router';
import Vuex from './vuex';
import {WechatPlugin} from 'vux';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(WechatPlugin); //  微信

FastClick.attach(document.body);

Vue.config.productionTip = false;
Vue.http.options.emulateJSON = true;
/* eslint-disable no-new */
new Vue({
    router,
    store: Vuex,
    render: h => h(App)
}).$mount('#app-box');


// Vue.http.options.emulateJSON = true;
// Vue.http.options.crossOrigin = true;
// Vue.http.options.emulateHTTP = true;
// Vue.http.interceptors.push((request, next) => {
//     // request.headers.set('Token', '123')
//     next(response => {
//         if(response.status==200){
//             Vuex.commit('LoadFalse');
//         }
//         return response;
//     })
// });