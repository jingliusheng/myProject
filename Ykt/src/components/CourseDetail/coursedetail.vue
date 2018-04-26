<template>
  <div class = "courseDetail">
    <div v-if = "dataList.id">
      <v-video ref = "videoWrapper" @getPlayTime = "getPlayTime"></v-video>
      <div class = "selectWrapper">
        <tab :line-width = 2 custom-bar-width = "71px" defaultColor = "#464444" active-color = "#3d8afe"
             v-model = "demoindex">
          <tab-item class = "vux-center" :selected = "demo === item" v-for = "(item , index) in list"
                    @click = "demo = item" :key = "index">{{item}}
          </tab-item>
        </tab>
      </div>
      <div class = "clear" style = "height: 264px;"></div>
      <div class = "menu" v-show = "demoindex===0" ref = "menu">
        <flexbox orient = "vertical">
          <flexbox-item v-for = "(item ,index) in dataList.lessons" :key = "item.id" class = "capter">
            <h4 class = "vux-1px-b">
              第{{item.chapter}}章
              <span class = "learning-progress">{{learnProgress(item.playtime, item.duration)}}</span>
            </h4>
            <div :class = "{'learned':hasLearned(item.playtime),'learning':(clickIndex===index)}"
                 @click = "selectCourse(item,index)">
              <span class = "isfree" :class = "{'blueColor':item.isfree=='1'}">{{item.isfree | isfree}}</span>
              <span class = "capterIndex">{{item.chapter < 9 ? '0'+item.chapter : item.chapter}}</span>
              <span class = "capterName">{{item.name}}</span>
              <span>{{Math.ceil(item.duration / 60)}}分钟</span>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class = "coursedesc" v-show = "demoindex===1" ref = "desc">
        <group gutter = "0">
          <cell>
            <div slot = "icon"
                 style = "width:5px;height: 16px;margin:0 6px 0 2px;background-color:#3D8AFE;"></div>
            <div slot = "title" style = "font-size: 15px;color: #444444;">课程大纲<span
              style = "color: #999999;">（点击图片查看原图）</span>
            </div>
          </cell>
          <div class = "outline-img">
            <img :src = "dataList.outline" alt = "" @click = "showBigImg(0)" class = "previewer-demo-img">
          </div>
        </group>
        <group class = "vux-1px-b" gutter = "0">
          <cell>
            <div slot = "icon"
                 style = "width:5px;height: 16px;margin:0 6px 0 2px;background-color:#3D8AFE;"></div>
            <div slot = "title" style = "font-size: 15px;color: #444444;">适宜人群</div>
          </cell>
          <p class = "courseContent">{{dataList.target}}</p>
        </group>
        <group gutter = "0">
          <cell>
            <div slot = "icon"
                 style = "width:5px;height: 16px;margin:0 6px 0 2px;background-color:#3D8AFE;"></div>
            <div slot = "title" style = "font-size: 15px;color: #444444;">课程说明</div>
          </cell>
          <p class = "courseContent">{{dataList.description}}</p>
        </group>
      </div>
      <div class = "afterclass" v-show = "demoindex===2">
        <group :gutter = "0">
          <cell :border-intent = "false" is-link @click.native = "courseData"
                v-show = "dataList.materiallink">
            <span slot = "title" style = "font-size: 14px;color: #333333;">课程资料</span>
          </cell>
          <cell :value = "dataList.exercisenumber" is-link @click.native = "testClick">
            <span slot = "title" style = "font-size: 14px;color: #333333;">课后测试</span>
          </cell>
        </group>
      </div>
      <tabbar class = "courseFoot">
        <div class = "courseDoMenu">
          <div @click = "comment($route.params.courseid)"><img src = "./tabIcon07.png" width = "22"
                                                               height = "22"><span>{{dataList.commentnumber}}</span>
          </div>
          <div v-show = "!isThumbUp" @click = "thumbup">
            <img src = "./tabIcon08.png" width = "22" height = "22">
            <span>{{dataList.praisenumber}}</span>
          </div>
          <div v-show = "isThumbUp" class = "thumbup thumbup-hook">
            <transition name = "scale">
              <img v-show = "isThumbUp" src = "./tabIcon10.png" width = "22" height = "22">
            </transition>
            <span>{{dataList.praisenumber}}</span>
          </div>
          <div v-show = "!isCollect" @click = "collect('collection')">
            <img src = "./tabIcon09.png" width = "22" height = "22">
            <span>收藏</span>
          </div>
          <div v-show = "isCollect" @click = "collect('delete_collection')" class = "thumbup collect-hook">
            <transition name = "scale">
              <img v-show = "isCollect" src = "./tabIcon11.png" width = "22" height = "22">
            </transition>
            <span>已收藏</span>
          </div>
        </div>
        <div class = "isBuyCourse" :class = "{'buy':dataList.ispurchased==='1'}" @click = "toggleBuy">{{text}}</div>
      </tabbar>
      
      <div class = "share" @click = "sharePoster">
        <img src = "./tabIcon12.png" width = "19" height = "16"><span>海报</span>
      </div>
      <transition name = "slideBg">
        <div class = "buy-background" v-show = "buy" @click = "toggleBuy"></div>
      </transition>
      <transition name = "slide">
        <div class = "slideWrapper" v-show = "buy">
          <div v-show = "money">
            <p class = "course-title">{{dataList.name}}</p>
            <p class = "course-price">¥ {{payMoney}}</p>
            <x-button class = "btn btn-sure" @click.native = "buyCourse">确定</x-button>
          </div>
          <div v-show = "!money">
            <p class = "course-title">余额不足</p>
            <x-button class = "btn btn-wx" @click.native = 'wxPay'>微信支付</x-button>
            <x-button class = "btn btn-budget" link = "/account">钱包充值</x-button>
          </div>
          <x-button class = "btn btn-cancle" @click.native = "toggleBuy">取消</x-button>
        </div>
      </transition>
      <div class = "thumb-up-tip" v-show = "thumbupTip" @click = "thumbupTip=false">
        <span>{{dataList.praisenumber}}</span>
      </div>
      <div class = "collect-tip" v-show = "collectTip" @click = "collectTip=false"></div>
      <div v-transfer-dom>
        <previewer ref = "previewer" :list = "bigImgList" :options = "options"></previewer>
      </div>
    </div>
    <img src = "./black.png" alt = "" v-if = "noData" style = "width:100vw;height: 100vh;">
    <toast v-model = "showWarning" type = "warn" width = "10em" :is-show-mask = "true" position = "middle"
           :text = "warningText"></toast>
  </div>
