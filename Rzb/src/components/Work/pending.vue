<template>
  <div class="pending">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
    <div class="searchArea">
      <el-row type="flex" justify="start" align="center">
        <el-col :span="7"><span>任务标题：</span><el-input size="small" placeholder="请输入任务标题" v-model="searchData.title"></el-input></el-col>
        <el-col :span="7"><span>企业名称：</span><el-input size="small" placeholder="请输入企业名称" v-model="searchData.name"></el-input></el-col>
        <el-col :span="7">
          <span>任务类型：</span>
          <el-select v-model="searchData.category" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <span>初审/复查：</span>
          <el-select v-model="searchData.type" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
          <span>任务地区：</span>
          <el-cascader
                  size="small"
                  :options="cityPptions"
                  v-model="selectedOptions"
                  @change="handleChange">
          </el-cascader>
        </el-col>
        <el-col :span="7">
          <span>任务状态：</span>
          <el-select v-model="searchData.status" size="small" placeholder="请选择">
            <el-option
                    v-for="item in options4"
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
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="title"
              label="任务标题"
              align="center"
              show-overflow-tooltip
              >
      </el-table-column>
      <el-table-column
              prop="category"
              label="任务类型"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="type"
              label="初审/复查"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="fee"
              label="服务费"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="company"
              label="企业名称"
              align="center"
              show-overflow-tooltip
              >
      </el-table-column>
      <el-table-column
              label="任务地区"
              align="center"
              :formatter="aa"
      >
      </el-table-column>
      <el-table-column
              prop="deadline"
              label="接单截止"
              align="center"
              >
      </el-table-column>
      <el-table-column
              prop="status_name"
              label="任务状态"
              align="center"
              >
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="50">
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
  import bus from '../../assets/js/eventBus';
  import cityData from '../../assets/city/china1.json';
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
          second_menu: '待定中任务列表'
        },
        currentPage: 1,
        selectedOptions: [""],
        cityPptions: cityData,
        options1: [{
          id: '',
          name: "全部"
        }],
        options2: [{
          value: '',
          label: '全部'
        }, {
          value: '初审',
          label: '初审'
        }, {
          value: '复查',
          label: '复查'
        }],
        options4: [{
          value: '',
          label: '全部'
        }, {
          value: '100',
          label: '待审核'
        }, {
          value: '200',
          label: '待支付'
        }, {
          value: '300',
          label: '待接单'
        }],
        dataList: [],
        searchData: {
          title: '',
          name: '',
          category: '',
          type: '',
          province: '',
          city: '',
          status: '',
          code: '2',
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
            title: '',
            name: '',
            category: '',
            type: '',
            province: '',
            city: '',
            status: '',
            code: '2',
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      aa(value) {
        return value.province + '-' + value.city + '-' + value.county;
      },
      view(row) {
        this.$router.push({
          path: '/RZB_work_pending/' + row.id,
          query: {
            t: this.$route.query.t
          }
        })
      },
      handleCurrentChange(val) {
        this.getList();
      },
      handleChange(val) {
        console.log(val);
      },
      //查询
      search() {
        this.searchData.page = 1;
        this.getList();
      },
      getList() {
        if (this.selectedOptions.length > 1) {
          this.searchData.province = this.selectedOptions[0];
          this.searchData.city = this.selectedOptions[1];
        }
        this.$http.post(this.root + '/Work/work_list', this.searchData).then(response => {
          var res = response.body;
          if (res.status == 200) {
            this.dataList = res.content.list;
            if (this.options1.length == 1) {
              this.options1 = this.options1.concat(res.content.categorys);
            }
            this.searchData.province = '';
            this.searchData.city = '';
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