<template>
  <div class="work_view">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <div class="work_info">
<!-- 基本信息开始 -->
      <el-row class="section" type="flex" justify="start" align="middle">
        <el-col :md="24" :lg="10">
          <el-row type="flex">
            <el-col :span="6.5" class="work_info_title minWidth6">发单企业名称：</el-col>
            <el-col :span="17.5">{{workInfo.company}}</el-col>
          </el-row>
        </el-col>
        <el-col :md="24" :lg="7">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth5">用户手机号：</el-col>
            <el-col :span="15.5">{{workInfo.phone}}</el-col>
          </el-row>
        </el-col>
        <el-col :md="24" :lg="7">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">发布时间：</el-col>
            <el-col :span="15.5">{{workInfo.createtime}}</el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="section" type="flex" justify="start" align="top">
        <el-col :md="17" :lg="17">
          <el-row type="flex" align="middle">
            <el-col :span="3.5" class="work_info_title minWidth4">任务标题：</el-col>
            <el-col :span="20.5" v-show="!isedit">{{workInfo.title}}</el-col>
            <el-col :span="10" v-show="isedit"><el-input size="small" v-model="workInfo.title" :maxlength=20
             placeholder="一句话描述您的需求（不超过20个字）"></el-input></el-col>
          </el-row>
        </el-col>
        <el-col :md="7" :lg="7">
          <el-row type="flex">
            <el-col :span="7.5" class="work_info_title minWidth4">任务状态：</el-col>
            <el-col :span="16.5">{{workInfo.status_name}}</el-col>
          </el-row>
        </el-col>

        <el-col :md="24" :lg="17">
          <el-row type="flex" align="middle">
            <el-col :span="0.5" class="work_info_title minWidth4">任务描述：</el-col>
            <el-col :span="20" v-show="!isedit">{{workInfo.description}}</el-col>
            <el-col :span="20" v-show="isedit">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                :maxlength=100
                placeholder="请输入任务描述"
                v-model="workInfo.description">
              </el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex" align="middle">
            <el-col :span="7.5" class="work_info_title minWidth4">接单截止：</el-col>
            <el-col :span="16.5" v-show="!isedit">{{workInfo.deadline}}</el-col>
            <el-col :span="16.5" v-show="isedit">
              <el-date-picker
                v-model="workInfo.deadline"
                type="datetime"
                size="small"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :editable='false'
                :picker-options="pickerOptions0"
                placeholder="选择接单截止时间">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-col>

        <el-col :md="12" :lg="17">
          <el-row type="flex" align="middle">
            <el-col :span="3.5" class="work_info_title minWidth4">任务地区：</el-col>
            <el-col :span="20.5" v-show="!isedit">{{workInfo.province}}-{{workInfo.city}}-{{workInfo.county}}</el-col>
            <el-col :span="20.5" v-show="isedit">
              <el-cascader
                size="small"
                :options="cityOptions"
                v-model="selectedCity"
              ></el-cascader>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex" align="middle">
            <el-col :span="7.5" class="work_info_title minWidth3">服务费：</el-col>
            <el-col :span="16.5" v-show="!isedit">{{workInfo.fee}}元</el-col>
            <el-col :span="16" v-show="isedit">
              <el-input size="small" v-model="workInfo.fee" type="number" min='1' max='1000000' 
               @blur="checkMoney(workInfo.fee)" placeholder="请输入整数"></el-input>
            </el-col>
          </el-row>
        </el-col>

        <el-col :md="12" :lg="17">
          <el-row type="flex" align="middle">
            <el-col :span="3.5" class="work_info_title minWidth5">任务联系人：</el-col>
            <el-col :span="20.5" v-show="!isedit">{{workInfo.contact}}</el-col>
            <el-col :span="20.5" v-show="isedit">
              <el-input size="small" v-model="workInfo.contact" placeholder="请填写任务联系人姓名"></el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex" align="middle">
            <el-col :span="8.5" class="work_info_title minWidth5">联系人电话：</el-col>
            <el-col :span="15.5" v-show="!isedit">{{workInfo.lphone}}</el-col>
            <el-col :span="15.5" v-show="isedit">
              <el-input size="small" v-model="workInfo.lphone" placeholder="请填写任务联系人的手机号"></el-input>
            </el-col>
          </el-row>
        </el-col>

        <el-col :md="12" :lg="17">
          <el-row type="flex" align="middle">
            <el-col :span="3.5" class="work_info_title minWidth4">任务类型：</el-col>
            <el-col :span="20.5" v-show="!isedit">{{categoryName}}</el-col>
            <el-col :span="20.5" v-show="isedit">
              <el-select v-model="workInfo.category" placeholder="请选择任务类型" size='small' @change="changeFee">
                <el-option
                  v-for="item in worktype"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex" align="middle">
            <el-col :span="7.5" class="work_info_title minWidth5">初审/复查：</el-col>
            <el-col :span="16.5" v-show="!isedit">{{workInfo.type}}</el-col>
            <el-col :span="16.5" v-show="isedit">
              <el-select v-model="workInfo.type" placeholder="请选择" size='small' @change="changeFee">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
