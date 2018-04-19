<template>
  <div class="home">
    <span>欢</span>
    <span>迎</span>
    <span>进</span>
    <span>入</span>
    <transition name="el-zoom-in-center">
      <div v-show="ready">
        <span>认</span>
        <span>证</span>
        <span>宝</span>
        <span>管</span>
        <span>理</span>
        <span>后</span>
        <span>台</span>
      </div>
    </transition>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        ready:false
      }
    },
    mounted(){
      setTimeout(()=>{
        this.ready = true
      },500)
    }
  }
</script>

<style>
.home{
  text-align: center;
  margin-top:5%; 
  
}
.home span{
  margin:0 15px;
  line-height: 2.5;
  color:#47a0fc;
  font-weight: 700;
  font-size: 30px;
  text-shadow: 5px 5px 3px rgb(139, 147, 182);
  cursor: default;
}
</style>
