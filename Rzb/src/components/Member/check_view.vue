<template>
  <div>
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
      <div class="work_info">
          <el-row class="section" type="flex" justify="start" align="middle">
              <el-col :md="24" :lg="10">
                  <el-row type="flex">
                      <el-col :span="6.5" class="work_info_title minWidth6">昵称：</el-col>
                      <el-col :span="17.5">{{searchData.uname}}</el-col>
                  </el-row>
              </el-col>
              <el-col :md="24" :lg="7">
                  <el-row type="flex">
                      <el-col :span="8.5" class="work_info_title minWidth5">用户手机号：</el-col>
                      <el-col :span="15.5">{{searchData.phone}}</el-col>
                  </el-row>
              </el-col>
              <el-col :md="24" :lg="7">
                  <el-row type="flex">
                      <el-col :span="8.5" class="work_info_title minWidth4">申请时间：</el-col>
                      <el-col :span="15.5">{{searchData.createtime}}</el-col>
                  </el-row>
              </el-col>
          </el-row>
          <el-row class="section" type="flex" justify="start" align="middle">
              <el-col :md="24" :lg="24" v-if="searchData.type===1">
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">认证类型：</el-col>
                      <el-col :span="10">发单认证</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">认证名称：</el-col>
                      <el-col :span="20">{{searchData.company}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">联系人：</el-col>
                      <el-col :span="10">{{searchData.contact}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">联系电话：</el-col>
                      <el-col :span="10">{{searchData.rphone}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">营业执照：</el-col>
                      <el-col :span="10"><img :src="searchData.license" width="80" @click="imgview($event)"></el-col>
                  </el-row>
              </el-col>
              <el-col :md="24" :lg="24" v-else-if="searchData.type===2">
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">认证类型：</el-col>
                      <el-col :span="10">接单认证</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">认证名称：</el-col>
                      <el-col :span="20">{{searchData.name}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">身份证号：</el-col>
                      <el-col :span="10">{{searchData.identitynumber}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">服务地区：</el-col>
                      <el-col :span="10">{{searchData.province}}{{searchData.city}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">接单类型：</el-col>
                      <el-col :span="20">{{searchData.taskcategory}}</el-col>
                  </el-row>
                  <el-row type="flex">
                      <el-col :span="1.5" class="work_info_title minWidth4">身份证照片：</el-col>
                      <el-col :span="10">
                          <img :src="searchData.identitypicture" width="200"  @click="imgview($event)">
                      </el-col>
                  </el-row>
              </el-col>
          </el-row>
          <el-row class="operateArea" type="flex" justify="start" align="middle">
              <el-col :md="24" :lg="24">
                  <span style="font-weight:bold;">审核状态：</span>
                  <el-select  size="small" v-model="submitData.status" placeholder="请选择">
                      <el-option
                              v-for="item in options1"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>
                  <div v-if="submitData.status==='3'" style="margin-top: 10px;">
                      <span style="font-weight:bold;">不通过原因：</span>
                      <el-autocomplete
                              style="width: 300px"
                        size="small"
                          class="inline-input"
                          v-model="submitData.remarks"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入内容"
                          @select="handleSelect"
                      >
                      </el-autocomplete>
                  </div>
                  <div  style="margin-top: 10px;">
                      <el-button type="primary" @click="submit()">提交</el-button>
                      <el-button type="primary" @click="back()">返回</el-button>
                  </div>
              </el-col>
          </el-row>
          <el-dialog title="图片查看" :visible.sync="dialogImg" width="30%">
              <img :src="imgsrc" width="100%">
          </el-dialog>
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
          link: '/RZB_member_list',
          primary_menu: '用户管理',
          second_menu: '待审核详情'
        },
        options1: [{
          value: '2',
          label: '审核通过'
        }, {
          value: '3',
          label: '审核不通过'
        }],
        value: '',
        searchData: [],
        submitData: {
          id: '',
          rid: '',
          status: '2',
          type: '',
          remarks: ''
        },
        state1: '',
        dialogImg: false,
        imgsrc: ''
      }
    },
    methods: {
      imgview(e) {
        this.imgsrc = e.target.getAttribute('src');
        this.dialogImg = true;
      },
      back() {
        this.$router.go(-1);
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [{
          "value": "企业名称与营业执照不一致"
        }, {
          "value": "营业执照图片不清晰"
        }, {
          "value": "姓名与身份证不一致"
        }, {
          "value": "身份证号有误"
        }, {
          "value": "身份证图片不清晰"
        }, {
          "value": "接单类型错误"
        }, ];
      },
      handleSelect(item) {
        console.log(item);
      },
      submit() {
        if (this.submitData.status === '3' & this.submitData.remarks === '') {
          this.$alert('请输入不通过原因', '提示', {
            confirmButtonText: '确定'
          });
        } else {
          this.$confirm('确定提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitData.id = this.searchData.id;
            this.submitData.rid = this.searchData.rid;
            this.submitData.type = this.$route.params.type;
            this.$http.post(this.root + '/Member/application_check', this.submitData).then(response => {
              var res = response.body;
              if (res.status == 200) {
                this.$message.success(res.msg);
                bus.$emit('checkId', this.$route.params.id);
                setTimeout(() => {
                  this.$router.go(-1);
                }, 1000)
              } else {
                this.$message.error(res.msg);
              }
            }, response => {
              this.$message.error('网络原因');
            })
          }).catch(() => {
            this.$message({
              type: '3',
              message: '已取消提交'
            });
          });
        }
      },
      getList() {
        this.$http.post(this.root + '/Member/application_view', {
          id: this.$route.params.id,
          type: this.$route.params.type
        }).then(response => {
          var res = response.body;
          if (res.status == 200) {
            this.searchData = res.content;
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      },
    },
    created() {
      this.$http.post(this.root + '/Member/application_view', {
        id: this.$route.params.id,
        type: this.$route.params.type
      }).then(response => {
        var res = response.body;
        if (res.status == 200) {
          this.searchData = res.content;
        } else {
          this.$message.error(res.msg);
        }
      }, response => {
        this.$message.error('网络原因');
      })
      this.restaurants = this.loadAll();
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