import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index/index';
import My from '@/components/My/my';
import Salvate from '@/components/Salvate/salvate';
import Basestatus from '@/common/utils/baseStatus.js';
import { ToastPlugin } from 'vux';
Vue.use(ToastPlugin);
Vue.use(Router);
Vue.prototype.GLOBAL = Basestatus;
export default new Router({
  routes: [
    { path: '*', redirect: '/index' },
    { path: '/index', component: Index, meta: { hasFooter: true } },
    { path: '/salvate', component: Salvate, name: 'salvate' },
    { path: '/my', component: My, name: '我的' },
    { path: '/invitelist', component: (resolve) => { require(['@/components/Invite/invite'], resolve) } },
    { path: '/miji', component: (resolve) => { require(['@/components/Index/miji'], resolve) } },
    { path: '/login', component: (resolve) => { require(['@/components/Login/login'], resolve) } },
    { path: '/modifypwd', component: (resolve) => { require(['@/components/Modifypwd/modify'], resolve) } },
    { path: '/register', component: (resolve) => { require(['@/components/Register/register'], resolve) } },
    { path: '/codelogin', component: (resolve) => { require(['@/components/Codelogin/codelogin'], resolve) } },
    { path: '/suggestion', component: (resolve) => { require(['@/components/Suggestion/index'], resolve) } },
    { path: '/bindphone', component: (resolve) => { require(['@/components/Bindphone/bindphone'], resolve) } },
    { path: '/editname', component: (resolve) => { require(['@/components/Changename/changeName'], resolve) } },
    { path: '/editphone', component: (resolve) => { require(['@/components/Changephone/changePhone'], resolve) } },
    { path: '/index/:id', component: (resolve) => { require(['@/components/Detail/detail'], resolve) }, props: true },
    { path: '/pay', component: (resolve) => { require(['@/components/Pay/pay'], resolve) }, props: true, name: 'pay' },
    { path: '/recharge', component: (resolve) => { require(['@/components/Recharge/recharge'], resolve) }, props: true },
    { path: '/istribute', component: (resolve) => { require(['@/components/Tribute/isTribute'], resolve) }, props: true, name: 'tribute' },
  ]
});