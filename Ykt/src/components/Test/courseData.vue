<template>
    <div class="courseData">
        <div class="content">
            <div class="file">
                <img class="type" src="./test-icon1.png" alt="">
                <span class="name"> {{msg.materialname}}</span>
            </div>
            <span class="size">{{msg.materialsize}}</span>
            <span class="copy-btn" @click="copy">复制</span>
        </div>
        <p class="note">注：点击复制，将下载链接复制并发送至电脑端即可下载</p>
        <toast v-model="showSuccess" type="text" :time="800" is-show-mask text="复制成功" position="middle"></toast>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Toast} from 'vux';
    import clipboard from '@/common/utils/clipboard.min.js';
    import Bus from '@/common/utils/eventBus.js';
    export default{
        name: 'courseData',
        data(){
            return {
                showSuccess: false,
                msg: {}
            }
        },
        created(){
            Bus.$on('getTarget', target => {
                this.msg = target;
            });
        },
        mounted(){
            if(!this.msg.materiallink){
                this.$router.go(-1);
            }
        },
        methods: {
            copy(){
                let _this=this;
                let link=_this.msg.materiallink;
                let clipboard=new Clipboard('.copy-btn', {
                    text: function() {
                        return link;
                    }
                });
                clipboard.on('success', function() {
                    _this.showSuccess=true;
                });
            }
        },
        components: {
            Toast
        }
    }
</script>

<style lang="less" scoped>
    .content {
        background-color: #fff;
        height: 64px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 14px;
        box-sizing: border-box;
        .file {
            display: flex;
        }
        .name {
            flex: 0 0 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width:150px;
            line-height: 43px;
            margin-left: 10px;
            color: #333333;
            font-size: 15px;
        }
        .type {
            width: 34px;
            height: 43px;
        }
        .size {
            color: #999999;
        }
        .copy-btn{
            flex: 0 0 40px;
            width:40px;
            line-height: 22px;
            text-align: center;
            background-color: #3d8afe;
            color: #fff;
            border-radius: 2px;
            font-size: 12px;
        }
    }
    .note{
        color: #f48618;
        font-size: 13px;
        line-height:36px;
        padding-left: 20px;
    }

</style>
