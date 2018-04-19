<template>
  <div class="buy" v-if="showFlag">
    <div class="userInfo">
      <p class="userInfo-name">会员：{{user.phone}}</p>
      <p class="userInfo-level">等级：Lv{{user.level}}</p>
      <p class="userInfo-tips">注册成为幸运会员，尊享会员折扣</p>
    </div>
    <p class="split"></p>
    <h5 class="vux-1px-b">选择贡品</h5>
    <Scroller lock-x ref="scroller" height="-197">
      <ul ref="itemWrapper">
        <li class="buy-item" @click="toggleColor(index)" v-for="(item,index) in tributes" :key="index">
          <span :class="{'active':item.bool}"></span>
          <img :src="'/'+item.picture">
          <div>
            <p>{{item.name}}({{item.level}}级)</p>
            <p class="price">{{item.coin}}修行符&nbsp;&nbsp;法力加持{{item.power}}</p>
          </div> 
        </li>
      </ul>
    </Scroller>
    <p class="split"></p>
    <div class="buy-foot">
      <div>
        <span>一次最多只能选择4种贡品</span>
        <span>有效时间为<span style="color:red">24小时</span></span>
      </div>
      <button class="vux-1px" @click="buyCancle">取消</button>
      <button class="vux-1px" @click="buySure">确定</button>
    </div>
  </div>  
</template>

<script>
import { Scroller } from "vux";
export default {
  props:{
    user:{
      type:Object,
      default: ()=> {
        return {}
      }
    },
    tributes:{
      type:Array,
      default: ()=> {
        return []
      }
    }
  },
  data() {
    return {
      showFlag:false,
      checkArr:[],
      checkLength:0
    };
  },
  components: {
    Scroller
  },
  created(){
    console.log(this.tributes);
  },
  methods: {
    buySure(){
      let checkStr = this.checkArr.join(',');
      if(this.checkLength<=0){
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "请选择贡品"
        });
      }else{
        this.$http.post(this.GLOBAL.BASEURL + "Payment/amount", { tributeids: checkStr }).then(res=>{
          var response = res.body;
          if(response.status == this.GLOBAL.STATUSOBJ.ok){
            this.$router.push({ name: 'pay', params:{
              buddhaId: this.$route.params.id,
              type: 'offer',
              coin:response.content.amount,
              tributeids:checkStr
              }
            });
          }else if(response.status == this.GLOBAL.STATUSOBJ.noLogin){
            this.$router.push({path:'/login'});
          }else{
            this.$vux.toast.show({
              width: "15em",
              type: "text",
              text: response.msg
            });
          }
        },res=>{
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: "网络错误，请稍后重试"
          });
        })
      }
    },
    show(){
      this.showFlag =true;
      this.$nextTick(()=>{
        this.tributes.forEach(item => {
          this.$set(item,'bool',false);
        });
      })
    },
    buyCancle(){
      this.showFlag = false;
    },
    toggleColor(index) {
      if(Number(this.tributes[index].level)>Number(this.user.level)){
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "您的等级暂不能购买该贡品"
        });
        return;
      }
      if(this.tributes[index].bool){
        this.checkLength--;
        for (let i = 0; i < this.checkArr.length; i++) {
          const element = this.checkArr[i];
          if(this.tributes[index].id == element){
            this.checkArr.splice(i,1);
          }
        }
      }else{
        this.checkLength++;
        this.checkArr.push(this.tributes[index].id)
      }
      if(this.checkLength>4){
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "只能选择4种贡品"
        });
        this.checkLength--;
        for (let i = 0; i < this.checkArr.length; i++) {
          const element = this.checkArr[i];
          if(this.tributes[index].id == element){
            this.checkArr.splice(i,1);
          }
        }
        return
      }
      this.tributes[index].bool =  !this.tributes[index].bool;
    }
  }
};
</script>

<style lang="less" scoped>
.buy{
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left:0;
  background: #ffffff;
}
.userInfo {
  padding: 8px 14px 5px;
  line-height: 27px;
  color: #333333;
  .userInfo-tips {
    font-size: 13px;
    color: #999999;
    &:before {
      display: inline-block;
      content: "";
      width: 13px;
      height: 13px;
      background: url("./warn.png") no-repeat 0 0;
      background-size: 100% 100%;
      margin-right: 6px;
    }
  }
}
.split {
  height: 5px;
  background-color: #f5f5f5;
}
h5 {
  padding: 0 14px;
  line-height: 42px;
}
.buy-item {
  padding: 0 14px;
  margin: 13px 0;
  display: flex;
  align-items: center;
  span {
    width: 18px;
    height: 18px;
    border: 2px solid #cccccc;
    border-radius: 50%;
    &.active {
      border-color: #ed6564;
    }
    &.active:after {
      content: "";
      width: 12px;
      height: 12px;
      background-color: #ed6564;
      border-radius: 50%;
      float: left;
      margin: 3px;
    }
  }
  img {
    width: 50px;
    height: 50px;
    margin: 0 15px 0 10px;
  }
  div {
    color: #333333;
    .price {
      color: #999999;
    }
  }
}
.buy-foot {
  width: 100%;
  padding: 4px 0;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  div {
    width: 180px;
    flex: 0 0 180px;
  }
  button {
    padding: 5px 17px;
    background-color: #ffffff;
    &:last-child {
      color: #ffffff;
      background: #ed6564;
    }
  }
}
</style>
