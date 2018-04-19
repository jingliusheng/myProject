import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

/**
 * vuex是数据仓库，同时也是状态管理器，状态就是公用的数据
 * state 状态对象
 * mutations 改变状态对象里的值的方法  要改变状态里的值，必须通过mutations中的方法
 * getters计算过滤操作  相当于vuex中的computed
 */
//状态
const state = {
  count: 1,
  total: 10
}

const mutations = {
  /**
   * @param {*} state 可以理解为默认的，对应的就是状态对象,可以操作对象中的值 
   * @param {*} n 调用的时候传过来的参数，可以使对象
   */

  add(state, n) {
    state.count += n;
    state.total += 2;
  },
  reduce(state) {
    state.count--;
    state.total -= 2;
  }
}

const getters = {
  // count: function(state) {
  //   return state.count += 100
  // },
  count: (state) => state.count += 100
}

const actions = {
  //context 上下文对象
  addAction(context) {
    context.commit('add', 100);
    setTimeout(() => {
      context.commit('reduce')
    }, 3000)
  },
  reduceAction({ commit }) {
    commit('reduce');
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})