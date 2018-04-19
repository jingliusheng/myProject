<template>
  <div>
      <h1>上拉加载、下拉刷新</h1>
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill=false  :bottom-all-loaded="allLoaded" ref="loadmore">
          <mt-cell 
          :title="'标题'+index"
          label="备注信息，显示在标题下方"
          value="内容"
          icon="more"
          v-for="(index,item) in list"
          :key="index">
        </mt-cell>
      </mt-loadmore>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'pull',
    data() {
      return {
        allLoaded: false,
        list: [],
        wrapperHeight: 0
      }
    },
    mounted() {
      // console.log('mounted');
      let _self = this;
      setTimeout(() => {
        _self.$indicator.close();
      }, 500)
      for (let i = 1; i <= 20; i++) {
        this.list.push(i);
      }
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 65;
    },
    methods: {
      // 下拉刷新
      loadTop() {
        // 进行ajax请求
        setTimeout(() => {
          let lastValue = this.list[0];
          if (lastValue > -10) {
            for (let i = 1; i <= 10; i++) {
              this.list.unshift(lastValue - i);
            }
          } else {
            this.allLoaded = true;
          }
          this.$refs.loadmore.onTopLoaded();
        }, 1500);
      },
      // 上拉加载
      loadBottom() {
        setTimeout(() => {
          let lastValue = this.list[this.list.length - 1];
          // console.log(lastValue);
          if (lastValue < 30) {
            for (let i = 1; i <= 10; i++) {
              this.list.push(lastValue + i);
            }
          } else {
            this.allLoaded = true;
          }
          this.$refs.loadmore.onBottomLoaded();
        }, 1500);

      }
    }
  }
</script>

<style scoped>
  .mint-loadmore {
    padding-bottom: 55px;
  }
</style>