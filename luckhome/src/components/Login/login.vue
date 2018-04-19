<template>
<div class="login">
  <p class="title">登录</p>
  <group>
    <x-input name="userphone" placeholder="输入手机号"  keyboard="number" is-type="china-mobile"  v-model="sendData.phone" ref="mobile" class="mobile">
      <img slot="label" src="./phoneIcon.png" width="18" class="loginIcon">
    </x-input>
    <x-input name="password" placeholder="输入密码" type="password"  keyboard="number" :min="6" :max="20"  v-model="sendData.password" class="mobile">
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
  </group>
  <div class="otherlogin">
    <span @click="codeLogin">验证码登录</span>    
    <span @click="modifypwd">重置密码</span>
    <span @click="modifypwd">忘记密码？</span>
  </div>
  <x-button type="warn" class="loginBtn" :disabled = "all" @click.native="login">登录</x-button>    
  <!-- <divider>第三方登录</divider>
  <div class="loginOther">
    <span><img src="./qq.png" height="24px"></span>
    <span><img src="./sina.png" height="24px"></span>
  </div> -->
</div>
</template>

<script>
import { XInput, Group,XButton,Divider  } from "vux";
import timerBtn from "@/components/Sendcode/sendcode";
export default {
  data() {
    return {
      sendData:{}
    };
  },
  components: {
    XInput,
    Group,
    XButton,
    Divider,
    "timer-btn": timerBtn
  },
  computed:{
    all(){
      if (!this.sendData.phone || !(/^1[34578]\d{9}$/.test(this.sendData.phone)) || !this.sendData.password) {
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
    codeLogin(){
      this.$router.push({path:'/codelogin'});
    },
    modifypwd(){
      this.$router.push({path:'/modifypwd'});
    },
    login(){
      this.$http.post(this.GLOBAL.BASEURL + "User/password_login",this.sendData).then(res=>{
        var response = res.body;
        if(response.status == this.GLOBAL.STATUSOBJ.ok){
          sessionStorage.setItem('user',JSON.stringify(response.content));
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
.title{
  font-size: 20px;
  color:#333333;
  margin: 27px auto;
  text-align: center;
}
.loginIcon{
  vertical-align: middle;
  margin-right: 7px;
}
.otherlogin{
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  color:rgb(0, 0, 238);
}
.loginBtn{
  width: 325px;
  height: 40px;
  margin-top: 15px;
  border-radius: 26px;
  font-size: 18px;
  line-height: 40px;
}
.loginBtn[disabled='disabled']{
  background-color: #ececec;
  color: #555555;
  font-size: 18px;
}
.loginBtn[disabled='disabled']:after{
  display: none;
}
.vux-divider{
  width: 80%;
  margin: 54px auto 36px;
}
.loginOther{
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
