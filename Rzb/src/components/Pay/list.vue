<template>
  <div class="list">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="7"><span>用户手机号：</span><el-input size="small" placeholder="请输入手机号" v-model="searchData.phone"></el-input></el-col>
        <el-col :span="7">
          <span>交易身份：</span>
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
          <span>交易类型：</span>
          <el-select v-model="searchData.type" size="small" placeholder="请选择">
            <el-option
              v-for="item in options2"
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
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <span>交易时间：</span>
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
        label="交易身份"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="type"
        label="交易类型"
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
        prop="createtime"
        label="交易时间"
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
          link: '/RZB_pay_list',
          primary_menu: '交易管理',
          second_menu: '交易列表'
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
          value: '1',
          label: '申请提现'
        }, {
          value: '2',
          label: '提现退回'
        }, {
          value: '3',
          label: '收入'
        }, {
          value: '4',
          label: '支付服务费'
        }, {
          value: '5',
          label: '支付质保金'
        }, {
          value: '6',
          label: '退款'
        }],
        options3: [{
          value: '',
          label: '全部'
        }, {
          value: 'balance',
          label: '钱包'
        }, {
          value: 'alipay',
          label: '支付宝'
        }, {
          value: 'wx',
          label: '微信'
        }, {
          value: 'bankcard',
          label: '银行卡'
        }],
        dataList: [],
        searchData: {
          page: 1,
          pageSize: 10,
          phone: '',
          role: '',
          type: '',
          way: '',
          starttime: '',
          endtime: ''
        },
        totalRows: 0,
        endDateOpt: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse((this.searchData.starttime).replace(/-/g, "/"));
          }
        },
      }
    },
    watch: {
      '$route': function(newVal, oldVal) {
        if (newVal.query.t != oldVal.query.t) {
          this.searchData = {
            page: 1,
            pageSize: 10,
            phone: '',
            role: '',
            type: '',
            way: '',
            starttime: '',
            endtime: ''
          }
          this.getList();
        }
      }
    },
    methods: {
      look(id) {
        this.$router.push({
          path: '/trade_view/' + id,
          query: {
            t: this.$route.query.t
          }
        });
      },
      getList() {
        this.$http.post(this.root + '/Trade/trade_list', this.searchData).then(response => {
          var res = response.body
          if (res.status == 200) {
            this.dataList = res.content.list;
            this.searchData.pageSize = Number(res.content.pageSize);
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
      bus.$on('listId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>

</style>