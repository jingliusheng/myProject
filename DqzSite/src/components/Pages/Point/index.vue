<template>
    <div class="applyList">
      <!-- 面包屑 -->
      <breadcrumb :breadcrumbData="breadcrumbData"></breadcrumb>
      <!-- 查询区 -->
      <div class="searchArea">
        <el-row type="flex" justify="start" align="middle">
          <el-col>
            <span>企业名称：</span>
            <el-input placeholder="请输入企业名称" v-model="searchData.name" @keyup.native.13="search"></el-input>
          </el-col>
          <el-col style="width:440px;">
            <span>添加时间：</span>
            <el-date-picker
                    type="date"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择开始时间"
                    v-model="searchData.starttime">
            </el-date-picker>
            <span>至</span>
            <el-date-picker
                    type="date"
                    :editable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择结束时间"
                    v-model="searchData.endtime">
            </el-date-picker>
          </el-col>  
          <el-button type="primary" icon="el-icon-search" :disabled="isDisabled" @click.native='search'>查询</el-button>
        </el-row>
      </div>
      <!-- 操作区 -->
      <div class="doMenu">
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('/point/manage/null')">添加</el-button>
      </div>
      <!-- 数据列表区 -->
      <el-table :data="tableData" v-loading="loading" stripe show-header header-row-class-name='headerRow' cell-class-name="cellStyle" style="width: 100%">
          <el-table-column prop="count" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="企业名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="企业标签" :formatter="formatlabel"></el-table-column>
          <el-table-column prop="istop" label="置顶" :formatter="formatIsTop" width="100"></el-table-column>
          <el-table-column prop="isrecommend" label="热词推荐" :formatter="formatIsHot" width="100"></el-table-column>
          <el-table-column prop="createtime" label="添加时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click.native.prevent="manage(scope.row.id)" type="text">
                管理
              </el-button>
              <el-button @click.native.prevent="del(scope.row.id)" type="text">
                删除
              </el-button>
            </template>
</el-table-column>
</el-table>

<!-- 分页 -->
<el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next, jumper" :total="totalRows" background v-show="totalRows"></el-pagination>

</div>
</template>
<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    name: 'applyList',
    components: {
      breadcrumb,
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: '点到为止',
          second_menu: '企业列表'
        },
        isDisabled: false,
        loading: true,
        totalRows: 0,
        searchData: {
          'name': '',
          'starttime': '',
          'endtime': '',
          'pageSize': 10,
          'page': 1
        },
        tableData: [],
      }
    },
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.getList();
    },
    watch: {
      '$route': function(val, oldVal) {
        if (val.path == '/point' && (oldVal.meta.isreload || oldVal.path == '/point')) {
          this.searchData = {
            name: '',
            starttime: '',
            endtime: '',
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      // 格式化标签
      formatlabel(column) {
        if (!column.label1 && !column.label2 && !column.label3) {
          return "/"
        } else {
          return column.label1 + " " + column.label2 + " " + column.label3;
        }
      },
      //格式化是否置顶
      formatIsTop(column) {
        return column.istop == '0' ? '否' : '是'
      },
      //格式化热词推荐
      formatIsHot(column) {
        return column.isrecommend == '0' ? '否' : '是'
      },
      //查询
      search() {
        if (this.$regobj.IsAllSpace(this.searchData.name)) {
          this.$message({
            message: '请输入企业名称',
            type: 'error',
            duration: 1000
          })
          return
        }

        if (Date.parse((this.searchData.starttime)) > Date.parse((this.searchData.endtime))) {
          this.$message({
            message: '开始时间不能大于结束时间',
            type: 'error',
            duration: 1500
          })
          return;
        }
        this.isDisabled = true;
        this.searchData.page = 1;
        this.getList();
      },
      // 查看
      manage(id) {
        this.$router.push('/point/manage/' + id);
      },
      //删除
      del(id) {
        this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/point/point_del', {
            id: id,
          }).then((response) => {
            let res = response.data;
            if (res.status == 200) {
              this.$message({
                message: '操作成功!',
                duration: 1000,
                type: 'success'
              });
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                duration: 1000,
                type: 'error'
              })
            }
          }).catch(() => {
            this.$message({
              message: "网络原因,请稍后重试",
              duration: 1000,
              type: 'error'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      // 请求数据
      getList() {
        this.$axios.post('/point/point_list', this.searchData).then(response => {
          let res = response.data;
          setTimeout(() => {
            this.isDisabled = false;
          }, 1500);
          if (res.status == 200) {
            this.tableData = res.content.list;
            this.totalRows = Number(res.content.totalRows);
          } else {
            this.$message({
              message: res.msg,
              duration: 1000,
              type: 'error'
            })
          }
        }, response => {
          this.isDisabled = false;
          this.$message({
            message: "网络原因,请稍后重试",
            duration: 1000,
            type: 'error'
          })
        })
      }
    },
  }
</script>

<style scoped>

</style>