<template>
  <div id="app">
    <view-box ref="viewBox" v-if="$route.meta.hasFooter">
      <flexbox class="lh-head" :gutter="0">
        <flexbox-item class="lh-logo">
          <img src="./common/img/logo.png" width="33" height="34"> 
          幸运之家，你心灵的庇护所！
        </flexbox-item>  
        <flexbox-item class="lh-miji">
          <router-link to="/miji">
          <img src="./common/img/mijiIcon.png" width="12" height="12">
          幸运秘籍
          </router-link>
        </flexbox-item>  
      </flexbox>    
      <router-view></router-view>
      <tabbar>
        <tabbar-item link="https://shop214717177.m.taobao.com">
          <img slot="icon" src="./common/img/taobao.png">
          <span slot="label">淘宝</span>
        </tabbar-item>
        <tabbar-item link="https://weibo.com/8xingyunfu8">
          <img slot="icon" src="./common/img/sina.png">
          <span slot="label">微博</span>
        </tabbar-item>

        <tabbar-item link="/suggestion">
          <img slot="icon" src="./common/img/feedback.png">
          <span slot="label">建议</span>
        </tabbar-item>
        <tabbar-item link="/my">
          <img slot="icon" src="./common/img/my.png">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
    <router-view v-else></router-view>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem, Flexbox, FlexboxItem } from "vux";
  export default {
    name: 'app',
    components: {
      Tabbar,
      TabbarItem,
      Flexbox,
      FlexboxItem
    }
  }
</script>

<style lang="less" scoped>
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import './common/style/reset.css';
body {
  background-color: #ffffff;
}
#app {
  height: 100%;
}
.weui-tabbar {
  position: fixed!important;
}
.lh-head{
  position: fixed;
  top:0;
  height: 44px;
  background: #4d5a6b;
  color: #fefefe;
  padding: 0 10px;
  box-sizing: border-box;
  .lh-logo{
    font-size:15px;
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img{
      border-radius: 5px;
      margin-right:10px;
    }
  }
  .lh-miji{
    font-size: 12px;
    width: 50px;
    flex: 0 0 50px;
    a{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      color: #fefefe;
    }
  }
}

</style>
