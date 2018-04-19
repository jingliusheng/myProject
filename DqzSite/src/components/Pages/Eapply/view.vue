<template>
    <div>
      <!-- 面包屑 -->
      <breadcrumb :breadcrumbData='breadcrumbData'></breadcrumb>
      <!-- 申请详情 -->
      <div class="viewBox">
        <el-row type="flex" justify="start" align="middle" class="section">
          <el-col :span="10"><span>活动名称：</span>{{applyObject.title}}</el-col>
          <el-col :span="6"><span>活动类型：</span>{{applyObject.type}}</el-col>
          <el-col :span="8"><span>报名时间：</span>{{applyObject.createtime}}</el-col>
        </el-row>
        <el-row class="section">
          <el-col><span>单位名称：</span>{{applyObject.company}}</el-col>
          <el-col><span>联系方式：</span>{{applyObject.phone}}</el-col>
          <el-col><span>联系人：</span>{{applyObject.name}}</el-col>
          <el-col><span>备注：</span>{{applyObject.remarks?applyObject.remarks:'暂无备注'}}</el-col>
          <el-col><span>城市：</span>{{applyObject.city}}</el-col>
        </el-row>
        <el-button type='primary' class="btn-hook" @click.native="goback">返回</el-button>
      </div>
    </div>
</template>

<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    name: 'applyView',
    props: {
      applyObject: {
        type: Object
      }
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: 'E企会',
          second_menu: '报名申请列表',
          third_menu: '报名申请详情'
        },
      }
    },
    components: {
      breadcrumb
    },
    methods: {
      goback() {
        this.$emit('handleBack');
      }
    },

  }
</script>

<style scoped></style>