<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-row type="flex" justify="space-between" align="center">
          <el-col :span="8" @click.native="$router.push('/home')">
            <img src="./assets/logo.png" class="logo">
          </el-col>
          <el-col :span="6">
              <span class="user">{{loginer}}</span><span style="margin:0 5px">|</span><span class="logout" @click="logout">退出</span>
          </el-col>
        </el-row>
      </el-header>
     
      <el-container>
        <el-aside>
          <el-menu unique-opened :default-active="$route.meta.opendPath"  :default-openeds="openeds">
            <el-menu-item index="/home" @click.native="$router.push('home')">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu :index="item.id" v-for="item in menuList" :key="item.id" 
              v-if="item.modulename!='首页'"
              >
              <template  slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.modulename}}</span>
              </template>
<el-menu-item v-for="subItem in item.cid" :key="subItem.id" :index="subItem.href" @click.native="link(subItem.href)">{{subItem.modulename}}</el-menu-item>
</el-submenu>
</el-menu>
</el-aside>
<el-main>
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</el-main>
</el-container>
</el-container>

</div>
</template>

<script>
  const env = process.env.NODE_ENV === 'production' ? 'http://admin.rzb0086.com' : 'http://admin.dev.rzb0086.com';
  export default {
    name: 'app',
    data() {
      return {
        menuList: [],
        openeds: [this.$route.meta.menuId],
        loginer: ''
      }
    },
    created() {
      this.$http.post(this.root + "/Index/get_menu").then((res) => {
        res = res.body;
        if (res.status == 200) {
          this.menuList = res.content.menu;
          this.loginer = res.content.username;
        }
      })
    },

    methods: {
      logout() {
        this.$http.post(this.root + '/Public/logout').then(response => {
          window.location.href = env;
        }, response => {});
      },
      link(link) {
        this.$router.push({
          path: link,
          query: {
            t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
          }
        })
      }
    }
  }
</script>

<style>
  @import './assets/css/reset.css';
  @import './assets/css/common.css';
  body {
    margin: 0;
    padding: 0;
  }
  
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
  }
  /* =======头部======= */
  
  .el-header {
    background-color: #47a0fc;
    color: #ffffff;
  }
  
  .el-header .el-col {
    height: 60px;
    line-height: 60px;
  }
  
  .el-header .el-col .logo {
    height: 50px;
    vertical-align: middle
  }
  /* 登录者，退出 */
  
  .el-header .el-col.el-col-6 {
    text-align: center;
  }
  
  .logout {
    cursor: pointer;
  }
  /* 侧边栏 */
  
  .el-aside {
    width: 200px;
    flex: 0 0 200px;
    min-height: calc(100vh - 60px);
  }
  
  .el-aside>ul {
    height: 100%;
  }
  
  .el-menu-item,
  .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }
  
  .el-menu-item-group__title {
    display: none;
  }
  
  .el-submenu .el-menu-item {
    height: inherit;
    line-height: 45px;
    padding-left: 65px!important;
  }
  
  .el-menu-item.is-active {
    background-color: rgb(237, 246, 255);
  }
</style>