<template>
  <div>
  <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
  <div  style="width: 70%;border:1px solid #000">
    <div>
      <el-row type="flex" justify="space-around" align="middle" >
        <el-col :span='6' :offset='1'>接单质保金比例</el-col>
        <el-col :span='6' :offset='3'>
          <span v-if="percent">{{percentObj.ratio}}&#37;</span>
          <el-input v-else size="mini" v-model="percentObj.ratio"></el-input>
        </el-col>
        <el-col :span='12' :offset='3'>
          <el-button type="primary" @click="percent=false" v-if="percent">修改</el-button>
          <el-button type="primary" @click="save('',1)" v-else>保存</el-button>
        </el-col>
      </el-row>
      <hr/>
    </div>
    <div>
      <el-table
              :data="dataList"
              stripe
              show-header
              header-row-class-name = 'headerRow'
              >
        <el-table-column
                prop="name"
                label="任务类型"
                align="center"
                >
        </el-table-column>
        <el-table-column
                prop="examinationfee"
                label="初审/元"
                align="center"
        >
          <template slot-scope="examination">
            <div v-show="!examination.row.isEdit">{{examination.row.examinationfee}}</div>
            <input v-show="examination.row.isEdit" v-model="examination.row.examinationfee" min="1">
          </template>

</el-table-column>
<el-table-column prop="reviewfee" label="复查/元" align="center">
  <template slot-scope="review">
            <div v-show="!review.row.isEdit">{{review.row.reviewfee}}</div>
            <input v-show="review.row.isEdit" v-model="review.row.reviewfee">
          </template>
</el-table-column>
<el-table-column fixed="right" label="操作" align="center">
  <template slot-scope="scope">
            <el-button
                    @click.native.prevent="edit(scope.row)"
                    type="text"
                    size="small"
                    :disabled="disabled"
                    v-if="!scope.row.isEdit"
                    >
                    修改
            </el-button>
            <el-button
                    @click.native.prevent="save(scope.row,2)"
                    type="text"
                    size="small"
                    v-if="scope.row.isEdit">
                    保存
            </el-button>
          </template>
</el-table-column>
</el-table>
</div>
</div>
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
          link: '/RZB_plantform_banner',
          primary_menu: '平台管理',
          second_menu: '参数设置'
        },
        percent: 'true',
        dataList: [],
        percentObj: {},
        disabled: false
      }
    },
    methods: {
      edit(row) {
        row.isEdit = true;
        this.disabled = true;
      },
      save(row, type) {
        if(this.percentObj.ratio==='0'|this.percentObj.ratio===''|row.examinationfee==='0'|row.examinationfee===''|row.reviewfee==='0'|row.reviewfee===''){
          this.$message('请输入正确的数值');
        }else {
          let sendData = {};
          if (type == 1) {
            sendData.id = this.percentObj.id;
            sendData.type = 1;
            sendData.ratio = this.percentObj.ratio;
          } else {
            sendData.id = row.id;
            sendData.type = 2;
            sendData.emoney = row.examinationfee;
            sendData.rmoney = row.reviewfee;
          }
          this.$http.post(this.root + '/Plantform/parameter_edit', sendData).then(response => {
            var res = response.body;
            if (res.status == 200) {
              this.$message.success(res.msg);
              if (type == 2) {
                row.isEdit = false;
                this.disabled = false;
              } else {
                this.percent = true;
              }
            } else {
              this.$message.error(res.msg);
            }
          }, response => {
            this.$message.error('网络原因');
          })
        }
      },
      getList() {
        this.$http.post(this.root + '/Plantform/parameter').then(response => {
          var res = response.body;
          if (res.status == 200) {
            res.content.list1.forEach(element => {
              element.isEdit = false;
            });
            this.dataList = res.content.list1;
            this.percentObj = res.content.list;
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      },
    },
    created() {
      this.getList()
    }
  }
</script>

<style scoped>
  hr {
    margin: 0;
  }
  
  .el-row--flex {
    margin: 10px 0;
  }
</style>