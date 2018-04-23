<template>
    <div class="testResult">
        <div class="wrapper">
            <h3>课程名称：{{dataList.coursename}}</h3>
            <p class="test-time vux-1px-b">测试时间：{{dataList.starttime}}</p>
            <div class="test-info">
                <div class="user-img">
                    <img :src="dataList.avatar" alt="">
                </div>
                <p class="user-name">{{dataList.uname}}</p>
                <p class="test-count">共{{dataList.totalnumber}}题</p>
                <div class="answer-right">
                    <div class="right-count">答对：<span>{{rightList.length}}题</span></div>
                    <ul class="right-list">
                        <li v-for="item in rightList">{{item}}</li>
                    </ul>
                </div>
                <div class="answer-error">
                    <div class="error-count">答错：<span>{{errorList.length}}题</span></div>
                    <ul class="error-list">
                        <li v-for="item in errorList">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="return-back">
            <x-button link="/" type="primary">返回首页</x-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XButton} from 'vux';
    export default{
        data(){
            return {
                dataList: {},
                rightList: [],
                errorList: []
            }
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/course/answer_result', {params: {answerresultid: this.$route.params.id}}).then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                    this.dataList.content.forEach((item, index) => {
                        if(item.rightanswer===item.selectedanswer){
                            this.rightList.push(index+1);
                        }else{
                            this.errorList.push(index+1);
                        }
                    });
                }
            }, response => {
                window.alert('网络问题，请稍后重试');
            });
        },
        components: {
            XButton
        }
    }
</script>

<style lang="less" scoped>
    .testResult {
        padding: 25px 35px;
        .wrapper {
            width: 100%;
            padding: 116px 30px 12px;
            margin-bottom: 60px;
            background: #fff url("testResult01.png") no-repeat top center;
            background-size: 265px 103px;
            border-radius: 20px;
            box-sizing: border-box;
            h3 {
                text-align: center;
                font-size: 14px;
                color: #333333;
            }
            .test-time {
                color: #999999;
                text-align: center;
                font-size: 13px;
                line-height: 42px;
                padding-bottom: 3px;
            }
            .user-img {
                text-align: center;
                margin: 11px 0;
                img {
                    width: 49px;
                    height: 49px;
                    border-radius: 50%;
                }
            }
            .user-name {
                font-size: 13px;
                color: #333333;
                text-align: center;
            }
            .test-count {
                line-height: 43px;
                color: #3d8afe;
                text-align: center;
                font-size: 15px;
            }
            .answer-right {
                margin-bottom: 6px;
                .right-count {
                    font-size: 14px;
                    line-height: 41px;
                    span {
                        color: #3d8afe;
                    }
                }
                .right-list {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        width: 37px;
                        height: 34px;
                        text-align: center;
                        line-height: 34px;
                        background-color: #3d8afe;
                        color: #fff;
                        margin: 0 12px 7px 0;
                    }
                }
            }
            .answer-error {
                .error-count {
                    font-size: 14px;
                    line-height: 41px;
                    span {
                        color: #999999;
                    }
                }
                .error-list {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        width: 37px;
                        height: 34px;
                        text-align: center;
                        line-height: 34px;
                        background-color: #eeeeee;
                        color: #999999;
                        margin: 0 12px 7px 0;
                    }
                }
            }
        }
        .return-back{
            position: fixed;
            bottom: 0;
            left:0;
            width:100%;
            padding: 12px 21px;
            background-color: #fff;
            box-sizing: border-box;
            button{
                background-color: #3d8afe;
            }
        }
    }
</style>
