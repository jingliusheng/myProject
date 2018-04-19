<template>
  <div class="roleList">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <div class="doMenu">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push('/roleManage/null')">添加</el-button>   
    </div>

    <el-table
    :data="dataList"
    stripe
    show-header
    header-row-class-name = 'headerRow'
    style="width: 100%"
    >
    <el-table-column
      prop="count"
      label="序号"
      align="center"
      width="50"
      >
    </el-table-column>
    <el-table-column
      prop="rolename"
      label="角色名"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="rolenotes"
      label="角色描述"
      align="center"
      :formatter="text"
      show-overflow-tooltip      
      >
    </el-table-column>
    <el-table-column
      prop="createtime"
      label="创建时间" align="center"
      >
    </el-table-column>
    
    <el-table-column
      label="操作" align="center"
      width="200">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="permission(scope.row.id)"
          type="text"
          size="small">
          权限设置
        </el-button> 
        <el-button
          @click.native.prevent="manage(scope.row.id)"
          type="text"
          size="small">
          管理
        </el-button>   
        
      </template>
</el-table-column>
</el-table>


<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="totalRows" background v-show="totalRows != 0">
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
          link: '/RZB_admin_role',
          primary_menu: '管理员',
          second_menu: '角色列表'
        },
        dataList: [],
        pageSize: 10,
        totalRows: 0,
        currentPage: 1
      }
    },
    methods: {
      text(row, column, cellValue) {
        if (cellValue == '' || cellValue == null)
          return '/'
        else
          return cellValue;
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      //权限设置
      permission(id) {
        this.$router.push('/permission/' + id);
      },
      //管理
      manage(id) {
        this.$router.push('/roleManage/' + id);
      },
      getList() {
        this.$http.post(this.root + '/User/role_list', {
          page: this.currentPage
        }).then(response => {
          var res = response.body;
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
      }
    },
    created() {
      bus.$on('roleId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>
  .el-tooltip__popper.is-dark {
    max-width: 70%;
  }
</style>