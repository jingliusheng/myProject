import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Index from '@/components/Pages/Index/index'
import Banner from '@/components/Pages/Banner/index'
import Member from '@/components/Pages/Member/index'
import MemberView from '@/components/Pages/Member/view'
import Apply from '@/components/Pages/Eapply/index'
import Point from '@/components/Pages/Point/index'
import PointManage from '@/components/Pages/Point/manage'
import PurchasePublish from '@/components/Pages/Purchase/publish'
import PurchaseReply from '@/components/Pages/Purchase/reply'
import AgentPublish from '@/components/Pages/Agent/publish'
import AgentReply from '@/components/Pages/Agent/reply'
import StockPublish from '@/components/Pages/Stock/publish'
import StockReply from '@/components/Pages/Stock/reply'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: '首页',
      component: Index
    },
    {
      path: '/banner',
      name: 'Banner管理',
      component: Banner
    },
    {
      path: '/member',
      name: '会员列表',
      component: Member
    },
    {
      path: '/member/view/:id',
      name: '会员详情',
      component: MemberView
    },
    {
      path: '/e',
      name: '报名申请',
      component: Apply
    },
    {
      path: '/point',
      name: '企业列表',
      component: Point
    },
    {
      path: '/point/manage/:id',
      name: '企业详情',
      component: PointManage
    },
    {
      path: '/purchase_publish',
      name: '采购通发布列表',
      component: PurchasePublish
    },
    {
      path: '/purchase_reply',
      name: '采购通回复列表',
      component: PurchaseReply
    },
    {
      path: '/agent_publish',
      name: '代理吧发布列表',
      component: AgentPublish
    },
    {
      path: '/agent_reply',
      name: '代理吧回复列表',
      component: AgentReply
    },
    {
      path: '/stock_publish',
      name: '库存宝发布列表',
      component: StockPublish
    },
    {
      path: '/stock_reply',
      name: '库存宝回复列表',
      component: StockReply
    }
  ]
})
router.beforeEach((to, from, next) => {
  let arr = to.path.split('/');
  let currentHighLight = '/' + arr[1];
  next();
  if (to.path == from.path) {
    store.commit('reload', true)
  } else {
    store.commit('reload', false)
  }
  store.commit('saveHighLightPath', currentHighLight);
})
export default router