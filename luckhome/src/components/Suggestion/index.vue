<template>
  <div class="suggestion">
    <group>
      <x-textarea :height="150" :max="500" name="detail" placeholder="请在此输入体验建议内容，字数500以内" 
      :show-counter="false" style="color:#666" v-model="content"></x-textarea>
    </group>
    <group>
      <x-input title="姓名" name="username" placeholder="请输入姓名" is-type="china-name" v-model="name"></x-input>
    </group>

    <group>
      <x-input title="手机号码" name="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile" v-model="phone" ref="mobile"></x-input>
    </group>

    <flexbox>
      <flexbox-item>
        <x-button class="btn" @click.native="submit">提交</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button class="btn" @click.native="cancle">取消</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { XTextarea, Group, XInput, XButton, Flexbox, FlexboxItem } from "vux";
export default {
  data() {
    return {
      content: "",
      name: "",
      phone: ""
    };
  },
  components: {
    XTextarea,
    Group,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "幸运之家--体验建议";
  },
  methods: {
    submit() {
      let sendData = {
          content: this.content ? this.content.trim() : "",
          name: this.name ? this.name.trim() : "",
          phone: this.phone ? this.phone.trim() : ""
        },
        hasError = this.$refs.mobile.hasErrors;
      if (!sendData.content) {
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "建议内容不能为空"
        });
      } else if (!sendData.name) {
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "姓名不能为空"
        });
      } else if (!sendData.phone) {
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "手机号码不能为空"
        });
      } else if (hasError) {
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "手机号码格式不正确"
        });
      } else {
        this.$http
          .post(this.GLOBAL.BASEURL + "Luck/save_feedback",  sendData)
          .then(
            res => {
              let response = res.body;
              if(response.status == this.GLOBAL.STATUSOBJ.ok){
                this.$router.push({path:'/index'})
              }else{
                this.$vux.toast.show({
                  width: "15em",
                  type: "text",
                  text: response.msg
                });
              }
            },
            res => {
              this.$vux.toast.show({
                width: "15em",
                type: "text",
                text: "网络错误，请稍后重试"
              });
            }
          );
      }
    },
    cancle() {
      this.content = "";
      this.name = "";
      this.phone = "";
      this.$router.push({
        path: "/index"
      });
    }
  }
};
</script>

<style scoped>
.btn {
  margin-top: 30px;
  width: 110px;
  height: 35px;
  font-size: 16px;
  color: #ffffff;
  background-color: #2c2f33;
  border-radius: 2px;
}
.btn:active {
  color: #ffffff !important;
  background-color: #cccccc !important;
}
</style>
