<template>
  <el-aside width="200px">
    <el-row>
      <el-col>
        <el-menu unique-opened background-color="#f5f5f5"
        text-color="#666666" :default-active="$store.state.highLightPath"
        >
          <template v-for="one in $store.state.navList">
            <el-menu-item v-if="one.isleaf == '0'" :index="one.href" @click.native="link(one.href)">
              <i class="el-icon-">
                <img :src="one.iconcls" v-show="!isIndex">
                <img :src="one.whiteIconcls" v-show="isIndex">
              </i>
              <span slot="title">{{one.modulename}}</span>
            </el-menu-item>

            <el-submenu :index="one.id" v-if="one.isleaf == '1'">
              <template slot="title">
                <i class="el-icon-"><img :src="one.iconcls"></i>
                <span slot="title">{{one.modulename}}</span>
              </template>
<el-menu-item-group v-for="two in one.cid" :key="two.id">
  <el-menu-item v-if="two.isleaf == '0'" :index="two.href" @click.native="link(two.href)">
    <i class="el-icon-"><img :src="two.iconcls" alt=""></i>
    <span slot="title">{{two.modulename}}</span>
  </el-menu-item>
  <!-- <el-submenu :index="two.id" v-if="two.isleaf == '1'">
    <template slot="title">
                    <span>{{two.modulename}}</span>
                  </template>
    <el-menu-item-group v-for="three in two.cid" :key="three.id">
      <el-menu-item :index="three.href" @click.native="link(three.href)">
        <span slot="title">{{three.modulename}}</span>
      </el-menu-item>
    </el-menu-item-group>
  </el-submenu> -->
</el-menu-item-group>
</el-submenu>

</template>

</el-menu>
</el-col>
</el-row>
</el-aside>
</template>

<script>
  export default {
    name: 'Navigation',
    data() {
      return {
        isIndex: true
      }
    },
    methods: {
      link(link) {
        this.$router.push({
          path: link,
          query: {
            t: +new Date() //保证每次点击路由的query项都是不一样的，从而会重新刷新view
          }
        })
        if (link == "/index") {
          this.isIndex = true
        } else {
          this.isIndex = false
        }
      }
    },
    created() {
      let link = this.$route.path;
      if (link == "/index") {
        this.isIndex = true
      } else {
        this.isIndex = false
      }
    }
  }
</script>

<style scoped>
  .el-aside {
    min-height: calc(100vh - 60px);
    background-color: #f5f5f5;
  }
  
   ::-webkit-scrollbar {
    width: 0
  }
</style>