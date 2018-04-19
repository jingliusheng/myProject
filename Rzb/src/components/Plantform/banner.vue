<template>
  <div>
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="doMenu">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push('/BannerManage/null')">添加</el-button>
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
              width="150"
              fixed>
      </el-table-column>
      <el-table-column
              prop="title"
              label="名称"
              align="center"
              fixed>
      </el-table-column>
      <el-table-column
              prop="weight"
              label="排序"
              align="center"
              fixed>
      </el-table-column>
      <el-table-column
              prop="starttime"
              label="起始时间" align="center"
              min-width="106"
      >
      </el-table-column>
      <el-table-column
              prop="endtime"
              label="终止时间" align="center"
              min-width="106"
      >
      </el-table-column>

      <el-table-column
            prop="targeturl"
            label="链接"
            align="center"
            :formatter="text"
      >
      </el-table-column>
      <el-table-column
            prop="isshow"
            label="显示状态"
            align="center"
            :formatter="formatter"
      >
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作" align="center"
              width="200">
        <template slot-scope="scope">

          <el-button
                  @click.native.prevent="manage(scope.row.id)"
                  type="text"
                  size="small"
          >
            管理
          </el-button>
          <el-button
                  @click.native.prevent="toggleShow(scope.row)"
                  type="text"
                  size="small"
          >
            {{scope.row.isshow == '0'?'隐藏':'显示'}}

          </el-button>

        </template>
</el-table-column>
</el-table>


<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size=pageSize layout="prev, pager, next, jumper" :total=totalRows background>
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
          link: 'RZB_plantform_banner',
          primary_menu: '平台管理',
          second_menu: 'banner管理',
        },
        tableData4: [],
        pageSize: 10,
        totalRows: 0,
        currentPage: 1,
        isshow: '',
      }
    },
    methods: {
      text(row, column, cellValue) {
        if (cellValue == '' || cellValue == null)
          return '/'
        else
          return cellValue;
      },
      formatter(column) {
        return column.isshow == '0' ? '显示' : '隐藏'
      },
      toggleShow(edit) {
        let Id = edit.id,
          isshow = edit.isshow == '0' ? '1' : '0',
          text = edit.isshow == '0' ? '确定要隐藏吗？' : '确定要显示吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/Plantform/banner_check', {
            id: Id,
            isshow: isshow
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
      manage(id){
        this.$router.push({
          path:'/BannerManage/'+id,
          query: {
            t: this.$route.query.t
          }
        })
      },
      handleCurrentChange() {
        this.getList();
      },
      getList() {
        this.$http.post(this.root + '/Plantform/banner_list', {
          page: this.currentPage
        }).then(response => {
          let res = response.body
          if (res.status == 200) {
            this.tableData4 = res.content.list;
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
      this.getList();

    }
  }
</script>

<style>

</style>