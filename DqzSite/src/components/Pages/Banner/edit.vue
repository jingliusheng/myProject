<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :breadcrumbData='breadcrumbData'></breadcrumb>
    <!-- banner详情区 -->
    <div class="viewBox">
        <el-form :model="tempbanner" label-position="left" status-icon ref="banner_form" :rules="rules" label-width="95px">
            <el-form-item label="名称：" prop="title">
              <el-input v-model="tempbanner.title" auto-complete="off" placeholder="不超过32个字" :maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="图片：" prop="pic">
              <el-upload
                class="banner-uploader"
                accept="image/jpg,image/png,image/jpeg,image/webp,image/gif,image/bmp"
                action="http://file.jxdqzb.com/image/upload"
                :data="paramData"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                >
                <!-- :before-upload="beforeBannerUpload" -->
                <img v-if="tempbanner.pic" :src="tempbanner.pic" class="banner">
                <i v-else class="el-icon-plus banner-uploader-icon"></i>
              </el-upload>
              <div style="color:red">app的图片大小750*340 不超过500kb</div>
            </el-form-item>
            <el-form-item label="地区：" prop="cname">
              <el-select v-model="tempbanner.cname" placeholder="请选择" @change="changCname">
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="显示时间：" required>
              <el-col :span="11">
                <el-form-item prop="starttime" class="hook">
                  <el-date-picker 
                  type="date" 
                  :editable="false"
                  value-format="yyyy-MM-dd" 
                  placeholder="请选择开始时间" 
                  v-model="tempbanner.starttime"
                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align:center;">至</el-col>
              <el-col :span="11">
                <el-form-item prop="endtime" class="hook">
                  <el-date-picker
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择结束时间"
                  v-model="tempbanner.endtime"
                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="tempbanner.weight"></el-input>
            </el-form-item>
            <el-form-item label="链接：">
                <el-input placeholder="请输入链接（可为空）" v-model="tempbanner.targeturl"></el-input>
            </el-form-item>
            <el-form-item label="是否显示：" required>
                <el-radio v-model="tempbanner.isshow" label="1">是</el-radio>
                <el-radio v-model="tempbanner.isshow" label="0">否</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('banner_form')" :disabled="adding" v-if="tempbanner.id">保存</el-button>
              <el-button type="primary" @click="submitForm('banner_form')" :disabled="adding" v-if="!tempbanner.id">添加</el-button>
              <el-button type="primary" @click="hide">返回</el-button>
            </el-form-item>
          </el-form>
    </div>
  </div>
</template>

<script>
  const ISDEV = /\.dev/.test(location.hostname);
  import breadcrumb from '../Breadcrumb/breadcrumb'
  export default {
    name: 'editBanner',
    components: {
      breadcrumb
    },
    props: {
      bannerObject: {
        type: Object
      }
    },
    data() {
      var checkLen = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入名称'))
        } else if (this.$regobj.IsAllSpace(value)) {
          return callback(new Error('名称不能全为空格'));
        } else {
          let len = this.$regobj.getLen(value);
          if (len > 64) {
            return callback(new Error('名称不超过32个汉字'));
          } else {
            return callback();
          }
        }
      };
      var checkStartTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择开始时间'));
        } else if (value !== '' && this.tempbanner.endtime !== '') {
          if (this.tempbanner.starttime > this.tempbanner.endtime) {
            callback(new Error('开始时间不能大于结束时间'))
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      var checkEndTime = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择结束时间'));
        } else if (value !== '' && this.tempbanner.starttime !== '') {
          if (this.tempbanner.starttime > this.tempbanner.endtime) {
            callback(new Error('结束时间不能小于开始时间'))
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        breadcrumbData: {
          primary_menu: '平台管理',
          second_menu: 'Banner列表',
          third_menu: this.bannerObject.id ? '管理轮播图' : '添加轮播图'
        },
        paramData: {
          project: ISDEV ? 'ecircledev' : 'ecircle',
          path: 'banner',
          rule: 'custom'
        },
        adding: false,
        options1: this.$store.state.bannerCityList,
        tempbanner: {},
        rules: {
          title: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }, {
            validator: checkLen,
            trigger: 'change'
          }],
          pic: [{
            required: true,
            message: '请上传图片',
            trigger: 'blur,change'
          }],
          cname: [{
            required: true,
            message: '请选择地区',
            trigger: 'blur,change'
          }],
          starttime: [{
            required: true,
            message: '请选择开始时间',
            trigger: 'blur,change'
          }, {
            validator: checkStartTime,
            trigger: 'blur,change'
          }],
          endtime: [{
            required: true,
            message: '请选择结束时间',
            trigger: 'blur,change'
          }, {
            validator: checkEndTime,
            trigger: 'blur,change'
          }]
        }
      }
    },
    created() {
      this.tempbanner = this.bannerObject;
      this.tempbanner._self = JSON.parse(JSON.stringify(this.bannerObject))
    },
    methods: {
      //隐藏
      hide() {
        this.$emit('cancleEdit', this.tempbanner);
      },
      // //banner上传之前的
      // beforeBannerUpload(file) {
      //   let _this = this;
      //   let isLt500 = file.size / 1024 < 500;
      //   if (!isLt500) {
      //     _this.$message.error('图片大小不超过500kb');
      //   }
      //   return isLt500;
      // },
      //banner上传成功的回调
      handleUploadSuccess(res, file) {
        this.tempbanner.pic = "http://file.jxdqzb.com/" + res.data[0].url;
      },
      //保存、添加
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let tipText = this.tempbanner.id ? '是否确定保存?' : '是否确定添加?';
            this.$confirm(tipText, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
              })
              .then(() => {
                delete this.tempbanner._self;
                this.adding = true;
                this.$axios.post('/Index/banner_add', this.tempbanner)
                  .then((response) => {
                    let res = response.data;
                    if (res.status == 200) {
                      setTimeout(() => {
                        if (!this.tempbanner.id) {
                          this.$emit('addSure');
                        } else {
                          this.$emit('editSure')
                        }
                        this.adding = false;
                      }, 1000);
                      this.$message({
                        message: res.msg,
                        duration: 1000,
                        type: 'success'
                      })
                    } else {
                      this.adding = false;
                      this.$message({
                        message: res.msg,
                        duration: 1000,
                        type: 'error'
                      })
                    }
                  })
                  .catch(() => {
                    this.adding = false;
                    this.$message({
                      message: "网络原因,请稍后重试",
                      duration: 1000,
                      type: 'error'
                    })
                  })
              })
              .catch(() => {
                this.$message({
                  message: '操作取消',
                  duration: 1000
                })
              })
          }
        });
      },
      //下拉框值发生变化
      changCname(arg) {
        if (arg == this.options1[0].name) {
          this.tempbanner.sign = '1'
        } else {
          this.tempbanner.sign = '0'
        }
      }
    }
  }
</script>

<style scoped>
  .el-form {
    width: 500px;
    padding: 20px;
  }
  
  .banner-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .banner-uploader-icon:hover {
    border-color: #409EFF;
  }
  
  .banner {
    width: 100px;
    height: 100px;
    display: block;
  }
  
  .hook {
    margin-bottom: 0
  }
</style>