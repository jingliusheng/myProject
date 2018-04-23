<template>
  <div class = "offlineDetail">
    <img src = "./black.png" alt = "" v-if = "noData" style = "width:100vw;height: 100vh;">
    <div v-else>
      <img :src = "dataList.thumbnail" width = "100%" height = "175">
      <div class = "classMsg vux-1px-b">
        <p>开课时间：{{dataList.startdatenote}}</p>
        <p>报名截止时间：{{dataList.startdate}}</p>
        <p>开课地点：{{dataList.place}}</p>
      </div>
      <div class = "classDesc textEdit" v-html = "dataList.description"></div>
      <div class = "offlineDetail-footer" v-if = "dataList.isdeadline!='1'">
        <a href = "tel:18989458256">电话咨询</a>
        <button @click = "applyAndPay">{{text}}</button>
      </div>
      <div v-show = "popback" class = "fade-background"></div>
      <div v-show = "apply" class = "fadeWrapper">
        <h3>请填写您的报名信息</h3>
        <group class = "cellWrapper">
          <x-input class = "name" title = "姓名"
                   label-width = "4.5em" name = "username"
                   placeholder = "请输入您的姓名" is-type = "china-name"
                   required v-model = "applyData.name">
          </x-input>
        </group>
        <group class = "cellWrapper">
          <x-input class = "phone" title = "联系方式"
                   label-width = "4.5em" name = "userphone"
                   placeholder = "请输入您的手机号码" is-type = "china-mobile"
                   required v-model = "applyData.phone">
          </x-input>
        </group>
        <group class = "cellWrapper">
          <x-input class = "message" title = "备注"
                   label-width = "4.5em" placeholder = "选填" :max = "100"
                   v-model = "applyData.remarks">
          </x-input>
        </group>
        <flexbox :gutter = "0" class = "btngroup">
          <flexbox-item>
            <button class = "btn-cancle" @click = "popcancle">取消</button>
          </flexbox-item>
          <flexbox-item>
            <button class = "btn-sure" @click = "applySure">确定报名</button>
          </flexbox-item>
        </flexbox>
      </div>
      <transition name = "slide">
        <div class = "slideWrapper" v-show = "pay">
          <div v-show = "money">
            <p class = "class-name">{{dataList.name}}</p>
            <div class = "applyNumber">
              <div>
                总费用：<span class = "class-price">¥ {{totalMoney}}</span>
              </div>
              <div class = "applyCount">
                <span>人数：</span>
                <span class = "count vux-1px" @click = "decrease">-</span>
                <span class = "number">{{applyNumber}}</span>
                <span class = "count vux-1px" @click = "increase">+</span>
              </div>
            </div>
            <button class = "btn btn-sure" @click = "paySure">确定</button>
          </div>
          <div v-show = "!money">
            <p class = "class-name">账号余额不足</p>
            <x-button class = "btn btn-wx" @click.native = 'wxPay'>微信支付</x-button>
            <x-button class = "btn btn-budget" link = "/account">钱包充值</x-button>
          </div>
          <button class = "btn btn-cancle" @click = "popcancle">取消</button>
        </div>
      </transition>
      <div v-transfer-dom>
        <alert v-model = "alertShow"> 报名成功</alert>
      </div>
    </div>
  </div>
</template>

