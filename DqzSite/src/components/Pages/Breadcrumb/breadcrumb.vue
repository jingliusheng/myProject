<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item>{{breadcrumbData.primary_menu}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{breadcrumbData.second_menu}}</el-breadcrumb-item>
    <el-breadcrumb-item v-if="breadcrumbData.third_menu">{{breadcrumbData.third_menu}}</el-breadcrumb-item>
  </el-breadcrumb>
  
</template>

<script>
  export default {
    props: {
      breadcrumbData: {
        type: Object,
        default () {
          return {
            'primary_menu': '',
            'second_menu': '',
            'third_menu': ''
          }
        }
      }
    }
  }
</script>

<style scoped>
  .el-breadcrumb {
    margin-bottom: 20px;
    font-size: 16px;
  }
</style>