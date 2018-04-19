<template>
  <div class="index" v-show="showFlag">
    <flexbox :gutter="0" wrap="wrap" align="flex-start" style="margin-top:44px;">
      <flexbox-item v-for="item in items" :key="item.id" :span="6">
        <router-link :to="'/index/'+item.id" class="lh-item">
          <img :src="'/'+item.home_pic">
          <span>{{item.description}}</span>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/salvate" class="lh-item">
          <img :src="'/'+lastItem.home_pic">
          <span>{{lastItem.description}}</span>
        </router-link>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>

import { Flexbox, FlexboxItem } from "vux";
export default {
  data() {
    return {
      items:[],
      lastItem:{},
      showFlag:false
    };
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "幸运之家--首页";
    this.$http
    .get(this.GLOBAL.BASEURL + "Luck/index")
    .then(res => {
      var response = res.body;
      if(response.status == this.GLOBAL.STATUSOBJ.ok){
        this.items = response.content;
        this.lastItem = this.items.pop();
        this.items = this.items;
        this.showFlag = true;
      }else{
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: response.msg
        });
      }
    }, res => {
      this.$vux.toast.show({
        width: "15em",
        type: "text",
        text: "网络错误，请稍后重试"
      });
    });
  },
  components: {
    Flexbox,
    FlexboxItem
  }
};
</script>

<style lang="less" scoped>
.index{padding-bottom: 44px;}
.lh-item {
  padding: 10px;
  &>img {
    width: 100%;
    height: 240px;
  }
}
</style>
