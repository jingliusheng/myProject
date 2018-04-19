<template>
  <div id="app">
    <el-container class="is-vertical">
      <MyHeader></MyHeader>
      <el-container>
        <SideNav></SideNav>
        <el-main>
          <keep-alive exclude ="memberView,pointView">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import MyHeader from '@/components/MyHeader/MyHeader';
  import SideNav from '@/components/SideNav/SideNav';

  export default {
    name: 'App',
    components: {
      MyHeader,
      SideNav
    }
  }
</script>

<style>
  @import './assets/css/reset.css';
  @import './assets/css/common.css';
</style>