<template>
  <div class="pointManage">
    <!-- 面包屑 -->
    <breadcrumb :breadcrumbData = "breadcrumbData"></breadcrumb>
    <div class="viewBox">
      <el-form :model="companyInfo" :rules="rules" label-position="left" status-icon ref="company_info" label-width="95px">
        <el-form-item label="企业名称：" prop="name">
          <el-input v-model="companyInfo.name" auto-complete="off" placeholder="不超过20个字" :maxlength="40" class="company_title"></el-input>
        </el-form-item>
        <el-form-item label="置顶：">{{companyInfo.istop=='0'?'否':'是'}}</el-form-item>
        <el-form-item label="热词推荐：">
          {{companyInfo.isrecommend=='0'?'否':'是'}}
          <div style="color:red">置顶和热词推荐需要修改，请联系电圈子总部</div>
        </el-form-item>
        <el-form-item label="企业标签：" required>
          <el-row type="flex" justify="start" :gutter="20">
            <el-col :span="0.5">
              <el-form-item prop="label1">
                <el-input auto-complete="off" placeholder="请输入标签名" :maxlength="2" class="company_label"  v-model='companyInfo.label1'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="0.5">
              <el-form-item prop="label2">
                <el-input auto-complete="off" placeholder="请输入标签名" :maxlength="2" class="company_label"  v-model='companyInfo.label2'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="0.5">
              <el-form-item prop="label3">
                <el-input auto-complete="off" placeholder="请输入标签名" :maxlength="2" class="company_label"  v-model='companyInfo.label3'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>   
        <el-form-item label="企业logo：" prop="logo">
          <el-upload
            class="logo-uploader"
            accept="image/jpg,image/png,image/jpeg,image/webp,image/gif,image/bmp"
            action="http://file.jxdqzb.com/image/upload"
            :data="paramData"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            >
            <!-- :before-upload="beforeBannerUpload" -->
            <img v-if="companyInfo.logo" :src="companyInfo.logo" class="logo">
            <i v-if="!companyInfo.logo" class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
          <div style="color:red">建议大小不超过100kb</div>
        </el-form-item>   
        <el-form-item label="企业简介：" prop="description">
          <div ref="editor1" class="editor"><p v-html="companyInfo.description"></p></div>
        </el-form-item>
        <el-form-item label="企业证书：(选填)">
          <div ref="editor2" class="editor"><p v-html="companyInfo.certificate"></p></div>
        </el-form-item>
        <el-form-item label="企业产品：(选填)">
          <el-button type="primary" @click.native="addProductDialog = true">点击添加</el-button>
        </el-form-item>
        <div class="companyProduct" v-if="companyInfo.product.length">
            <el-row type="flex" align="middle"
            v-for="(item,index) in companyInfo.product" :key="index">
            <el-col :span="3">
              <img :src="item.picture" alt="">
            </el-col>
            <el-col :span="19">
              <el-row>
                  产品名称：{{item.name}}
              </el-row>
              <el-row type="flex">
                <el-col style="width:90px;">产品介绍：</el-col>
                <el-col>{{item.description}}</el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" @click.native="delProduct(index,item.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('company_info')" :disabled="adding" v-if="companyInfo.id">保存</el-button>
          <el-button type="primary" @click="submitForm('company_info')" :disabled="adding" v-if="!companyInfo.id">添加</el-button>
          <el-button type="primary" @click="goback">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 添加，管理企业产品 -->
    <el-dialog
      title="添加企业产品"
      :visible.sync="addProductDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center width="35%">
        <el-dialog
        width="30%"
        :title="companyInfo.id ? '是否确定保存?' : '是否确定添加?'"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        center>
        <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="addProductInfoSure">添 加</el-button>
          </div>
      </el-dialog>
      <el-form :model="productInfo" :rules="productRules" ref="product_info" label-width="95px" label-position="left"  class="addProductBox">
        <el-form-item label="产品名称：" prop="name">
          <el-input v-model="productInfo.name" auto-complete="off" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品介绍：" prop="description">
          <el-input type="textarea" resize='none' :rows="4" v-model="productInfo.description" placeholder="请输入产品介绍"></el-input>
        </el-form-item>
        <el-form-item label="产品图片：" prop="picture">
          <el-upload
            class="picture-uploader"
            accept="image/jpg,image/png,image/jpeg,image/webp,image/gif,image/bmp"
            action="http://file.jxdqzb.com/image/upload"
            :data="productParamData"
            :show-file-list="false"
            :on-success="handleProductSuccess"
            >
            <!-- :before-upload="beforeProductUpload" -->
            <img v-if="productInfo.picture" :src="productInfo.picture" class="picture">
            <i v-else class="el-icon-plus picture-uploader-icon"></i>
          </el-upload>
          <div style="color:red">建议尺寸：188*230</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelProductInfo">取 消</el-button>
        <el-button type="primary" @click.native="addProductInfo">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const ISDEV = /\.dev/.test(location.hostname);
  import breadcrumb from '../Breadcrumb/breadcrumb'
  import E from 'wangeditor'
  export default {
    name: 'pointView',
    components: {
      breadcrumb
    },
    data() {
      var checkLen = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入企业名称'))
        } else if (this.$regobj.IsAllSpace(value)) {
          return callback(new Error('名称不能全为空格'));
        } else {
          let len = this.$regobj.getLen(value);
          if (len > 40) {
            return callback(new Error('名称不超过20个汉字'));
          } else {
            return callback();
          }
        }
      };
      var checkLabel1 = (rule, value, callback) => {
        if (!value && !this.companyInfo.label2 && !this.companyInfo.label3) {
          return callback(new Error('请输入企业标签'))
        } else if (this.companyInfo.label2 || this.companyInfo.label3) {
          return callback();
        } else if (value && this.$regobj.IsAllSpace(value)) {
          return callback(new Error('标签不能全为空格'))
        } else {
          this.$refs.company_info.validateField('label2');
          this.$refs.company_info.validateField('label3');
          return callback();
        }
      };
      var checkLabel2 = (rule, value, callback) => {
        if (!value && !this.companyInfo.label1 && !this.companyInfo.label3) {
          return callback(new Error('请输入企业标签'))
        } else if (this.companyInfo.label1 || this.companyInfo.label3) {
          return callback();
        } else if (value && this.$regobj.IsAllSpace(value)) {
          return callback(new Error('标签不能全为空格'))
        } else {
          this.$refs.company_info.validateField('label1');
          this.$refs.company_info.validateField('label3');
          return callback();
        }
      };
      var checkLabel3 = (rule, value, callback) => {
        if (!value && !this.companyInfo.label1 && !this.companyInfo.label2) {
          return callback(new Error('请输入企业标签'))
        } else if (this.companyInfo.label1 || this.companyInfo.label2) {
          return callback();
        } else if (value && this.$regobj.IsAllSpace(value)) {
          return callback(new Error('标签不能全为空格'))
        } else {
          this.$refs.company_info.validateField('label1');
          this.$refs.company_info.validateField('label2');
          return callback();
        }
      };
      return {
        breadcrumbData: {
          primary_menu: '点到为止',
          second_menu: '企业列表',
          third_menu: this.id !== 'null' ? '管理企业' : '添加企业'
        },
        id: '',
        adding: false,
        addProductDialog: false,
        innerVisible: false,
        descriptionEditor: {}, //企业简介
        certificateEditor: {}, //企业证书
        // 当前企业的信息
        companyInfo: {
          name: '',
          logo: '',
          istop: '0',
          isrecommend: '0',
          product: []
        },
        // 添加的企业产品信息
        productInfo: {
          name: '',
          description: '',
          picture: ''
        },
        // 上传企业产品图片的参数
        productParamData: {
          project: ISDEV ? 'ecircledev' : 'ecircle',
          path: 'other',
          rule: 'custom',
          thumb: 1
        },
        // 上传logo的参数
        paramData: {
          project: ISDEV ? 'ecircledev' : 'ecircle',
          path: 'logo',
          rule: 'custom',
          thumb: 1
        },
        // 添加、管理企业的规则
        rules: {
          name: [{
            required: true,
            message: '企业名称不能为空',
            trigger: 'blur'
          }, {
            validator: checkLen,
            trigger: 'change'
          }],
          logo: [{
            required: true,
            message: '请上传企业logo',
            trigger: 'blur,change'
          }],
          label1: [{
            validator: checkLabel1,
            trigger: 'blur,change'
          }],
          label2: [{
            validator: checkLabel2,
            trigger: 'blur,change'
          }],
          label3: [{
            validator: checkLabel3,
            trigger: 'blur,change'
          }],
          description: [{
            required: true,
            message: '请输入企业简介',
            trigger: 'blur'
          }]
        },
        // 添加企业产品的规则
        productRules: {
          name: [{
            required: true,
            message: '请输入产品名称',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入产品介绍',
            trigger: 'blur'
          }],
          picture: [{
            required: true,
            message: '请上传产品图片',
            trigger: 'blur,change'
          }]
        }
      }
    },
    beforeCreate() {
      this.id = this.$route.params.id;
    },
    created() {
      if (this.$route.params.id !== 'null') {
        this.$axios.post('/point/point_view', {
          id: this.$route.params.id
        }).then((response) => {
          let res = response.data;
          if (res.status == 200) {
            this.companyInfo = res.content;
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            message: '网路原因，请稍后重试',
            type: 'error'
          })
        })
      }
    },
    mounted() {
      this.descriptionEditor = new E(this.$refs.editor1);
      this.descriptionEditor.customConfig = {
        debug: true,
        zIndex: 100,
        uploadImgServer: 'http://file.jxdqzb.com/image/upload', // 配置服务器端地址
        uploadImgParams: {
          project: ISDEV ? 'ecircledev' : 'ecircle',
          path: 'other',
          rule: 'custom' // 属性值会自动进行 encode ，此处无需 encode
        },
        onblur: (html) => {
          let textContent = this.descriptionEditor.txt.text();
          if (this.$regobj.IsAllSpace(textContent)) {
            this.$message({
              message: '企业简介不能全为空格',
              duration: 2000
            })
          }
          // else {
          //   this.companyInfo.description = "";
          //   this.companyInfo.description = html;
          // }
          this.$refs.company_info.validateField('description')
        },
        uploadImgHooks: {
          before: function(xhr, editor, files) {
            console.log('before'); // 图片上传之前触发
          },
          success: function(xhr, editor, result) {
            console.log('uploadsuccess'); // 图片上传并返回结果，图片插入成功之后触发
          },
          fail: function(xhr, editor, result) {
            console.log('insertfail'); // 图片上传并返回结果，但图片插入错误时触发
          },
          error: function(xhr, editor) {
            console.log('uploaderror'); // 图片上传出错时触发
          },
          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          customInsert: function(insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果 result 必须是一个 JSON 格式字符串！！！否则报错
            var url = 'http://file.jxdqzb.com/' + result.data[0].url;
            insertImg(url)
          }
        }
      }
      this.descriptionEditor.create();

      this.certificateEditor = new E(this.$refs.editor2);
      this.certificateEditor.customConfig = {
        debug: true,
        zIndex: 100,
        uploadImgServer: 'http://file.jxdqzb.com/image/upload', // 配置服务器端地址
        uploadImgParams: {
          project: ISDEV ? 'ecircledev' : 'ecircle',
          path: 'other',
          rule: 'custom' // 属性值会自动进行 encode ，此处无需 encode
        },

        onblur: (html) => {
          let textContent = this.certificateEditor.txt.text();
          if (this.$regobj.IsAllSpace(textContent)) {
            this.$message({
              message: '企业证书不能全为空格',
              duration: 2000
            })
          }
        },
        uploadImgHooks: {
          before: function(xhr, editor, files) {
            console.log('before'); // 图片上传之前触发
          },
          success: function(xhr, editor, result) {
            console.log('uploadsuccess'); // 图片上传并返回结果，图片插入成功之后触发
          },
          fail: function(xhr, editor, result) {
            console.log('insertfail'); // 图片上传并返回结果，但图片插入错误时触发
          },
          error: function(xhr, editor) {
            console.log('uploaderror'); // 图片上传出错时触发
          },
          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          customInsert: function(insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果 result 必须是一个 JSON 格式字符串！！！否则报错
            var url = 'http://file.jxdqzb.com/' + result.data[0].url;
            insertImg(url)
          }
        }
      }
      this.certificateEditor.create();
    },
    methods: {
      // //logo上传之前
      // beforeBannerUpload(file) {
      //   let _self = this;
      //   let isLt100 = file.size / 1024 < 100;
      //   if (!isLt100) {
      //     _self.$message.error('logo大小不超过100k');
      //   }
      //   return isLt100;
      // },
      //logo上传成功的回调
      handleUploadSuccess(res, file) {
        this.companyInfo.logo = "http://file.jxdqzb.com/" + res.data[0].thumb;
        this.$refs.company_info.validateField('logo');
      },
      // 返回列表
      goback() {
        this.$router.go(-1);
        this.$route.meta.isreload = false;
      },
      //保存、添加
      submitForm(formName) {
        this.companyInfo.description = this.descriptionEditor.txt.html();
        this.companyInfo.certificate = this.certificateEditor.txt.html();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let tipText = this.companyInfo.id ? '是否确定保存?' : '是否确定添加?';
            this.$confirm(tipText, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
              })
              .then(() => {
                this.adding = true;
                this.$axios.post('/point/point_add', this.companyInfo).then(response => {
                  let res = response.data;
                  if (res.status == 200) {
                    this.$message.success(res.msg);
                    setTimeout(() => {
                      this.adding = false;
                      this.$router.go(-1);
                    }, 1000)
                    this.$route.meta.isreload = this.companyInfo.id ? false : true;
                  } else {
                    this.adding = false;
                    this.$message.error(res.msg);
                  }
                }, response => {
                  this.adding = false;
                  this.$message.error('网络原因,请稍后重试');
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
      // // 企业产品图片上传之前
      // beforeProductUpload(file) {
      //   let _self = this,
      //     Max_Width = 188,
      //     Max_Height = 230,
      //     fileData = file,
      //     isAllow = false;
      //   //读取图片数据
      //   let reader = new FileReader();
      //   reader.onload = function(e) {
      //     //加载图片获取图片真实宽度和高度
      //     let data = e.target.result,
      //       image = new Image();
      //     image.onload = function() {
      //       let width = image.width;
      //       let height = image.height;
      //       isAllow = width <= Max_Width && height <= Max_Height;
      //       if (!isAllow) {
      //         _self.$message.error('宽高未通过，要求width:' + Max_Width + ', height:' + Max_Height);
      //       } else {
      //         return isAllow;
      //       }
      //     };
      //     image.src = data;
      //   };
      //   reader.readAsDataURL(fileData);
      // },
      // 企业产品图片上传成功
      handleProductSuccess(res, file) {
        this.productInfo.picture = "http://file.jxdqzb.com/" + res.data[0].thumb;
        this.$refs.product_info.validateField('picture');
      },
      // 检验+询问 添加企业产品
      addProductInfo() {
        this.$refs.product_info.validate((valid) => {
          if (valid) {
            this.innerVisible = true;
          }
        })
      },
      // 取消添加企业产品
      cancelProductInfo() {
        this.addProductDialog = false
        this.productInfo = {
          name: '',
          description: '',
          picture: ''
        }
      },
      // 确定添加企业产品
      addProductInfoSure() {
        this.companyInfo.product.push(this.productInfo);
        this.addProductDialog = false
        this.innerVisible = false
        this.productInfo = {
          name: '',
          description: '',
          picture: ''
        }
      },
      // 删除企业产品
      delProduct(index, delId) {
        this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (delId) {
                this.$axios.post('/point/product_del', {
                  id: delId,
                }).then((response) => {
                  let res = response.data;
                  if (res.status == 200) {
                    this.$message({
                      message: '操作成功!',
                      duration: 1000,
                      type: 'success'
                    });
                    this.companyInfo.product.splice(index, 1);
                  } else {
                    this.$message({
                      message: res.msg,
                      duration: 1000,
                      type: 'error'
                    })
                  }
                }).catch(() => {
                  this.$message({
                    message: "网络原因,请稍后重试",
                    duration: 1000,
                    type: 'error'
                  })
                })
              } else {
                this.companyInfo.product.splice(index, 1);
              }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消删除',
                duration: 1000
              });
            });
          }).catch(() => {
            this.$message({
              message: '取消删除',
              duration: 1500
            })
          })
      }
    }
  }
</script>

<style scoped>
  .el-form {
    padding: 20px;
  }
  
  .company_title {
    width: 396px
  }
  
  .company_label {
    width: 130px
  }
  
  .logo-uploader-icon,
  .picture-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .logo-uploader-icon:hover,
  .picture-uploader-icon:hover {
    border-color: #409EFF;
  }
  
  .logo,
  .picture {
    width: 80px;
    height: 80px;
    display: block;
  }
  
  .hook {
    margin-bottom: 0
  }
  
  .editor {
    text-align: left;
  }
  
  .addProductBox {
    padding: 0;
  }
  
  .companyProduct {
    border: 1px solid #7c7f84;
    margin-bottom: 18px;
  }
  
  .companyProduct>.el-row {
    padding: 10px;
    border-bottom: 1px dashed #7c7f84;
  }
  
  .companyProduct>.el-row:last-child {
    border-bottom: none
  }
  
  .companyProduct .el-col-2,
  .companyProduct .el-col-3 {
    text-align: center;
  }
</style>