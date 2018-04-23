<template>
  <button @click = "sendCode" :disabled = "disabled || time > 0">{{ text }}</button>
</template>

<script>
  export default {
    props: {
      phoneNumber: {
        type: Object
      }
    },
    data() {
      return {
        time: 0,
        second: 60,
        disabled: false
      }
    },
    computed: {
      text: function () {
        return this.time > 0 ? '重新获取' + this.time + 's' : '点击获取';
      }
    },
    methods: {
      sendCode(){
        if (!this.phoneNumber.phone ||!(/^1[34578]\d{9}$/.test(this.phoneNumber.phone))) {
          window.alert('请输入正确的手机号码');
        } else {
          this.start(); //启动倒计时
          this.$http.post(this.GLOBAL.BASEURL + '/common/send_code', { 'phone': this.phoneNumber.phone }).then((response) => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              window.alert('验证码已发，请注意查收');
            } else {
              window.alert(response.msg);
            }
          }, () => {
            window.alert('网络问题，请稍后重试');
          })
        }
      },
      start(){
        this.time = this.second;
        this.disabled = true;
        this.timer();
      },
      stop(){
        this.time = 0;
        this.disabled = false;
      },
      timer() {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        } else {
          this.stop();
        }
      }
    }
  }
</script>

<style scoped>
  button{
    color: #FFFFFF;
    background: #d3ba32;
    font-size:14px;
  }
</style>
