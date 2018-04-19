<template>
<div>
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div  style="width: 80%;border:1px solid #000">
        <el-row type="flex" justify="start" align="middle" class="section" style="margin-top: 10px">
            <div>
                <span style="font-weight:bold;">头像:</span>
                <el-col>
                <img :src="searchData.avatar" @click="imgview($event)" style="border-radius:50%;width: 80px;height: 80px;overflow: hidden">
                </el-col>
            </div>
           <div>
                <el-col :span="8"  style="margin-bottom: 10px"><span style="font-weight:bold;">昵称：</span><span>{{searchData.uname}}</span></el-col>
                <el-col :span="8"  style="margin-bottom: 10px"><span style="font-weight:bold;">用户手机号：</span><span>{{searchData.phone}}</span></el-col>
                <el-col :span="8"  style="margin-bottom: 10px"><span style="font-weight:bold;">注册时间：</span><span>{{searchData.regtime}}</span></el-col>
                <el-col :span="8" >
                    <span style="font-weight:bold;">服务地区：</span>
                    <span v-if="searchData.province===null">
                        /
                    </span>
                    <span v-else>
                        {{searchData.province}}{{searchData.city}}
                    </span>
                </el-col>
                <el-col :span="8"><span style="font-weight:bold;">发单认证：</span><span>{{searchData.fstatus_name}}</span></el-col>
                <el-col :span="8"><span style="font-weight:bold;">接单认证：</span><span>{{searchData.jstatus_name}}</span></el-col>
           </div>
        </el-row>
        <el-row type="flex" justify="start" align="middle" style="margin-top: 10px" v-if="searchData.fstatus_name!='未认证'" class="section">
          <div>
           <span style="font-weight:bold;">营业执照：</span>
            <el-col>
             <img :src="searchData.license" @click="imgview($event)" width="80">
            </el-col>
          </div>
          <div>
            <el-col :span="14"  style="margin-bottom: 10px"><span style="font-weight:bold;">发单企业名称:</span><span>{{searchData.company}}</span></el-col>
            <el-col :span="10"  style="margin-bottom: 10px"><span style="font-weight:bold;">联系人：</span><span>{{searchData.contact}}</span></el-col>
            <el-col :span="14"><span style="font-weight:bold;">联系电话:</span><span>{{searchData.dphone}}</span></el-col>
            <el-col :span="10">
                <span  style="font-weight:bold;">认证通过:</span>
                <span v-if="searchData.fstatus_name!=='已认证'">/</span>
                <span v-else>{{searchData.fchecktime}}</span>
            </el-col>
          </div>
            <hr/>
        </el-row>


        <el-row type="flex" justify="start" align="middle" style="margin-top: 10px" v-if="searchData.jstatus_name!='未认证'" class="section">
           <div>
            <span style="font-weight:bold;">身份证照片：</span>
            <el-col>
            <img :src="searchData.identitypicture" @click="imgview($event)" width="100">
            </el-col>
            </div>
            <div>
                <el-col :span="14"  style="margin-bottom: 10px"><span style="font-weight:bold;">接单姓名:</span><span>{{searchData.name}}</span></el-col>
                <el-col :span="10"  style="margin-bottom: 10px"><span style="font-weight:bold;">身份证号：</span><span>{{searchData.identitynumber}}</span></el-col>
                <el-col :span="14"><span style="font-weight:bold;">接单类型:</span><span>{{searchData.taskcategory}}</span></el-col>
                <el-col :span="10"><span style="font-weight:bold;">认证通过:</span>
                    <span v-if="searchData.jstatus_name!=='已认证'">/</span>
                    <span v-else>{{searchData.jchecktime}}</span>
                </el-col>
            </div>
            <hr/>
        </el-row>
        <el-table
                :data="tableData4"
                stripe
                show-header
                header-row-class-name = 'headerRow'
                style="width: 100%">
            <el-table-column
                    prop="operatorname"
                    label="操作者"
                    align="center"
                    fixed>
            </el-table-column>
            <el-table-column
                    prop="operation"
                    label="操作"
                    align="center"
                    fixed>
            </el-table-column>
            <el-table-column
                    prop="createtime"
                    label="操作时间"
                    align="center"
                    fixed>
            </el-table-column>
            <el-table-column
                    prop="remarks"
                    label="原因"
                    align="center"
                    :formatter="formatter"
                    fixed>
            </el-table-column>
            </el-table>
        <el-button style="margin:10px " type="primary" @click="back()">返回</el-button>
    </div>
    <el-dialog title="图片查看" :visible.sync="dialogImg" width="30%">
        <img :src="imgsrc" width="100%">
    </el-dialog>
</div>
</template>
<script type="text/ecmascript-6">
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    components: {
      breadcrumb
    },
    data() {
      return {
        breadcrumbData: {
          link: '/RZB_member_list',
          primary_menu: '用户管理',
          second_menu: '会员详情',
        },
        searchData: [],
        tableData4: [],
        dialogImg: false,
        imgsrc: ''
      }
    },
    methods: {
      imgview(e) {
        this.imgsrc = e.target.getAttribute('src');
        this.dialogImg = true;
      },
      formatter(column) {
        return column.remarks ? column.remarks : '//';
      },
      back() {
        this.$router.go(-1);
      },
      getList() {
        this.$http.post(this.root + '/Member/member_view', {
          id: this.$route.params.id
        }).then(response => {
          var res = response.body;
          if (res.status == 200) {
            this.searchData = res.content.list;
            this.tableData4 = res.content.list1;
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      },
    },
    created() {
      this.getList()
    }
  }
</script>

<style scoped>
  .section {
    border-bottom: 1px dashed #666666;
    padding: 0 15px;
  }
</style>