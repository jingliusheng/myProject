<template>
  <div class="userList">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="7"><span>认证名称：</span><el-input size="small" placeholder="请输入认证名称" v-model="searchData.name"></el-input></el-col>
        <el-col :span="7"><span>用户手机号：</span><el-input size="small" placeholder="请输入用户手机号"v-model="searchData.phone"></el-input></el-col>
        <el-col :span="7">
          <span>认证类型：</span><el-select v-model="searchData.type" size="small" placeholder="请选择">
          <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
        </el-col>
        <el-button type="primary" icon="el-icon-search" size="small" @click.native.prevent="search">查询</el-button>
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
              prop="ename"
              label="认证名称"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="type_name"
              label="认证类型"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="createtime"
              label="申请时间"
              align="center"
      >
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作" align="center"
              width="100">
        <template slot-scope="scope">
          <el-button
                  @click.native.prevent="look(scope.row.id,scope.row.type)"
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
          link: 'RZB_member_list',
          primary_menu: '用户管理',
          second_menu: '待审核列表',
        },
        value: '',
        options1: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '发单认证'
        }, {
          value: '2',
          label: '接单认证'
        }, ],
        tableData4: [],
        searchData: {
          name: '',
          phone: '',
          type: '',
          pageSize: 10,
          page: 1
        },
        totalRows: 0,
      }
    },
    watch: {
      '$route': function(newVal, oldVal) {
        if (newVal.query.t != oldVal.query.t) {
          this.searchData = {
            name: '',
            phone: '',
            type: '',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      look(id, type) {
        this.id = id;
        this.type = type;
        this.$router.push({
          name: 'check',
          params: {
            id: this.id,
            type: this.type
          },
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
        this.getList();
      },
      getList() {
        this.$http.post(this.root + '/Member/application_list', this.searchData).then(response => {
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
      bus.$on('checkId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>

</style>