import Vue from 'vue'
import Router from 'vue-router'
import Mint from 'mint-ui'
import ChooseType from '@/components/ChooseType'
import Index from '@/components/Pages/index'
import 'mint-ui/lib/style.css'

Vue.use(Router)
Vue.use(Mint)

const router = new Router({
  routes: [{
      path: '/',
      name: 'ChooseType',
      component: ChooseType
    },
    {
      path: '/list',
      name: 'Index',
      component: Index,
      children: [{
        path: '',
        name: 'DataList',
        component: (resolve) => { require(['@/components/Pages/PullUpDown'], resolve) }
      }, {
        path: '2',
        name: 'DataList2',
        component: (resolve) => { require(['@/components/Pages/DataList'], resolve) }
      }, {
        path: '3',
        name: 'DataList3',
        component: (resolve) => { require(['@/components/Pages/Swiper'], resolve) }
      }, {
        path: '4',
        name: 'DataList4',
        component: (resolve) => { require(['@/components/Pages/DataList4'], resolve) }
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  Vue.$indicator.open({
    text: '加载中...',
    spinnerType: 'fading-circle'
  });
  next();
})

export default router;