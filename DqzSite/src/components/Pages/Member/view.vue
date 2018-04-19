<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :breadcrumbData="breadcrumbData"></breadcrumb>
    <!-- 会员详情 -->
    <div class="viewBox">
      <el-row class="section">
        <el-row type="flex" align="middle">
          <el-col :span="8">
            <span>昵称：</span>{{memberInfo.uname}}
          </el-col>
          <el-col :span="8">
            <span>手机号码：</span>{{memberInfo.phone}}
          </el-col>
          <el-col :span="8">
            <span>注册时间：</span>{{memberInfo.regtime}}
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="8">
              <span>电圈号：</span>{{memberInfo.identifier}}
            </el-col>
            <el-col :span="8">
              <span>性别：</span>{{memberInfo.sex}}
            </el-col>
            <el-col :span="8">
              <span>注册IP：</span>{{memberInfo.regip}}
            </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="8">
            <span>地区：</span>{{memberInfo.province}}{{memberInfo.city}}{{memberInfo.county}}
          </el-col>
          <el-col :span="8">
            <span>来源：</span>{{regway}}
          </el-col>
        </el-row>
      </el-row>
      <el-row class="section" v-if="memberInfo.authstate>0">
        <el-row type="flex" align="middle">
          <el-col :span="8">
            <span>公司名称：</span>{{memberInfo.name}}
          </el-col>
          <el-col :span="8">
            <span>营业执照编号：</span>{{memberInfo.licensenum}}
          </el-col>
          <el-col :span="8">
            <span>企业所在地区：</span>{{memberInfo.eprovince}}{{memberInfo.ecity}}{{memberInfo.ecounty}}
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="8">
           <span>认证状态：</span>{{state}}
          </el-col>
          <el-col :span="8">
            <span>申请认证时间：</span>{{memberInfo.createtime}}
          </el-col>
          <el-col :span="8">
            <span>审核时间：</span>{{memberInfo.modifytime}}
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col>
            <span>审核备注：</span>{{memberInfo.remarks?memberInfo.remarks:'暂无备注'}}
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col>
            <span>企业营业执照：</span><img :src="'http://file.jxdqzb.com/'+memberInfo.licensepic" alt="企业营业执照" title="点击可查看" class="thumbImg" @click="imgview($event)">
          </el-col>
        </el-row>
      </el-row>
      <el-button type='primary' class="btn-hook" @click.native="$router.go(-1)">返回</el-button>
    </div>
<!-- 查看图片 -->
    <el-dialog title="图片查看" :visible.sync="dialogImg">
      <img :src="imgsrc" width="100%">
    </el-dialog>
  </div>
</template>

<script>
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    name: 'memberView',
    data() {
      return {
        breadcrumbData: {
          primary_menu: '会员管理',
          second_menu: '会员列表',
          third_menu: '会员详情'
        },
        id: '',
        memberInfo: {},
        dialogImg: false,
        imgsrc: ''
      }
    },
    components: {
      breadcrumb
    },
    computed: {
      regway() {
        let regStr = '';
        switch (this.memberInfo.regway) {
          case 'app':
            regStr = '电圈子APP'
            break;
          case 'pc':
            regStr = '电圈子官网'
            break;
          case 'rzb_app':
            regStr = '认证宝App'
            break;
          case 'rzb_wap':
            regStr = '认证宝移动端'
            break;
          case 'rzb_pc':
            regStr = '认证宝PC端'
            break;
          case 'hon_pc':
            regStr = 'E兑付PC端'
            break;
          case 'hon_wap':
            regStr = 'E兑付移动端'
            break;
          case 'synch':
            regStr = '同步'
            break;
          case 'ykt':
            regStr = '电气云课堂'
            break;
        }
        return regStr;
      },
      state() {
        let stateStr = '';
        switch (this.memberInfo.authstate) {
          case '1':
            stateStr = '待审核';
            break;
          case '2':
            stateStr = '未通过';
            break;
          case '3':
            stateStr = '已通过';
            break;
          default:
            stateStr = '未申请';
            break;
        }
        return stateStr;
      }
    },
    created() {
      this.id = this.$route.params.id;
      this.$axios.post('/member/member_view', {
          id: this.id
        })
        .then((response) => {
          let res = response.data;
          if (res.status == 200) {
            this.memberInfo = res.content;
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
            type: 'info',
            message: '网络原因,请稍后重试',
            duration: 1000
          });
        });
    },
    methods: {
      imgview(e) {
        this.imgsrc = e.target.getAttribute('src');
        this.dialogImg = true
      }
    }
  }
</script>

<style scoped></style>