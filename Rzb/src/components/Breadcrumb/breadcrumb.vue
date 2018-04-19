<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>{{breadcrumbData.primary_menu}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{breadcrumbData.second_menu}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    props: {
      breadcrumbData: {
        type: Object,
        default () {
          return {
            'link': '',
            'primary_menu': '',
            'second_menu': '',
          }
        }
      }
    }
  }
</script>

<style>
  .el-breadcrumb {
    margin-bottom: 20px;
  }
</style>