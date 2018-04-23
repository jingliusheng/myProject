<template>
    <div class="test">
        <div class="title">
            <h3>课后测试</h3>
            <div class="current-question">当前第<span>{{test_index + 1}}</span>题/共{{dataList.length}}题</div>
        </div>
        <swiper :show-dots="false" :loop="false" class="test-cont" :height="height"
                v-model="test_index">
            <swiper-item class="swiper-item" v-for="(item,index) in dataList" :key="item.id">
                <div class="question vux-1px">{{index + 1}}、{{item.question}}</div>
                <ul class="answer">
                    <li class="answer-item" :class="{'selected-answer':answers[index].selectedanswer==='A'}"
                        @click="chooseAnswer(index,'A')">
                        <span class="radio-btn"></span>
                        <span class="text">A.{{item.answera}}</span>
                    </li>
                    <li class="answer-item" :class="{'selected-answer':answers[index].selectedanswer==='B'}"
                        @click="chooseAnswer(index,'B')">
                        <span class="radio-btn"></span>
                        <span class="text">B.{{item.answerb}}</span>
                    </li>
                    <li class="answer-item" :class="{'selected-answer':answers[index].selectedanswer==='C'}"
                        @click="chooseAnswer(index,'C')">
                        <span class="radio-btn"></span>
                        <span class="text">C.{{item.answerc}}</span>
                    </li>
                    <li class="answer-item" :class="{'selected-answer':answers[index].selectedanswer==='D'}"
                        @click="chooseAnswer(index,'D')">
                        <span class="radio-btn"></span>
                        <span class="text">D.{{item.answerd}}</span>
                    </li>
                </ul>
            </swiper-item>
        </swiper>
        <div class="test-operation vux-1px-t">
            <x-button @click.native="submit">立即交卷</x-button>
            <x-button @click.native="viewRecord">查看答题记录</x-button>
        </div>
        <transition name="fade">
            <div class="test-background" v-show="showRecord" @click="showRecord=!showRecord"></div>
        </transition>
        <transition name="slide">
            <div class="answer-records" v-show="showRecord">
                <div class="records-title">
                    <p class="left">答题记录</p>
                    <ul class="right">
                        <li class="unanswered"><span class="vux-1px"></span>未答</li>
                        <li class="answered"><span></span>已答</li>
                    </ul>
                </div>
                <ul class="records-list">
                    <li class="record-item" :class="{'answered':answers[index].selectedanswer!=''}"
                        @click="viewCurrent(index)"
                        v-for="(item,index) in answers">{{index + 1}}
                    </li>
                </ul>
            </div>
        </transition>
        <toast v-model="showWarning" type="text" width="9em" :time='1000' :is-show-mask="true" position="middle"
               text="已经是最后一题了"></toast>
        <div v-transfer-dom>
            <confirm v-model="leaveWarning" content="你有题目未答完,确定要交卷吗?"
                     @on-cancel="onCancel"
                     @on-confirm="onConfirm">
            </confirm>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {XButton, Swiper, SwiperItem, dateFormat, Toast, Confirm, TransferDomDirective as TransferDom} from 'vux';
    export default{
        data(){
            return {
                leaveWarning: false,
                showWarning: false,
                transferData: {},
                dataList: [],
                showRecord: false,
                height: '',
                test_index: 0,
                answers: []
            }
        },
        created(){
            this.transferData.strtotime = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
            this.transferData.courseid = this.$route.params.courseid;
            this.$http.get(this.GLOBAL.BASEURL + '/course/exercise_list', {params: {courseid: this.$route.params.courseid}}).then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                    this.dataList.forEach((item, index) => {
                        this.answers[index] = {};
                        this.answers[index].exerciseid = item.id;
                        this.answers[index].rightanswer = item.rightanswer;
                        this.answers[index].selectedanswer = '';
                    });
                } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
                    this.$router.push({path: '/bindphone/null'});
                } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
                    this.$router.push({path: '/login'});
                } else if (response.status === 302) {
                    let str = response.content.url;
                    let routePath = this.$route.path.substring(1).split('/').join('_');
                    let str1 = str.replace(/123/, routePath);
                    window.location.href = str1;
                }
            }, response => {
                window.alert('网络问题，请稍后重试');
            });
        },
        mounted(){
            this.height = document.documentElement.clientHeight - 104 + "px";
        },
        methods: {
            //查看答题记录
            viewRecord(){
                this.showRecord = !this.showRecord;
            },
            //跳转当前题
            viewCurrent(index){
                this.showRecord = !this.showRecord;
                this.test_index = index;
            },
            //选择答案
            chooseAnswer(index, val){
                this.answers[index].selectedanswer = val;
                if (this.test_index < this.dataList.length - 1) {
                    this.test_index = index + 1;
                } else {
                    let swiperItem = document.querySelectorAll(".swiper-item")[index];
                    let itemIndex;
                    if (val === 'A') {
                        itemIndex = 0;
                    } else if (val === 'B') {
                        itemIndex = 1;
                    } else if (val === 'C') {
                        itemIndex = 2;
                    } else if (val === 'D') {
                        itemIndex = 3;
                    }
                    for (let i = 0; i < 4; i++) {
                        swiperItem.querySelectorAll(".answer-item")[i].className = "answer-item";
                    }
                    swiperItem.querySelectorAll(".answer-item")[itemIndex].className = "answer-item selected-answer";
                    this.showWarning = true;
                }
            },
            //提交试卷出弹窗事件
            submit(){
                let hasAnswerAll = true;
                this.answers.forEach((item) => {
                    if (item.selectedanswer == '') {
                        hasAnswerAll = false;
                    }
                });
                if (!hasAnswerAll) {
                    this.leaveWarning = true;
                } else {
                    this.transferData.endtime = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
                    this.transferData.answers = this.answers;
                    this.$http.post(this.GLOBAL.BASEURL + '/course/submit_answer', this.transferData).then(response => {
                        response = response.body;
                        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                            this.$router.push({path: '/testResult/' + response.content.answerresultid});
                        }
                    })
                }
            },
            //未答完题点弹窗取消事件
            onCancel(){
                this.leaveWarning = false;
            },
            //确认提交事件
            onConfirm(){
                this.transferData.endtime = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
                this.transferData.answers = this.answers;
                this.$http.post(this.GLOBAL.BASEURL + '/course/submit_answer', this.transferData).then(response => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.$router.push({path: '/testResult/' + response.content.answerresultid});
                    }
                })
            }
        },
        components: {
            XButton,
            Swiper,
            SwiperItem,
            Toast,
            Confirm
        }
    }
