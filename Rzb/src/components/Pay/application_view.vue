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
                        <el-col :span="8.5" class="work_info_title minWidth4">申请提现时间：</el-col>
                        <el-col :span="15.5">{{dataList.createtime}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="section" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="7">
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">提现身份：</el-col>
                        <el-col :span="10">
                            <span v-if="dataList.role==='1'">发单用户</span>
                            <span v-else>接单用户</span>
                        </el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">交易方式：</el-col>
                        <el-col :span="10">
                            <span v-if="dataList.way==='bankcard'">银行卡</span>
                            <span v-else>支付宝</span>
                        </el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="6" class="work_info_title minWidth4">金额：</el-col>
                        <el-col :span="10">{{dataList.money}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="8" class="work_info_title minWidth4">预计到账时间：</el-col>
                        <el-col :span="14">{{dataList.arrivaltime}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="section" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="24" v-if="dataList.way==='bankcard'">
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">持卡人：</el-col>
                        <el-col :span="10">{{dataList2.name}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">银行：</el-col>
                        <el-col :span="10">{{dataList2.bname}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">开户行：</el-col>
                        <el-col :span="18">{{dataList2.branch}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">预留手机号：</el-col>
                        <el-col :span="10">{{dataList2.phone}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">卡号：</el-col>
                        <el-col :span="10">{{dataList2.cardnumber}}</el-col>
                    </el-row>
                </el-col>
                <el-col :md="24" :lg="24" v-else-if="dataList.way==='alipay'">
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">认证姓名：</el-col>
                        <el-col :span="10">{{dataList2.name}}</el-col>
                    </el-row>
                    <el-row type="flex">
                        <el-col :span="1.5" class="work_info_title minWidth4">支付宝账号：</el-col>
                        <el-col :span="10">{{dataList2.account}}</el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="operateArea" type="flex" justify="start" align="middle">
                <el-col :md="24" :lg="24">
                    <el-table
                            :data="dataList1"
                            stripe
                            show-header
                            header-row-class-name = 'headerRow'
                            style="width: 50%">
                        <el-table-column
                                prop="operatorname"
                                label="操作者"
                                align="center"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="operation"
                                label="操作"
                                align="center"
                                width="100"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="createtime"
                                label="操作时间"
                                align="center"
                                width="200"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="remarks"
                                label="原因"
                                align="center"
                                min-width="100"
                                :formatter="formatter"
                        >
                        </el-table-column>
                    </el-table>
                    <br/>
                    <div v-if="dataList.status==='1'">
                        <span>审核状态：</span>
                        <el-select v-model="submitData.code" size="small" placeholder="请选择">
                            <el-option
                                    v-for="item in options1"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <br/>
                        <br/>
                        <div v-if="submitData.code==='1'">
                            <span>不通过原因：</span>
                            <el-autocomplete
                                    style="width: 300px"
                                    size="small"
                                    class="inline-input"
                                    v-model="submitData.remarks"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    @select="handleSelect"
                            ></el-autocomplete> 不超过15个字
                        </div>
                    </div>
                    <div style="margin-top: 10px">
                        <el-button v-if="dataList.status==='1'" type="primary" @click="submit()">提交</el-button>
                        <el-button v-else-if="dataList.status==='2'" type="primary" @click="transfer()">确认转账</el-button>
                        <el-button type="primary" @click="back()">返回</el-button>
                    </div>
                </el-col>
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
          link: '/RZB_pay_application',
          primary_menu: '交易管理',
          second_menu: '提现详情'
        },
        options1: [{
          value: '2',
          label: '审核通过'
        }, {
          value: '1',
          label: '审核不通过'
        }],
        reasons: [],
        dataList: [],
        dataList1: [],
        dataList2: [],
        dataList3: [],
        submitData: {
          id: this.$route.params.id,
          status: '',
          code: '2',
          remarks: ''
        },
        transferData: {
          id: this.$route.params.id,
          status: '',
        }
      }
    },
    methods: {
      formatter(column) {
        return column.remarks ? column.remarks : '//';
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
          "value": "认证姓名与支付宝账号不一致"
        }, {
          "value": "银行卡持卡人错误"
        }, {
          "value": "开户行输入不正确"
        }, {
          "value": "银行卡卡号错误"
        }, {
          "value": "银行卡预留手机号错误"
        }, {
          "value": "账号异常"
        }, ];
      },
      handleSelect(item) {
        console.log(item);
      },
      transfer() {
        this.transferData.status = this.dataList.status;
        this.$confirm('确定已转账给提现用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/Trade/withdrawal_check', this.transferData).then(response => {
            var res = response.body;
            if (res.status == 200) {
              this.$message.success(res.msg);
              bus.$emit('appId', this.$route.params.id);
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
            type: 'info',
            message: '已取消'
          });
        });
      },
      submit() {
        if (this.submitData.code === '1' & this.submitData.remarks === '') {
          this.$alert('请输入不通过原因', '提示', {
            confirmButtonText: '确定'
          });
        } else {
          this.submitData.status = this.dataList.status;
          this.$confirm('确定提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post(this.root + '/Trade/withdrawal_check', this.submitData).then(response => {
              var res = response.body;
              if (res.status == 200) {
                this.$message.success(res.msg);
                bus.$emit('appId', this.$route.params.id);
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
              type: 'info',
              message: '已取消'
            });
          });
        }

      }
    },
    created() {
      this.restaurants = this.loadAll();
      this.$http.post(this.root + '/Trade/withdrawal_view', {
        id: this.$route.params.id
      }).then(response => {
        var res = response.body
        if (res.status == 200) {
          this.dataList = res.content.list;
          this.dataList1 = res.content.list2;
          this.dataList2 = res.content.list1;
        } else {
          this.$message.error(res.msg);
        }
      }, response => {
        this.$message.error('网络原因');
      })

      this.$http.post(this.root + '/Trade/withdrawal_reason').then(response => {
        var res = response.body
        if (res.status == 200) {
          this.dataList3 = res.content;
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