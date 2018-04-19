<template>
<div class="register">
  <group>
    <x-input name="userphone" placeholder="输入手机号"  keyboard="number" is-type="china-mobile"  v-model="sendData.phone" class="mobile">
      <img slot="label" src="./phoneIcon.png" width="18" class="loginIcon">
    </x-input>
    <x-input placeholder="输入验证码"  class="weui-vcode" v-model="sendData.code" >
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
    <x-input name="password" placeholder="输入密码（6-20位）" type="password"  keyboard="number" :min="6" :max="20"  v-model="sendData.password" class="mobile">
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
    <x-input name="repassword" placeholder="重复密码" type="password"  keyboard="number" :min="6" :max="20"  v-model="sendData.repassword" class="mobile">
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
    <timer-btn :phoneNumber="sendData.phone"></timer-btn>
  </group>
  <x-button type="warn" class="registerBtn" :disabled = "all"  @click.native="modify">确定</x-button>    
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
      if (!this.sendData.phone || !(/^1[34578]\d{9}$/.test(this.sendData.phone)) || !this.sendData.password || !this.sendData.code) {
        return true;
      }else{
        return false;
      }
    }
  },
   mounted(){
    document.getElementsByTagName("title")[0].innerText = "设置密码";
  },
  methods: {
    modify(){
      if(this.sendData.password != this.sendData.repassword){
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "密码不一致"
        });
        return;
      }
      delete this.sendData.repassword;
      this.$http.post(this.GLOBAL.BASEURL + "User/modify_password",this.sendData).then(res=>{
        var response = res.body;
        if(response.status == this.GLOBAL.STATUSOBJ.ok){
          this.$router.push({path:'/login'});
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
</style>
