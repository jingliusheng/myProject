<template>
  <!-- 查看 -->
<applyView :applyObject="selectApply"  @handleBack="handleCancel" v-if="showFlag"></applyView>
  <div class="applyList" v-else>
    <!-- 面包屑 -->
    <breadcrumb :breadcrumbData="breadcrumbData"></breadcrumb>
    <!-- 查询区 -->
    <div class="searchArea">
      <el-row type="flex" justify="start" align="middle">
        <el-col>
          <span>状态：</span>
          <el-select v-model="searchData.isdealt" placeholder="请选择">
            <el-option v-for="item in isdealtOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col>
          <span>联系方式：</span>
          <el-input placeholder="请输入手机号码" v-model="searchData.phone" :maxlength="11" @keyup.native.13="search"></el-input>
        </el-col>
        <el-col>
          <span>活动类型：</span>
          <el-select v-model="searchData.type" placeholder="请选择">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col style="width:440px;">
          <span>报名时间：</span>
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
    <!-- 数据列表区 -->
    <el-table :data="tableData" v-loading="loading" stripe show-header header-row-class-name='headerRow' cell-class-name="cellStyle" style="width: 100%">
        <el-table-column prop="count" label="序号" width="50"></el-table-column>
        <el-table-column prop="company" label="单位名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column prop="title" label="活动名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="活动类型"></el-table-column>
        <el-table-column prop="createtime" label="报名时间"></el-table-column>
        <el-table-column prop="city" label="城市"></el-table-column>
        <el-table-column fixed="right" label="操作" width="70">
          <template slot-scope="scope">
            <el-button @click.native.prevent="look(scope.row)" type="text">
              查看
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
  import applyView from './view'
  export default {
    name: 'applyList',
    components: {
      breadcrumb,
      applyView
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: 'E企会',
          second_menu: '报名申请列表'
        },
        isDisabled: false,
        loading: true,
        showFlag: false,
        totalRows: 0,
        selectApply: {},
        tableData: [],
        isdealtOptions: [{
          "value": '',
          "label": '全部'
        }, {
          "value": '0',
          "label": '未对接'
        }, {
          "value": '1',
          "label": '已对接'
        }],
        typeOption: [{
          "value": '',
          "label": '全部'
        }, {
          "value": '1',
          "label": '电力展会'
        }, {
          "value": '2',
          "label": '电力会议'
        }],
        searchData: {
          'isdealt': '',
          'phone': '',
          'type': '',
          'pageSize': 10,
          'page': 1
        },
      }
    },
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.getList();
    },
    methods: {
      //查询
      search() {
        if (this.searchData.phone) {
          if (!/^\d{1,11}$/.test(this.searchData.phone)) {
            this.$message({
              message: '请输入1-11位数字',
              type: 'error',
              duration: 1500
            })
            return;
          }
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
      look(row) {
        this.selectApply = row;
        this.showFlag = true;
      },
      // 详情页返回按钮的监听事件
      handleCancel() {
        this.showFlag = false;
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      // 请求数据
      getList() {
        this.$axios.post('/application/application_list', this.searchData).then(response => {
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
        }).catch(() => {
          this.isDisabled = false;
          this.$message({
            message: "网络原因,请稍后重试",
            duration: 1000,
            type: 'error'
          })
        })
      }
    },
    watch: {
      '$route': function(val, oldVal) {
        if (val.path == '/e') {
          this.showFlag = false;
          this.searchData = {
            'isdealt': '',
            'phone': '',
            'type': '',
            'pageSize': 10,
            'page': 1
          }
          this.getList();
        }
      }
    },
  }
</script>

<style scoped>

</style>