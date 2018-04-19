<template>
  <div class="addUser">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="ruleForm.username" auto-complete="off" placeholder="请输入用户名(4-12个字符)"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式：" prop="phone">
        <el-input v-model.number="ruleForm.phone" auto-complete="off" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password" v-if="!isManage">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码(6-14位),数字或字母组合"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="repassword" v-if="!isManage">
        <el-input type="password" v-model="ruleForm.repassword" auto-complete="off" placeholder="请确认密码"></el-input>
      </el-form-item>
      <el-form-item label="设置角色：" prop="roleid">
        <el-select v-model="ruleForm.roleid" placeholder="请选择用户角色">
          <el-option v-for="role in roleList" :key="role.id" :label="role.rolename" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="submitForm('ruleForm')" :disabled="adding" v-if="isManage">保存</el-button>
        <el-button type="primary" @click.native="submitForm('ruleForm')" :disabled="adding" v-if="!isManage">添加</el-button>
        <el-button type="primary" @click="resetForm('ruleForm')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import bus from '../../assets/js/eventBus';
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    components: {
      breadcrumb
    },
    data() {
      var validateUname = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      var validateName = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      };

      var validatePhone = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入联系方式'));
        } else if (isNaN(value)) {
          callback(new Error('联系方式为数字'));
        } else if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的联系方式'));
        } else {
          callback();
        }
      };
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
      var validateRole = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请选择用户角色'));
        } else {
          callback();
        }
      };

      return {
        breadcrumbData: {
          link: '/RZB_admin_user',
          primary_menu: '管理员',
          second_menu: this.$route.params.id == 'null' ? '添加用户' : '管理用户'
        },
        adding: false,
        roleList: [],
        ruleForm: {
          username: '',
          name: '',
          phone: '',
          password: '',
          repassword: '',
          roleid: ''
        },
        rules: {
          username: [{
            required: true,
            validator: validateUname,
            trigger: 'blur'
          }, {
            required: true,
            min: 4,
            max: 12,
            message: '长度在 4 到 12 个字符',
            trigger: 'blur'
          }, ],
          name: [{
            required: true,
            validator: validateName,
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            validator: validatePhone,
            trigger: 'blur'
          }],
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
          }],
          roleid: [{
            required: true,
            validator: validateRole,
            trigger: 'blur'
          }, ]
        }
      }
    },
    computed: {
      isManage() {
        return this.$route.params.id == 'null' ? false : true
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          //console.log(valid);true\false
          if (valid) {
            let text = this.isManage ? '是否确认修改用户' : '是否确认添加用户'
            this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.adding = true;
              this.$http.post(this.root + '/User/user_update', this.ruleForm).then(response => {
                var res = response.body;
                if (res.status == 200) {
                  bus.$emit('userId', this.$route.params.id);
                  this.$message.success(res.msg);
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
            }).catch(() => {
              this.$message.info('操作取消');
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
    mounted() {
      if (this.isManage) {
        this.$http.post(this.root + '/User/user_view', {
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

      this.$http.get(this.root + '/User/user_role').then(response => {
        var res = response.body;
        if (res.status == 200) {
          this.roleList = res.content;
        } else {
          this.$message.error(res.msg);
        }
      }, response => {
        this.$message.error('网络原因');
      })

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