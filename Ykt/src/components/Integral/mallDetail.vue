<template>
    <div class="mallDetail">
        <div class="goods">
            <img :src="dataList.pic" alt="">
        </div>
        <div class="type">
            <h3>{{dataList.name}}</h3>
            <div class="points-number">
                <span class="count">{{dataList.score}}</span><span>积分</span>
            </div>
        </div>
        <div class="detail">
            <h3>商品详情</h3>
            <div class="textEdit vux-1px-t" v-html="dataList.description"></div>
        </div>
        <div class="btn-operation vux-1px-t">
            <div class="remaining-points" v-show="isEnough">
                <span>积分余额：</span>
                <span class="count">{{dataList.userscore}}</span>
            </div>
            <div class="notenough-points" v-show="!isEnough">您的积分不足</div>
            <x-button type="primary" style="margin: 0 auto 10px;width:90%;background-color:#3d8afe;"
                      @click.native="exchange" v-show="isEnough">立即兑换
            </x-button>
            <x-button type="primary" style="margin: 0 auto 10px;width:90%;background-color:#3d8afe;"
                      @click.native="exchange" v-show="!isEnough">去赚取积分
            </x-button>
        </div>
        <toast v-model="showSuccess" type="text" :time="800" is-show-mask :text="soldText"
               position="middle"></toast>
        <div v-transfer-dom>
            <confirm v-model="exchangeWarning" content="确定要兑换？"
                     @on-cancel="onCancel"
                     @on-confirm="onConfirm">
            </confirm>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XButton, Toast, Confirm, TransferDomDirective as TransferDom} from 'vux';
    export default{
        data(){
            return {
                dataList: {},
                exchangeWarning: false,
                showSuccess: false,
                soldText: '兑换成功'
            }
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/score/goods_detail', {params: {goodsid: this.$route.params.id}}).then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        },
        computed: {
            isEnough(){
                return Number(this.dataList.userscore) >= Number(this.dataList.score) ? true : false;
            }
        },
        methods: {
            //兑换按钮调起弹窗内的取消事件
            onCancel(){
                this.exchangeWarning = false;
            },
            //兑换按钮调起弹窗内的确认提交事件
            onConfirm(){
                this.exchangeWarning = false;
                this.$http.post(this.GLOBAL.BASEURL + '/score/exchange', {goodsid: this.$route.params.id}).then(response => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.soldText = '兑换成功';
                        this.dataList.userscore = Number(this.dataList.userscore) - Number(this.dataList.score);
                    } else {
                        this.soldText = response.msg;
                    }
                    this.showSuccess = true;
                }, response => {
                    window.alert('网络原因，请稍后重试');
                })
            },
            //兑换按钮事件
            exchange(){
                if (Number(this.dataList.userscore) >= Number(this.dataList.score)) {
                    this.exchangeWarning = true;
                } else {
                    this.$router.push({path: '/integralRule'});
                }
            }
        },
        components: {
            XButton,
            Toast,
            Confirm
        }
    }
</script>

<style lang="less" scoped>
    .mallDetail {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .goods {
        flex: 0 0 176px;
        height: 176px;
        background-color: #373737;
        text-align: center;
        line-height: 176px;
        img {
            width: 267px;
            height: 150px;
            vertical-align: middle;
            border-radius: 4px;
        }
    }

    .type {
        flex: 0 0 88px;
        height: 88px;
        background-color: #fff;
        padding: 9px 14px 0;
        margin-bottom: 11px;
        box-sizing: border-box;
        h3 {
            font-size: 17px;
            line-height: 30px;
        }
        .points-number {
            color: #f48618;
            font-size: 13px;
            .count {
                font-size: 21px;
                margin-right: 3px;
                font-weight: bold;
            }
        }
    }

    .detail {
        flex: 1;
        background-color: #fff;
        font-size: 14px;
        padding-bottom: 83px;
        h3 {
            line-height: 37px;
            color: #999999;
            text-indent: 14px;
        }
        .textEdit {
            padding: 12px 14px;
            color: #333333;
            line-height: 20px;
        }
    }

    .btn-operation {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        .remaining-points {
            text-align: center;
            font-size: 0;
            span {
                display: inline-block;
                font-size: 14px;
                line-height: 30px;
            }
            .count {
                color: #f48618;
                font-size: 16px;
            }
        }
        .notenough-points {
            text-align: center;
            line-height: 30px;
            color: #f48618;
            font-size: 14px;
        }
    }
</style>
