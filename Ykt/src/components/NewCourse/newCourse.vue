<template>
    <div class="new">
        <scroller lock-x use-pullup use-pulldown
                  @on-pullup-loading="loadMore"
                  @on-pulldown-loading="refresh"
                  :pullup-config="upconfig"
                  :pulldown-config="downconfig"
                  ref="scroller" class="scroller"
        >
            <div class="list-cont">
                <flexbox orient="vertical" :gutter="0">
                    <flexbox-item v-for="item in dataList" :key="item.id">
                        <router-link :to="'/list/coursedetail/'+item.id" class="list-item vux-1px-b">
                            <div class="img-wrapper">
                                <div class="member-discount" v-show="item.vipisfree==='1'">会员免费</div>
                                <div class="member-discount" v-show="item.vipisfree==='0'">会员<br>{{item.discount}}折</div>
                                <img :src="item.thumbnail" width="141" height="88">
                                <span class="buy-count">{{item.buyernumber}}人已购买</span>
                                <span class="type">视频</span>
                            </div>
                            <div class="intro-wrapper">
                                <p class="title">{{item.name}}</p>
                                <p class="company">{{item.teacher}}-{{item.profile}}</p>
                                <div class="detail">
                                    <span class="duration">时长：{{item.duration}}分/{{item.lessonnumber}}节课</span>
                                    <span class="money" v-if="item.price!=='0.00'">¥{{item.price}}</span>
                                    <span class="free" v-if="item.price==='0.00'">免费</span>
                                </div>
                            </div>
                        </router-link>
                    </flexbox-item>
                </flexbox>
            </div>
        </scroller>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Scroller, Flexbox, FlexboxItem} from 'vux';
    export default {
        name: 'newCourse',
        data(){
            return {
                searchParams: {
                    'sort': 'modifytime',
                    'page': 1
                },
                dataList: [],
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
            this.$http.get(this.GLOBAL.BASEURL + '/course/search_list', {params: this.searchParams}).then(response => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.dataList = response.content;
                    this.$nextTick(() => {
                        this.$refs.scroller.reset();
                        if(this.dataList.length<10){
                            this.$refs.scroller.disablePullup();
                        }
                        document.querySelectorAll('.intro-wrapper').forEach((item)=>{
                            item.style.width = document.documentElement.clientWidth-182+"px";
                        })
                    })
                } else {
                    window.alert(response.msg);
                }
            }, response => {
                window.alert('网络原因，请稍后重试');
            })
        },
        methods: {
            loadMore() {
                this.searchParams.page++;
                this.$http.get(this.GLOBAL.BASEURL + '/course/search_list', {params: this.searchParams}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.dataList = this.dataList.concat(response.content);
                        this.$nextTick(() => {
                            this.$refs.scroller.donePullup();
                            this.$refs.scroller.reset();
                            document.querySelectorAll('.intro-wrapper').forEach((item)=>{
                                item.style.width = document.documentElement.clientWidth-182+"px";
                            });
                            this.searchParams.page++;
                            this.$http.get(this.GLOBAL.BASEURL + '/course/search_list', {params: this.searchParams}).then((response) => {
                                response = response.body;
                                if (response.status != this.GLOBAL.STATUSOBJ.ok) {
                                    this.$nextTick(() => {
                                        this.$refs.scroller.disablePullup();
                                    });
                                }
                            });
                            this.searchParams.page--;
                        });
                    }
                }, () => {
                    window.alert('网络问题，请稍后重试');
                })
            },
            refresh() {
                this.searchParams.page = 1;
                this.$http.get(this.GLOBAL.BASEURL + '/course/search_list', {params: this.searchParams}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.dataList = response.content;
                        this.$nextTick(() => {
                            this.$refs.scroller.donePulldown();
                            if(this.dataList.length>=10){
                                this.$refs.scroller.enablePullup();
                            }else{
                                this.$refs.scroller.disablePullup();
                            }
                            this.$refs.scroller.reset();
                        })
                    }
                }, () => {
                    window.alert('网络问题，请稍后重试');
                })
            },
        },
        components: {
            Scroller,
            Flexbox,
            FlexboxItem
        }
    }
</script>

<style lang="less" scoped>
    .tab-wrapper {
        width: 498px;
    }

    .vux-tab {
        background-color: #F8F8F8;
    }

    .list-cont {
        padding: 0 14px;
        background-color: #FFFFFF;
        .vux-flexbox-item:last-child .list-item:after {
            display: none;
        }
        .list-item {
            display: flex;
            width: 100%;
            padding: 13px 0;
            justify-content: flex-start;
            box-sizing: border-box;
        }
        .img-wrapper {
            overflow: hidden;
            position: relative;
            flex: 0 0 141px;
            margin-right: 13px;
            height: 88px;
            border-radius: 4px;
            .member-discount{
                position: absolute;
                top:0;
                left:4px;
                width:26px;
                height:33px;
                background: url('member-logo.png') no-repeat left top;
                background-size:26px 33px;
                font-size: 10px;
                color: #fff;
                text-align: center;
                padding-top:2px;
                line-height: 12px;
            }
            img {
                width: 100%;
                height: 100%;
                vertical-align: middle;
            }
            .buy-count {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 19px;
                line-height: 19px;
                font-size: 12px;
                text-indent: 14px;
                background-color: rgba(0, 0, 0, .5);
                color: #FFFFFF;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                z-index: 2;
            }
            .type {
                display: block;
                position: absolute;
                bottom: 7px;
                right: 7px;
                border-radius: 2px;
                width: 26px;
                height: 15px;
                text-align: center;
                line-height: 15px;
                background-color: #6ABA8D;
                color: #FFFFFF;
                font-size: 8px;
            }
        }
        .intro-wrapper {
            flex: 1;
            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                line-height: 22px;
                color: #333333;
            }
            .company {
                font-size: 12px;
                height: 36px;
                line-height: 18px;
                margin: 3px 0 5px;
                color: #666666;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .detail {
                font-size: 12px;
                line-height: 23px;
                color: #999999;
                display: flex;
                justify-content: space-between;
                .money {
                    font-size: 17px;
                    color: #F48618;
                }
                .free {
                    color: #0ABE67;
                    font-size: 16px;
                }
            }
        }
    }
</style>
