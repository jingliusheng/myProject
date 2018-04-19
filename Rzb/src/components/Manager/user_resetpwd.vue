<template>
  <div class="resetPwd">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
      <el-input type="hidden" v-model="ruleForm.id"></el-input>
      <el-form-item label="密码：" prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码(6-14位),数字或字母组合"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="repassword">
        <el-input type="password" v-model="ruleForm.repassword" auto-complete="off" placeholder="请确认密码"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click.native="submitForm('ruleForm')" :disabled="adding">保存</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    components: {
      breadcrumb
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validaterePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        breadcrumbData: {
          link: '/RZB_admin_user',
          primary_menu: '管理员',
          second_menu: '重置密码'
        },
        adding: false,
        ruleForm: {
          id: this.$route.params.id,
          password: '',
          repassword: ''
        },
        rules: {
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }, {
            required: true,
            pattern: /^[0-9a-zA-Z]{6,14}$/,
            message: '密码长度为6-14位的数字或字母组合',
            trigger: 'blur'
          }],
          repassword: [{
            required: true,
            validator: validaterePass,
            trigger: 'blur'
          }, {
            required: true,
            pattern: /^[0-9a-zA-Z]{6,14}$/,
            message: '密码长度为6-14位的数字或字母组合',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          //console.log(valid);true\false
          if (valid) {
            this.$confirm('是否确认重置密码？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.adding = true;
              this.$http.post(this.root + '/User/change_password', this.ruleForm).then(response => {
                var res = response.body;
                if (res.status == 200) {
                  this.$message.success(res.msg);
                  setTimeout(() => {
                    this.$router.go(-1);
                  }, 1000)
                } else {
                  this.$message.error(res.msg);
                  this.adding = false;
                }
              }, response => {
                this.$message.error('网络原因');
                this.adding = false;
              })
            }).catch(() => {
              this.$message.info('操作取消');
            });

          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.go(-1);
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