<template>
    <div class="invite">
        <img :src="bgImg" alt="">
    </div>
</template>

<script type="text/ecmascript-6">
    import {base64} from 'vux';
    export default {
        data(){
            return {
                bgImg: base64.decode(this.$route.params.invitepic)
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
                        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 此处填你所用到的方法
                    })
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        },
        mounted(){
            let _this = this;
            _this.$wechat.ready(() => {
                _this.$wechat.onMenuShareAppMessage({
                    title: '电气云课堂，用智慧点亮未来', // 分享标题
                    desc: '每一个有梦想的电气行业人都在这里。专注电气人才培养，分享行业实战干货，洞察电气行业趋势。', // 分享描述
                    link: _this.GLOBAL.BASEURL + '/share/invite/' + _this.$route.params.invitepic, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: _this.bgImg, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
                });
              _this.$wechat.onMenuShareTimeline({
                title:'电气云课堂，用智慧点亮未来', // 分享标题
                link: _this.GLOBAL.BASEURL + '/share/invite/' +  _this.$route.params.invitepic, //  分享链接，该链接域名必须与当前企业的可信域名一致
                imgUrl:  _this.bgImg, // 分享图标
              });
            });
        }
    }
</script>

<style lang="less" scoped>
    .invite {
        img {
            width: 100vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>
