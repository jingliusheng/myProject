<template>
    <div class="help_update">
        <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
        <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
            <el-form-item label="标题：" prop="title" required>
                <el-input v-model="ruleForm.title" auto-complete="off" placeholder="请输入标题(不超过15个字)"></el-input>
            </el-form-item>
            <el-form-item label="适用于：" prop="role" required>
                    <el-radio v-model="ruleForm.role" label="1">发单用户</el-radio>
                    <el-radio v-model="ruleForm.role" label="2">接单用户</el-radio>
            </el-form-item>
            <el-form-item label="是否显示：" prop="isshow" required>
                    <el-radio v-model="ruleForm.isshow" label="1">是</el-radio>
                    <el-radio v-model="ruleForm.isshow" label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="内容：" prop="content" required>
                <UE :defaultMsg="ruleForm.content" :config="config" :id="ueId" ref="ue"></UE>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" :disabled="adding" v-if="isManage">保存</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" :disabled="adding" v-if="!isManage">添加</el-button>
                <el-button type="primary" @click="resetForm('ruleForm')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script type="text/ecmascript-6">
  import UE from '../UE/ue'
  import breadcrumb from '../Breadcrumb/breadcrumb'
  import bus from '../../assets/js/eventBus';
  export default {
    components: {
      breadcrumb,
      UE
    },
    data() {
      var validateTitle = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入标题'));
        } else {
          callback();
        }
      };
      return {
        breadcrumbData: {
          link: '/RZB_plantform_help',
          primary_menu: '平台管理',
          second_menu: this.$route.params.id == 'null' ? '添加使用帮助' : '管理使用帮助'
        },
        adding: false,
        ruleForm: {
          title: '',
          role: '1',
          isshow: '0',
          content: ''
        },
        rules: {
          title: [{
            validator: validateTitle,
            trigger: 'blur,change'
          }, {
            max: 15,
            message: '不超过15个字',
            trigger: 'blur,change'
          }, ],
          content: [{
            required: true,
            message: '请输入内容'
          }]
        },
        config: {
          initialFrameWidth: 900,
          initialFrameHeight: 250,
          scaleEnabled: true, //是否可以拉伸长高，默认true(当开启时，自动长高失效)
          focus: true, //初始化时，是否让编辑器获得焦点true或false
          elementPathEnabled: false, //是否启用元素路径，默认是true显示
          maximumWords: 1e7 //{Number} [默认值：10000] 允许的最大字符数
        },
        ueId: 'ue',
      }
    },
    computed: {
      isManage() {
        return this.$route.params.id == 'null' ? false : true
      }
    },
    methods: {
      submitForm(formName) {
        this.ruleForm.content = this.$refs.ue.getUEContent();
        this.$refs[formName].validate((valid) => {
          //console.log(valid);true\false
          if (valid) {
            this.adding = true;
            this.$http.post(this.root + '/Plantform/help_update', this.ruleForm).then(response => {
              var res = response.body;
              if (res.status == 200) {
                this.$message.success(res.msg);
                bus.$emit('helpId', this.$route.params.id);
                setTimeout(() => {
                  this.adding = false;
                  this.$router.go(-1);
                }, 1000)
              } else {
                this.adding = false;
                this.$message.error(res.msg);
              }
            }, response => {
              this.adding = false;
              this.$message.error('网络原因');
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.go(-1);
      }
    },
    created() {
      if (this.isManage) {
        this.$http.post(this.root + '/Plantform/help_edit', {
          id: this.$route.params.id
        }).then(response => {
          var res = response.body;
          if (res.status == 200) {
            this.ruleForm = res.content;
          } else {
            this.$message.error(res.msg);
          }
        }, response => {
          this.$message.error('网络原因');
        })
      }


    }
  }
</script>

<style scoped>
  .demo-ruleForm {
    width: 500px;
  }
  
  .el-select {
    width: 100%
  }
</style>