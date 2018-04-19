<template>
    <div>
      <!-- 面包屑 -->
      <breadcrumb :breadcrumbData='breadcrumbData'></breadcrumb>
      <!-- 申请详情 -->
      <div class="viewBox">
        <el-row type="flex" justify="start" align="middle" class="section">
          <el-col :span="10"><span>企业名称：</span>{{AgentPublishObject.ename}}</el-col>
          <el-col :span="6"><span>手机号码：</span>{{AgentPublishObject.phone}}</el-col>
          <el-col :span="8"><span>发布时间：</span>{{AgentPublishObject.createtime}}</el-col>
        </el-row>
        <div class="section">
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:55px">
              <span>标题：</span>
            </el-col>
            <el-col>
              {{AgentPublishObject.title}}
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:90px">
              <span>产品类型：</span>
            </el-col>
            <el-col>
              {{AgentPublishObject.name}}
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:115px">
              <span>可代理产品：</span>
            </el-col>
            <el-col>
              <div v-if="AgentPublishObject.product || AgentPublishObject.picture">
                {{AgentPublishObject.product}}
                <p v-if="AgentPublishObject.picture.length">
                    <img v-for="(item,index) in AgentPublishObject.picture" :key="index" :src="item.pic" class="thumbImg"  @click="imgview($event)">
                </p>
              </div>
              <span v-else>/</span>
              
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="top">
            <el-col style="width:125px">
              <span>佣金结算政策：</span>
            </el-col>
            <el-col>
              {{AgentPublishObject.commission}}
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
    name: 'AgentPubView',
    props: {
      AgentPublishObject: {
        type: Object
      }
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: '代理吧',
          second_menu: '发布列表',
          third_menu: '发布详情'
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