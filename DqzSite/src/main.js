// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill';
import axios from './util/http'
import store from './store'
import router from './router'
import Element from 'element-ui'
import '@/assets/theme/index.css'
import regObj from './util/reg';

Vue.use(Element, { size: 'small' });
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.$axios = axios;
Vue.prototype.$regobj = regObj;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>'
})