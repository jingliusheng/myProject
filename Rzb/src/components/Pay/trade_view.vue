<template>
    <div class="trade_view">
        <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
        <div class="work_info">
            <el-row class="section" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="10">
                    <el-row type="flex">
                        <el-col :span="6.5" class="work_info_title minWidth6">昵称：</el-col>
                        <el-col :span="17.5">{{dataList.uname}}</el-col>
                    </el-row>
                </el-col>
                <el-col :md="24" :lg="7">
                    <el-row type="flex">
                        <el-col :span="8.5" class="work_info_title minWidth5">用户手机号：</el-col>
                        <el-col :span="15.5">{{dataList.phone}}</el-col>
                    </el-row>
                </el-col>
                <el-col :md="24" :lg="7">
                    <el-row type="flex">
                        <el-col :span="8.5" class="work_info_title minWidth4">交易时间：</el-col>
                        <el-col :span="15.5">{{dataList.createtime}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="section" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="7">
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">交易身份：</el-col>
                        <el-col :span="10">{{dataList.role}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">交易类型：</el-col>
                        <el-col :span="10">{{dataList.type}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">交易方式：</el-col>
                        <el-col :span="10">{{dataList.way}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">金额：</el-col>
                        <el-col :span="10">{{dataList.money}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="operateArea" type="flex" justify="start" align="middle">
                <el-button style="margin: 10px" type="primary" @click="back()">返回</el-button>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../assets/js/eventBus';
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    components: {
      breadcrumb
    },
    data() {
      return {
        breadcrumbData: {
          link: '/RZB_pay_list',
          primary_menu: '交易管理',
          second_menu: '交易详情'
        },
        dataList: []
      }
    },
    methods: {
      back() {
        this.$router.go(-1);
      },

    },
    created() {
      this.$http.post(this.root + '/Trade/trade_view', {
        id: this.$route.params.id
      }).then(response => {
        var res = response.body
        if (res.status == 200) {
          this.dataList = res.content.list;
        } else {
          this.$message.error(res.msg);
        }
      }, response => {
        this.$message.error('网络原因');
      })
    }
  }
</script>

<style scoped>
  .work_info {
    border: 1px solid #666666;
    width: 80%;
    font-size: 14px;
  }
  
  .section {
    border-bottom: 1px dashed #666666;
    padding: 0 15px;
    flex-wrap: wrap;
  }
  
  .el-col {
    margin: 5px 0;
  }
  
  .work_info_title {
    font-weight: bold;
  }
  
  .operateArea {
    padding: 0 15px;
  }
</style>