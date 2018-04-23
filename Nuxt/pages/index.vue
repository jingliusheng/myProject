<template>
  <div>
    <ul>
      <!-- <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/news">News</a></li> -->
      <li><nuxt-link :to="{name:'index'}">Home</nuxt-link></li>
      <li><nuxt-link :to="{name:'about'}">About</nuxt-link></li>
      <li><nuxt-link :to="{path:'/user'}">User</nuxt-link></li>
      <li><nuxt-link :to="{name:'news',params:{newsId:1}}">News   第一种方式路由传参，直接在params中定义</nuxt-link></li>
      <li><nuxt-link :to="{name:'news-id',params:{id:1000}}">News-Id 第二种路由传参，定义对应的子视图文件。个人认为该模式适用新闻详情、任务详情等等详情页</nuxt-link></li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style></style>