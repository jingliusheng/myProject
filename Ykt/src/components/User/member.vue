<template>
    <div class="member">
        <div class="user-info">{{dataList.uname}}</div>
        <div class="expire-time" v-show="dataList.isvip=='1'">{{vipendtime}} 到期</div>
        <div class="expire-time" v-show="dataList.isvip=='0'">尚未开通云课堂会员</div>
        <div class="member-cont">
            <div class="member-rules">
                <div class="left">
                    <span>一年期会员</span>
                    <img src="./member1.png" alt="">
                </div>
                <span class="right">{{dataList.price}}元</span>
            </div>
            <x-button type="primary" v-show="dataList.isvip=='1'" style="background-color:#f48618;"
                      @click.native="toggleBuy">会员续费
            </x-button>
            <x-button type="primary" v-show="dataList.isvip=='0'" style="background-color:#f48618;"
                      @click.native="toggleBuy">立即开通
            </x-button>
            <div class="member-interest">
                <h3>会员权益</h3>
                <ul class="text">
                    <li>
                        <h4>1.免费课程</h4>
                        <p>电气云课堂畅学VIP平台专属免费课程</p>
                    </li>
                    <li>
                        <h4>2.折扣课程</h4>
                        <p>平台付费精品课程专享折扣</p>
                    </li>
                </ul>
            </div>
        </div>
        <transition name="slide">
            <div class="slideWrapper" v-show="buy">
                <div v-show="money">
                    <p class="course-title">云课堂会员支付</p>
                    <p class="course-price">¥ {{dataList.price}}</p>
                    <x-button class="btn btn-sure" @click.native="buySubmit">确定</x-button>
                </div>
                <div v-show="!money">
                    <p class="course-title">余额不足</p>
                    <x-button class="btn btn-wx" @click.native='wxPay'>微信支付</x-button>
                    <x-button class="btn btn-budget" link="/account">钱包充值</x-button>
                </div>
                <x-button class="btn btn-cancle" @click.native="toggleBuy">取消</x-button>
            </div>
        </transition>
        <transition name="fade">
            <div class="pay-background" v-show="buy"></div>
        </transition>
        <toast v-model="showSuccess" type="text" :time="800" is-show-mask text="购买成功" position="middle"></toast>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XButton, Toast} from 'vux';
    export default{
        data(){
            return {
                dataList: {},
                buy: false,
                money: true,
                vipendtime: '',
                showSuccess: false
            }
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/wx/wxconfig').then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    let Data = response.content;
                    this.$wechat.config({
                        debug: Data.debug, // 开启调试模式,开发时可以开启
                        appId: Data.appId,   // 必填，公众号的唯一标识   由接口返回
                        timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
                        nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
                        signature: Data.signature,   // 必填，签名 由接口返回
                        jsApiList: ['chooseWXPay'] // 此处填你所用到的方法
                    })
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
            this.$http.get(this.GLOBAL.BASEURL + '/user/vip_info').then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                    let t = this.dataList.vipendtime.split(' ')[0].split('-');
                    this.vipendtime = t[0] + '年' + t[1] + '月' + t[2] + '日';
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        },
        methods: {
            //会员续费确定
            buySubmit(){
                this.$http.post(this.GLOBAL.BASEURL + '/account/balance_pay', {'type': 'vip'}).then(response => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.buy = false;
                        this.showSuccess = true;
                        this.$http.get(this.GLOBAL.BASEURL + '/user/vip_info').then(response => {
                            response = response.body;
                            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                                this.dataList = response.content;
                                let t = this.dataList.vipendtime.split(' ')[0].split('-');
                                this.vipendtime = t[0] + '年' + t[1] + '月' + t[2] + '日';
                            }
                        }, response => {
                            window.alert('网络原因，请稍后重试');
                        })
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noMoney) {
                        this.money = false;
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
                        this.$router.push({path: '/bindphone/null'});
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
                        this.$router.push({path: '/login'});
                    } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
                        window.alert(response.msg + '==>' + response.status);
                    } else if (response.status === 302) {
                        let str = response.content.url;
                        let routePath = this.$route.path.substring(1).split('/').join('_');
                        let str1 = str.replace(/123/, routePath);
                        window.location.href = str1;
                    }
                }, response => {
                    window.alert('网络原因，请稍后重试');
                })
            },
            //取消
            toggleBuy(){
                this.buy = !this.buy;
                if (!this.money) {
                    setTimeout(() => {
                        this.money = true;
                    }, 600);
                }
            },
            //微信支付
            wxPay(){
                if (typeof WeixinJSBridge == "undefined") {
                    window.alert('请在微信中打开');
                } else {
                    this.$http.post(this.GLOBAL.BASEURL + '/wx/pay', {
                        'type': 'vip'
                    }).then(response => {
                        response = response.body;
                        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                            let obj = response.content;
                            this.onBridgeReady(obj);
                        } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
                            window.alert(response.msg + '==>' + response.status);
                        } else if (response.status === 302) {
                            let str = response.content.url;
                            let routePath = this.$route.path.substring(1).split('/').join('_');
                            let str1 = str.replace(/123/, routePath);
                            window.location.href = str1;
                        }
                    }, response => {
                        window.alert('网络原因，请稍后重试');
                    })
                }
            },
            onBridgeReady(obj){
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        appId: obj.appId,//公众号名称，由商户传入
                        timeStamp: obj.timeStamp,//时间戳，自1970年以来的秒数
                        nonceStr: obj.nonceStr, //随机串
                        package: obj.package,
                        signType: obj.signType,//微信签名方式：
                        paySign: obj.paySign //微信签名
                    },
                    function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            window.location.reload();
                        }  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回  ok，但并不保证它绝对可靠。
                    }
                );
            }
        },
        components: {
            XButton,
            Toast
        }
    }