<!-- 基本信息结束 -->      
<!-- 接单人信息开始 -->
      <el-row class="section" type="flex" justify="start" align="middle" v-if="receive">
        <el-col :md="12" :lg="5">
          <el-row type="flex">
            <el-col :span="6.5" class="work_info_title minWidth5">接单人姓名：</el-col>
            <el-col :span="17.5">{{receive.name}}</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth6">接单人手机号：</el-col>
            <el-col :span="15.5">{{receive.phone}}</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="5">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth3">质保金：</el-col>
            <el-col :span="15.5">{{receive.money}}元</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">接单时间：</el-col>
            <el-col :span="15.5">{{receive.createtime}}</el-col>
          </el-row>
        </el-col>
      </el-row>
<!-- 接单人信息结束 -->      
<!-- 退款信息开始 -->
      <el-row class="section" type="flex" justify="start" align="middle" v-if="refund">
        <el-col :md="12" :lg="4">
          <el-row type="flex">
            <el-col :span="6.5" class="work_info_title minWidth4">退发单人：</el-col>
            <el-col :span="17.5">{{refund.demandermoney}}元</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="4">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">退接单人：</el-col>
            <el-col :span="15.5">{{refund.undertakermoney}}元</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="9">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">退款原因：</el-col>
            <el-col :span="15.5">{{refund.reason}}</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="7">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth6">申请退款时间：</el-col>
            <el-col :span="15.5">{{refund.createtime}}</el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">退款说明：</el-col>
            <el-col :span="15.5">{{refund.remarks}}</el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="section" type="flex" v-if="refund &&refund.refuse_reason">
        <el-col :span="2.5" class="work_info_title minWidth4">拒绝原因：</el-col>
        <el-col :span="21.5">{{refund.refuse_reason}}</el-col>
      </el-row>

      <el-row class="section" type="flex" v-if="refund && refund.realreason">
        <el-col :md="24" :lg="8">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth6">真实退款原因：</el-col>
            <el-col :span="15.5">{{refund.realreason}}</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth7">实际退还发单人：</el-col>
            <el-col :span="15.5">{{refund.realdemandermoney}}元</el-col>
          </el-row>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth7">实际退还接单人：</el-col>
            <el-col :span="15.5">{{refund.realundertakermoney}}元</el-col>
          </el-row>
        </el-col>
      </el-row>
