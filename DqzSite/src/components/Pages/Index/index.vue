<template>
  <div id="index">
      <span>欢</span>
      <span>迎</span>
      <span>进</span>
      <span>入</span>
      <transition name="el-zoom-in-center">
        <div v-show="ready">
          <span>电</span>
          <span>圈</span>
          <span>子</span>
          <span>在</span>
          <span>线</span>
          <span>合</span>
          <span>伙</span>
          <span>人</span>
        </div>
      </transition>
      <el-collapse-transition>
        <div v-show="ready">
          <span>管</span>
          <span>理</span>
          <span>后</span>
          <span>台</span>
        </div>
      </el-collapse-transition>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data() {
      return {
        ready: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.ready = true;
      }, 500);
    }
  }
</script>

<style scoped>
  #index {
    text-align: center;
    margin-top: 5%;
  }
  
  #index span {
    margin: 0 15px;
    line-height: 2.5;
    color: #47a0fc;
    font-weight: 700;
    font-size: 30px;
    text-shadow: 5px 5px 3px rgb(139, 147, 182);
    cursor: default;
  }
</style>