</script>

<style lang="less" scoped>
    .member {
        padding: 0 9px;
    }

    .user-info {
        text-align: center;
        font-size: 17px;
        color: #333333;
        padding-top: 22px;
    }

    .expire-time {
        text-align: center;
        font-size: 14px;
        line-height: 42px;
        color: #444444;
    }

    .member-cont {
        width: 100%;
        background-color: #fff;
        border-radius: 10px;
        padding: 21px;
        box-sizing: border-box;
        .member-rules {
            line-height: 32px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #444444;
            .left {
                img {
                    width: 26px;
                    height: 14px;
                    vertical-align: text-top;
                }
            }
        }
    }

    .member-interest {
        margin-top: 17px;
        h3 {
            line-height: 34px;
            color: #444444;
            font-size: 14px;
        }
        .text {
            padding: 25px;
            background-color: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
            line-height: 16px;
            li {
                margin-bottom: 16px;
            }
            h4 {
                color: #5c5c5c;
                font-weight: bold;
                margin-bottom: 2px;
            }
            p {
                color: #555555;
            }
        }
    }

    .pay-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        opacity: 0.2;
    }

    .slideWrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 502;
        width: 100%;
        padding: 26px 20px 15px;
        background: #FFFFFF;
        text-align: center;
        box-sizing: border-box;
        .course-title {
            font-size: 17px;
            line-height: 1em;
            color: #333333;
            font-weight: 700;
        }
        .course-price {
            font-size: 20px;
            line-height: 1em;
            margin: 27px 0;
            color: #F48618;
            font-weight: 700;
        }
        .btn {
            display: block;
            width: 100% !important;
            height: 45px;
            line-height: 45px;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            color: #FFFFFF;
            &.btn-sure {
                background: #F48618 !important;
            }
            &.btn-wx {
                margin-top: 15px;
                background: #00CC66 !important;
            }
            &.btn-budget {
                background: #F48618 !important;
                margin: 15px 0;
            }
            &.btn-cancle {
                color: #B4B4B4;
                background: #DDDDDD !important;
                margin: 15px 0 0;
            }
        }
    }

    .slide-enter-to, .slide-leave-to {
        transform: translate3d(0, 0, 0);
        transition: all .5s;
    }

    .slide-enter, .slide-leave-to {
        transform: translate3d(0, 100%, 0);
    }

    .fade-enter-to, .fade-leave-to {
        opacity: .2;
        transition: all .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
