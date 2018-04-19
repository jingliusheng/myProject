<template>
  <div class="help">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="9"><span>标题：</span><el-input size="small" placeholder="请输入标题" v-model="searchData.title"></el-input></el-col>
        <el-col :span="12">
          <span>发布时间：</span>
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
        <el-col :span="9">
          <span>适用于：</span>
          <el-select v-model="searchData.role" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <span>显示状态：</span>
          <el-select v-model="searchData.isshow" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options3"
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
      <el-button type="primary" size="small" icon="el-icon-plus" @click="$router.push('/RZB_plantform_help_update/null')">添加</el-button>
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
      prop="title"
      label="标题"
      align="center"
      >
    </el-table-column>
    <el-table-column
      prop="role"
      label="适用于"
      align="center"
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
      prop="createtime"
      label="发布时间"
      align="center"
      >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="200">
      <template slot-scope="scope">
        <el-button
                @click.native.prevent="display(scope.row)"
                type="text"
                size="small"
        >
          {{scope.row.isshow == '0'?'显示':'隐藏'}}
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
          link: '/RZB_plantform_help',
          primary_menu: '平台管理',
          second_menu: '使用帮助'
        },
        value: '',
        value1: '',
        value2: '',
        value3: '',
        options2: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '发单用户'
        }, {
          value: '2',
          label: '接单用户'
        }],
        options3: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '显示'
        }, {
          value: '0',
          label: '隐藏'
        }],
        dataList: [],
        searchData: {
          title: '',
          starttime: '',
          endtime: '',
          role: '',
          isshow: '',
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
            title: '',
            starttime: '',
            endtime: '',
            role: '',
            isshow: '',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      formatter(column) {
        return column.isshow == '0' ? '隐藏' : '显示'
      },
      // 管理
      manage(id) {
        this.$router.push({
          path: '/RZB_plantform_help_update/' + id,
          query: {
            t: this.$route.query.t
          }
        });
      },
      display(edit) {
        let Id = edit.id,
          isshow = edit.isshow == '0' ? '1' : '0',
          text = edit.isshow == '0' ? '确定要显示吗？' : '确定要隐藏吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/Plantform/help_check', {
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
      getList() {
        this.$http.post(this.root + '/Plantform/help', this.searchData).then(response => {
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
      }
    },
    created() {
      bus.$on('helpId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>

</style>