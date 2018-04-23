<template>
  <div class = "account">
    <div class = "money vux-1px-b">{{balance}}元</div>
    <div class = "charge">
      <div class = "title">充值（人民币）</div>
      <ul class = "charge-list">
        <li v-for = "item in chargeList" class = "charge-item vux-1px" :class = "{'current-charge':money==item}"
            @click = "money=item">{{item}}元
        </li>
      </ul>
      <div class = "pay-money">支付金额：{{money}}元</div>
      <x-button class = "submit-btn" @click.native = "wxPay">确认支付</x-button>
    </div>
  </div>
</template>

<script type = "text/ecmascript-6">
  import { XButton } from 'vux';
  export default{
    name: 'account',
    data(){
      return {
        balance: 0.00,
        money: 208,
        chargeList: [6, 68, 208, 388, 698, 998]
      };
    },
    beforeCreate(){
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
    },
    created(){
      this.$http.get(this.GLOBAL.BASEURL + '/account/balance').then(response => {
        response = response.body;
        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
          this.balance = response.content.balance;
        } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
          this.$router.push({ path: '/bindphone/null' });
        } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
          this.$router.push({ path: '/login' });
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
    methods: {
      wxPay(){
        if (typeof WeixinJSBridge == "undefined") {
          window.alert('请在微信中打开');
        } else {
          this.$http.post(this.GLOBAL.BASEURL + '/wx/pay', {
            'type': 'charge',
            'money': this.money,
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
      },
    },
    components: {
      XButton
    }
  }
</script>

<style lang = "less" scoped>
  .account {
    height: 100vh;
    background-color: #FFFFFF;
  }
  .money {
    height: 127px;
    line-height: 127px;
    color: #666666;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
  }
  .charge {
    padding: 20px 28px;
    .title {
      color: #999999;
      font-size: 13px;
    }
    .charge-list {
      display: flex;
      flex-wrap: wrap;
      margin-right: -16px;
    }
    .charge-item {
      width: 25%;
      height: 57px;
      text-align: center;
      line-height: 57px;
      margin: 10px;
      font-size: 18px;
      color: #F48618;
      &.current-charge {
        background-color: #F48618;
        color: #FFFFFF;
      }
      &:before {
        border: 1px solid #F48618;
      }
    }
    .pay-money {
      height: 64px;
      line-height: 64px;
      color: #F48618;
      font-size: 15px;
      text-align: center;
    }
    .submit-btn {
      background-color: #3D8AFE;
      color: #FFFFFF;
    }
  }
</style>
