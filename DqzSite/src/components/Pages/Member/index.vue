<template>
    <div class="memberList">
      <!-- 面包屑 -->
      <breadcrumb :breadcrumbData="breadcrumbData"></breadcrumb>
      <!-- 查询区  -->
      <div class="searchArea" ref="searchArea">
        <el-row type="flex" justify="start" align="middle">
          <el-col>
            <span>企业认证：</span>
            <el-select v-model="searchData.authstate" placeholder="请选择">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col>
            <span>地区：</span>
            <el-select v-model="searchData.city" placeholder="请选择" @change="changCity">
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-col>
          <el-col>
            <span>来源：</span>
            <el-select v-model="searchData.regway" placeholder="请选择">
              <el-option
                v-for="item in regwayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col>
            <span>电圈号：</span>
            <el-input placeholder="请输入电圈号" v-model="searchData.identifier" @keyup.native.13="search"></el-input>
          </el-col>
          <el-col>
            <span>手机号码：</span>
            <el-input placeholder="请输入手机号码" v-model="searchData.phone" :maxlength="11" @keyup.native.13="search"></el-input>
          </el-col>
          <el-col style="width:440px">
            <span>注册时间：</span>
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
          <el-button type="primary" icon="el-icon-sold-out" style="margin:0 30px" @click.native='exportExcel'>导出</el-button>
          <el-button type="primary" icon="el-icon-search" :disabled="isDisabled" @click.native='search'>查询</el-button>
        </el-row>

        <form ref="hideFrom" :action='exportUrl' method='post' enctype='multipart/form-data' v-show="false">
          <input type='hidden' name='authstate' v-model="searchData.authstate" >
          <input type='hidden' name='regway' v-model="searchData.regway" >
          <input type='hidden' name='identifier' v-model="searchData.identifier" >
          <input type='hidden' name='phone' v-model="searchData.phone" >
          <input type='hidden' name='city' v-model="searchData.city" >
          <input type='hidden' name='sign' v-model="searchData.sign" >
          <input type='hidden' name='starttime' v-model="searchData.starttime" >
          <input type='hidden' name='endtime' v-model="searchData.endtime" >
          </form>
      </div>
      <!-- 数据列表区 -->
      <el-table :data="tableData" v-loading="loading" stripe show-header header-row-class-name='headerRow' cell-class-name="cellStyle" style="width: 100%">
          <el-table-column prop="count" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="identifier" label="电圈号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="phone" label="手机">
          </el-table-column>
          <el-table-column prop="regway" label="来源" :formatter="formatRegway">
            </el-table-column>
          <el-table-column prop="cname" label="地区">
          </el-table-column>
          <el-table-column prop="regtime" label="注册时间">
          </el-table-column>
          <el-table-column prop="logintime" label="最近登陆">
          </el-table-column>
          <el-table-column prop="authstate" label="企业认证" :formatter="formatState">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="look(scope.row.id)" type="text">
                查看
              </el-button>
              <el-button @click.native.prevent="toggleLock(scope.row)" type="text">
                {{scope.row.islock == '0'?'禁用':'启用'}}
              </el-button>
            </template>
</el-table-column>
</el-table>
<!-- 分页 -->
<el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-size="searchData.pageSize" layout="prev, pager, next, jumper" :total="totalRows" background v-show="totalRows"></el-pagination>
</div>
</template>

