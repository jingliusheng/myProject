<template>
    <div>
      <!-- 面包屑 -->
      <breadcrumb :breadcrumbData='breadcrumbData'></breadcrumb>
      <!-- 申请详情 -->
      <div class="viewBox">
        <el-row type="flex" justify="start" align="middle" class="section">
          <el-col :span="15"><span>回复人昵称：</span>{{AgentReplyObject.uname}}</el-col>
          <el-col :span="9"><span>回复时间：</span>{{AgentReplyObject.createtime}}</el-col>
        </el-row>
        <div class="section">
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:90px">
              <span>发布标题：</span>
            </el-col>
            <el-col>
                {{AgentReplyObject.title}}
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:90px">
              <span>回复内容：</span>
            </el-col>
            <el-col>
              {{AgentReplyObject.content?AgentReplyObject.content:'/'}}
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:90px">
              <span>回复图片：</span>
            </el-col>
            <el-col>
              <img v-if="AgentReplyObject.picture.length" v-for="(item,index) in AgentReplyObject.picture" :key="index" :src="item.pic" class="thumbImg"  @click="imgview($event)">
              <span v-if="!AgentReplyObject.picture.length">/</span>
            </el-col>
          </el-row>
        </div>
        <el-button type='primary' class="btn-hook" @click.native="goback">返回</el-button>
      </div>
      
      <!-- 查看图片 -->
      <el-dialog title="图片查看" :visible.sync="dialogImg">
        <img :src="imgsrc" width="100%">
      </el-dialog>
    </div>
  </template>

<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    name: 'PurchasePubView',
    props: {
      AgentReplyObject: {
        type: Object
      }
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: '代理吧',
          second_menu: '回复列表',
          third_menu: '回复详情'
        },
        dialogImg: false,
        imgsrc: ''
      }
    },
    components: {
      breadcrumb
    },
    methods: {
      imgview(e) {
        this.imgsrc = e.target.getAttribute('src');
        this.dialogImg = true
      },
      goback() {
        this.$emit('handleBack', this.tempbanner);
      }
    },

  }
</script>

<style scoped></style>