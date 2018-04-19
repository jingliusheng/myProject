<template>
  <div>
    <h2>{{msg}}</h2><hr/>
    <h3>count:{{count}}</h3>
    <h3>total:{{total}}</h3>
    <p>
      <button @click="add(1)">+</button>
      <button @click="reduce">-</button>
    </p>
    <p>
      <button @click="addAction">+</button>
      <button @click="reduceAction">-</button>
    </p>
  </div>
</template>

<script>
  import store from '@/vuex/store';
  import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex';
  export default {
    data() {
      return {
        msg: 'Hello Vuex'
      }
    },
    /**
     * 将$store.state.count换成直接使用count表达的三种方法
     * 一、computed属性 
     * computed:{
     *   count(){
     *     return this.$store.state.count;
     *   }
     * }
     * 二、利用mapState
     * computed: mapState({
     *   count: state => state.count,
     *   // 传字符串参数 'count' 等同于 `state => state.count`
     *   count: 'count',
     * })
     * 三、利用数组的形式
     * 还是mapstate,里面不是对象，而是数组，数组里面是对应的字符串
     * 
     * 
     * 将 $store.commit('add',10) 简化成常用的方法的写法add(10)
     * 还是利用mapMutations数组的形式。
     * 
     * 利用扩展运算符，可以继续写自己的计算属性，方法。。。
     */
    computed: {
      ...mapState(['count', 'total']),
      // count() {
      //   return this.$store.getters.count;
      // }
      ...mapGetters(['count'])
    },
    methods: {
      ...mapMutations(['add', 'reduce']),
      ...mapActions(['addAction', 'reduceAction'])
    },
    store
  }
</script>