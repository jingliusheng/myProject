<template>
  <div class="userList">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <div class="searchArea">
      <el-row type="flex" justify="start" align="middle"> 
        <el-col :span="7"><span>用户名：</span><el-input size="small" placeholder="请输入用户名" v-model="searchData.username"></el-input></el-col>
        <el-col :span="7"><span>姓名：</span><el-input size="small" placeholder="请输入姓名" v-model="searchData.name"></el-input></el-col>
        <el-col :span="7">
          <span>状态：</span><el-select v-model="searchData.islock" size="small" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-button type="primary" icon="el-icon-search" size="small" @click.native.prevent="search">查询</el-button>
      </el-row>  
    </div>
    <div class="doMenu">
      <el-button type="primary" size="small" icon="el-icon-plus"  @click="$router.push('/userManage/null')">添加</el-button>   
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
      width="50">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="phone"
      label="联系方式"
      align="center"
      min-width="110"
      >
    </el-table-column>
    <el-table-column
      prop="rolename"
      label="角色名"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="state"
      label="状态"
      align="center"
      :formatter="formatter"
      >
    </el-table-column>
    <el-table-column
      prop="createtime"
      label="创建时间" align="center"
      min-width="106"
      >
    </el-table-column>
    <el-table-column
      prop="logintime"
      label="最近登录时间" align="center"
      min-width="106"
      >
    </el-table-column>
    <el-table-column
    fixed="right"
      label="操作" align="center"
      width="200">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="toggleable(scope.row)"
          type="text"
          size="small">
          {{scope.row.islock == '0'?'禁用':'启用'}}
        </el-button>

        <el-button
          @click.native.prevent="manage(scope.row.id)"
          type="text"
          size="small">
          管理
        </el-button>   
        <el-button
          @click.native.prevent="resetpwd(scope.row.id)"
          type="text"
          size="small">
          重置密码
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
          link: '/RZB_admin_user',
          primary_menu: '管理员',
          second_menu: '用户列表'
        },
        value: '',
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '启用'
        }, {
          value: '1',
          label: '禁用'
        }],
        dataList: [],
        searchData: {
          username: '',
          name: '',
          islock: '',
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
            username: '',
            name: '',
            islock: '',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      formatter(column) {
        return column.islock == '0' ? '启用' : '禁用'
      },
      // 禁用  启用
      toggleable(edit) {
        let Id = edit.id,
          isLock = edit.islock == '0' ? '1' : '0',
          text = edit.islock == '0' ? '确定要禁用吗？' : '确定要启用吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/User/user_islock', {
            id: Id,
            islock: isLock
          }).then(response => {
            var res = response.body;
            if (res.status == 200) {
              this.$message.success(res.msg);
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          }, response => {
            this.$message.error('网络原因');
          })
        }).catch(() => {
          this.$message.info('操作取消');
        });
      },
      // 管理
      manage(id) {
        this.$router.push({
          path: '/userManage/' + id,
          query: {
            t: this.$route.query.t
          }
        });
      },
      // 重置密码
      resetpwd(id) {
        this.$router.push({
          path: '/resetPassword/' + id,
          query: {
            t: this.$route.query.t
          }
        });
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      //查询
      search() {
        this.searchData.page = 1;
        this.getList();
      },
      getList() {
        this.$http.post(this.root + '/User/user_list', this.searchData).then(response => {
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
      bus.$on('userId', (id) => {
        this.getList();
      })
      this.getList();
    },
  }
</script>
<style>

</style>