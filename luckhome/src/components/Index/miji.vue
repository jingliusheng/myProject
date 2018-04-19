<template>
  <div class="miji" v-html="contentStr"></div>
</template>

<script>
  export default {
    data(){
      return {
        contentStr:''
      }
    },
    created(){
      document.getElementsByTagName('title')[0].innerText="幸运之家--幸运秘籍";
      this.$http
    .get(this.GLOBAL.BASEURL + "Luck/cheats")
    .then(res => {
      var response = res.body;
      if(response.status == this.GLOBAL.STATUSOBJ.ok){
        this.contentStr = response.content.content;
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
  };
</script>

<style>
</style>