</script>

<style lang="less" scoped>
    .title {
        height: 35px;
        line-height: 35px;
        padding: 0 14px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        h3 {
            color: #666666;
        }
        .current-question {
            color: #999999;
            span {
                color: #3d8afe;
                font-weight: bold;
            }
        }
    }

    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        background-color: #ffffff;
    }

    .test-cont {
        background-color: #fff;
        height: calc(~'100vh - 35px');
        .swiper-item {
            padding: 19px 33px;
            box-sizing: border-box;
            overflow-y: scroll;
            .question {
                padding: 25px 19px;
                margin-bottom: 13px;
                color: #333333;
                font-size: 15px;
                line-height: 24px;
            }
            .answer {
                .answer-item {
                    padding: 12px 10px;
                    line-height: 22px;
                    color: #999999;
                    margin-bottom: 7px;
                    font-size: 14px;
                }
                .selected-answer {
                    background-color: #f5f5f5;
                    .radio-btn {
                        position: relative;
                        border-color: #3d8afe;
                        &:before {
                            content: '';
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background-color: #3d8afe;
                            position: absolute;
                            top: 3px;
                            left: 3px;
                        }
                    }
                }
                .radio-btn {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    margin-right: 6px;
                    border-radius: 50%;
                    background: #fcfcfc;
                    border: 1px solid #f2f2f2;
                    vertical-align: middle;
                    box-sizing: border-box;
                }
            }
        }
    }

    .test-operation {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 12px 18px;
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-content: flex-start;
        button {
            width: 155px;
            height: 45px;
            margin-top: 0;
            background-color: #3d8afe;
            color: #fff;
        }
    }

    .answer-records {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 18px 14px 47px;
        background-color: #fff;
        box-sizing: border-box;
        .records-title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 21px;
            .left {
                font-size: 15px;
                line-height: 25px;
                color: #333333;
            }
            .right {
                display: flex;
            }
            .answered {
                display: flex;
                color: #3d8afe;
                margin-left: 28px;
                span {
                    display: block;
                    width: 27px;
                    height: 25px;
                    background-color: #3d8afe;
                    margin-right: 7px;
                }
            }
            .unanswered {
                display: flex;
                color: #999999;
                span {
                    display: block;
                    width: 25px;
                    height: 25px;
                    margin-right: 7px;
                }
            }
        }
        .records-list {
            overflow: hidden;
            margin-right: -20px;
            .record-item {
                float: left;
                width: 37px;
                height: 34px;
                text-align: center;
                line-height: 34px;
                box-sizing: border-box;
                margin: 0 15px 15px 0;
                color: #999999;
                border: 1px solid #ccc;
                &.answered {
                    background-color: #3d8afe;
                    border: 1px solid #3d8afe;
                    color: #fff;
                }
            }
        }
    }

    .test-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        opacity: 0.2;
    }

    .slide-enter-to, .slide-leave-to {
        transform: translate3d(0, 0, 0);
        transition: all .5s;
    }

    .slide-enter, .slide-leave-to {
        transform: translate3d(0, 100%, 0);
    }

    .fade-enter-to, .fade-leave-to {
        opacity: .2;
        transition: all .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