</template>

<script>
import Vue from "vue";
import video from "@/components/Video/video";
import Bus from "@/common/utils/eventBus.js";
import {
  Tab,
  TabItem,
  Flexbox,
  FlexboxItem,
  Tabbar,
  TabbarItem,
  Group,
  Cell,
  XButton,
  base64,
  Previewer,
  TransferDom,
  Toast
} from "vux";
const list = () => ["目录", "详情", "课后"];
Vue.filter("isfree", value => {
  return value === "0" ? "视频" : "试听";
});
export default {
  name: "courseDetail",
  directives: {
    TransferDom
  },
  data() {
    return {
      showWarning: false,
      warningText: "",
      demo: "目录",
      demoindex: 0,
      list: list(),
      dataList: {},
      noData: false,
      clickIndex: "",
      buy: false,
      money: true,
      thumbupTip: false,
      collectTip: false,
      bigImgList: [],
      options: {
        getThumbBoundsFn(index) {
          let thumbnail = document.querySelectorAll(".previewer-demo-img")[
            index
          ];
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      }
    };
  },
  computed: {
    isThumbUp() {
      return this.dataList.ispraised === "1";
    },
    isCollect() {
      return this.dataList.iscollected === "1";
    },
    text() {
      if (this.dataList.ispurchased == "1") {
        return "已购买";
      } else if (this.dataList.vipisfree == "1") {
        return "订阅:¥" + this.dataList.price + "/会员免费";
      } else {
        return (
          "订阅:¥" +
          this.dataList.price +
          "/会员" +
          this.dataList.discount +
          "折"
        );
      }
    },
    payMoney() {
      if (this.dataList.isvip == 1) {
        if (this.dataList.vipisfree == "1") {
          return "0.00";
        } else {
          return (
            Math.ceil(this.dataList.price * this.dataList.discount * 10) / 100
          ).toFixed(2);
        }
      } else {
        return this.dataList.price;
      }
    }
  },
  created() {
    this.$http.get(this.GLOBAL.BASEURL + "/wx/wxconfig").then(
      response => {
        response = response.body;
        if (response.status === this.GLOBAL.STATUSOBJ.ok) {
          let Data = response.content;
          this.$wechat.config({
            debug: Data.debug, // 开启调试模式,开发时可以开启
            appId: Data.appId, // 必填，公众号的唯一标识   由接口返回
            timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
            nonceStr: Data.nonceStr, // 必填，生成签名的随机串 由接口返回
            signature: Data.signature, // 必填，签名 由接口返回
            jsApiList: [
              "chooseWXPay",
              "onMenuShareTimeline",
              "onMenuShareAppMessage",
              "onMenuShareQQ",
              "onMenuShareQZone"
            ] // 此处填你所用到的方法
          });
        }
      },
      response => {
        window.alert("网络原因，请稍后重试");
      }
    );
  },
  mounted() {
    this.$http
      .get(this.GLOBAL.BASEURL + "/course/detail", {
        params: { id: this.$route.params.courseid }
      })
      .then(
        response => {
          response = response.body;
          if (response.status === this.GLOBAL.STATUSOBJ.ok) {
            document.getElementsByTagName("title")[0].innerHTML =
              response.content.name;
            this.dataList = response.content;
            this.bigImgList = [{ src: this.dataList.outline, w: 750, h: 1000 }];
            this.$nextTick(() => {
              let url = window.location.href.replace(/#/, "share");
              let _this = this;
              _this.$wechat.ready(() => {
                _this.$wechat.onMenuShareAppMessage({
                  title:
                    "《" +
                    _this.dataList.name +
                    "》|" +
                    _this.dataList.teacher +
                    "解读", // 分享标题
                  desc: _this.dataList.abstract, // 分享描述
                  link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: "", // 分享图标
                  type: "link", // 分享类型,music、video或link，不填默认为link
                  dataUrl: "" // 如果type是music或video，则要提供数据链接，默认为空
                });
                _this.$wechat.onMenuShareTimeline({
                  title: _this.dataList.name, // 分享标题
                  link: url, // 分享链接，该链接域名必须与当前企业的可信域名一致
                  imgUrl: "" // 分享图标
                });
              });
            });
          } else if (response.status == 403) {
            this.noData = true;
          }
        },
        () => {
          window.alert("网络问题，请稍后重试");
        }
      );
  },
  methods: {
    //未购买用户不允许参加考试
    testClick() {
      if (this.dataList.exercisenumber == "0") {
        return false;
      } else if (this.dataList.ispurchased == "0") {
        this.showWarning = true;
        this.warningText = "您还没有订阅课程无法参加课后测试";
      } else {
        this.$router.push({
          path: "/test/test/" + this.$route.params.courseid
        });
      }
    },
    //未购买用户不允许下载课程资料事件
    courseData() {
      if (this.dataList.ispurchased == "0") {
        this.showWarning = true;
        this.warningText = "您还没有订阅课程无法下载课程资料";
      } else {
        this.$router.push({ path: "/test/courseData" });
      }
    },
    //播放进度
    learnProgress(playTime, duration) {
      if (playTime == 0) {
        return "未学习";
      } else if (duration - playTime <= 5) {
        return "已学习";
      } else {
        if (playTime / 60 < 10) {
          if (playTime % 60 < 10) {
            return (
              "学习到 0" + Math.floor(playTime / 60) + ":0" + playTime % 60
            );
          } else {
            return "学习到 0" + Math.floor(playTime / 60) + ":" + playTime % 60;
          }
        } else {
          if (playTime % 60 < 10) {
            return "学习到 " + Math.floor(playTime / 60) + ":0" + playTime % 60;
          } else {
            return "学习到 " + Math.floor(playTime / 60) + ":" + playTime % 60;
          }
        }
      }
    },
    //获取播放时间 判断当前点击章节是否播放
    getPlayTime(time, id) {
      this.dataList.lessons.forEach(item => {
        if (item.id == id) {
          if (item.playtime < time) {
            item.playtime = time;
          }
        }
      });
    },
    //课程大纲大图显示
    showBigImg(index) {
      this.$refs.previewer.show(index);
    },
    //生成海报
    sharePoster() {
      this.$router.push({
        path: "/coursePoster/" + this.$route.params.courseid
      });
    },
    toggleBuy() {
      if (this.dataList.ispurchased === "0") {
        this.buy = !this.buy;
        this.money = true;
      }
    },
    buyCourse() {
      this.$http
        .post(this.GLOBAL.BASEURL + "/account/balance_pay", {
          type: "course",
          id: this.$route.params.courseid
        })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList.ispurchased = "1";
              this.buy = false;
            } else if (response.status === this.GLOBAL.STATUSOBJ.noMoney) {
              this.money = false;
            } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
              this.$router.push({ path: "/bindphone/null" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
              this.$router.push({ path: "/login" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
              window.alert(response.msg + "==>" + response.status);
            } else if (response.status === 302) {
              let str = response.content.url;
              let routePath = this.$route.path
                .substring(1)
                .split("/")
                .join("_");
              let str1 = str.replace(/123/, routePath);
              window.location.href = str1;
            }
          },
          response => {
            window.alert("网络原因，请稍后重试");
          }
        );
    },
    wxPay() {
      if (typeof WeixinJSBridge == "undefined") {
        window.alert("请在微信中打开");
      } else {
        this.$http
          .post(this.GLOBAL.BASEURL + "/wx/pay", {
            type: "course",
            id: this.$route.params.courseid
          })
          .then(
            response => {
              response = response.body;
              if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                let obj = response.content;
                this.onBridgeReady(obj);
              } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
                window.alert(response.msg + "==>" + response.status);
              } else if (response.status === 302) {
                let str = response.content.url;
                let routePath = this.$route.path
                  .substring(1)
                  .split("/")
                  .join("_");
                let str1 = str.replace(/123/, routePath);
                window.location.href = str1;
              }
            },
            response => {
              window.alert("网络原因，请稍后重试");
            }
          );
      }
    },
    onBridgeReady(obj) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: obj.appId, //公众号名称，由商户传入
          timeStamp: obj.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: obj.nonceStr, //随机串
          package: obj.package,
          signType: obj.signType, //微信签名方式：
          paySign: obj.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            window.location.reload();
          } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回  ok，但并不保证它绝对可靠。
        }
      );
    },
    hasLearned(time) {
      if (time > 0) {
        return true;
      } else {
        return false;
      }
    },
    selectCourse(course, index) {
      this.clickIndex = index;
      this.$refs.videoWrapper.getauthority(course);
    },
    comment(id) {
      this.$router.push({ path: "/ratings/" + id });
    },
    thumbup() {
      this.$http
        .post(this.GLOBAL.BASEURL + "/course/praise_course", {
          courseid: this.$route.params.courseid
        })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList.ispraised = "1";
              this.dataList.praisenumber++;
              this.$nextTick(() => {
                let left =
                  document.querySelector(".thumbup-hook").offsetLeft + 6;
                document.querySelector(
                  ".thumb-up-tip"
                ).style.backgroundPosition =
                  left + "px" + " bottom";
                this.thumbupTip = true;
              });
            } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
              this.$router.push({ path: "/bindphone/null" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
              this.$router.push({ path: "/login" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
              window.alert(response.msg);
            } else if (response.status === 302) {
              let str = response.content.url;
              let routePath = this.$route.path
                .substring(1)
                .split("/")
                .join("_");
              let str1 = str.replace(/123/, routePath);
              window.location.href = str1;
            }
          },
          () => {
            window.alert("网络原因，请稍后重试");
          }
        );
    },
    collect(url) {
      this.$http
        .post(this.GLOBAL.BASEURL + "/course/" + url, {
          courseid: this.$route.params.courseid
        })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList.iscollected =
                this.dataList.iscollected === "0" ? "1" : "0";
              if (this.isCollect) {
                this.$nextTick(() => {
                  let left =
                    document.querySelector(".collect-hook").offsetLeft + 6;
                  document.querySelector(
                    ".collect-tip"
                  ).style.backgroundPosition =
                    left + "px" + " bottom";
                  this.collectTip = true;
                });
              }
            } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
              this.$router.push({ path: "/bindphone/null" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
              this.$router.push({ path: "/login" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
              window.alert(response.msg + "==>" + response.status);
            } else if (response.status === 302) {
              let str = response.content.url;
              let routePath = this.$route.path
                .substring(1)
                .split("/")
                .join("_");
              let str1 = str.replace(/123/, routePath);
              window.location.href = str1;
            }
          },
          () => {
            window.alert("网络原因，请稍后重试");
          }
        );
    }
  },
  destroyed() {
    let courseData = {};
    courseData.materialsize = this.dataList.materialsize;
    courseData.materialname = this.dataList.materialname;
    courseData.materiallink = this.dataList.materiallink;
    Bus.$emit("getTarget", courseData);
  },
  components: {
    "v-video": video,
    Tab,
    TabItem,
    Flexbox,
    FlexboxItem,
    Tabbar,
    TabbarItem,
    Group,
    Cell,
    XButton,
    Previewer,
    Toast
  }
};
</script>

