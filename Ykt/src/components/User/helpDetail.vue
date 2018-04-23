<template>
    <div class="detailWrapper">
        <div class="title">{{detail.title}}</div>
        <div class="content" v-html="detail.content"></div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                detail: {}
            }
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/help/detail', {params: {id: this.$route.params.id}}).then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.detail = response.content;
                } else {
                    window.alert(response.msg);
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        }
    };
</script>

<style lang="less">
    .detailWrapper {
        padding: 9px 14px 0;
        box-sizing: border-box;
        .title {
            font-size: 17px;
            font-weight: 700;
            line-height: 49px;
            color: #333333;
        }
        .content {
            color: #666666;
            font-size: 13px;
            line-height: 25px;
            img {
                width: 100%;
            }
        }
    }
</style>
