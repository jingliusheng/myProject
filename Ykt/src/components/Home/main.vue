<template>
    <div class="main">
        <swiper auto loop :interval="3000" height="150px" dots-class="dot-wrapper" :show-dots="bannerList.length>1">
            <swiper-item v-for="(item, index) in bannerList" :key="index" class="img-wrapper">
                <a :href="item.targeturl">
                    <img :src="item.pic" height="150">
                </a>
            </swiper-item>
        </swiper>
        <scroller lock-y :scrollbar-x=false ref="navScroller">
            <div class="nav-wrapper" ref="navScroll">
                <router-link class="nav-item" to="/list/0">
                    <span>全部</span>
                    <img src="./nav01.png" width="75" height="75">
                </router-link>
                <router-link class="nav-item" :class="{'five':cateListLength>4}" v-for="cate in cateList"
                             :key="cate.id" :to="/list/+cate.id">
                    <span>{{cate.name}}</span>
                    <img :src="cate.thumbnail" width="75" height="75">
                </router-link>
            </div>
        </scroller>
        <div class="course-cont">
            <group gutter="0">
                <cell is-link link="/newCourse">
                    <div slot="icon" style="width:5px;height: 16px;margin-left:-15px;background-color:#3D8AFE;"></div>
                    <span slot="title" style="font-size: 15px;color: #444444;">最新课程</span>
                    <span slot="value" style="font-size: 13px;color: #444444;line-height: 24px;">查看全部</span>
                </cell>
            </group>
            <div class="course-list">
                <flexbox wrap="wrap" :gutter="0" justify="flex-start">
                    <flexbox-item :span="6" v-for="newCourse in courseList.new" :key="newCourse.id">
                        <router-link :to="'/list/coursedetail/'+newCourse.id" class="course-item">
                            <div class="cover-img">
                                <img :src="newCourse.thumbnail">
                                <span>视频</span>
                            </div>
                            <p class="name">{{newCourse.name}}</p>
                            <p class="count">{{newCourse.viewernumber}}人观看</p>
                        </router-link>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
        <div class="course-cont">
            <group gutter="0">
                <cell is-link link="/freeCourse">
                    <div slot="icon" style="width:5px;height: 16px;margin-left:-15px;background-color:#3D8AFE;"></div>
                    <span slot="title" style="font-size: 15px;color: #444444;">限时免费</span>
                    <span slot="value" style="font-size: 13px;color: #444444;line-height: 24px;">查看全部</span>
                </cell>
            </group>
            <div class="course-list">
                <flexbox wrap="wrap" :gutter="0" justify="flex-start">
                    <flexbox-item :span="6" v-for="freeCourse in courseList.free" :key="freeCourse.id">
                        <router-link :to="'/list/coursedetail/'+freeCourse.id" class="course-item">
                            <div class="cover-img">
                                <img :src="freeCourse.thumbnail">
                                <span>视频</span>
                            </div>
                            <p class="name">{{freeCourse.name}}</p>
                            <p class="count">{{freeCourse.viewernumber}}人观看</p>
                        </router-link>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
        <div class="course-cont">
            <group gutter="0">
                <cell>
                    <div slot="icon" style="width:5px;height: 16px;margin-left:-15px;background-color:#3D8AFE;"></div>
                    <span slot="title" style="font-size: 15px;color: #444444;">猜你喜欢</span>
                    <div slot="value" @click="change"
                         style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);font-size: 13px;color: #444444;line-height: 24px;">
                        换一换 <img ref="rotateImg" style="margin-bottom: -2px;" width="14"
                                 height="14" src="./change.png" alt="">
                    </div>
                </cell>
            </group>
            <div class="course-list">
                <flexbox wrap="wrap" :gutter="0" justify="flex-start">
                    <flexbox-item :span="6" v-for="randomCourse in courseList.random" :key="randomCourse.id">
                        <router-link :to="'/list/coursedetail/'+randomCourse.id" class="course-item">
                            <div class="cover-img">
                                <img :src="randomCourse.thumbnail">
                                <span>视频</span>
                            </div>
                            <p class="name">{{randomCourse.name}}</p>
                            <p class="count">{{randomCourse.viewernumber}}人观看</p>
                        </router-link>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
    </div>