<style lang = "less" scoped>
.weui-cell:before {
  left: 0;
}
.vux-tab {
  margin-bottom: 11px;
}
.selectWrapper {
  width: 100%;
  position: fixed;
  top: 210px;
  left: 0;
  z-index: 502;
}
.share {
  width: 81px;
  height: 33px;
  text-align: center;
  line-height: 33px;
  background: #999999;
  color: #ffffff;
  font-size: 14px;
  position: fixed;
  right: 0;
  bottom: 80px;
  z-index: 502;
  border-top-left-radius: 16.5px;
  border-bottom-left-radius: 16.5px;
  img {
    vertical-align: sub;
    margin-right: 6px;
  }
}
.menu {
  padding-bottom: 50px;
  .capter {
    background: #ffffff;
    line-height: 42px;
    font-size: 14px;
    box-sizing: border-box;
    div {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      vertical-align: middle;
      &.learned {
        color: #999999;
      }
      &.learning {
        color: #3d8afe;
        /*.isfree {*/
        /*color: #3d8afe;*/
        /*border: 1px solid #3d8afe;*/
        /*}*/
      }
      .isfree {
        height: 20px;
        line-height: 22px;
        margin: auto 0;
        padding: 0 3px;
        color: #0abe67;
        border: 1px solid #0abe67;
        border-radius: 3px;
        font-size: 12px;
      }
      .blueColor {
        color: #3d8afe;
        border: 1px solid #3d8afe;
      }
      .capterIndex {
        padding: 0 13px;
      }
      .capterName {
        flex: 1;
      }
    }
    h4,
    div {
      position: relative;
      padding: 0 14px;
    }
    .learning-progress {
      position: absolute;
      right: 14px;
      top: 12px;
      background-color: #f1eff3;
      color: #c8c7c9;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      padding: 0 7px;
      border-radius: 4px;
    }
  }
}
.coursedesc {
  padding-bottom: 50px;
  & > div:first-child {
    margin-bottom: 11px;
  }
  .outline-img {
    padding: 0 20px 10px;
    height: 150px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .weui-cells {
    padding-top: 6px;
    .weui-cell {
      padding: 12px 20px !important;
    }
    .courseContent {
      padding: 0 20px 10px;
      font-size: 14px;
      color: #666666;
      line-height: 25px;
      p,
      span {
        color: #666666;
      }
      img {
        width: 100% !important;
      }
    }
  }
}
.afterclass {
  background-color: #ffffff;
}
.courseFoot {
  width: 100%;
  height: 50px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 500;
  display: flex;
  justify-content: space-between;
  .courseDoMenu {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    div {
      flex: 1;
      height: 50px;
      padding-top: 3px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      font-size: 10px;
    }
    .thumbup {
      color: #3d8afe;
    }
  }
  .isBuyCourse {
    flex: 1;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #ffffff;
    background: #f48618;
    &.buy {
      background: #3d8afe;
    }
  }
}
.buy-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 502;
  background-color: rgba(40, 38, 38, 0.3);
}
.slideWrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 502;
  width: 100%;
  padding: 26px 20px 15px;
  background: #ffffff;
  text-align: center;
  box-sizing: border-box;
  .course-title {
    font-size: 17px;
    line-height: 1em;
    color: #333333;
    font-weight: 700;
  }
  .course-price {
    font-size: 20px;
    line-height: 1em;
    margin: 27px 0;
    color: #f48618;
    font-weight: 700;
  }
  .btn {
    display: block;
    width: 100% !important;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 5px;
    font-size: 16px;
    color: #ffffff;
    &.btn-sure {
      background: #f48618 !important;
    }
    &.btn-wx {
      margin-top: 15px;
      background: #00cc66 !important;
    }
    &.btn-budget {
      background: #f48618 !important;
      margin: 15px 0;
    }
    &.btn-cancle {
      color: #b4b4b4;
      background: #dddddd !important;
      margin: 15px 0 0;
    }
  }
}
.thumb-up-tip {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 502;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  background-image: url("thumbup-tip.png");
  background-size: 157px 148px;
  background-repeat: no-repeat;
  span {
    display: block;
    width: 34px;
    text-align: center;
    color: #3d8afe;
    position: absolute;
    bottom: 0;
    left: 75px;
  }
}
.collect-tip {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 502;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  background-image: url("collect-tip.png");
  background-size: 152px 155px;
  background-repeat: no-repeat;
}
.slide-enter-to,
.slide-leave-to {
  transform: translate3d(0, 0, 0);
  transition: all 0.5s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(0, 100%, 0);
}
.scale-enter-to {
  transform: scale(1);
  transition: all 1s;
}
.scale-enter {
  transform: scale(1.3);
}
</style>
