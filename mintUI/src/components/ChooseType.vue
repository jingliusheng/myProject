<template>
  <div class="chooseType">
    <router-link to="/list">
      <img src="../assets/logo.png" alt=""><br>
      角色一
    </router-link>
    <router-link to="/list">
      <img src="../assets/logo.png" alt=""><br>
      角色二
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'chooseType',
    mounted() {
      let _self = this;
      setTimeout(() => {
        _self.$indicator.close();
      }, 0)
    }
  }
</script>

<style scoped>
  .chooseType {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  
  .chooseType div {
    text-align: center;
  }
  
  .chooseType img {
    width: 100px;
  }
</style>