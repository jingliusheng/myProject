<template>
  <div class="feed_back">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="9"><span>昵称：</span><el-input size="small" placeholder="请输入昵称" v-model="searchData.name"></el-input></el-col>
        <el-col :span="9"><span>用户手机号：</span><el-input size="small" placeholder="请输入手机号" v-model="searchData.phone"></el-input></el-col>
        <el-col :span="9">
          <span>处理状态：</span>
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
          <span>提交时间：</span>
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
          <!--:picker-options="endDateOpt"-->
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
        prop="content"
        label="意见反馈内容"
        show-overflow-tooltip
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="提交时间"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        :formatter="formatter"
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="200">
        <template slot-scope="scope">
          <el-button
          @click.native.prevent="look(scope.row.id,scope.row.status)"
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
          link: '/RZB_feed_back',
          primary_menu: '平台管理',
          second_menu: '意见反馈'
        },
        value4: '',
        value5: '',
        options3: [{
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
          starttime: '',
          endtime: '',
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
      formatter(column) {
        return column.status == '0' ? '未处理' : '已处理'
      },
      look(id, status) {
        this.id = id;
        this.status = status;
        this.$router.push({
          name: 'RZB_feed_back_edit',
          params: {
            id: this.id,
            status: this.status
          },
          query: {
            t: this.$route.query.t
          }
        });
      },
      getList() {
        this.$http.post(this.root + '/Plantform/feedback', this.searchData).then(response => {
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
      bus.$on('feedId', (id) => {
        this.getList();
      })
      this.getList();
    }
  }
</script>

<style>

</style>