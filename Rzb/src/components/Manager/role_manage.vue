<template>
  <div class="roleManage">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <el-form :model="roleForm" :rules="rules" ref="roleForm" label-position="right" label-width="100px" class="demo-roleForm">
      <el-form-item label="角色名："  prop="rolename" required>
        <el-input v-model="roleForm.rolename" auto-complete="off" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item label="角色描述：">
        <el-input type="textarea" v-model="roleForm.rolenotes"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('roleForm')" :disabled="adding" v-if="isManage">保存</el-button>
        <el-button type="primary" @click="submitForm('roleForm')" :disabled="adding" v-if="!isManage">添加</el-button>
        <el-button type="primary" @click="resetForm('roleForm')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import bus from '../../assets/js/eventBus';
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default{
    components: {
      breadcrumb
    },
    computed:{
      isManage(){
        return this.$route.params.id == 'null' ? false : true;
      }
    },
    data(){
      var validateRolename = (rule, value, callback)=>{
        if(value == ''){
          callback(new Error('请输入角色名'));
        }else{
          callback();
        }
      };
      return{
        breadcrumbData:{
          link:'/RZB_admin_role',
          primary_menu:'管理员',
          second_menu:this.$route.params.id == 'null'?'添加角色':'管理角色'
        },
        adding:false,
        roleForm: {
          rolename:'',
          rolenotes:''
        },
        rules: {
          rolename:[
            {  validator: validateRolename, trigger: 'blur,change' },
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.adding = true;
            this.$http.post(this.root + '/User/role_update',this.roleForm).then(response=>{
              var res = response.body;
              if(res.status == 200){
                bus.$emit('roleId',this.$route.params.id);
                this.$message.success(res.msg);
                setTimeout(()=>{
                  this.adding = false;
                  this.$router.push({path:'/RZB_admin_role'})
                },1000)
              }else{
                this.adding = false;
                this.$message.error(res.msg);
              }
            },response=>{
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
        this.$router.push({path:'/RZB_admin_role'})
      }
    },
    mounted(){
      if(this.isManage){
        this.$http.post(this.root + '/User/role_view',{id:this.$route.params.id}).then(response=>{
          var res = response.body;
          if(res.status == 200){
            this.roleForm = res.content;
          }else{
            this.$message.error(res.msg);
          }
        },response=>{
          this.$message.error('网络原因');
        })
      }
    }
  }
</script>

<style scoped>
.demo-roleForm{
  width: 500px;
}
</style>