<script>
  const ISDEV = /\.dev/.test(location.hostname);
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    name: 'memberList',
    data() {
      return {
        breadcrumbData: {
          primary_menu: '会员管理',
          second_menu: '会员列表'
        },
        isDisabled: false,
        loading: true,
        totalRows: 0,
        tableData: [],
        cityOptions: [],
        exportUrl: ISDEV ? 'http://siteadmin.dev.e-circle.cn/index.php?s=/Admin/Member/export.html' : 'http://siteadmin.e-circle.cn/index.php?s=/Admin/Member/export.html',
        searchData: {
          authstate: '',
          starttime: '',
          endtime: '',
          regway: '',
          identifier: '',
          phone: '',
          city: '全部',
          sign: 1,
          pageSize: 10,
          page: 1
        },
        stateOptions: [{
          "value": "",
          "label": "全部"
        }, {
          "value": "0",
          "label": "未申请"
        }, {
          "value": "1",
          "label": "待审核"
        }, {
          "value": "2",
          "label": "未通过"
        }, {
          "value": "3",
          "label": "已通过"
        }],
        regwayOptions: [{
          "value": "",
          "label": "全部"
        }, {
          "value": "app",
          "label": "电圈子App"
        }, {
          "value": "pc",
          "label": "电圈子官网"
        }, {
          "value": "rzb_app",
          "label": "认证宝App"
        }, {
          "value": "rzb_wap",
          "label": "认证宝移动端"
        }, {
          "value": "rzb_pc",
          "label": "认证宝PC端"
        }, {
          "value": "hon_pc",
          "label": "E兑付PC端"
        }, {
          "value": "hon_wap",
          "label": "E兑付移动端"
        }, {
          "value": "synch",
          "label": "同步"
        }, {
          "value": "ykt",
          "label": "电气云课堂"
        }],
      }
    },
    components: {
      breadcrumb
    },
    mounted() {
      setTimeout(() => {
        this.cityOptions = this.$store.state.memberCityList;
        this.loading = false;
      }, 800);
      this.getList();
    },
    watch: {
      '$route': function(val, oldVal) {
        if (val.path == '/member') {
          this.searchData = {
            authstate: '',
            starttime: '',
            endtime: '',
            regway: '',
            identifier: '',
            phone: '',
            city: '全部',
            sign: 1,
            pageSize: 10,
            page: 1
          }
          this.getList();
        }
      }
    },
    methods: {
      //格式化会员的来源
      formatRegway(column) {
        let regStr = '';
        switch (column.regway) {
          case 'app':
            regStr = '电圈子APP'
            break;
          case 'pc':
            regStr = '电圈子官网'
            break;
          case 'rzb_app':
            regStr = '认证宝App'
            break;
          case 'rzb_wap':
            regStr = '认证宝移动端'
            break;
          case 'rzb_pc':
            regStr = '认证宝PC端'
            break;
          case 'hon_pc':
            regStr = 'E兑付PC端'
            break;
          case 'hon_wap':
            regStr = 'E兑付移动端'
            break;
          case 'synch':
            regStr = '同步'
            break;
          case 'ykt':
            regStr = '电气云课堂'
            break;
        }
        return regStr;
      },
      //格式化企业认证状态
      formatState(column) {
        let stateStr = '';
        switch (column.authstate) {
          case '1':
            stateStr = '待审核';
            break;
          case '2':
            stateStr = '未通过';
            break;
          case '3':
            stateStr = '已通过';
            break;
          default:
            stateStr = '未申请';
            break;
        }
        return stateStr;
      },
      //查询
      search() {
        let identifyReg = /^[D|Q|Z]*\d{0,11}$/;
        if (this.searchData.identifier) {
          if (!identifyReg.test(this.searchData.identifier)) {
            this.$message({
              message: '请输入正确的电圈号',
              type: 'error',
              duration: 1500
            })
            return;
          }
        }
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
      // 导出
      exportExcel() {
        this.$refs.hideFrom.submit()
      },
      // 查看会员数据
      look(id) {
        this.$router.push({
          path: '/member/view/' + id
        })
      },
      // 启用  禁用
      toggleLock(arg) {
        let currentId = arg.id,
          islock = arg.islock == '0' ? '1' : '0',
          tipText = arg.islock == '0' ? '确定禁用该会员?' : '确定启用该会员?';
        this.$confirm(tipText, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
          .then(() => {
            this.$axios.post('/member/member_lock', {
                id: currentId,
                islock: islock
              })
              .then((response) => {
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
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '网路原因，请稍后重试',
                  duration: 1000
                })
              })
          })
          .catch(() => {
            this.$message({
              message: '操作取消',
              duration: 1000
            })
          });
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      // 请求数据
      getList() {
        this.$axios.post('/member/member_list', this.searchData).then(response => {
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
      },
      //下拉框值发生变化
      changCity(arg) {
        if (arg == this.cityOptions[0].name) {
          this.searchData.sign = '1'
        } else {
          this.searchData.sign = '0'
        }
      }
    }
  }
</script>

<style scoped>

</style>