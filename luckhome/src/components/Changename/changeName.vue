<template>
<div class="bindphone">
  <group>
    <x-input placeholder="输入昵称" v-model="sendData.uname">
      <img slot="label" src="./codeIcon.png" width="18" class="loginIcon">
    </x-input>
  </group>
  <x-button type="warn" class="bindBtn" :disabled = "all"  @click.native="change">确定</x-button>    
</div>
</template>

<script>
import { XInput, Group,XButton } from "vux";
export default {
  data() {
    return {
      sendData:{
        uname:''
      }
    };
  },
  components: {
    XInput,
    Group,
    XButton
  },
  computed:{
    all(){
      if (!this.sendData.uname) {
        return true;
      }else{
        return false;
      }
    }
  },
  mounted(){
    document.getElementsByTagName("title")[0].innerText = "修改昵称";
  },
  methods: {
    change(){
       this.$http.post(this.GLOBAL.BASEURL + "User/modify_info",this.sendData).then(res=>{
        var response = res.body;
        if(response.status == this.GLOBAL.STATUSOBJ.ok){
          var user = JSON.parse(sessionStorage.getItem('user'));
          user.uname = this.sendData.uname;
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
