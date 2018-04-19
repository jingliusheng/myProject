<template>
  <!-- 添加 编辑 -->
  <edit :bannerObject="selectBanner" @cancleEdit="handleCancel" @addSure="handleAddSure" @editSure="handleEditSure" v-if="showFlag"></edit>
  <div class="banner" v-else>
    <!-- 面包屑 -->
    <breadcrumb :breadcrumbData='breadcrumbData'></breadcrumb>
    <!-- 查询区 -->
    <div class="searchArea">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <span>名称：</span>
          <el-input placeholder="请输入名称" v-model="searchData.title" @keyup.native.13="search"></el-input>
        </el-col>
        <el-col>
          <span>地区：</span>
          <el-select v-model="searchData.province" placeholder="请选择" @change="changProvince">
            <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-col>
        <el-col>
          <span>状态：</span>
          <el-select v-model="searchData.isshow" placeholder="请选择">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-button type="primary" icon="el-icon-search" :disabled="isDisabled" @click.native='search'>查询</el-button>
      </el-row>
    </div>
    <!-- 操作区 -->
    <div class="doMenu">
      <el-button type="primary" icon="el-icon-plus" @click="addBanner">添加</el-button>
    </div>
    <!-- 数据列表区 -->
    <el-table :data="tableData" v-loading="loading" stripe show-header header-row-class-name='headerRow' cell-class-name="cellStyle" style="width: 100%">
      <el-table-column prop="count" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="title" label="名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="weight" label="排序">
      </el-table-column>
      <el-table-column prop="cname" label="地区">
      </el-table-column>
      <el-table-column prop="starttime" label="起始时间">
      </el-table-column>
      <el-table-column prop="endtime" label="终止时间">
      </el-table-column>
      <el-table-column prop="targeturl" label="链接" :formatter="formatUrl">
      </el-table-column>
      <el-table-column prop="isshow" label="显示状态" :formatter="formatShow">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click.native.prevent="manage(scope.$index,scope.row)" type="text">
            管理
          </el-button>
          <el-button @click.native.prevent="toggleShow(scope.row)" type="text">
            {{scope.row.isshow == '0'?'显示':'隐藏'}}
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
  import edit from './edit'
  export default {
    name: 'Banner',
    components: {
      breadcrumb,
      edit
    },
    data() {
      return {
        breadcrumbData: {
          primary_menu: '平台管理',
          second_menu: 'Banner列表'
        },
        isDisabled: false,
        loading: true,
        totalRows: 0,
        showFlag: false,
        selectBanner: {},
        tempIndex: '', //所管理的数据所在行的索引
        provinceOptions: [],
        tableData: [],
        searchData: {
          title: '',
          province: '',
          isshow: '',
          sign: '1',
          pageSize: 10,
          page: 1
        },
        stateOptions: [{
          "value": '',
          "label": '全部'
        }, {
          "value": '1',
          "label": '显示'
        }, {
          "value": '0',
          "label": '隐藏'
        }],
      }
    },

    methods: {
      formatShow(column) {
        return column.isshow == '0' ? '隐藏' : '显示'
      },
      formatUrl(row, column, cellValue) {
        if (cellValue == '' || cellValue == null)
          return '/'
        else
          return cellValue;
      },
      //添加banner
      addBanner() {
        this.selectBanner = {
          "title": "",
          "pic": "",
          "cname": this.provinceOptions[0].name,
          "starttime": "",
          "endtime": "",
          "weight": "",
          "targeturl": "",
          "sign": "1",
          "isshow": "0"
        };
        this.tempIndex = '';
        this.showFlag = true
      },
      // 管理
      manage(index, row) {
        this.selectBanner = row;
        this.tempIndex = index;
        this.showFlag = true
      },
      /**
       * 添加banner的监听回调。添加成功，查询条件不保留。相当于第一次进
       */
      handleAddSure() {
        this.searchData = {
          title: '',
          province: '',
          isshow: '',
          sign: '1',
          pageSize: 10,
          page: 1
        };
        this.showFlag = false;
        this.getList();
      },
      /**
       * 编辑banner的监听回调。保存成功，保留原条件。
       */
      handleEditSure() {
        this.showFlag = false;
        this.getList();
      },
      /*
      取消管理 只有编辑的取消，才会触发这个数据还原，添加的不会触发
      */
      handleCancel(arg) {
        if (typeof this.tempIndex == "number") {
          let old = arg._self;
          this.tableData.splice(this.tempIndex, 1, old)
        }
        this.showFlag = false
      },
      // 显示  隐藏
      toggleShow(edit) {
        let Id = edit.id,
          isShow = edit.isshow == '0' ? '1' : '0',
          text = edit.isshow == '0' ? '确定要显示吗？' : '确定要隐藏吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$axios.post('/Index/banner_check', {
              id: Id,
              isshow: isShow
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
                message: "网络原因,请稍后重试",
                duration: 1000,
                type: 'error'
              })
            })
        }).catch(() => {
          this.$message({
            message: '操作取消',
            duration: 1000
          })
        });
      },
      // 删除
      del(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/index/banner_del', {
              id: id
            })
            .then((response) => {
              let res = response.data;
              if (res.status == 200) {
                this.$message({
                  message: '删除成功!',
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
                message: "网络原因,请稍后重试",
                duration: 1000,
                type: 'error'
              })
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消',
            duration: 1000
          });
        });
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      //查询
      search() {
        if (this.$regobj.IsAllSpace(this.searchData.title)) {
          this.$message({
            message: '请输入名称',
            type: "error",
            duration: 1000
          })
        } else {
          this.isDisabled = true;
          this.searchData.page = 1;
          this.getList();
        }
      },
      //请求数据
      getList() {
        this.$axios.post('/index/banner_list', this.searchData).then(response => {
          let res = response.data;
          setTimeout(() => {
            this.isDisabled = false;
          }, 1500);
          if (res.status == 200) {
            this.tableData = res.content.list;
            // this.provinceOptions = res.content.site;
            this.provinceOptions = this.$store.state.bannerCityList;
            this.totalRows = Number(res.content.totalRows);
            if (!this.searchData.province) {
              this.searchData.province = this.$store.state.bannerCityList[0].name;
            }
          } else {
            this.$message({
              message: res.msg,
              duration: 1000,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error);
          this.isDisabled = false;
          this.$message({
            message: "网络原因,请稍后重试",
            duration: 1000,
            type: 'error'
          })
        })
      },
      //下拉框值发生变化
      changProvince(arg) {
        if (arg == this.provinceOptions[0].name) {
          this.searchData.sign = '1'
        } else {
          this.searchData.sign = '0'
        }
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
        if (val.path == '/banner') {
          this.handleAddSure();
        }
      }
    }
  }
</script>

<style scoped></style>