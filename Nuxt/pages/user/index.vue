<template>
  <div>
    <ul>
      <li>
        <nuxt-link :to="{name:'user-id',params:{id:1}}">User   One</nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{name:'user-id',params:{id:2}}">User   Two</nuxt-link>
      </li>
      <li>
        <nuxt-link :to="{name:'user-id',params:{id:3}}">User   Three</nuxt-link>
      </li>
    </ul>
  </div>
</template>