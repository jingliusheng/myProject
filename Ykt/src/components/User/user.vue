<template>
    <div class="user">
        <div class="header vux-1px-b">
            <div class="bg">
                <img src="./user-bg.jpg">
                <div class="background"></div>
            </div>
            <div class="info">
                <div class="user-img">
                    <img :src="userInfo.avatar" alt="">
                </div>
                <p>{{userInfo.uname}}</p>
            </div>
        </div>
        <group style="margin-bottom: 20px;">
            <cell is-link link="/member">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon6.png">
                <span slot="title" style="font-size: 14px;color: #333333;">我的会员</span>
                <span slot="value" style="font-size: 16px;color: #F58E26;" v-show="userInfo.isvip==1">还有{{userInfo.vipday}}天到期</span>
                <span slot="value" style="font-size: 16px;color: #ccc;"  v-show="userInfo.isvip==0">尚未开通</span>
            </cell>
            <cell is-link link="/user/myCourse">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon7.png">
                <span slot="title" style="font-size: 14px;color: #333333;">我的课程</span>
            </cell>
            <cell is-link link="/collectedList">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon3.png">
                <span slot="title" style="font-size: 14px;color: #333333;">我的收藏</span>
            </cell>
            <cell style="background-color:#F5F5F5;"></cell>
            <cell is-link link="/mall">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon5.png">
                <span slot="title" style="font-size: 14px;color: #333333;">积分商城</span>
                <span slot="value" style="font-size: 16px;color: #F58E26;">剩余{{userInfo.score}}积分</span>
            </cell>
            <cell is-link :link="'/invite/'+userInfo.invite_pic">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon1.png">
                <span slot="title" style="font-size: 14px;color: #333333;">邀请好友加入</span>
                <span slot="value" style="font-size: 16px;color: #F58E26;">立赚50积分</span>
            </cell>
            <cell is-link link="/account">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon2.png">
                <span slot="title" style="font-size: 14px;color: #333333;">我的账户</span>
                <span slot="value" style="font-size: 16px;color: #F58E26;">¥{{userInfo.balance}}</span>
            </cell>
            <cell is-link link="/help">
                <img slot="icon" width="20" style="display:block;margin-right:10px;" src="./user-icon4.png">
                <span slot="title" style="font-size: 14px;color: #333333;">帮助中心</span>
            </cell>
        </group>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Group, Cell, base64} from 'vux';
    export default {
        name: 'user',
        data(){
            return {
                userInfo: {}
            }
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/user/info').then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.userInfo = response.content;
                    this.userInfo.invite_pic=base64.encode(this.userInfo.invite_pic);
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
        },
        components: {
            Group,
            Cell
        }
    };
</script>

<style lang="less" scoped>
    .weui-cell {
        padding: 10px 15px !important;
    }

    .weui-cell:before {
        left: 0;
    }

    .bg {
        position: relative;
        .background {
            width: 100%;
            height: 150px;
            background-color: rgba(0, 0, 0, .2);
            position: absolute;
            top: 0;
            left: 0;
        }
        img {
            width: 100%;
            height: 150px;
            vertical-align: middle;
        }
    }

    .info {
        text-align: center;
        background-color: #FFFFFF;
        .user-img {
            overflow: hidden;
            position: relative;
            width: 64px;
            height: 64px;
            margin: -45px auto 0;
            border-radius: 50%;
            border: 2px solid #fff;
            z-index: 10;
            img {
                width: 100%;
                height: 100%;
                vertical-align: middle;
            }
        }
        p {
            line-height: 40px;
            color: #333333;
            font-size: 15px;
        }
    }
</style>
