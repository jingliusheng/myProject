<template>
    <div id="app">
        <view-box ref="viewBox" v-if="$route.meta.hasFooter">
            <router-view></router-view>
            <tabbar slot="bottom" icon-class="tabbar-icon">
                <tabbar-item :selected="$route.path === '/' || $route.path === '/main'" link="/"
                             active-class="item1">
                    <img slot="icon" src="./common/img/tabIcon01.png">
                    <img slot="icon-active" src="./common/img/tabIcon04.png">
                    <span slot="label">发现</span>
                </tabbar-item>
                <tabbar-item :selected="$route.path === '/offline'" link="/offline" active-class="item2">
                    <img slot="icon" src="./common/img/tabIcon02.png">
                    <img slot="icon-active" src="./common/img/tabIcon05.png">
                    <span slot="label">线下VIP课程</span>
                </tabbar-item>
                <tabbar-item :selected="$route.path === '/user'" active-class="item3" @on-item-click="tabbarSelect">
                    <img slot="icon" src="./common/img/tabIcon03.png">
                    <img slot="icon-active" src="./common/img/tabIcon06.png">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>
        <router-view v-else></router-view>
    </div>
</template>

<script>
    import {ViewBox, Tabbar, TabbarItem} from 'vux';
    export default {
        name: 'app',
        methods:{
          tabbarSelect(){
            this.$http.get(this.GLOBAL.BASEURL + '/user/info').then(response => {
              response = response.body;
              if (response.status === this.GLOBAL.STATUSOBJ.ok) {
               this.$router.push({path:'/user'});
              } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
                this.$router.push({ path: '/bindphone/null' });
              } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
                this.$router.push({ path: '/login' });
              } else if (response.status === 302) {
                let str = response.content.url;
                let routePath = this.$route.path.substring(1).split('/').join('_');
                let str1 = str.replace(/123/, routePath);
                window.location.href = str1;
              }
            }, response => {
              window.alert('网络问题，请稍后重试');
            })
          }
        } ,
        components: {
            ViewBox,
            Tabbar,
            TabbarItem
        }
    };
</script>

<style lang="less">
    @import './common/style/reset.css';
    @import '~vux/src/styles/reset.less';
    @import '~vux/src/styles/1px.less';

    html, body {
        overflow-x: hidden;
        width: 100%;
        height: 100%;
        background-color: #F5F5F5;
    }

    #app {
        height: 100%;
        .footerWrapper {
            width: 100%;
            height: 50px;
            position: fixed;
            bottom: 0;
            left: 0;
            background: #FFFFFF;
        }
    }

    .tabbg {
        width: 100%;
        height: 45px;
        background-color: rgba(7, 17, 27, 0.5);
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1000;
    }

    .tabbar-icon {
        width: 22px !important;
        height: 22px !important;
    }
</style>