<script>
import {
  XInput,
  Group,
  Flexbox,
  FlexboxItem,
  XButton,
  Alert,
  TransferDomDirective as TransferDom
} from "vux";
export default {
  name: "offlineDetail",
  directives: {
    TransferDom
  },
  components: {
    XInput,
    Group,
    Flexbox,
    FlexboxItem,
    XButton,
    Alert
  },
  data() {
    return {
      dataList: {},
      applyData: {
        remarks: "",
        classid: this.$route.params.id
      },
      applyNumber: 1,
      apply: false,
      pay: false,
      popback: false,
      money: true,
      alertShow: false,
      noData: false
    };
  },
  methods: {
    applyAndPay() {
      if (this.dataList.ispaid === "0") {
        this.$http.get(this.GLOBAL.BASEURL + "/user/is_login").then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.popback = !this.popback;
              if (this.dataList.isapplied === "0") {
                this.apply = !this.apply;
              } else {
                this.pay = !this.pay;
              }
            } else if (response.status === this.GLOBAL.STATUSOBJ.noPhone) {
              window.alert(response.msg);
              this.$router.push({ path: "/bindphone/null" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.noLogin) {
              window.alert(response.msg);
              this.$router.push({ path: "/login" });
            } else if (response.status === this.GLOBAL.STATUSOBJ.error) {
              window.alert(response.msg);
            } else if (response.status === 302) {
              window.alert(response.msg);
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
            window.alert("网络问题，请稍后重试");
          }
        );
      }
    },
    applySure() {
      if (!this.applyData.classid) {
        window.alert("未获取班级ID");
      } else if (!this.applyData.name || this.applyData.name.match(/^[ ]*$/)) {
        window.alert("姓名不能为空");
      } else if (
        !this.applyData.phone ||
        !/^1[34578]\d{9}$/.test(this.applyData.phone)
      ) {
        window.alert("请输入正确的手机号码");
      } else {
        this.$http
          .post(this.GLOBAL.BASEURL + "/class/apply", this.applyData)
          .then(
            response => {
              response = response.body;
              if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                this.dataList.isapplied = "1";
                this.popcancle();
                this.alertShow = true;
              } else if (response.status === 403) {
                this.noData = true;
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
            response => {
              window.alert("网络问题，请稍后重试");
            }
          );
      }
    },
    decrease() {
      if (this.applyNumber > 1) {
        this.applyNumber--;
      }
    },
    increase() {
      if (this.applyNumber < 99) {
        this.applyNumber++;
      }
    },
    paySure() {
      this.$http
        .post(this.GLOBAL.BASEURL + "/account/balance_pay", {
          type: "class",
          id: this.$route.params.id,
          number: this.applyNumber
        })
        .then(
          response => {
            response = response.body;
            if (response.status === this.GLOBAL.STATUSOBJ.ok) {
              this.dataList.ispaid = "1";
              this.pay = false;
              this.popback = false;
            } else if (response.status === 403) {
              this.noData = true;
            } else if (response.status === this.GLOBAL.STATUSOBJ.noMoney) {
              this.money = false;
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
            type: "class",
            id: this.$route.params.id,
            number: this.applyNumber
          })
          .then(
            response => {
              response = response.body;
              if (response.status === this.GLOBAL.STATUSOBJ.ok) {
                let obj = response.content;
                this.onBridgeReady(obj);
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
    popcancle() {
      this.apply = this.popback = this.pay = false;
      this.money = true;
      this.applyData = {
        remarks: "",
        classid: this.$route.params.id
      };
    }
  },
  computed: {
    text() {
      if (this.dataList.isapplied == "0") {
        return "立即报名";
      } else if (
        this.dataList.isapplied == "1" &&
        this.dataList.ispaid == "0"
      ) {
        return "立即支付";
      } else {
        return "已购买";
      }
    },
    totalMoney() {
      let money = Number(this.dataList.price) * this.applyNumber;
      return money.toFixed(2);
    }
  },
  beforeCreate() {
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
              "onMenuShareAppMessage",
              "onMenuShareTimeline"
            ] // 此处填你所用到的方法
          });
        }
      },
      response => {
        window.alert("网络原因，请稍后重试");
      }
    );
  },
  created() {
    this.$http
      .get(this.GLOBAL.BASEURL + "/class/detail", {
        params: { id: this.$route.params.id }
      })
      .then(
        response => {
          response = response.body;
          if (response.status === this.GLOBAL.STATUSOBJ.ok) {
            document.getElementsByTagName("title")[0].innerHTML =
              response.content.name;
            this.dataList = response.content;
            this.$nextTick(() => {
              let url = window.location.href.replace(/#/, "share");
              let _this = this;
              _this.$wechat.ready(() => {
                _this.$wechat.onMenuShareAppMessage({
                  title: "《" + _this.dataList.name + "》", // 分享标题
                  desc:
                    "每一个有梦想的电气行业人都在这里。专注电气人才培养，分享行业实战干货，洞察电气行业趋势。", // 分享描述
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
          } else if (response.status === 403) {
            this.noData = true;
          } else {
            window.alert(response.msg);
          }
        },
        response => {
          window.alert("网络原因，请稍后重试");
        }
      );
  },
  mounted() {
    let _this = this;
    let url = window.location.href.replace(/#/, "share");
    this.$wechat.ready(() => {
      this.$wechat.onMenuShareAppMessage({
        title:
          "《" + _this.dataList.name + "》|" + _this.dataList.teacher + "解读", // 分享标题
        desc: _this.dataList.abstract, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "", // 分享图标
        type: "link", // 分享类型,music、video或link，不填默认为link
        dataUrl: "" // 如果type是music或video，则要提供数据链接，默认为空
      });
    });
  }
};
</script>

<style lang = "less" scoped>
#vux_view_box_body {
  padding-bottom: 0;
}
.offlineDetail {
  background: #ffffff;
  font-size: 0;
  .classMsg {
    padding: 9px 0 6px 27px;
    color: #999999;
    font-size: 13px;
    p {
      line-height: 28px;
    }
  }
  .classDesc {
    color: #666666;
    font-size: 14px;
    line-height: 24px;
    padding: 8px 16px 50px;
  }
  .offlineDetail-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    font-size: 16px;
    a {
      flex: 1;
      text-align: center;
      background: #f48618;
      line-height: 50px;
      color: #ffffff;
    }
    button {
      flex: 1.5;
      background: #3d8afe;
      line-height: 50px;
      color: #ffffff;
    }
  }
  .fade-background {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    background-color: rgba(40, 38, 38, 0.3);
  }
  .fadeWrapper {
    width: 290px;
    height: 290px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -145px;
    margin-left: -145px;
    z-index: 501;
    padding: 10px 0 0;
    background: #ffffff;
    box-sizing: border-box;
    border-radius: 10px;
    h3 {
      font-size: 16px;
      text-align: center;
      line-height: 36px;
    }
    .cellWrapper {
      padding: 0 14px;
      .name,
      .phone,
      .message {
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #cccccc;
      }
    }
    .btngroup {
      margin-top: 35px;
      button {
        display: block;
        width: 100%;
        height: 44px;
        font-size: 18px;
        background: #ffffff;
        color: #3d8afe;
        border-top: 1px solid #cccccc;
        &.btn-cancle {
          border-right: 1px solid #cccccc;
          border-radius: 0 0 0 10px;
        }
        &.btn-sure {
          border-radius: 0 0 10px 0;
        }
      }
    }
  }
  .slideWrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 501;
    width: 100%;
    padding: 26px 20px 15px;
    background: #ffffff;
    text-align: center;
    box-sizing: border-box;
    .class-name {
      font-size: 17px;
      line-height: 1em;
      color: #333333;
      font-weight: 700;
    }
    .applyNumber {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      margin: 27px 0;
      .class-price {
        line-height: 1em;
        color: #f48618;
        font-weight: 700;
      }
      .applyCount {
        display: flex;
        justify-content: flex-end;
      }
      .number {
        margin: 0 6px;
      }
      .count {
        padding: 2px 7px;
        &:before {
          border-radius: 10px !important;
          border: 1px solid #dddddd !important;
        }
      }
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
        background: #3d8afe;
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
        background: #dddddd;
        margin: 15px 0 0;
      }
    }
  }
  .slide-enter-to,
  .slide-leave-to {
    transform: translate3d(0, 0, 0);
    transition: all 0.4s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
