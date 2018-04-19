<template>
  <el-header>
    <el-row type="flex" justify="space-around" align="middle">
      <el-col class="logoWrapper">
        <img src="../../assets/img/logo.png" height="40"> 电圈子在线合伙人
        <span>|</span>
        管理后台
      </el-col>
      <el-col>
        <el-row type="flex" justify="end" align="middle">
          <span class="loginer">{{$store.state.loginUser}}</span>
          <el-button @click.native="logout" :disabled="!islogin">退出</el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
</template>
<script>
const isDev = /\.dev/.test(location.hostname);
const ENV = isDev ? "" : "";
export default {
  name: "Head",
  data() {
    return {
      islogin: true
    };
  },
  created() {
    this.$axios
      .get("/Index/user_info")
      .then(response => {
        let res = response.data;
        if (res.status == 200) {
          let str = res.content.province + "--" + res.content.username;
          this.$store.commit("saveLoginer", str);
          this.$store.commit("saveBannerCityList", res.content.site);
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Error1", error.response.data);
          console.log("Error11", error.response.status);
          console.log("Error111", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log("Error2", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error3", error.message);
        }
        console.log(error.config);
      });
  },
  methods: {
    logout() {
      this.$confirm("此操作将会退出登录,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .post("/public/logout")
          .then(response => {
            let res = response.data;
            if (res.status == 200) {
              this.$store.commit("saveLoginer", "");
              this.islogin = false;
              window.location.href = ENV;
            }
          })
          .catch(() => {});
      });
    }
  }
};
</script>
<style scoped>
.el-header {
  padding: 10px 20px;
}

.loginer {
  color: red;
  margin: 0 15px;
  cursor: default;
}

.logoWrapper {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.logoWrapper img {
  margin-right: 15px;
}

.logoWrapper span {
  margin: 0 15px;
}
</style>