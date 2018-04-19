<template>
    <div class="certification_view">
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
                        <el-col :span="8.5" class="work_info_title minWidth4">提交时间：</el-col>
                        <el-col :span="15.5">{{dataList.createtime}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="section" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="24">
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">需求标题：</el-col>
                        <el-col :span="10">{{dataList.title}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">详细描述：</el-col>
                        <el-col :span="20">{{dataList.description}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">处理状态：</el-col>
                        <el-col :span="14">{{dataList.status_name}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="section" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="24">
                    <el-col :md="24" :lg="24" v-if="dataList.is_dealt==='0'">
                        <span style="font-weight:bold;">处理记录：</span>
                        <el-input
                                style="width: 30%"
                                autosize
                                type="textarea"
                                placeholder="请输入处理结果"
                                v-model="subList.remarks">
                        </el-input>
                    </el-col>
                    <el-col :md="24" :lg="24" v-else>
                        <span style="font-weight:bold;">处理记录：</span>{{dataList.remarks}}
                    </el-col>
                </el-col>
            </el-row>
            <el-row class="operateArea" type="flex" justify="start" align="middle">
                <div style="margin: 10px">
                    <el-button v-if="dataList.is_dealt==='0'" type="primary" @click="submit()">处理</el-button>
                    <el-button type="primary" @click="back()">返回</el-button>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default{
    components: {
      breadcrumb
    },
    data(){
      return{
        breadcrumbData:{
          link:'/RZB_work_all',
          primary_menu:'任务管理',
          second_menu:'产品认证详情'
        },
        dataList:{
          phone:'',
          uname:'',
          remarks:'',
          createtime:'',
          status_name:'',
          content:'',
          is_dealt:'',
        },
        subList:{
          id:this.$route.params.id,
          remarks:''
        }
      }
    },
    methods: {
      back() {
        this.subList.remarks='';
        this.$router.push({path:'/RZB_product_certification'})
      },
      submit(){
        if(this.subList.remarks===''){
          this.$alert('请输入处理记录', '提示', {
            confirmButtonText: '确定'
          });
        }else{
          this.$confirm('确定提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post(this.root + '/Work/product_check',this.subList).then(response=>{
              var res = response.body;
              if(res.status == 200){
                this.$message.success(res.msg);
                setTimeout(() => {
                  this.$router.push({
                    path: '/RZB_product_certification'
                  })
                }, 1000)
              }else{
                this.$message.error(res.msg);
              }
            },response=>{
              this.$message.error('网络原因');
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      }
    },
    created(){
      this.$http.post(this.root+'/Work/product_view',{id:this.$route.params.id}).then(response=>{
        var res = response.body;
        if(res.status == 200){
          this.dataList = res.content;
        }else{
          this.$message.error(res.msg);
        }
      },response=>{
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