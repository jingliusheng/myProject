<template>
  <div class="detail" v-show="full" ref="abc">
    <flexbox :gutter="0" wrap="wrap" justify="center" class="imgHeader">
      <flexbox-item class="bigImg">
          <img :src="'/'+buddhaInfo.big_pic">
          <div class="lh-tributes">
            <ul class="tributes1">
              <li v-for="(item,index) in level1" :key="index">
                <img :src="'/'+item.picture">
              </li>
            </ul>
            <ul class="tributes2">
              <li v-for="(item,index) in level2" :key="index">
                <img :src="'/'+item.picture">
              </li>
            </ul>
          </div>          
      </flexbox-item>
    </flexbox>

    <flexbox :gutter="0" class="domenu">
      <flexbox-item class="domenuItem" v-show="count" @click.native="pauseCount">
        <img src="./pauseIcon.png" alt="" width="30" height="30">
        <span>暂停</span>
      </flexbox-item>
      <flexbox-item class="domenuItem" v-show="!count" @click.native="startCount">
        <img src="./startIcon.png" alt="" width="30" height="30">
        <span>开始</span>
      </flexbox-item>
      <flexbox-item class="domenuItem">
          <p>{{buddhaInfo.description}}</p>
          <p>{{str}}</p>
      </flexbox-item>
      <flexbox-item class="domenuItem" @click.native="overCount" >
        <img src="./overIcon.png" alt="" width="30" height="30">
        <span>结束</span>
      </flexbox-item>
    </flexbox>
    <x-button class="buyBtn" @click.native="buy">
      <img src="./heart_app.png" width="21" height="21">
      购买贡品
    </x-button>
    <transition name="fade">
      <Buy :user="userInfo" :tributes="tributes" ref="buy"></Buy> 
    </transition>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton } from "vux";
import Buy from '../Buy/buy';
export default {
  data() {
    return {
      buddhaId: this.$route.params.id,
      buddhaInfo:{},
      level1:[],
      level2:[],
      tributes:[],
      userInfo:{},
      count: false,
      full:false,
      isCouont: false, //是否计时的标志
      str: "00:00:00", //时间字符串
      HH: 0, //时
      mm: 0, //分
      ss: 0 //秒
    };
  },
  methods: {
    startCount() {
      this.count = true;
      this.isCouont = true;
      this.timer(); //启动倒计时
    },
    pauseCount() {
      this.count = false;
      this.isCouont = false;
    },
    overCount() {
      this.str = "00:00:00";
      this.isCouont = false;
      this.count = false;
      this.$router.push({ name: 'tribute', params:{buddha:this.buddhaInfo }});
    },
    buy() {
      /*
      登录才可购买
      */
      if(!this.userInfo){
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          time: "1000",
          text: "请先登录"
        });
        setTimeout(()=>{
          this.$router.push({path:'/login'})
        },1000)
      }else{
        this.$refs.buy.show();
      }
    },
    timer() {
      if (this.isCouont) {
        this.str = "";
        if (++this.ss == 60) {
          if (++this.mm == 60) {
            this.HH++;
            this.mm = 0;
          }
          this.ss = 0;
        }

        this.str += this.HH < 10 ? "0" + this.HH : this.HH;
        this.str += ":";
        this.str += this.mm < 10 ? "0" + this.mm : this.mm;
        this.str += ":";
        this.str += this.ss < 10 ? "0" + this.ss : this.ss;
        setTimeout(this.timer, 1000);
      }
    },
    /**
    * 处理贡品
    */
    tribute(tributes){
      var _this = this;
      if(!tributes){
        return false;
      }
      for (var i in tributes) {
        if(tributes[i].col == '1'){
          _this.level1.push(tributes[i]);
        }else{
          _this.level2.push(tributes[i]);
        }
      }
    }
  },
  created() {
    this.userInfo = JSON.parse( sessionStorage.getItem('user') );
    this.$http
      .post(this.GLOBAL.BASEURL + "Luck/buddha", { id: this.buddhaId })
      .then(
        res => {
          var response = res.body;
          if(response.status == this.GLOBAL.STATUSOBJ.ok){
            this.buddhaInfo = response.content.buddha;
            this.tributes = response.content.tributes;
            this.tribute(response.content.purchasedTributes);
            document.getElementsByTagName("title")[0].innerText = "幸运之家--"+response.content.buddha.name;
            this.full = true;
          }else{
            this.$vux.toast.show({
              width: "15em",
              type: "text",
              text: response.msg
            });
          }
        },
        res => {
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: "网络错误，请稍后重试"
          });
        }
      );
    
  },
  // mounted(){
  //   setTimeout(()=>{
  //     var contentHeight = $("#app").height();
  //     var viewHeight = $("body").height();
  //     if(contentHeight>viewHeight){
  //       var per = Math.floor((viewHeight/contentHeight)*100-8);
  //       $(".detail").css('width',per+'%');
  //     }
  //   },200)
  // },
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    Buy
  }
};
</script>

<style lang="less" scoped>
.detail {
  margin: 0 auto;
  margin-bottom: -50px;
  padding-bottom: 20px;
  transition: all 0.3s;
}
.imgHeader {
  background-color: #f5f5f5;
  .bigImg {
    position: relative;
    text-align: center;
    .lh-tributes{
      width: 100%;
      position: absolute;
      left:0;
      bottom: 0;
      background: rgba(0,0,0,.5);
      ul{
        display: flex;
        justify-content: space-around;
        overflow: hidden;
        li{
          display: flex;
          box-sizing: border-box;
          img{
            height: 80px;
          }
        }
        &.tributes2{
          min-height: 40px;
          margin-top: -40px;
        }
      }
    }
    &>img {
      width: 80%;
      height: calc(~"100vh - 200px");
      margin: 10px 0;
    }
  }
}
.domenu {
  padding: 20px 0;
  .domenuItem {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    text-align: center;
    &:nth-of-type(3) {
      flex: 3;
      justify-content: center;
    }
  }
}
.buyBtn {
  width: 140px;
  height: 35px;
  font-size: 15px;
  color: #fff !important;
  background-color: #ed6564 !important;
  // border-radius: 6px !important;
  img {
    vertical-align: sub;
    margin-right: 5px;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
</style>
