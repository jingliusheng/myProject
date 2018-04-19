<template>
<div class="register">
  <group>
    <x-input name="userphone" placeholder="输入手机号"  keyboard="number" is-type="china-mobile"  v-model="sendData.phone" class="mobile">
      <img slot="label" src="./phoneIcon.png" width="18" class="loginIcon">
    </x-input>
    <x-input placeholder="输入验证码"  class="weui-vcode" v-model="sendData.code" >
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
    <timer-btn :phoneNumber="sendData.phone"></timer-btn>
  </group>
  <div class="otherlogin">
    <span @click="login">密码登录</span>    
    <span @click="modifypwd">重置密码</span>
    <span @click="modifypwd">忘记密码？</span>
  </div>
  <x-button type="warn" class="registerBtn" :disabled = "all"  @click.native="codelogin">登录</x-button>    
</div>
</template>

<script>
import { XInput, Group,XButton } from "vux";
import timerBtn from "@/components/Sendcode/sendcode";
export default {
  data() {
    return {
      sendData:{
        phone:'',
        password:'',
        code:''
      }
    };
  },
  components: {
    XInput,
    Group,
    XButton,
    "timer-btn": timerBtn
  },
  computed:{
    all(){
      if (!this.sendData.phone || !(/^1[34578]\d{9}$/.test(this.sendData.phone)) || !this.sendData.code) {
        return true;
      }else{
        return false;
      }
    }
  },
   mounted(){
    document.getElementsByTagName("title")[0].innerText = "登录";
  },
  methods: {
    login(){
      this.$router.push({path:'/login'});
    },
    modifypwd(){
      this.$router.push({path:'/modifypwd'});
    },
    codelogin(){
      this.$http.post(this.GLOBAL.BASEURL + "User/code_login",this.sendData).then(res=>{
        var response = res.body;
        if(response.status == this.GLOBAL.STATUSOBJ.ok){
          this.$router.push({path:'/index'});
        }else{
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: response.msg
          });
        }
      }, res => {
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "网络错误，请稍后重试"
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.registerBtn{
  width: 85%;
  margin-top: 15px;
  border-radius: 26px;
  font-size: 15px;
}
.loginIcon{
  margin-right: 7px;
  vertical-align: middle;
}
.otherlogin{
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  color:rgb(0, 0, 238);
}
</style>
