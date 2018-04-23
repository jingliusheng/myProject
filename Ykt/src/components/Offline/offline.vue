<template>
    <div class="offline">
        <swiper :auto="true" loop :interval="3000" height="150px" dots-class="dot-wrapper"
                :show-dots="bannerList.length>1">
            <swiper-item v-for="(item, index) in bannerList" :key="index">
                <a :href="item.targeturl">
                    <img :src="item.pic" width="100%" height="150">
                </a>
            </swiper-item>
        </swiper>
        <scroller ref="offlineList" lock-x :scrollbarY=false height="-198" @on-pulldown-loading="refresh"
                  @on-pullup-loading="loadMore"
                  :use-pulldown=true :use-pullup=true
                  :pullup-config="upconfig"
                  :pulldown-config="downconfig">
            <div class="list">
                <flexbox orient="vertical" :gutter="0">
                    <flexbox-item class="vux-1px-b" v-for="item in courseList" :key="item.id">
                        <router-link :to="'/offlinedetail/'+item.id" class="list-item">
                            <div class="img-wrapper">
                                <img :src="item.thumbnail">
                                <span class="countdown" v-show="item.isdeadline==='0'">{{item.countdown}}后报名截止</span>
                                <span class="countdown" v-show="item.isdeadline==='1'"
                                      style="text-align: center">报名已截止</span>
                            </div>
                            <div class="info-wrapper">
                                <p class="date">开课时间：{{item.startdatenote}}</p>
                                <p class="location">开课地点：{{item.place}}</p>
                                <div class="course">
                                    <span class="name">{{item.name}}</span>
                                    <span class="money">¥{{item.price}}</span>
                                </div>
                            </div>
                            <div class="status">
                                <img class="finish" src="./finish.png" v-if="item.isdeadline=='1'">
                                <img class="hot" src="./hot.png" v-else-if="item.isdeadline=='0' && item.istop==='1'">
                                <img class="ongoing" src="./ongoing.png" v-else>
                            </div>
                        </router-link>
                    </flexbox-item>
                </flexbox>
            </div>
        </scroller>
        <div class="feedback" @click="feedback">
            <img src="./feedback.png" width="20" height="20">
            <span>反馈</span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Swiper, SwiperItem, Scroller, Flexbox, FlexboxItem} from 'vux';
    export default{
        name: 'offline',
        data () {
            return {
                num: 1,
                bannerList: [],
                courseList: [],
                upconfig: {
                    content: '上拉加载',
                    pullUpHeight: 40,
                    height: 40,
                    autoRefresh: false,
                    downContent: '释放加载数据',
                    upContent: '上拉加载',
                    loadingContent: '加载中...',
                    clsPrefix: 'xs-plugin-pullup-'
                },
                downconfig: {
                    downContent: '下拉刷新',
                    upContent: '释放后更新',
                    loadingContent: '刷新中...',
                    clsPrefix: 'xs-plugin-pulldown-'
                }
            }
        },
        created(){
            this.$http.get(this.GLOBAL.BASEURL + '/class/banner').then((response) => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.bannerList = response.content;
                }
            }, () => {
                window.alert('网络问题，请稍后重试');
            });
            this.$http.get(this.GLOBAL.BASEURL + '/class/index').then((response) => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.courseList = response.content;
                    this.$nextTick(() => {
                        this.$refs.offlineList.reset();
                        if (this.courseList.length >= 10) {
                            this.$refs.offlineList.enablePullup();
                        } else {
                            this.$refs.offlineList.disablePullup();
                        }
                        document.querySelectorAll('.info-wrapper').forEach((item) => {
                            item.style.width = document.documentElement.clientWidth - 202 + "px";
                        })
                    });
                }
            }, () => {
                window.alert('网络问题，请稍后重试');
            });
        },
        methods: {
            loadMore() {
                this.num++;
                this.$http.get(this.GLOBAL.BASEURL + '/class/index', {params: {page: this.num}}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.courseList = this.courseList.concat(response.content);
                        this.$nextTick(() => {
                            this.$refs.offlineList.donePullup();
                            this.$refs.offlineList.reset();
                            document.querySelectorAll('.info-wrapper').forEach((item) => {
                                item.style.width = document.documentElement.clientWidth - 202 + "px";
                            });
                            this.$http.get(this.GLOBAL.BASEURL + '/class/index', {params: {page: this.num + 1}}).then((response) => {
                                response = response.body;
                                if (response.status != this.GLOBAL.STATUSOBJ.ok) {
                                    this.$nextTick(() => {
                                        this.$refs.offlineList.disablePullup();
                                    });
                                }
                            })
                        });
                    }
                }, () => {
                    window.alert('网络问题，请稍后重试');
                })
            },
            refresh() {
                this.num = 1;
                this.$http.get(this.GLOBAL.BASEURL + '/class/index', {params: {page: this.num}}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.courseList = response.content;
                        this.$nextTick(() => {
                            this.$refs.offlineList.donePulldown();
                            if (this.courseList.length >= 10) {
                                this.$refs.offlineList.enablePullup();
                            } else {
                                this.$refs.offlineList.disablePullup();
                            }
                            this.$refs.offlineList.reset();
                        })
                    }
                }, () => {
                    window.alert('网络问题，请稍后重试');
                })
            },
            feedback(){
                this.$router.push({path: '/feedback'});
            }
        },
        components: {
            Swiper,
            SwiperItem,
            Scroller,
            Flexbox,
            FlexboxItem
        }
    };
</script>

<style lang="less" scoped>
    .list {
        padding: 12px 0;
        .vux-flexbox {
            min-height: calc(~'100vh - 210px');
            background-color: #FFFFFF;
            padding: 0 14px;
            box-sizing: border-box;
            .vux-flexbox-item:last-child:after {
                border-bottom: none;
            }
            .list-item {
                position: relative;
                padding: 7px 0;
                display: flex;
            }
        }
        .img-wrapper {
            flex: 0 0 130px;
            height: 90px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
            }
            .countdown {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                line-height: 13px;
                font-size: 12px;
                padding: 1px 7px 1px 10px;
                background-color: rgba(0, 0, 0, .5);
                color: #FFFFFF;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                box-sizing: border-box;
                z-index: 2;
            }
        }
        .info-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 10px;
            color: #999999;
            font-size: 12px;
            .course {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .name {
                font-size: 14px;
            }
            .money {
                font-size: 17px;
                color: #F48618;
                margin-right: -34px;
            }
        }
        .status {
            position: absolute;
            right: 0;
            top: 14px;
            width: 32px;
            height: 39px;
            text-align: center;
            .hot {
                width: 20px;
                height: 35px;
            }
            .ongoing {
                width: 32px;
                height: 32px;
            }
            .finish {
                width: 34px;
                height: 28px;
            }
        }
    }

    .feedback {
        position: fixed;
        right: 14px;
        bottom: 55px;
        width: 43px;
        height: 43px;
        background: #3d8afe;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 502;
        span {
            color: #FFFFFF;
            font-size: 10px;
        }
    }
</style>
