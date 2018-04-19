<template>
<div class="bindphone">
  <group>
    <x-input name="userphone" placeholder="输入手机号"  keyboard="number" is-type="china-mobile"  v-model="sendData.phone" ref="mobile" class="mobile">
      <img slot="label" src="./phoneIcon.png" width="18" class="loginIcon">
    </x-input>
    <x-input placeholder="输入验证码"  class="weui-vcode"  v-model="sendData.code">
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
    <timer-btn :phoneNumber="phone"></timer-btn>
  </group>
  <x-button type="warn" class="bindBtn" :disabled = "all"  @click.native="bind">提交修改手机</x-button>    
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
    document.getElementsByTagName("title")[0].innerText = "修改手机";
  },
  methods: {
    bind(){
       this.$http.post(this.GLOBAL.BASEURL + "User/modify_phone",this.sendData).then(res=>{
        var response = res.body;
        if(response.status == this.GLOBAL.STATUSOBJ.ok){
          var user = JSON.parse(sessionStorage.getItem('user'));
          user.phone = this.sendData.phone;
          sessionStorage.setItem('user',JSON.stringify(user));
          this.$router.push({path:'/my'});
        }else{
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: response.msg
          });
        }
      },res=>{
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "网络错误，请稍后重试"
        });
      })
    }
  }
};
</script>

<style lang="less" scoped>
.bindBtn{
  width: 85%;
  margin-top: 26px;
  border-radius: 26px;
  font-size: 15px;
}
.loginIcon{
  margin-right: 7px;
  vertical-align: middle;
}
</style>
