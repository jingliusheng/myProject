<template>
  <div class="my">
    <div class="myInfo">
      <div class="myAvata">
        <div class="avatarWrapper">
          <img :src="userinfo.avatar" class="avatarImg">
          <span class="isVip">
            <img src="./vipIcon.png" width="23" height="23">
          </span>
          <form id="form">
            <input type="file" name="file" class="uploadImg" accept="image/gif,image/jpeg,image/jpg,image/png" @change="uploadImg($event)">
          </form>
        </div>
        <div class="myName"  v-show="!login">
          <p class="myInfo-name">{{userinfo.uname}}({{userinfo.phone}})</p>
          <p class="myInfo-name">邀请码：{{userinfo.invitation_code}}</p>
          <p class="myInfo-name">修行符：{{userinfo.balance}} 
            <x-button type="warn" class="btn balance" @click.native="recharge">购买修行符</x-button> 
          </p>
        </div>
      </div>
      <div v-show="!login">
        <p class="myInfo-level">
          会员等级:Lv{{userinfo.level}}
          (法力加持{{userinfo.power}}，距离Lv{{userupper.level}}只差{{userupper.lacking_score}})
        </p>
        <p class="myInfo-level">
          使者等级:Lv{{userinfo.messenger_level}}
          (法力加持{{userinfo.messenger_power}}，距离Lv{{messengerupper.level}}只差{{messengerupper.lacking_number}})
        </p>
      </div>
      <x-button type="warn" class="btn" link="/login" v-show="login">立即登录</x-button>
      <x-button type="warn" class="btn" link="/register" v-show="register">立即注册</x-button>
      <x-button type="warn" class="btn" link="/bindphone" v-show="bindphone">绑定手机</x-button>
      <x-button type="warn" class="btn" link="/editname" v-show="!login">修改昵称</x-button>
      <x-button type="warn" class="btn" link="/editphone" v-show="changePhone">修改手机</x-button>
    </div>
    <p class="records">名下会员</p>
    <Scroller lock-x use-pullup @on-pullup-loading="loadMore" :pullup-config="upconfig" height="-242" ref="scroller">
      <div>
        <img src="./noData.png" width="54" class="noRecords" v-show="!dataList.length">
        <ul class="recordsList">
          <li class="vux-1px-b recordsList-item" v-for="(item,index) in dataList" :key="index">
            <div class="recordsList-item-time"><img :src="item.avatar"></div>
            <div class="recordsList-item-type">
              <span>手机号码：{{item.phone}}</span>&nbsp;
              <span>等级：{{item.level}}</span>
              <p>注册时间：{{item.reg_time}}</p>
            </div>
          </li>
        </ul>
      </div>
    </Scroller>  
  </div>
</template>

<script>
import { XButton, Scroller } from "vux";

