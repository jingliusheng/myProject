<template>
    <div class="feedback" ref="feedBack">
        <group class="feedback-wrapper">
            <x-textarea placeholder="请填写期望课程名称,开课地区等反馈给电气云课堂的老师们。" v-model="feedData.content" :max="300"></x-textarea>
            <x-input name="mobile" placeholder="请输入联系号码"
                     is-type="china-mobile" v-model="feedData.phone"></x-input>
        </group>
        <x-button type="primary" @click.native="submitFeedback" style="margin-top: 28px;width: 90%;background: #3D8AFE">提交</x-button>
        <div class="feedback-footer" v-show="!isFocus">
            <img src="./phone.png" width="19" height="19">
            <a href="tel:18989458256">客服热线：18989458256</a>
        </div>
    </div>
</template>

<script>
    import {XTextarea, Group, XInput, XButton} from 'vux'
    export default {
        name: 'feedback',
        data(){
            return {
                feedData: {}
            }
        },
        components: {
            XTextarea,
            Group,
            XInput,
            XButton
        },
        mounted(){
            this.$refs.feedBack.style.height = document.documentElement.clientHeight + "px";
        },
        methods: {
            submitFeedback(){
                if (!this.feedData.content || this.feedData.content.match(/^[ ]*$/)) {
                    window.alert('请输入反馈内容');
                } else if (!this.feedData.phone) {
                    window.alert('请输入手机号码');
                } else if (!(/^1[34578]\d{9}$/.test(this.feedData.phone))) {
                    window.alert('手机号码错误，请重新输入');
                } else {
                    this.$http.post(this.GLOBAL.BASEURL + '/class/feedBack', this.feedData).then(response => {
                        response = response.body;
                        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                            this.$router.push({path: '/offline'});
                        } else {
                            window.alert(response.msg);
                        }
                    }, response => {
                        window.alert('网络问题，请稍后重试');
                    })
                }
            }
        }
    };
</script>

<style lang="less">
    .feedback {
        position: relative;
    }
    .weui-textarea-counter{
        font-size: 14px;
    }
    .feedback-wrapper {
        padding: 12px 14px 15px;
        background: #FFFFFF;
        box-sizing: border-box;
        .weui-cells {
            margin-top: 0;
            padding: 0;
            .weui-cell {
                padding: 0 !important;
                &:before {
                    border: none;
                }
                textarea, input {
                    font-size: 14px;
                    box-sizing: border-box;
                    border: 1px solid #EEEEEE;
                    border-radius: 5px;
                }
                textarea {
                    height: 147px;
                    padding: 15px 13px;
                    margin-bottom: 12px;
                }
                input {
                    height: 45px;
                    padding-left: 13px;
                }
            }

            input {
                font-size: 14px;
            }
        }
    }

    .feedback-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 64px;
        text-align: center;
        line-height: 64px;
        background: #FFFFFF;
        img {
            vertical-align: sub;
        }
    }
</style>
