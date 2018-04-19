<template>
  <button @click = "sendCode" :disabled = "disabled || time > 0">{{ text }}</button>
</template>

<script>
  export default {
    props: {
      phoneNumber: {
        type: String
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
        return this.time > 0 ? '剩余' + this.time + 's' : '点击获取验证码';
      }
    },
    methods: {
      sendCode(){
        if (!this.phoneNumber ||!(/^1[34578]\d{9}$/.test(this.phoneNumber))) {
          window.alert('请输入正确的手机号码');
        } else {
          this.start(); //启动倒计时
          this.$http.post('http://www.xingyunfu.org/Sms/send_code', { 'phone': this.phoneNumber }).then((response) => {
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
    background-color: #ffffff;
    color: #333333;
    font-size:13px;
    position: absolute;
    right: 15px;
    top: 59px;
  }
</style>
