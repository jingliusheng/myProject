import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const NAVLIST = [{
    "id": "1",
    "modulename": "首页",
    "href": "/index",
    "isleaf": "0",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_首页.png",
    "whiteIconcls": "/Uploads/ecircle/images/default/module/dqz_首页.png"
  },
  {
    "id": "2",
    "modulename": "平台管理",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_平台管理.png",
    "cid": [
      { "id": "2-1", "modulename": "Banner管理", "href": "/banner", "isleaf": "0", "iconcls": "" }
    ]
  },
  {
    "id": "3",
    "modulename": "会员管理",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_会员.png",
    "cid": [
      { "id": "3-1", "modulename": "会员列表", "href": "/member", "isleaf": "0", "iconcls": "" }
    ]
  },
  {
    "id": "4",
    "modulename": "E企会",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_E企会.png",
    "cid": [
      { "id": "4-1", "modulename": "报名申请", "href": "/e", "isleaf": "0", "iconcls": "" }
    ]
  },
  {
    "id": "5",
    "modulename": "点到为止",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_点到为止.png",
    "cid": [
      { "id": "5-1", "modulename": "企业列表", "href": "/point", "isleaf": "0", "iconcls": "" }
    ]
  },
  {
    "id": "6",
    "modulename": "采购通",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_采购通.png",
    "cid": [
      { "id": "6-1", "modulename": "发布列表", "href": "/purchase_publish", "isleaf": "0", "iconcls": "" },
      { "id": "6-2", "modulename": "回复列表", "href": "/purchase_reply", "isleaf": "0", "iconcls": "" }
    ]
  },
  {
    "id": "7",
    "modulename": "代理吧",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_代理吧.png",
    "cid": [
      { "id": "7-1", "modulename": "发布列表", "href": "/agent_publish", "isleaf": "0", "iconcls": "" },
      { "id": "7-2", "modulename": "回复列表", "href": "/agent_reply", "isleaf": "0", "iconcls": "" }
    ]
  },
  {
    "id": "8",
    "modulename": "库存宝",
    "href": "",
    "isleaf": "1",
    "iconcls": "/Uploads/ecircle/images/default/module/dqzf_库存宝.png",
    "cid": [
      { "id": "8-1", "modulename": "发布列表", "href": "/stock_publish", "isleaf": "0", "iconcls": "" },
      { "id": "8-2", "modulename": "回复列表", "href": "/stock_reply", "isleaf": "0", "iconcls": "" }
    ]
  }
]

const store = new Vuex.Store({
  state: {
    loginUser: '',
    bannerCityList: [], //banner管理分站列表
    memberCityList: [], //会员 地区列表
    navList: NAVLIST, //左侧导航列表
    highLightPath: '/index',
    reload: false
  },
  mutations: {
    saveLoginer(state, loginer) {
      state.loginUser = loginer;
    },

    saveBannerCityList(state, banner_city) {
      state.bannerCityList = banner_city;
      state.memberCityList = state.bannerCityList.slice(1);
      state.memberCityList.unshift({ id: '', name: '全部' })
    },

    saveHighLightPath(state, arg) {
      state.highLightPath = arg;
    },

    reload(state, arg) {
      state.reload = arg;
    }
  },

})

export default store;