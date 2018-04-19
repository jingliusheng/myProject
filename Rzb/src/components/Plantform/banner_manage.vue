<template>
<div class="roleManage">
        <breadcrumb :breadcrumbData = 'breadcrumbData'></breadcrumb>
        <el-form :model="roleForm" :rules="rules"  ref="roleForm" label-position="right" label-width="100px" class="demo-roleForm">
            <el-form-item label="名称：" prop="title" required>
                <el-input v-model="roleForm.title" auto-complete="off" placeholder="请输入名称(不超过32字)"></el-input>
            </el-form-item>
            <el-form-item label="图片：" prop="pic" required>
                <el-upload
                        class="avatar-uploader"
                        accept="image/jpg,image/png,image/jpeg,image/webp,image/gif,image/bmp"
                        action="/"
                        :data="paramData"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeBannerUpload">
                    <img v-if="roleForm.pic" :src="roleForm.pic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div style="color:red">app的图片大小750*340 不超过500kb</div>
            </el-form-item>
            <el-form-item label="显示时间：" required>
              <el-col :span="11">
                <el-form-item prop="starttime" required>
                  <el-date-picker 
                  type="date" 
                  value-format="yyyy-MM-dd" 
                  placeholder="请选择开始时间" 
                  v-model="roleForm.starttime"
                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="col-center">至</el-col>
              <el-col :span="11">
                <el-form-item prop="endtime" required>
                  <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择结束时间"
                  v-model="roleForm.endtime"
                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="排序：">
                <el-input v-model="roleForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="链接：">
                <el-input placeholder="请输入链接（可为空）" v-model="roleForm.targeturl"></el-input>
            </el-form-item>
            <el-form-item label="是否显示：" required>
                <el-radio v-model="isshow" label="0">是</el-radio>
                <el-radio v-model="isshow" label="1">否</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('roleForm')" :disabled="adding" v-if="isManage">保存</el-button>
              <el-button type="primary" @click="submitForm('roleForm')" :disabled="adding" v-if="!isManage">添加</el-button>
              <el-button type="primary" @click="resetForm('roleForm')">返回</el-button>
            </el-form-item>
        </el-form>
</div>
</template>

<script type="text/ecmascript-6">
import bus from "../../assets/js/eventBus";
import breadcrumb from "../Breadcrumb/breadcrumb";
export default {
  components: {
    breadcrumb
  },
  computed: {
    isManage() {
      return this.$route.params.id == "null" ? false : true;
    }
  },
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择开始时间"));
      } else if (value !== "" && this.roleForm.endtime !== "") {
        if (this.roleForm.starttime > this.roleForm.endtime) {
          callback(new Error("开始时间不能大于结束时间"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkEndTime = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择结束时间"));
      } else if (value !== "" && this.roleForm.starttime !== "") {
        if (this.roleForm.starttime > this.roleForm.endtime) {
          callback(new Error("结束时间不能小于开始时间"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      breadcrumbData: {
        link: "/RZB_plantform_banner",
        primary_menu: "平台管理",
        second_menu:
          this.$route.params.id == "null" ? "添加banner" : "管理banner"
      },
      adding: false,
      paramData: {
        project: "rzbdev",
        path: "banner"
      },
      roleForm: {
        title: "",
        pic: "",
        starttime: "",
        endtime: "",
        weight: "",
        targeturl: ""
      },
      isshow: "1",
      rules: {
        title: [
          { required: true, message: "请输入名称", trigger: "blur,change" },
          { min: 1, max: 32, message: "不超过32个字", trigger: "blur,change" }
        ],
        pic: [{ required: true, message: "请上传图片" }],
        starttime: [
          { required: true, message: "请选择开始时间", trigger: "blur,change" },
          { validator: checkStartTime, trigger: "blur,change" }
        ],
        endtime: [
          { required: true, message: "请选择结束时间", trigger: "blur,change" },
          { validator: checkEndTime, trigger: "blur,change" }
        ]
      }
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.roleForm.pic = res.data[0].url;
    },
    beforeBannerUpload(file) {
      let _this = this;
      let isLt500 = file.size / 1024 < 500;
      if (!isLt500) {
        _this.$message.error("图片大小不超过500kb");
      }
      return isLt500;
    },

    submitForm(formName) {
      this.roleForm.isshow = this.isshow;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.adding = true;
          this.$http
            .post(this.root + "/Plantform/banner_update", this.roleForm)
            .then(
              response => {
                var res = response.body;
                if (res.status == 200) {
                  bus.$emit("roleId", this.$route.params.id);
                  this.$message.success(res.msg);
                  setTimeout(() => {
                    this.adding = false;
                    this.$router.push({ path: "/RZB_plantform_banner" });
                  }, 1000);
                } else {
                  this.adding = false;
                  this.$message.error(res.msg);
                }
              },
              response => {
                this.adding = false;
                this.$message.error("网络原因");
              }
            );
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/RZB_plantform_banner" });
    }
  },
  mounted() {
    if (this.isManage) {
      this.$http
        .post(this.root + "/Plantform/banner_edit", {
          id: this.$route.params.id
        })
        .then(
          response => {
            var res = response.body;
            if (res.status == 200) {
              this.roleForm = res.content;
              this.isshow = this.roleForm.isshow;
            } else {
              this.$message.error(res.msg);
            }
          },
          response => {
            this.$message.error("网络原因");
          }
        );
    }
  }
};
</script>

<style scoped>
.demo-roleForm {
  width: 500px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
.col-center {
  text-align: center;
}
</style>
