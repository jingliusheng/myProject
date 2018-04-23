<template>
    <div class="ratings">
        <scroller lock-x height="-40px" ref="scroller">
            <div class="list">
                <h4 v-show="hotRatings.length">热评</h4>
                <flexbox orient="vertical" :gutter="0" v-show="hotRatings.length">
                    <flexbox-item class="ratingWrapper vux-1px-b" v-for="(item,index) in hotRatings" :key="item.id"
                                  v-show="index<3 || n">
                        <div class="commenter-avatar">
                            <img
                                    :src="item.avatar"
                                    width="32" height="32">
                        </div>
                        <div class="commenter-comment">
                            <p class="commenter-name">{{item.uname}}</p>
                            <p class="commenter-time">{{item.createtime}}</p>
                            <p class="commenter-content">{{item.content}}</p>
                        </div>
                        <div class="staus" @click="thumbup(item)" v-show="item.ispraised=='0'">
                            <img src="./tabIcon08.png" width="12" height="12">
                            {{item.praisenumber}}
                        </div>
                        <div class="staus thumbup" v-show="item.ispraised=='1'">
                            <transition name="scale">
                                <img v-show="item.ispraised" src="./tabIcon10.png" width="12" height="12">
                            </transition>
                            {{item.praisenumber}}
                        </div>
                    </flexbox-item>
                    <p v-show="!n" class="viewAllHot" @click="allHot">全部热评>></p>
                </flexbox>

                <h4>最新</h4>
                <flexbox orient="vertical" :gutter="0">
                    <flexbox-item class="ratingWrapper vux-1px-b" v-for="(item,index) in allRatings" :key="item.id">
                        <div class="commenter-avatar">
                            <img :src="item.avatar" width="32" height="32">
                        </div>
                        <div class="commenter-comment">
                            <p class="commenter-name">{{item.uname}}</p>
                            <p class="commenter-time">{{item.createtime}}</p>
                            <p class="commenter-content">{{item.content}}</p>
                        </div>
                        <div class="staus" @click="thumbup(item)" v-show="item.ispraised=='0'">
                            <img src="./tabIcon08.png" width="12" height="12">
                            {{item.praisenumber}}
                        </div>
                        <div class="staus thumbup" v-show="item.ispraised=='1'">
                            <transition name="scale">
                                <img v-show="item.ispraised" src="./tabIcon10.png" width="12" height="12">
                            </transition>
                            {{item.praisenumber}}
                        </div>
                    </flexbox-item>
                </flexbox>
            </div>
        </scroller>
        <div class="send-rating">
            <input type="text" v-model="content" ref="ratingInput">
            <span @click="sendRating">发送</span>
        </div>
        <toast v-model="showCommentSuccess" type="text" :time="800" is-show-mask text="评论成功" position="middle"></toast>
    </div>
</template>

<script>
    import {Scroller, Flexbox, FlexboxItem, Toast} from 'vux';
    export default {
        name: 'ratings',
        data(){
            return {
                n: false,
                content: '',
                hotRatings: [],
                allRatings: [],
                showCommentSuccess: false
            }
        },
        created(){
            this.$http.post(this.GLOBAL.BASEURL + '/course/comment_list', {'courseid': this.$route.params.courseid}).then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.hotRatings = response.content.hot;
                    this.allRatings = response.content.all;
                    this.$nextTick(() => {
                        this.$refs.scroller.reset();
                    })
                } else {
                    window.alert(response.msg);
                }
            }, response => {
                window.alert('网络问题，请稍后重试');
            })
        },
        methods: {
            allHot(){
                this.n = true;
                this.$nextTick(() => {
                    this.$refs.scroller.reset();
                })
            },
            sendRating(){
                if (this.content && !this.content.match(/^[ ]*$/)) {
                    this.$http.post(this.GLOBAL.BASEURL + '/course/comment', {
                        'courseid': this.$route.params.courseid,
                        'content': this.content
                    }).then((response) => {
                        response = response.body;
                        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                            this.showCommentSuccess = true;
                            this.content = '';
                            this.allRatings.unshift(response.content);
                            this.$nextTick(() => {
                                this.$refs.scroller.reset();
                            });
                        } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
                            this.$router.push({path: '/bindphone/null'});
                        } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
                            this.$router.push({path: '/login'});
                        } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
                            window.alert(response.msg);
                        } else if (response.status === 302) {
                            let str = response.content.url;
                            let routePath = this.$route.path.substring(1).split('/').join('_');
                            let str1 = str.replace(/123/, routePath);
                            window.location.href = str1;
                        }
                    }, () => {
                        window.alert('网络原因，请稍后重试');
                    })
                }
            },
            thumbup(obj){
                this.$http.post(this.GLOBAL.BASEURL + '/course/praise_comment', {'commentid': obj.id}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        obj.ispraised = 1;
                        obj.praisenumber++;
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
                        this.$router.push({path: '/bindphone/null'});
                    } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
                        this.$router.push({path: '/login'});
                    } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
                        window.alert(response.msg);
                    } else if (response.status === 302) {
                        let str = response.content.url;
                        let routePath = this.$route.path.substring(1).split('/').join('_');
                        let str1 = str.replace(/123/, routePath);
                        window.location.href = str1;
                    }
                }, () => {
                    window.alert('网络原因，请稍后重试');
                })
            }
        },
        components: {
            Scroller,
            Flexbox,
            FlexboxItem,
            Toast
        }
    };
</script>

<style lang="less" scoped>
    h4 {
        padding: 0 14px;
        color: #AAAAAA;
        font-size: 14px;
        line-height: 30px;
        box-sizing: border-box;
    }

    .ratingWrapper {
        padding: 10px 14px 15px;
        background: #FFFFFF;
        box-sizing: border-box;
        display: flex;
        position: relative;
        .commenter-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 12px;
            img {
                border-radius: 50%
            }
        }
        .commenter-comment {
            .commenter-name {
                font-size: 12px;
                color: #454545;
                line-height: 22px;
            }
            .commenter-time {
                font-size: 10px;
                color: #999999;
                line-height: 15px;
            }
            .commenter-content {
                font-size: 13px;
                color: #333333;
                line-height: 18px;
            }
        }
        .staus {
            position: absolute;
            right: 10px;
            top: 5px;
            padding: 5px;
            color: #999999;
            &.thumbup {
                color: #3D8AFE;
            }
        }
    }

    .viewAllHot {
        width: 100%;
        text-align: center;
        color: #3d8afe;
        font-size: 13px;
        line-height: 35px;
        background: #FFFFFF;
    }

    .scale-enter-to {
        transform: scale(1);
        transition: all 1s;
    }

    .scale-enter {
        transform: scale(1.5);
    }

    .send-rating {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        background-color: #ddd;
        display: flex;
        padding: 5px 8px;
        box-sizing: border-box;
        z-index: 1000;
        input {
            flex: 1;
            margin-right: 5px;
            border-radius: 4px;
            padding-left: 8px;
            box-sizing: border-box;
        }
        span {
            width: 42px;
            padding: 6px 8px;
            font-size: 12px;
            background-color: #3D8AFE;
            color: #fff;
            border-radius: 4px;
            flex: 0 0 42px;
            box-sizing: border-box;
        }
    }

</style>
