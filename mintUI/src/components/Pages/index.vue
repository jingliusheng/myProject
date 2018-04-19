<template>
  <div class="hello" v-show="loaded">
    <mt-tabbar fixed v-model="selected">
      <mt-tab-item id="1">
        <img slot="icon" src="../../assets/logo.png" alt="">
        上拉加下拉刷
      </mt-tab-item>
      <mt-tab-item id="2">
        <img slot="icon" src="../../assets/logo.png" alt="">
        常用列表
      </mt-tab-item>
      <mt-tab-item id="3">
        <img slot="icon" src="../../assets/logo.png" alt="">
        Swiper
    </mt-tab-item>
      <mt-tab-item id="4">
        <img slot="icon" src="../../assets/logo.png" alt="">
        我的
      </mt-tab-item>
    </mt-tabbar>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        loaded: false,
        selected: '1'
      }
    },
    watch: {
      selected: function(val) {
        switch (val) {
          case '1':
            this.$router.push('/list');
            break;
          case '2':
            this.$router.push('/list/2');
            break;
          case '3':
            this.$router.push('/list/3');
            break;
          case '4':
            this.$router.push('/list/4');
            break;
          default:
            this.$router.push('list');
            break;
        }
      }
    },
    mounted() {
      let _self = this;
      setTimeout(() => {
        _self.$indicator.close();
        _self.loaded = true;
      }, 500)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mint-tabbar.is-fixed {
    z-index: 2;
  }
</style>