<template>
    <div class="login" ref="loginHook">
        <div class="loginArea" ref="loginAreaHook">
            <div class="login-phone">
                <span>手机号</span><input type="tel" v-model="loginData.phone" placeholder="请输入您的手机号">
            </div>
            <div class="login-code">
                <span>验证码</span>
                <div>
                    <input type="tel" v-model="loginData.code" placeholder="请输入验证码">
                    <timer-btn :phoneNumber="loginData"></timer-btn>
                </div>
            </div>
            <button class="login-sure" @click="login">确 定</button>
        </div>
    </div>
</template>

<script>
    import timerBtn from '@/components/Sendcode/sendcode';
    export default {
        name: 'login',
        data() {
            return {
                loginData: {}
            }
        },
        mounted(){
            this.$refs.loginHook.style.height = document.documentElement.clientHeight+"px";
            this.$refs.loginAreaHook.style.height = (document.documentElement.clientHeight/4)+"px";
        },
        methods: {
            login(){
                if (!this.loginData.phone || !(/^1[34578]\d{9}$/.test(this.loginData.phone))) {
                    window.alert('请输入正确的手机号码');
                    return;
                }
                if (!this.loginData.code) {
                    window.alert('请输入验证码');
                    return;
                }
                this.$http.post(this.GLOBAL.BASEURL + '/user/code_login', this.loginData).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.$router.go(-1);
                    } else {
                        window.alert(response.msg);
                    }
                }, () => {
                    window.alert('网络问题，请稍后重试');
                })
            }
        },
        components: {
            'timer-btn': timerBtn
        }
    };
</script>

<style lang="less" scoped>
    .weui-tab__panel {
        padding-bottom: 0 !important;
    }

    .login {
        width: 100vw;
        background: url("login.png") no-repeat top left;
        background-size: 100% 100%;
        position: relative;
        .loginArea {
            width: 80%;
            position: absolute;
            left: 10%;
            bottom: 19.06%;
            color: #d3ba32;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: flex-start;
            & > div {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                &.login-phone {
                    span {
                        margin-right: 15px;
                    }
                    input {
                        width: 75%;
                    }
                }
                &.login-code {
                    margin: 14px 0;
                    span {
                        margin-right: 15px;
                    }
                    div {
                        width: 75%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        input {
                            width: 55%;
                        }
                        button {
                            width: 40%;
                            height: 39px;
                        }
                    }
                }
            }
            .login-sure {
                display: block;
                width: 208px;
                height: 40px;
                margin: 0 auto;
                line-height: 28%;
                border-radius: 5px;
                color: #FFFFFF;
                background: #d3ba32;
                font-size: 16px;
            }
            input {
                height: 39px;
                border: 2px solid #d3ba32;
                background-color: rgba(0, 0, 0, 0);
                box-sizing: border-box;
                padding-left: 10px;
                color: #d3ba32;
            }
        }
    }
</style>
