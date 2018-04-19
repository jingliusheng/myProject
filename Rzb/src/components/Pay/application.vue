<template>
  <div class="application">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="7"><span>用户手机号：</span><el-input size="small" placeholder="请输入手机号" v-model="searchData.phone"></el-input></el-col>
        <el-col :span="7">
          <span>提现身份：</span>
          <el-select v-model="searchData.role" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <span>交易方式：</span>
          <el-select v-model="searchData.way" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <span>提现状态：</span>
          <el-select v-model="searchData.status" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>申请提现时间：</span>
          <el-date-picker
                  size="small"
                  v-model="searchData.starttime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择开始时间">
          </el-date-picker>至
          <el-date-picker
                  size="small"
                  v-model="searchData.endtime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择结束时间">
          </el-date-picker>
        </el-col>
        <el-button type="primary" icon="el-icon-search" size="small" @click.native.prevent="search">查询</el-button>
      </el-row>
    </div>
    <el-table
            :data="dataList"
            stripe
            show-header
            header-row-class-name = 'headerRow'
            style="width: 100%">
      <el-table-column
              prop="count"
              label="序号"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="uname"
              label="昵称"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="phone"
              label="用户手机号"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="role"
              label="提现身份"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="way"
              label="交易方式"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="money"
              label="金额"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="status"
              label="提现状态"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="arrivaltime"
              label="预计到账时间"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="createtime"
              label="申请提现时间"
              align="center"
              >
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="100">
        <template slot-scope="scope">
          <el-button
                  @click.native.prevent="look(scope.row.id)"
                  type="text"
                  size="small">
            查看
          </el-button>
        </template>
</el-table-column>
</el-table>
<el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next, jumper" :total="totalRows" background>
</el-pagination>
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
          second_menu: '提现列表'
        },
        totalRows: 0,
        searchData: {
          phone: '',
          role: '',
          way: '',
          status: '',
          starttime: '',
          endtime: '',
          pageSize: 10,
          page: 1
        },
        endDateOpt: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse((this.searchData.starttime).replace(/-/g, "/"));
          }
        },
        options1: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '发单用户'
        }, {
          value: '2',
          label: '接单用户'
        }],
        options2: [{
          value: '',
          label: '全部'
        }, {
          value: 'alipay',
          label: '支付宝'
        }, {
          value: 'bankcard',
          label: '银行卡'
        }],
        options3: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '待审核'
        }, {
          value: '2',
          label: '待转账'
        }, {
          value: '3',
          label: '已成功'
        }, {
          value: '4',
          label: '已失败'
        }],
        dataList: []
      }
    },
    watch: {
      '$route': function(newVal, oldVal) {
        if (newVal.query.t != oldVal.query.t) {
          this.searchData = {
            phone: '',
            role: '',
            way: '',
            status: '',
            starttime: '',
            endtime: '',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      look(id) {
        this.$router.push({
          path: '/withdrawal_view/' + id,
          query: {
            t: this.$route.query.t
          }
        });
      },
      getList() {
        this.$http.post(this.root + '/Trade/withdrawal_list', this.searchData).then(response => {
          let res = response.body
          if (res.status == 200) {
            this.dataList = res.content.list;
            this.pageSize = Number(res.content.pageSize);
            this.totalRows = Number(res.content.totalRows);
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      //查询
      search() {
        this.searchData.page = 1;
        if(Date.parse((this.searchData.starttime))>Date.parse((this.searchData.endtime))){
          this.$message.error('开始时间不能大于结束时间');
        }else {
          this.getList();
        }
      },
    },
    created() {
      bus.$on('appId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>

</style>