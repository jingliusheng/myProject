<template>
  <div class="userList">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="8"><span>昵称：</span><el-input size="small"  v-model="searchData.name"></el-input></el-col>
        <el-col :span="8"><span>用户手机号：</span><el-input size="small"  v-model="searchData.phone"></el-input></el-col>
        <el-col :span="8"><span>发单企业名称：</span><el-input size="small" v-model="searchData.fname"></el-input></el-col>
        <el-col :span="8"><span>接单姓名：</span><el-input size="small" v-model="searchData.jname"></el-input></el-col>
        <el-col :span="12"><span >注册时间：</span>
          <el-date-picker
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择开始时间"
                  v-model="searchData.starttime">
          </el-date-picker>
          <span>至</span>
          <el-date-picker
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择结束时间"
                  v-model="searchData.endtime">
          </el-date-picker>
        </el-col>

        <el-col :span="8">
          <span>发单认证：</span><el-select v-model="searchData.fstatus" size="small" placeholder="请选择">
          <el-option
                  v-for="item in options1"
                  :key="item.value1"
                  :label="item.label"
                  :value="item.value1">
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="8">
          <span>接单认证：</span><el-select v-model="searchData.jstatus" size="small" placeholder="请选择">
          <el-option
                  v-for="item in options2"
                  :key="item.value2"
                  :label="item.label"
                  :value="item.value2">
          </el-option>
        </el-select>
        </el-col>
        <el-button type="primary" icon="el-icon-search" size="small"  @click.native.prevent="search">查询</el-button>
      </el-row>
    </div>
    <el-table
            :data="tableData4"
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
              :formatter="text"
              prop="company"
              label="发单企业名称"
              align="center"
              show-overflow-tooltip
              >
      </el-table-column>
      <el-table-column
              :formatter="text"
              prop="name"
              label="接单姓名"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="fstatus"
              label="发单认证"
              align="center"
      >
      </el-table-column>
      <el-table-column
             prop="jstatus"
             label="接单认证"
             align="center"
             >
      </el-table-column>
      <el-table-column
              prop="regtime"
              label="注册时间"
              align="center"
      >
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作" align="center"
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


<el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next, jumper" :total="totalRows" background v-show="totalRows != 0">
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
          link: '/RZB_member_list',
          primary_menu: '用户管理',
          second_menu: '会员管理',
        },
        value1: '',
        value2: '',
        options1: [{
          value1: '',
          label: '全部'
        }, {
          value1: '0',
          label: '未认证'
        }, {
          value1: '1',
          label: '审核中'
        }, {
          value1: '3',
          label: '未通过'
        }, {
          value1: '2',
          label: '已认证'
        }],
        options2: [{
          value2: '',
          label: '全部'
        }, {
          value2: '0',
          label: '未认证'
        }, {
          value2: '1',
          label: '审核中'
        }, {
          value2: '3',
          label: '未通过'
        }, {
          value2: '2',
          label: '已认证'
        }],
        tableData4: [],
        searchData: {
          name: '',
          phone: '',
          fname: '',
          jname: '',
          starttime: '',
          endtime: '',
          fstatus: '',
          jstatus: '',
          pageSize: 10,
          page: 1
        },
        totalRows: 0,
        endDateOpt: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse((this.searchData.starttime).replace(/-/g, "/"));
          }
        }
      }
    },
    watch: {
      '$route': function(newVal, oldVal) {
        if (newVal.query.t != oldVal.query.t) {
          this.searchData = {
            name: '',
            phone: '',
            fname: '',
            jname: '',
            starttime: '',
            endtime: '',
            fstatus: '',
            jstatus: '',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      text(row, column, cellValue) {
        if (cellValue == '' || cellValue == null)
          return '/'
        else
          return cellValue;
      },
      look(id) {
        this.$router.push({
          path: '/listManage/' + id,
          query: {
            t: this.$route.query.t
          }
        });
      },
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
      getList() {
        this.$http.post(this.root + '/Member/member_list', this.searchData).then(response => {
          var res = response.body;
          if (res.status == 200) {
            this.tableData4 = res.content.list;
            this.searchData.pageSize = Number(res.content.pageSize);
            this.totalRows = Number(res.content.totalRows);
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      },
    },
    created() {
      bus.$on('memberId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>

</style>