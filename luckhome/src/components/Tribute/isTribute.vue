<template>
  <div class="istribute">
    <div class="goods">
      <p class="goods-tips">上贡好处：</p>
      <p class="goods-descr">{{buddhaInfo.benefit}}</p>
    </div>
    <p class="split"></p>
    <div class="imgWrapper">
      <img src="./mohu.png" width="120" height="363" v-show="!isTribute">
      <img src="./qingxi.png" width="120" height="363" v-show="isTribute">
    </div>
    <flexbox>
      <flexbox-item>
        <x-button class="btn" @click.native="tributeSure">上贡</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button class="btn" link="BACK">不上贡</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem } from "vux";
export default {
  data() {
    return {
      buddhaInfo: this.$route.params.buddha,
      isTribute:false
    };
  },
  components: {
    XButton,
    Flexbox,
    FlexboxItem
  },
  methods:{
    tributeSure(){
      var userInfo = sessionStorage.getItem('user');
      if(!userInfo){
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
        this.$router.push({ name: 'pay', params:{buddhaId: this.buddhaInfo.id,type: 'reward',coin:''}});
      }
    }
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "是否上贡";
    this.$http
      .post(this.GLOBAL.BASEURL + "Luck/remove_layer", {
        buddha_id: this.buddhaInfo.id
      })
      .then(res => {
        var response = res.body;
        if(response.status == this.GLOBAL.STATUSOBJ.ok){
         this.isTribute = true;
        }else{
          this.isTribute = false;
        }
      }, res => {
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "网络错误，请稍后重试"
        });
      });
  }
};
</script>


<style lang="less" scoped>
.goods {
  padding: 4px 14px 15px;
  font-size: 14px;
  .goods-tips {
    color: #333333;
    line-height: 35px;
  }
  .goods-descr {
    color: #999999;
    line-height: 20px;
  }
}
.split {
  height: 10px;
  background-color: #f5f5f5;
}
.imgWrapper {
  display: flex;
  justify-content: center;
  padding-top: 26px;
}
.vux-flexbox {
  position: fixed;
  bottom: 16px;
  .btn {
    width: 130px;
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    color: #ffffff;
    background-color: #ed6564;
    border-radius: 5px;
  }
}
</style>
