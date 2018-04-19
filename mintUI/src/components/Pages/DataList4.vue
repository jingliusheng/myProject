<template>
  <div class="dataList4">
    <p v-for="n in 11">{{n}}</p>
  </div>
</template>

<script>
  export default {
    name: 'dataList4',
    mounted() {
      let _self = this;
      setTimeout(() => {
        _self.$indicator.close();
      }, 500)
    }
  }
</script>

<style scoped>
  .dataList4 {
    padding-bottom: 55px;
  }
</style>