<!-- 退款信息结束 -->
<!-- 评价开始 -->
      <el-row class="section" type="flex" justify="start" align="middle" v-if="fevaluate">
        <el-col>
          <el-row type="flex">
            发单人评价接单人：
          </el-row>
        </el-col>
        <el-col :md="23" :lg="11" :push="1">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">总体评价：</el-col>
            <el-col :span="15.5">
              <el-rate
                v-model="fevaluate.overallscore"
                show-text
                disabled
                :texts='allscoreText'>
              </el-rate>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="23" :lg="11" :push="1">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">服务态度：</el-col>
            <el-col :span="15.5">
              <el-rate
                v-model="fevaluate.attitudescore"
                show-text
                disabled
                :texts='attributeText'>
              </el-rate>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="23" :lg="11" :push="1">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">服务能力：</el-col>
            <el-col :span="15.5">
              <el-rate
                v-model="fevaluate.abilityscore"
                show-text
                disabled
                :texts="abilityText">
              </el-rate>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="23" :lg="23" :push="1">
          <el-row type="flex">
            <el-col :span="1.5" class="work_info_title">说明：</el-col>
            <el-col :span="20">{{fevaluate.content?fevaluate.content:'/'}}</el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="section" type="flex" justify="start" align="middle" v-if="receive_evaluate">
        <el-col>
          <el-row type="flex">
            接单人评价发单人：
          </el-row>
        </el-col>
        <el-col :md="23" :lg="23" :push="1">
          <el-row type="flex">
            <el-col :span="8.5" class="work_info_title minWidth4">总体评价：</el-col>
            <el-col :span="15.5">
              <el-rate
                v-model="receive_evaluate.overallscore"
                show-text
                disabled
                :texts='allscoreText'>
              </el-rate>
            </el-col>
          </el-row>
        </el-col>
        <el-col :md="23" :lg="23" :push="1">
          <el-row type="flex">
            <el-col :span="1.5" class="work_info_title">说明：</el-col>
            <el-col :span="20">{{receive_evaluate.content?receive_evaluate.content:'/'}}</el-col>
          </el-row>
        </el-col>
      </el-row>
<!-- 评价结束 -->
<!-- 操作日志 -->
      <el-row class="section">
        <el-table
          :data="workRecord"
          stripe
          show-header
          header-row-class-name = 'headerRow'>
          <el-table-column
            prop="operatorname"
            label="操作者">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作" >
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="操作时间">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="原因"
            :formatter="formatter"
            >
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="operateArea">
        <div v-if="workInfo.status == '100' && !isedit">
          <el-row type="flex" align="middle">
            <el-col :span="2.5" class="work_info_title minWidth5">审核状态：</el-col>
            <el-col :span="21.5">
              <el-select v-model="checkObj.code" size='small'>
                <el-option
                  v-for="item in checkOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="6.5" class="work_info_title minWidth5">不通过原因：</el-col>
            <el-col :span="10">
              <el-input 
                size="small"
                v-model="checkObj.remarks" 
                placeholder="请输入不通过原因" 
                :maxlength=30
                :disabled="checkObj.code == '1'"
                ></el-input>
            </el-col>
            <el-col :span="10">不超过30个字</el-col>
          </el-row>
         </div>

        <div v-if="workInfo.status == '700' || workInfo.status == '720' ">
          <el-row type="flex" align="middle">
            <el-col :span="2.5" class="work_info_title minWidth6">真实退款原因：</el-col>
            <el-col :span="21.5">
              <el-select v-model="refundObj.realreason" size='small' @change="changeReason">
                <el-option
                  v-for="item in refundOptions"
                  :key="item.id"
                  :label="item.reason"
                  :value="item.reason">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="6.5" class="work_info_title minWidth7">实际退还发单人：</el-col>
            <el-col :span="10.5">
              <el-input 
                size="small"
                type="number"
                v-model='refundObj.rfmoney'
                :max='workInfo.fee'
                :disabled="refundCannotEdit"
                :placeholder="refundText"
                ></el-input>
            </el-col>
          </el-row>
         </div>
        <el-button type="primary" v-if="!isedit" @click="$router.go(-1)">返回</el-button>
        <el-button type="primary" v-if="workInfo.status == '100' && !isedit" @click="submit">提交</el-button>
        <el-button type="primary" v-if="workInfo.status == '100' && isedit" @click="editCancle">取消</el-button>
        <el-button type="primary" v-if="workInfo.status == '100' && isedit" @click="editsave">保存</el-button>
        <el-button type="primary" v-if="workInfo.status == '100' && !isedit" @click="edit">修改</el-button>
        <el-button type="primary" v-if="workInfo.status == '400'" @click="certificateSuccess">认证完成</el-button>
        <el-button type="primary" v-if="workInfo.status == '500'" @click="confirmSuccess">确认完成</el-button>
        <el-button type="primary" v-if="workInfo.status == '700' || workInfo.status == '720'" @click="refundSure">确定</el-button>
        
      </el-row>
    </div>
  </div>