export default {
  data() {
    return {
      page: 1,
      userinfo:{},
      userupper:{},
      messengerupper:{},
      dataList: [],
      myfull:false,
      login:true,
      register:true,
      bindphone:false,
      changePhone:false,
      upconfig: {
        content: "上拉加载",
        pullUpHeight: 40,
        height: 40,
        autoRefresh: false,
        downContent: "释放加载数据",
        upContent: "上拉加载",
        loadingContent: "加载中...",
        clsPrefix: "xs-plugin-pullup-"
      }
    };
  },
  components: {
    XButton,
    Scroller
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "幸运之家--我的";
    if(sessionStorage.getItem('user')){
      this.userinfo = JSON.parse(sessionStorage.getItem('user'));
      this.userupper = this.userinfo.upper_user_level;
      this.messengerupper = this.userinfo.upper_messenger_level;
      this.login = false;
      this.register = false;
      if(!this.userinfo.phone){
        this.bindphone = true;
      }else{
        this.changePhone = true;
      }
    }else{
      this.login = true;
      this.register = true;
    }
    this.$http.get(this.GLOBAL.BASEURL + "User/invited_user").then(res=>{
      var response = res.body;
      if (response.status === this.GLOBAL.STATUSOBJ.ok) {
        this.dataList = response.content.list;
        if(this.dataList.length<10){
           this.$refs.scroller.disablePullup();
        }
      }else if(response.status === this.GLOBAL.STATUSOBJ.noLogin){
        this.$refs.scroller.disablePullup();        
      }else{
        this.$refs.scroller.disablePullup();
        this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: response.msg
        });
      }
    },res=>{
      this.$vux.toast.show({
          width: "15em",
          type: "text",
          text: "网络错误，请稍后重试"
        });
    })
  },
  methods: {
    uploadImg(){
      var _this = this;
      $("#form").ajaxSubmit({
        type: "POST",
        dataType: "JSON",
        url: "http://www.xingyunfu.org/Luck/upload_image",
        async: false,
        data: {
          photo: $("#form").serialize(),
          type:'avatar'
        },
        success: function(res) {
          if(res.status == 200) {
            _this.modifyAvatar(res.content.url)
          } else {
            alert(res.msg);
          }
        }
      })
    },
    modifyAvatar(url){
      var _this = this;
      this.$http.post(this.GLOBAL.BASEURL + 'user/modify_info',{avatar:url}).then(res=>{
        if (res.status == this.GLOBAL.STATUSOBJ.ok) {
          _this.userinfo.avatar='/'+url;
        }
      })
    },
    my(){
      this.$router.push({path:'/my'});
    },
    recharge(){
       this.$router.push({path:'/recharge'});
    },
    loadMore() {
      this.page++;
      this.$http.get(this.GLOBAL.BASEURL + "User/invited_user", { params: {page:this.page} }).then(
        response => {
          var response = response.body;
          if (response.status == this.GLOBAL.STATUSOBJ.ok) {
            this.dataList = this.dataList.concat(response.content);
            this.$nextTick(() => {
              this.$refs.scroller.donePullup();
              this.$refs.scroller.reset();

              this.page++;
              this.$http
                .get(this.GLOBAL.BASEURL + "User/invited_user", { params: {page:this.page} })
                .then(response => {
                  response = response.body;
                  if (response.status != this.GLOBAL.STATUSOBJ.ok) {
                    this.$refs.scroller.disablePullup();
                  }
                });
              this.page--;
            });
          }else{
            this.$refs.scroller.disablePullup();
          }
        },
        response => {
           this.$refs.scroller.reset({
             top:0
           });
          this.$vux.toast.show({
            width: "15em",
            type: "text",
            text: "网络错误，请稍后重试"
          });
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.my {
  margin-bottom: -50px;
  background-color: #ffffff;
  .myInfo {
    padding:14px;
    text-align: center;
    .myAvata {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      .avatarWrapper{
        position: relative;
        margin-right: 10px;
        .avatarImg{
          width: 75px;
          height: 75px;
          border: 5px solid #ececec;
          background: #d3d3d3;
          border-radius: 50%;
          box-sizing: border-box;
        }
        .isVip {
          position: absolute;
          left: 45px;
          top: 45px;
        }
        .uploadImg{
          position: absolute;
          width: 75px;
          height: 75px;
          top: 0;
          left: 0;
          opacity: 0;
        }
      }
      .myName{
        line-height: 23px;
        color:#666666;
        font-size: 15px;
        text-align: left;        
      }
    }
    .myInfo-level{
      color:#666666;
      font-size: 13px;
      line-height: 23px;
      text-align: left;
    }
    .btn {
      display: inline-block;
      width: 80px;
      height: 26px;
      font-size: 13px;
      line-height: 26px;
      margin: 10px 15px;
      padding: 0;
      &.balance{
        margin: 0 15px;
      }
    }
  }
  .records {
    padding: 10px 15px;
    color: #666666;
    font-size: 13px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: space-between;
    span{
      color: #17499F;
    }
  }
  .noRecords {
    display: block;
    margin: 44px auto 0;
  }
  .recordsList {
    .recordsList-item{
      padding-left: 15px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-right: 15px;
      box-sizing: border-box;
      color:#999999;
      font-size: 13px;
      line-height: 25px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .recordsList-item-type{
        color:#333333;
        font-size: 14px;
        line-height: 27px;
        margin-left: 15px;
      }
    }
  }
}
</style>
