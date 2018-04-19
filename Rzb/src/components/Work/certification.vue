<template>
  <div class="certification">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="6"><span>昵称：</span><el-input size="small" placeholder="请输入昵称" v-model="searchData.name"></el-input></el-col>
        <el-col :span="7"><span>用户手机号：</span><el-input size="small" placeholder="请输入手机号" v-model="searchData.phone"></el-input></el-col>
        <el-col :span="7">
          <span>处理状态：</span>
          <el-select v-model="searchData.status" size="small" placeholder="请选择">
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
      :data="dataList"
      stripe
      show-header
      header-row-class-name = 'headerRow'
      style="width: 100%">
      <el-table-column
        prop="count"
        label="序号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="uname"
        label="昵称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="用户手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="title"
        label="需求标题"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status_name"
        label="处理状态"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="提交时间"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button
          @click.native.prevent="view(scope.row)"
          type="text"
          size="small">
            查看
          </el-button>
        </template>
</el-table-column>
</el-table>
<el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next, jumper" :total="totalRows" v-show="totalRows != 0" background>
</el-pagination>
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
          link: '/RZB_work_all',
          primary_menu: '任务管理',
          second_menu: '产品认证列表'
        },
        options1: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '未处理'
        }, {
          value: '1',
          label: '已处理'
        }],
        dataList: [],
        searchData: {
          name: '',
          phone: '',
          status: '',
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
            status: '',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      view(row) {
        this.$router.push({
          path: '/RZB_product_certification/' + row.id,
          query: {
            t: this.$route.query.t
          }
        })
      },
      //分页跳转页面
      handleCurrentChange(val) {
        this.getList();
      },
      //查询
      search() {
        this.searchData.page = 1;
        this.getList();
      },
      getList() {
        this.$http.post(this.root + '/Work/product_list', this.searchData).then(response => {
          var res = response.body;
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
      }
    },
    created() {
      this.getList();
    },
  }
</script>

<style>

</style>