</template>

<script>
  import bus from '../../assets/js/eventBus';
  import cityData from '../../assets/city/city.json'
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    components: {
      breadcrumb
    },
    computed: {
      categoryName() {
        let str = '';
        switch (this.workInfo.category) {
          case '1':
            str = 'ISO9001'
            break;
          case '2':
            str = 'ISO14001'
            break;
          case '3':
            str = 'OHSAS18001'
            break;
          case '4':
            str = 'FSC森林认证'
            break;
          case '5':
            str = 'CCC'
            break;
          case '6':
            str = 'ISO20000'
            break;
          case '7':
            str = 'ISO22000'
            break;
          case '8':
            str = 'PEFC森林认证'
            break;
          case '9':
            str = 'ISO27001'
            break;
          case '10':
            str = 'ISO13485'
            break;
          case '11':
            str = 'HACCP'
            break;
          case '12':
            str = 'IATF16949'
            break;
          case '13':
            str = 'GB/T50430'
            break;
          default:
            break;
        }
        return str;
      }
    },

    data() {
      return {
        breadcrumbData: {
          link: this.$route.fullPath.match(/\/\w+/)[0],
          primary_menu: '任务管理',
          second_menu: '任务详情'
        },
        isedit: false, //是否修改任务
        cityOptions: cityData, //省市数据
        selectedCity: [], //选中的城市
        workInfo: {}, //任务详情页公共部分
        receive: {}, //接单人相关的信息
        refund: {}, //退款信息
        fevaluate: {}, //发单人评价
        receive_evaluate: {}, //接单人评价
        workRecord: [], //操作日志记录

        allscoreText: ["非常不满意", "不满意", "一般", "满意", "非常满意"], //总体评价对应文字描述
        attributeText: ["非常差", "差", "一般", "好", "非常好"], //服务态度
        abilityText: ["非常弱", "弱", "一般", "强", "非常强"], //服务能力

        typeOptions: [{ //初审、复查
          value: '初审',
          label: '初审'
        }, {
          value: '复查',
          label: '复查'
        }],
        worktype: [], //任务类型
        checkOptions: [{ //审核选项
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '审核不通过'
        }],

        //审核操作的对象
        checkObj: {
          code: '1',
          remarks: ''
        },
        refundOptions: [], //退款的下拉框
        refundObj: { //退款操作的对象
          id: '', //任务id
          tid: '', //退款id
          status: '', //任务当前状态

          responsible: '0', //责任方：1己方责任，0对方责任
          realreason: '', //文字信息
          rfmoney: '', //实际退还发单人
          rjmoney: '0', //实际退接单人的钱
        },
        refundCannotEdit: true, //退款金额的是否可以编辑
        refundText: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    methods: {
      /**
       * @description 格式化操作记录中的原因  原因为空显示 //
       **/
      formatter(column) {
        return column.remarks ? column.remarks : '//';
      },

      /** 
       *@description 提交审核操作
       * */
      submit() {
        if (this.checkObj.code === '2' & this.checkObj.remarks === '') {
          this.$alert('请输入不通过原因', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              console.log(action);
            }
          });
        } else {
          this.checkObj.id = this.workInfo.id;
          this.checkObj.status = this.workInfo.status;
          this.$confirm('确定提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post(this.root + '/Work/status_submit', this.checkObj).then(response => {
              var res = response.body;
              if (res.status == 200) {
                this.$message.success(res.msg);
                this.getInfo();
                bus.$emit('workId', this.$route.params.id);
              } else {
                this.$message.error(res.msg);
              }
            }, response => {
              this.$message.error('网络原因');
            })
          }).catch(() => {
            this.$message.info('操作取消');
          });
        }

      },

      /**
       * @description 认证完成
       */
      certificateSuccess() {
        this.$confirm('已认证完成？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/Work/status_finish', {
            id: this.workInfo.id,
            status: this.workInfo.status
          }).then(response => {
            var res = response.body;
            if (res.status == 200) {
              this.$message.success(res.msg);
              this.getInfo();
              bus.$emit('workId', this.$route.params.id);
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

      /**
       * @description 确认完成 
       */
      confirmSuccess() {
        this.$confirm('确定完成？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/Work/status_confirm', {
            id: this.workInfo.id,
            status: this.workInfo.status
          }).then(response => {
            var res = response.body;
            if (res.status == 200) {
              this.$message.success(res.msg);
              this.getInfo();
              bus.$emit('workId', this.$route.params.id);
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

      /**
       * @description 切换真实退款原因
       * */
      changeReason(value) {
        this.refundOptions.forEach(element => {
          if (element.reason == value) {
            this.refundObj.responsible = element.responsible;
            if (element.responsible == '0') { //不可编辑
              this.refundCannotEdit = true;
              this.refundObj.rfmoney = Number(this.workInfo.fee) + Number(this.receive.money);
              this.refundText = this.refundObj.rfmoney + '元';
            } else {
              this.refundObj.rfmoney = '';
              this.refundCannotEdit = false;
              this.refundText = '最多可退' + this.workInfo.fee + '元';
            }
          }
        });
      },
      /**
       * @description 退款确认
       **/
      refundSure() {
        let money = /\./;
        if (this.refundObj.responsible == '1') {
          if (money.test(this.refundObj.rfmoney) || this.refundObj.rfmoney == '' || this.refundObj.rfmoney == '0' || Number(this.refundObj.rfmoney) > Number(this.workInfo.fee)) {
            console.log(this.refundObj);
            this.$alert('请输入正确的退款金额', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                console.log(action);
              }
            });
            return false;
          } else {
            this.refundObj.rjmoney = Number(this.workInfo.fee) + Number(this.receive.money) - Number(this.refundObj.rfmoney);
          }
        } else {
          this.refundObj.rfmoney = Number(this.workInfo.fee) + Number(this.receive.money);
          this.refundObj.rjmoney = '0';
        }

        this.$confirm('确定退款？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(this.root + '/Work/refund_confirm', this.refundObj).then(response => {
            var res = response.body;
            if (res.status == 200) {
              this.$message.success(res.msg);
              this.getInfo();
              bus.$emit('workId', this.$route.params.id);
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

      /**
      @description 修改
      **/
      edit() {
        this.workInfo.fee = parseInt(this.workInfo.fee);
        this.isedit = true;
      },
      /** 
       *@description 修改之后的保存
       * */
      editsave() {
        let reg = /\./g;
        let nameReg = /^[\u4e00-\u9fa5]{2,4}$/g;
        let phontReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        this.workInfo.province_id = this.selectedCity[0];
        this.workInfo.city_id = this.selectedCity[1];
        this.workInfo.county_id = this.selectedCity[2];
        if (!this.workInfo.title || !this.workInfo.description || !this.workInfo.province_id || !this.workInfo.city_id || !this.workInfo.county_id || !this.workInfo.deadline || !this.workInfo.fee || !this.workInfo.contact || !this.workInfo.lphone) {
          this.$alert('请将必填项填写完整！', '提示')
        } else if (reg.test(this.workInfo.fee) || this.workInfo.fee < 1 || this.workInfo.fee > 1e6) {
          this.$alert('请输入正确的服务费,1-100万的正整数', '提示');
        } else if (!nameReg.test(this.workInfo.contact)) {
          this.$alert('请输入正确的姓名', '提示');
        } else if (!phontReg.test(this.workInfo.lphone)) {
          this.$alert('请输入正确的手机号', '提示');
        } else {
          this.workInfo.fee = this.workInfo.fee + '.00';
          this.$http.post(this.root + '/Work/work_edit', this.workInfo).then(response => {
            let res = response.body;
            if (res.status == 200) {
              this.isedit = false;
              this.$message.success(res.msg);
              this.getInfo();
            } else {
              this.$message.error(res.msg);
            }
          }, response => {
            this.$message.error('网络原因')
          })
        }
      },

      /** 
       *@description 取消修改
       * */
      editCancle() {
        this.isedit = false;
        this.getInfo();
      },

      /**
       * @description 检测服务费用
       * */
      checkMoney(value) {
        let moneyReg = new RegExp("^[1-9]\\d{0,6}$");
        if (this.isedit) {
          if (!moneyReg.test(value)) {
            this.$alert('请输入1-100万的正整数', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                console.log(action);
              }
            });
          }
        }
      },

      /**
       * @description 切换初审、复查、任务类型之后获取对应的服务费
       */
      changeFee() {
        this.$http.post(this.root + '/Work/work_fee', {
          id: this.workInfo.category,
          type: this.workInfo.type
        }).then(response => {
          let res = response.body;
          if (res.status == 200) {
            this.workInfo.fee = parseInt(res.content.fee);
          }
        })
      },

      /**
       * @description 获取任务信息
       * */
      getInfo() {
        this.$http.post(this.root + '/Work/work_view', {
          id: this.$route.params.id
        }).then(response => {
          let res = response.body;
          if (res.status == 200) {
            this.workInfo = res.content.list;
            this.receive = res.content.list1;
            this.refund = res.content.list2;
            this.fevaluate = res.content.list3;
            this.receive_evaluate = res.content.list4;
            this.workRecord = res.content.record;
            this.worktype = res.content.work_type;
            this.selectedCity = [this.workInfo.province_id, this.workInfo.city_id, this.workInfo.county_id];
            if (this.workInfo.status == '700' || this.workInfo.status == '720') {
              this.getRefundReason();
            }
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      },

      /**
       * @description 获取退款原因
       * */
      getRefundReason() {
        this.refundObj.id = this.workInfo.id;
        this.refundObj.status = this.workInfo.status;
        this.refundObj.tid = this.refund.id;
        this.refundObj.realreason = '审查未通过';

        this.$http.get(this.root + '/Work/refund_reason').then(response => {
          let res = response.body;
          if (res.status == 200) {
            this.refundOptions = res.content;
            this.refundText = Number(this.workInfo.fee) + Number(this.receive.money) + '元';
          } else {
            this.$message.error(res.msg);
          }
        })
      }
    },

    created() {
      this.getInfo();
    }
  }
</script>

<style scoped>
  .work_info {
    border: 1px solid #666666;
    width: 80%;
    font-size: 14px;
  }
  
  .section {
    border-bottom: 1px dashed #666666;
    padding: 0 15px;
    flex-wrap: wrap;
  }
  
  .el-col {
    margin: 5px 0;
  }
  
  .work_info_title {
    font-weight: bold;
  }
  
  .minWidth3 {
    min-width: 56px;
  }
  
  .minWidth4 {
    min-width: 70px;
  }
  
  .minWidth5 {
    min-width: 84px;
  }
  
  .minWidth6 {
    min-width: 100px;
  }
  
  .minWidth7 {
    min-width: 112px;
  }
  
  .operateArea {
    padding: 0 15px;
  }
  
  .el-button {
    margin: 15px
  }
</style>