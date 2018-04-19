<template>
  <div class="dataList">
    <h2>列表</h2>
    <mt-cell title="标题文字"></mt-cell>
    <mt-cell title="标题文字" value="说明文字"></mt-cell>
    <mt-cell title="标题文字" icon="more" value="带 icon"></mt-cell>
    <mt-cell title="标题文字" icon="more">
      <span>icon 是图片</span>
      <img slot="icon" src="../../assets/logo.png" width="24" height="24">
    </mt-cell>
    <mt-cell title="标题文字" is-link value="带链接"></mt-cell>
    <mt-cell title="标题文字" is-link>
      <span style="color: green">这里是元素</span>
    </mt-cell>
    <mt-cell title="标题文字">
      <mt-button size="small" type="primary" icon="back">按钮</mt-button>
    </mt-cell>
    <mt-cell title="标题" label="描述信息" is-link></mt-cell>
    <mt-cell title="原生跳转" label="跳转到 https://mint-ui.github.io" is-link to="https://mint-ui.github.io"></mt-cell>
    <h2>搜索</h2>
    <p>基础用法</p>
    <mt-search v-model="value"></mt-search>
    <p>设置显示文字</p>
    <mt-search
      v-model="value"
      cancel-text="取消"
      placeholder="搜索">
    </mt-search>
    <p>带搜索结果</p>
    <mt-search v-model="value" :result.sync="result"></mt-search>
  </div>
</template>

<script>
  export default {
    name: 'dataList',
    data() {
      return {
        value: '',
        result: []
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
  
  .mint-search {
    height: 100%;
  }
</style>