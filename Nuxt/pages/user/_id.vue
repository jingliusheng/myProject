<template>
  <div>
    <h1>这是id为{{$route.params.id}}的用户的详情</h1>
    <br>
    <div>
      <nuxt-link :to="{name:'user'}">返回用户列表</nuxt-link>
    </div>
  </div>
</template>