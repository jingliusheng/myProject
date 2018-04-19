<template>
  <div class="dataList">
    <mt-cell-swipe
    title="标题"
    label="右滑动删除"
    :right="[
      {
        content: 'HTML 或者纯文本',
        style: { background: 'grey', color: '#fff' },
        handler: () => $messagebox.alert('mark')
      },
      {
        content: 'Delete',
        style: { background: 'red', color: '#fff' },
        handler: () => $messagebox.confirm('delete'),
      }
    ]"></mt-cell-swipe>
    <h4>swiper</h4>
    <p>基础用法</p>
    <mt-swipe :auto="1500">
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
    <p>隐藏 indicators</p>
    <mt-swipe :show-indicators="false">
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
    <p>取消自动播放</p>
    <mt-swipe :auto="0">
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
    <p>defaultIndex</p>
    <mt-swipe :defaultIndex="1">
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
    <p>左右滑动</p>
    <div class="nav">
      <mt-button size="small" @click.native.prevent="active = 'tab-container1'">tab 1</mt-button>
      <mt-button size="small" @click.native.prevent="active = 'tab-container2'">tab 2</mt-button>
      <mt-button size="small" @click.native.prevent="active = 'tab-container3'">tab 3</mt-button>
    </div>
    <div class="page-tab-container">
      <mt-tab-container class="page-tabbar-tab-container" v-model="active" swipeable>
        <mt-tab-container-item id="tab-container1">
          <mt-cell v-for="(index,n) in 5" :key="index" title="tab-container 1"></mt-cell>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container2">
          <mt-cell v-for="(index,n) in 5" :key="index" title="tab-container 2"></mt-cell>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container3">
          <mt-cell v-for="(index,n) in 5" :key="index" title="tab-container 3"></mt-cell>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'swiper',
    data() {
      return {
        active: 'tab-container1'
      }
    },
    mounted() {
      // console.log('mounted');
      let _self = this;
      setTimeout(() => {
        _self.$indicator.close();
      }, 500)
    }
  }
</script>

<style scoped>
  .dataList {
    padding-bottom: 55px;
  }
  
  .mint-swipe {
    height: 100px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .mint-swipe-item {
    line-height: 100px;
    background: palegreen;
  }
</style>