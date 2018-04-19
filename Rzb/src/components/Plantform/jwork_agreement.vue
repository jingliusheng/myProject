<template>
  <div class="memberAgreement">
    <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>  
    <div class="ue_wrapper" v-show="ready">
      <UE :defaultMsg="ueMsg.content" :config="config" :id="ueId" ref="ue"></UE>  
      <el-button type="primary" @click="save">保存</el-button>  
    </div>  
  </div>
</template>

<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  import UE from '../UE/ue'
  export default {
    components: {
      breadcrumb,
      UE
    },
    data() {
      return {
        breadcrumbData: {
          link: '/RZB_plantform_banner',
          primary_menu: '平台管理',
          second_menu: '接单认证协议'
        },
        config: {
          initialFrameWidth: 900,
          initialFrameHeight: 350,
          scaleEnabled: true, //是否可以拉伸长高，默认true(当开启时，自动长高失效)
          focus: true, //初始化时，是否让编辑器获得焦点true或false
          elementPathEnabled: false, //是否启用元素路径，默认是true显示
          maximumWords: 1e7 //{Number} [默认值：10000] 允许的最大字符数
        },
        ueMsg: {},
        ueId: 'ue',
        ready: false
      }
    },
    beforeCreate() {
      this.$http.post(this.root + '/Plantform/agreement', {
        type: 'undertaker'
      }).then(response => {
        let res = response.body;
        if (res.status == 200) {
          this.ueMsg = res.content;
        }
      }, response => {
        this.$message.error('网络问题')
      })
    },
    mounted() {
      this.ready = true;
    },
    methods: {
      save() {
        if (!this.$refs.ue.hasContents()) {
          this.$message.warning('内容不能为空！');
        } else {
          this.$http.post(this.root + '/Plantform/agreement_update', {
            id: this.ueMsg.id,
            content: this.$refs.ue.getUEContent()
          }).then(response => {
            var res = response.body;
            this.$message.success(res.msg);
          }, response => {
            this.$message.error('网络问题')
          })
        }
      }
    }
  }
</script>

<style scoped>
  .el-button--primary {
    margin-top: 20px
  }
</style>