<template>
  <div class="pay">
    <div class="userInfo">
      <p class="userInfo-name">会员：{{ userInfo.phone }}</p>
      <p class="userInfo-level">等级：Lv{{ userInfo.level }}</p>
    </div>
    <p class="split"></p>
    <group class="coin">
      <x-input type="number" title="修行符数量" placeholder="输入修行符数量" :required="true" placeholder-align="right" v-model="money"></x-input>
    </group>
    <p class="split"></p>
    <h5 class="vux-1px-b">选择支付方式</h5>
    <ul ref="itemWrapper">
      <li class="pay-item" @click="toggleColor(0)">
        <img src="./aliPay.png">
        <div>支付宝支付</div> 
        <span :class="{'active':payType[0].bool}"></span> 
      </li>
      <li class="pay-item" @click="toggleColor(1)">
        <img src="./wxPay.png">
        <div>微信支付</div> 
        <span :class="{'active':payType[1].bool}"></span>
      </li>
      <li class="pay-item" @click="toggleColor(2)">
        <img src="./cftPay.png">
        <div>财付通支付</div> 
        <span :class="{'active':payType[2].bool}"></span>
      </li>
    </ul>
    <div class="wx_qr_wrapper" v-show="wx_pub_qr" @click="hide_wx_qr">
      <img :src="wx_pub_qr" class="wx_pub_qr">
    </div>
    <flexbox>
      <flexbox-item>
        <x-button class="btn btn-sure" @click.native="paySure">确定</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button class="btn" @click.native="payCancle">取消</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import pingpp from 'pingpp-js';
import { XInput, Group, XButton, Flexbox, FlexboxItem } from 'vux';
export default {
  components: {
    XInput,
    XButton,
    Group,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      userInfo:{},
      money:'',
      wx_pub_qr:'',
      payType:[
        {bool:true,value:'alipay_wap'},
        {bool:false,value:'wx_pub_qr'},
        {bool:false,value:'cftPay'}
        ]
    };
  },
  computed:{
    channel(){
      for (let index = 0; index < this.payType.length; index++) {
        const element = this.payType[index];
        if(element.bool){
          return element.value;
        }
      }
    }
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = '幸运之家--购买修行符';
    this.userInfo = JSON.parse( sessionStorage.getItem('user') );
  },
  methods:{
    hide_wx_qr(){
      this.wx_pub_qr = '';
    },
    paySure(){
      if (typeof WeixinJSBridge != "undefined") {
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: "请在手机浏览器中打开"
          });
      } else{
        let sendData={
          channel:this.channel,
          type:'recharge',
          money:this.money
        },
        reg=/^[1-9]+[0-9]*$/;
        if(!sendData.money || sendData.money=='0'){
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: '修行符数量不能为空且大于0'
          });
          return;
        }else if(!reg.test(sendData.money)){
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: '修行符数量为正整数'
          });
          return; 
        }
        if (this.channel == "alipay_wap") {
          this.$http.post(this.GLOBAL.BASEURL+'payment/charge',sendData).then(res=>{
            let response = res.body;
            if(response.status == this.GLOBAL.STATUSOBJ.ok){     
              pingpp.createPayment(response.content);
            }else if(response.status == this.GLOBAL.STATUSOBJ.noLogin){
              this.$router.push({path:'/login'});
            }else{
              this.$vux.toast.show({
                width: "15em",
                type: "text",
                text: response.msg
              });
            }
          },res=>{})
        }else if(this.channel == 'wx_pub_qr'){
           this.$http.post(this.GLOBAL.BASEURL+'payment/charge',sendData).then(res=>{
            let response = res.body;
            if(response.status == this.GLOBAL.STATUSOBJ.ok){     
              this.wx_pub_qr = response.content.wx_pub_qr;
            }else if(response.status == this.GLOBAL.STATUSOBJ.noLogin){
              this.$router.push({path:'/login'});
            }else{
              this.$vux.toast.show({
                width: "15em",
                type: "text",
                text: response.msg
              });
            }
          },res=>{})
         
        } else if(this.channel == 'cftPay'){
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: "财付通支付"
          });
        }
      }
    },
    payCancle(){
      this.$router.push({path:'/my'});
    },
    toggleColor(index){
      this.payType.forEach((element,index1) => {
        if(index1 == index){
          element.bool = true;
        }else{
          element.bool = false
        }
      });
    }
  }

};
</script>


<style lang="less" scoped>
.userInfo {
  padding: 8px 14px 5px;
  line-height: 27px;
  color: #333333;
}
.split {
  height: 5px;
  background-color: #f5f5f5;
}
h5 {
  padding: 0 14px;
  line-height: 42px;
}
.pay-item {
  padding: 0 14px;
  margin: 13px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333333;
  img {
    width: 30px;
    height: 30px;
    margin: 0 15px 0 10px;
  }
  div{
    flex: 2
  }
  span {
    width: 18px;
    height: 18px;
    border: 2px solid #cccccc;
    border-radius: 50%;
    float: right;
    &.active {
      border-color: #ed6564;
    }
    &.active:after {
      content: "";
      width: 12px;
      height: 12px;
      background-color: #ed6564;
      border-radius: 50%;
      float: left;
      margin: 3px;
    }
  }
}
.wx_qr_wrapper{
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  .wx_pub_qr{
    width: 200px;
    height: 200;
    position: absolute;
    top: 50%;
    left:50%;
    margin-top: -100px;
    margin-left: -100px;
  }
}
.vux-flexbox {
  position: fixed;
  bottom: 16px;
  .btn {
    width: 130px;
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    color:#333333;
    border-radius: 5px;
    border-color: #e3e3e3;
    background-color: #fff;
    &.btn-sure{
      color: #ffffff;
      background-color: #ed6564;
      border-color: #ed6564;
    }
  }
}
</style>
