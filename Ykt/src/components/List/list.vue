<template>
    <div class="list" v-cloak>
        <div class="search">
            <scroller lock-y :scrollbar-x=false ref="navScroller">
                <div class="tab-wrapper" ref="navScroll">
                    <tab :line-width="2" defaultColor="#464444" active-color="#3d8afe">
                        <tab-item :selected="searchParams.categoryid === '0'" @on-item-click="onItemClick(0)">全部
                        </tab-item>
                        <tab-item v-for="item in cateList" @on-item-click="onItemClick(item.id)" :key="item.id"
                                  :selected="searchParams.categoryid === item.id">{{item.name}}
                        </tab-item>
                    </tab>
                </div>
            </scroller>
        </div>
        <sort :sort-list="sortList" :default-sort="defaultSort" @sortChoose="sortChoose"></sort>
        <scroller lock-x use-pullup use-pulldown height="-82px"
                  @on-pullup-loading="loadMore"
                  @on-pulldown-loading="refresh"
                  :pullup-config="upconfig"
                  :pulldown-config="downconfig"
                  ref="scroller"
                  class="scroller"
        >
            <div class="list-cont" v-show="dataList.length">
                <flexbox orient="vertical" :gutter="0">
                    <flexbox-item v-for="item in dataList" :key="item.id">
                        <router-link :to="'/list/coursedetail/'+item.id" class="list-item vux-1px-b">
                            <div class="img-wrapper">
                                <div class="member-discount" v-show="item.vipisfree==='1'">会员免费</div>
                                <div class="member-discount" v-show="item.vipisfree==='0'">会员<br>{{item.discount}}折
                                </div>
                                <img :src="item.thumbnail" width="141" height="88">
                                <span class="buy-count">{{item.buyernumber}}人已购买</span>
                                <span class="type">视频</span>
                            </div>
                            <div class="intro-wrapper">
                                <p class="title">{{item.name}}</p>
                                <p class="company">{{item.teacher}}-{{item.profile}}</p>
                                <div class="detail">
                                    <span class="duration">时长：{{item.duration}}分/{{item.lessonnumber}}节课</span>
                                    <span class="money" v-if="item.isfree==='0'">¥{{item.price}}</span>
                                    <span class="free" v-if="item.isfree==='1'">免费</span>
                                </div>
                            </div>
                        </router-link>
                    </flexbox-item>
                </flexbox>
            </div>
            <img src="./black.png" alt="" class="black-page" v-show="blackPage">
        </scroller>
    </div>
</template>