</template>

<script>
    import {Swiper, SwiperItem, Scroller, Group, Cell, Flexbox, FlexboxItem} from 'vux';
    export default {
        name: 'hello',
        data () {
            return {
                bannerList: [],
                cateList: [],
                courseList: [],
                show: true
            }
        },
        created() {
            sessionStorage.setItem('categoryid', '');
            this.$http.get(this.GLOBAL.BASEURL + '/course/index').then((response) => {
                response = response.body;
                if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                    this.bannerList = response.content.banner;
                    this.cateList = response.content.cate;
                    this.courseList = response.content.course;
                    this.$nextTick(() => {
                        this.$refs.navScroller.reset();
                    });
                    sessionStorage.setItem('cateNames', JSON.stringify(this.cateList));
                } else {
                    window.alert(response.msg);
                }
            }, () => {
                window.alert('网络问题，请稍后重试');
            })
        },
        computed: {
            cateListLength(){
                let length = this.cateList.length;
                if (length > 4) {
                    this.$refs.navScroll.style.width = 85 * (this.cateList.length) + 108 + 'px';
                } else {
                    this.$refs.navScroll.style.width = 91 * (this.cateList.length + 1) + 8 + 'px';
                }
                return length + 1;
            },
            courseids() {
                let Aids = [];
                this.courseList.new.forEach((course) => {
                    Aids.push(course.id);
                });
                this.courseList.free.forEach((course) => {
                    Aids.push(course.id);
                });
                this.courseList.random.forEach((course) => {
                    Aids.push(course.id);
                });
                return Aids.join(',');
            }
        },
        methods: {
            change(){
                this.$refs.rotateImg.style.transition = 'all .5s linear';
                this.$refs.rotateImg.style.transform = 'rotate(180deg)';
                this.$http.get(this.GLOBAL.BASEURL + '/course/random', {params: {'courseids': this.courseids}}).then((response) => {
                    response = response.body;
                    if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                        this.courseList.random = response.content;
                    }
                }, () => {
                    window.alert('网络原因，请稍后重试');
                })
                setTimeout(() => {
                    this.$refs.rotateImg.style.transition = 'all 0s';
                    this.$refs.rotateImg.style.transform = 'rotate(0)';
                }, 500)
            }
        },
        components: {
            Swiper,
            SwiperItem,
            Scroller,
            Group,
            Cell,
            Flexbox,
            FlexboxItem
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .main {
        overflow: hidden;
    }

    .dot-wrapper .active {
        background-color: #3D8AFE !important;
    }

    .img-wrapper img {
        width: 100%;
    }

    .nav-wrapper {
        min-width: 100vw;
        box-sizing: border-box;
        padding: 0 4px;
        background-color: #FFFFFF;
        margin-bottom: 11px;
        font-size: 0;
        .nav-item {
            position: relative;
            display: inline-block;
            width: 75px;
            height: 75px;
            text-align: center;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            margin: 15px 8px;
            &.five {
                margin: 15px 5px !important;
            }
            span {
                line-height: 75px;
                color: #FFFFFF;
                font-size: 15px;
            }
            img {
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
                border-radius: 5px;
            }
        }
    }

    .course-cont {
        background-color: #FFFFFF;
        margin-bottom: 12px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .course-list {
        padding: 0 6px;
        .course-item {
            width: 100%;
            padding: 0 9px;
            margin-bottom: 10px;
            box-sizing: border-box;
            .cover-img {
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 103px;
                border-radius: 4px;
                img {
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
                span {
                    display: block;
                    position: absolute;
                    bottom: 7px;
                    right: 7px;
                    border-radius: 2px;
                    width: 30px;
                    height: 17px;
                    text-align: center;
                    line-height: 17px;
                    background-color: #6ABA8D;
                    color: #FFFFFF;
                    font-size: 10px;
                }
            }
            .name {
                line-height: 24px;
                font-size: 14px;
                color: #333333;
                margin-top: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .count {
                line-height: 16px;
                font-size: 12px;
                color: #999999;
            }
        }
    }

</style>
