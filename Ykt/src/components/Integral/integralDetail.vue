<template>
    <div class="integralDetail">
        <ul class="record-list" v-show="dataList.length">
            <li class="vux-1px-b record-item" v-for="item in dataList">
                <div class="left">
                    <p class="title">{{item.title}}</p>
                    <p class="time">{{item.createtime}}</p>
                </div>
                <div class="right">
                    <span class="count">{{item.score}}</span>
                    <span>积分</span>
                </div>
            </li>
        </ul>
        <img src="./black.png" alt="" class="black-page" v-show="!dataList.length">
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
            return {
                dataList: []
            }
        },
        mounted(){
            this.$http.get(this.GLOBAL.BASEURL + '/score/score_record').then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        },
    };
</script>

<style lang="less" scoped>
    .integralDetail {
        .black-page{
            width:100vw;
            height:100vh;
            vertical-align: middle;
        }
        .record-item {
            display: flex;
            justify-content: space-between;
            height: 55px;
            padding: 0 14px;
            background-color: #fff;
            &:last-child:after{
                border-bottom: none;
            }
            .left{
                display: flex;
                flex-direction: column;
                justify-content: center;
                .title{
                    font-size: 15px;
                    color: #404040;
                }
                .time{
                    font-size: 13px;
                    color: #b3b3b3;
                }
            }
            .right {
                line-height: 55px;
                color: #f48618;
                font-size: 0;
                span{
                    display: inline-block;
                    font-size: 13px;
                }
                .count{
                    font-size: 17px;
                    font-weight: bold;
                }
            }
        }
    }
</style>