<script type="text/ecmascript-6">
import { Scroller, Tab, TabItem, Flexbox, FlexboxItem } from "vux";
import sort from "../Sort/sort.vue";
export default {
  name: "list",
  data() {
    return {
      blackPage: false,
      cateList: [],
      dataList: [], //数据列表
      sortList: [
        { name: "按上架时间（从新到旧）", value: "modifytime" },
        { name: "按用户购买最多（从多到少）", value: "popularity" }
      ],
      defaultSort: 0,
      searchParams: {
        categoryid: 0,
        sort: "modifytime",
        page: 1
      },
      upconfig: {
        content: "上拉加载",
        pullUpHeight: 40,
        height: 40,
        autoRefresh: false,
        downContent: "释放加载数据",
        upContent: "上拉加载",
        loadingContent: "加载中...",
        clsPrefix: "xs-plugin-pullup-"
      },
      downconfig: {
        downContent: "下拉刷新",
        upContent: "释放后更新",
        loadingContent: "刷新中...",
        clsPrefix: "xs-plugin-pulldown-"
      }
    };
  },
  created() {
    this.cateList = JSON.parse(sessionStorage.getItem("cateNames"));
    this.searchParams.categoryid = sessionStorage.getItem("categoryid")
      ? sessionStorage.getItem("categoryid")
      : this.$route.params.categoryid;
    this.getDataList(this.searchParams);
  },
  mounted() {
    this.$refs.navScroll.style.width = 70 * (this.cateList.length + 1) + "px";
    this.$nextTick(() => {
      this.$refs.navScroller.reset();
    });
  },
  methods: {
    getDataList(obj) {
      this.$http
        .get(this.GLOBAL.BASEURL + "/course/search_list", { params: obj })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList = response.content;
              if (!this.dataList.length) {
                this.blackPage = true;
              } else {
                this.blackPage = false;
              }
              this.$nextTick(() => {
                this.$refs.scroller.reset({
                  top: 0
                });
                if (this.dataList.length < 10) {
                  this.$refs.scroller.disablePullup();
                }
                document.querySelectorAll(".intro-wrapper").forEach(item => {
                  item.style.width =
                    document.documentElement.clientWidth - 182 + "px";
                });
              });
            } else {
              this.dataList = [];
              this.blackPage = true;
              this.$refs.scroller.disablePullup();
            }
          },
          () => {
            window.alert("网络问题，请稍后重试");
          }
        );
    },
    loadMore() {
      this.searchParams.page++;
      this.$http
        .get(this.GLOBAL.BASEURL + "/course/search_list", {
          params: this.searchParams
        })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList = this.dataList.concat(response.content);
              this.$nextTick(() => {
                this.$refs.scroller.donePullup();
                this.$refs.scroller.reset();
                document.querySelectorAll(".intro-wrapper").forEach(item => {
                  item.style.width =
                    document.documentElement.clientWidth - 182 + "px";
                });
                this.searchParams.page++;
                this.$http
                  .get(this.GLOBAL.BASEURL + "/course/search_list", {
                    params: this.searchParams
                  })
                  .then(response => {
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
          },
          () => {
            window.alert("网络问题，请稍后重试");
          }
        );
    },
    refresh() {
      this.searchParams.page = 1;
      this.$http
        .get(this.GLOBAL.BASEURL + "/course/search_list", {
          params: this.searchParams
        })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList = response.content;
              if (!this.dataList.length) {
                this.blackPage = true;
              }
              this.$nextTick(() => {
                this.$refs.scroller.donePulldown();
                if (this.dataList.length >= 10) {
                  this.$refs.scroller.enablePullup();
                } else {
                  this.$refs.scroller.disablePullup();
                }
                this.$refs.scroller.reset();
              });
            } else {
              this.$nextTick(() => {
                this.$refs.scroller.donePulldown();
              });
            }
          },
          () => {
            window.alert("网络问题，请稍后重试");
          }
        );
    },
    onItemClick(id) {
      this.searchParams.categoryid = id;
      this.searchParams.page = 1;
      sessionStorage.setItem("categoryid", id);
      this.getDataList(this.searchParams);
    },
    sortChoose(val) {
      //                更新视图数据
      this.searchParams.sort = val;
      this.getDataList(this.searchParams);
    }
  },
  components: {
    Scroller,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    sort
  }
};
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  z-index: 1000;
  width: 100%;
}

.vux-tab {
  min-width: 100vw;
  background-color: #f8f8f8;
}

.black-page {
  width: 100vw;
  height: calc(~"100vh - 84px");
}

.scroller {
  top: 84px;
  .list-cont {
    padding: 0 14px;
    background-color: #ffffff;
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
      .member-discount {
        position: absolute;
        top: 0;
        left: 4px;
        width: 26px;
        height: 33px;
        background: url("member-logo.png") no-repeat left top;
        background-size: 26px 33px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        padding-top: 2px;
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
        background-color: rgba(0, 0, 0, 0.5);
        color: #ffffff;
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
        background-color: #6aba8d;
        color: #ffffff;
        font-size: 8px;
      }
    }
    .intro-wrapper {
      flex: 1;
      /*width: 55.62%;*/
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
          font-size: 14px;
          color: #f48618;
        }
        .free {
          color: #0abe67;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
