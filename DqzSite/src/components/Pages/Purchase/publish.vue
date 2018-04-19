<template>
  <!-- 查看 -->
  <pubView :PurchasePublishObject="selectPurchase" @handleBack="handleCancel" v-if="showFlag"></pubView>
  <div class="purchasePublishList" v-else>
      <!-- 面包屑 -->
      <breadcrumb :breadcrumbData="breadcrumbData"></breadcrumb>
      <!-- 查询区 -->
      <div class="searchArea">
        <el-row type="flex" justify="start" align="middle">
          <el-col>
            <span>发布内容：</span>
            <el-input placeholder="请输入发布内容" v-model="searchData.content" @keyup.native.13="search"></el-input>
          </el-col>
          <el-col>
            <span>发布类型：</span>
            <el-select v-model="searchData.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col>
            <span>昵称：</span>
            <el-input placeholder="请输入昵称" v-model="searchData.name" @keyup.native.13="search"></el-input>
          </el-col>
          <el-col>
            <span>手机号码：</span>
            <el-input placeholder="请输入手机号码" v-model="searchData.phone" :maxlength="11" @keyup.native.13="search"></el-input>
          </el-col>
          <el-col style="width:440px">
            <span>发布时间：</span>
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
          <el-table-column prop="content" label="发布内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="type" label="发布类型"></el-table-column>
          <el-table-column prop="uname" label="昵称"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="createtime" label="发布时间"></el-table-column>
          <el-table-column prop="commentnumber" label="回复数"></el-table-column>
          <el-table-column prop="isdeleted" label="状态" :formatter="formatIsdeleted"></el-table-column>
          
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click.native.prevent="look(scope.row)" type="text">
                查看
              </el-button>
              <el-button @click.native.prevent="toggleShow(scope.row)" type="text">
                {{scope.row.isdeleted == '0'?'屏蔽':'解禁'}}
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
  import pubView from './pub_view'
  export default {
    name: 'purchasePublishList',
    components: {
      breadcrumb,
      pubView
    },
    data() {
      return {
        isDisabled: false,
        loading: true,
        totalRows: 0,
        showFlag: false,
        selectPurchase: {}, //查看的对象
        tableData: [],
        breadcrumbData: {
          primary_menu: '采购通',
          second_menu: '发布列表'
        },
        searchData: {
          content: '',
          type: '',
          name: '',
          phone: '',
          starttime: '',
          endtime: '',
          pageSize: 10,
          page: 1
        },
        typeOptions: [{
          value: '',
          label: '全部'
        }, {
          value: '5',
          label: '采购'
        }, {
          value: '6',
          label: '询价'
        }, {
          value: '7',
          label: '渠道'
        }, {
          value: '8',
          label: '合作'
        }],
      }
    },
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      this.getList();
    },
    methods: {
      // 格式化状态
      formatIsdeleted(column) {
        return column.isdeleted == '0' ? '显示' : '隐藏'
      },
      //查询
      search() {
        if (this.$regobj.IsAllSpace(this.searchData.content)) {
          this.$message({
            message: '请输入发布内容',
            type: "error",
            duration: 1500
          })
          return;
        }
        if (this.$regobj.IsAllSpace(this.searchData.name)) {
          this.$message({
            message: '请输入昵称',
            type: "error",
            duration: 1500
          })
          return;
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
      // 查看
      look(row) {
        this.selectPurchase = row;
        this.showFlag = true
      },
      // 详情页返回按钮的监听事件
      handleCancel() {
        this.showFlag = false;
      },
      // 显示  隐藏
      toggleShow(edit) {
        let Id = edit.id,
          isDeleted = edit.isdeleted == '0' ? '1' : '0',
          text = edit.isdeleted == '0' ? '确定要屏蔽吗？' : '确定要解禁吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$axios.post('/release/release_check', {
            id: Id,
            isdeleted: isDeleted
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
            message: '操作取消',
            duration: 1000
          })
        });
      },
      // 分页跳转页面
      handleCurrentChange() {
        this.getList();
      },
      // 获取数据列表
      getList() {
        this.$axios.post('/release/release_list', this.searchData).then(response => {
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
    watch: {
      '$route': function(val, oldVal) {
        if (val.path == '/purchase_publish') {
          this.showFlag = false;
          this.searchData = {
            content: '',
            type: '',
            name: '',
            phone: '',
            starttime: '',
            endtime: '',
            pageSize: 10,
            page: 1
          };
          this.getList();
        }
      }
    },
  }
</script>

<style scoped></style>