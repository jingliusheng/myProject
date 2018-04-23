<template>
    <div class="mall">
        <div class="mall-background"></div>
        <div class="mall-link">
            <router-link to="/integralDetail" class="vux-1px-r">
                <img src="./mall-icon1.png" alt="">
                <span>积分</span>
                <span style="color: #f48618;font-size: 16px">{{dataList.userscore}}</span>
            </router-link>
            <router-link to="/Record">
                <img src="./mall-icon2.png" alt="">
                <span>兑换记录</span>
            </router-link>
        </div>
        <div class="mall-content">
            <group>
                <cell>
                    <div slot="title">
                        <img style="width:17px;height: 19px;vertical-align: text-bottom" src="./mall-icon3.png"
                             alt="">
                        <span>积分优选</span>
                    </div>
                </cell>
            </group>
            <ul class="mall-list">
                <li class="mall-item" @click="intoDetail(item.id,item.remains)" v-for="item in dataList.goodslist">
                    <div class="img-wrapper">
                        <div class="sold-out" v-show="item.remains==='0'"></div>
                        <img :src="item.pic" alt="">
                    </div>
                    <div class="type">{{item.name}}</div>
                    <div class="count"><span>{{item.score}}</span>积分</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Group, Cell} from 'vux';
    export default{
        data(){
            return {
                dataList: []
            };
        },
        mounted(){
            this.$http.get(this.GLOBAL.BASEURL + '/score/goods_list').then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        },
        methods: {
            intoDetail(id,remains){
                if(remains>0){
                    this.$router.push('/mallDetail/' + id);
                }
            }
        },
        components: {
            Group,
            Cell
        }
    }
</script>

<style lang="less" scoped>
    .mall-background {
        width: 100%;
        height: 165px;
        background: url('mall_bg1.png') no-repeat top left;
        background-size: 100% 100%;
    }

    .mall-link {
        font-size: 0;
        height: 21px;
        background-color: #fff;
        padding: 12px 0;
        a {
            display: inline-block;
            width: 50%;
            text-align: center;
            font-size: 14px;
            color: #333333;
            box-sizing: border-box;
            img {
                width: 18px;
                height: 16px;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                vertical-align: middle;
            }
        }
    }

    .mall-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 11px 14px 6px;
        .mall-item {
            width: 49%;
            max-width: 168px;
            height: 153px;
            margin-bottom: 6px;
            padding: 15px 9px 0;
            background-color: #fff;
            box-sizing: border-box;
            .img-wrapper {
                position: relative;
                width: 100%;
                height: 83px;
                .sold-out {
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, .6) url('./mall_bg2.png') no-repeat center;
                    background-size: 88px 47px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
            img {
                width: 100%;
                height: 83px;
                border-radius: 4px;
            }
            .type {
                width:100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                color: #333333;
                height:20px;
                line-height: 20px;
                margin-top: 9px;
            }
            .count {
                line-height: 20px;
                font-size: 12px;
                color: #b3b3b3;
                span {
                    font-size: 14px;
                    color: #f58e26;
                }
            }
        }
    }
</style>
