<template>
  <div>
    <p>{{$route.params.id}}</p>
    <nuxt-link :to="{name:'index'}">Home</nuxt-link>
  </div>
</template>