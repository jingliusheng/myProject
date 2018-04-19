<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :breadcrumbData='breadcrumbData'></breadcrumb>
    <!-- 申请详情 -->
    <div class="viewBox">
      <el-row type="flex" justify="start" align="middle" class="section">
        <el-col :span="10"><span>昵称：</span>{{PurchasePublishObject.uname}}</el-col>
        <el-col :span="6"><span>手机号码：</span>{{PurchasePublishObject.phone}}</el-col>
        <el-col :span="8"><span>发布时间：</span>{{PurchasePublishObject.createtime}}</el-col>
      </el-row>
      <div class="section">
        <el-row type="flex" justify="start" align="top">
          <el-col style="width:90px">
            <span>发布内容：</span>
          </el-col>
          <el-col>
            {{PurchasePublishObject.content}}
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" align="top">
          <el-col style="width:90px">
            <span>发布类型：</span>
          </el-col>
          <el-col>
            {{PurchasePublishObject.type}}
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" align="middle">
          <el-col style="width:90px">
            <span>回答数：</span>
          </el-col>
          <el-col>
            {{PurchasePublishObject.commentnumber}}
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" align="top">
          <el-col style="width:90px">
            <span>回复图片：</span>
          </el-col>
          <el-col>
            <img v-if="PurchasePublishObject.pics.length" v-for="(item,index) in PurchasePublishObject.pics" :key="index" :src="item.pic" class="thumbImg"  @click="imgview($event)">
            <span v-if="!PurchasePublishObject.pics.length">/</span>
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
      PurchasePublishObject: {
        type: Object
      }
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: '采购通',
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