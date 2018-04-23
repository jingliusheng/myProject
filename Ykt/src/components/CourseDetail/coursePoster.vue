<template>
  <div class = "sharePicWrapper">
    <img :src = "dataList.sharepic">
  </div>
</template>

<script>
  import { base64 } from 'vux';
  export default {
    data(){
      return {
        dataList: ''
      }
    },
    beforeCreate(){
      this.$http.get(this.GLOBAL.BASEURL + '/wx/wxconfig').then(response => {
        response = response.body;
        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
          let Data = response.content;
          this.$wechat.config({
            debug: Data.debug, // 开启调试模式,开发时可以开启
            appId: Data.appId,   // 必填，公众号的唯一标识   由接口返回
            timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
            nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
            signature: Data.signature,   // 必填，签名 由接口返回
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 此处填你所用到的方法
          })
        }
      }, response => {
        window.alert('网络原因，请稍后重试');
      })
    },
    mounted(){
      this.$http.get(this.GLOBAL.BASEURL + '/course/detail', { params: { 'id': this.$route.params.id } }).then((response) => {
        response = response.body;
        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
          document.getElementsByTagName('title')[0].innerHTML = response.content.name;
          let _this = this;
          _this.dataList = response.content;
          _this.$wechat.ready(() => {
            _this.$wechat.onMenuShareAppMessage({
              title: '我正在电气云课堂学习《' + _this.dataList.name + "》", // 分享标题
              desc: _this.dataList.abstract, // 分享描述
              link: _this.GLOBAL.BASEURL + '/share/coursePoster/' + _this.$route.params.id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: _this.dataList.thumbnail, // 分享图标
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
            });
            _this.$wechat.onMenuShareTimeline({
              title: _this.dataList.name, // 分享标题
              link: _this.GLOBAL.BASEURL + '/share/coursePoster/' + _this.$route.params.id, // 分享链接，该链接域名必须与当前企业的可信域名一致
              imgUrl: _this.dataList.thumbnail, // 分享图标
            });
          });
        }
      }, () => {
        window.alert('网络问题，请稍后重试');
      });
    }
  };
</script>

<style lang = "less">
  .sharePicWrapper {
    img {
      width: 100vw;
      min-height: 100vh;
    }
  }
</style>
