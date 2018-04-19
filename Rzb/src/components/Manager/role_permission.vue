<template>
  <div class="editUser">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <el-collapse-transition name="el-zoom-in-top">
      <el-tree
        :data="permissionList"
        show-checkbox
        default-expand-all
        :default-checked-keys="checkedList"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        v-show="fadeShow"
        >
      </el-tree>
    </el-collapse-transition>
    <div class="btn_wrapper">
      <el-button type="primary" @click="save" :loading="adding">保存</el-button>
      <el-button type="primary" @click="$router.push('/RZB_admin_role')">返回</el-button>
    </div>
  </div>
</template>

<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    components: {
      breadcrumb
    },
    data() {
      return {
        breadcrumbData: {
          link: '/RZB_admin_role',
          primary_menu: '管理员',
          second_menu: '权限设置'
        },
        permissionList: [],
        checkedList: [],
        defaultProps: {
          children: 'cid',
          label: 'modulename'
        },
        adding: false,
        fadeShow: false
      }
    },
    methods: {
      save() {
        let checkedArr = this.$refs.tree.getCheckedKeys().join(",");
        this.adding = true;
        this.$http.post(this.root + '/User/role_choice', {
          roleid: this.$route.params.id,
          moduleid: checkedArr
        }).then(response => {
          let res = response.body;
          if (res.status == 200) {
            this.$message.success(res.msg);
            setTimeout(() => {
              this.adding = false;
              this.$router.push('/RZB_admin_role');
            }, 1000)
          } else {
            this.adding = false;
            this.$message.error(res.msg);
          }
        }, response => {
          this.adding = false;
          this.$message.error('网络原因');
        })
      }
    },
    created() {
      this.$http.post(this.root + '/User/role_power', {
        id: this.$route.params.id
      }).then(response => {
        let res = response.body;
        if (res.status == 200) {
          this.permissionList = res.content.auth;
          if (res.content.list.length > 0) {
            let selectedList = res.content.list;
            for (let index = 0; index < this.permissionList.length; index++) {
              let selectedParent = this.permissionList[index].id;
              for (let j = 0; j < selectedList.length; j++) {
                const element = selectedList[j].moduleid;
                if (selectedParent == element) {
                  selectedList.splice(j, 1);
                  break;
                }
              }
            }
            selectedList.forEach(element => {
              this.checkedList.push(element.moduleid);
            });
          }
          setTimeout(() => {
            this.fadeShow = true;
          }, 10)
        } else {
          this.$message.error(res.msg);
        }
      }, response => {
        this.$message.error('网络原因');
      })
    }
  }
</script>

<style>
  .el-tree {
    overflow: hidden;
  }
  
  .el-tree-node__children .el-tree-node {
    float: left;
  }
  
  .btn_wrapper {
    clear: both;
    margin-top: 20px
  }
</style>