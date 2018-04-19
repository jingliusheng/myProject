// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.http.options.emulateJSON = true

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
