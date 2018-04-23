<template>
  <div class = "sort">
    <transition name = "fade">
      <div class = "sort-background" v-show = "sortShow" @touchstart = "toggleSort"></div>
    </transition>
    <div class = "sort-wrapper vux-1px-b">
      <div class = "left">排序</div>
      <div class = "right" @click = "toggleSort">
        <span class = "value">{{sortList[sortVal].name}}</span>
        <span class = "arrow" ref = "rotateArrow"></span>
      </div>
    </div>
    <transition name = "fold">
      <ul class = "sort-list" v-show = "sortShow">
        <li v-for = "(item,k) in sortList" :class = "{'current-sort':k===sortVal}" @click = "chooseSort(k)">{{item.name}}</li>
      </ul>
    </transition>
  </div>
</template>

<script type = "text/ecmascript-6">
  export default{
    props: {
      sortList: {
        type: Array,
        dafault() {
          return [];
        }
      },
      defaultSort: {
        type: Number
      }
    },
    data(){
      return {
        sortShow: false,
        sortVal: this.defaultSort
      }
    },
    watch: {
      sortShow(curVal, oldVal){
        if (curVal) {
          this.$refs.rotateArrow.style.transform = 'rotate(180deg)';
        } else {
          this.$refs.rotateArrow.style.transform = 'rotate(0)';
        }
      }
    },
    methods: {
      toggleSort() {
        this.sortShow = !this.sortShow;
        this.$store.state.bgShow = !this.$store.state.bgShow;
      },
      chooseSort(k) {
        this.sortShow = false;
        this.$store.state.bgShow = false;
        if (this.sortVal !== k) {
          this.sortVal = k;
          this.$emit('sortChoose', this.sortList[k].value);
        }
      }
    }
  };
</script>

<style lang = "less" scoped>
  .sort {
    position: fixed;
    width: 100%;
    z-index: 503;
    top: 44px;
  }
  .sort-wrapper {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding: 0 14px 0 28px;
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    z-index: 2;
    .left {
      color: #333333;
    }
    .right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #999999;
      .arrow {
        width: 0;
        height: 0;
        margin-top: 4px;
        border: 5px solid transparent;
        border-top: 5px solid #999999;
        transform-origin: 50% 25%;
      }
    }
  }
  .sort-list {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    padding: 9px 0;
    text-align: center;
    background-color: #FFFFFF;
    li {
      line-height: 30px;
      &.current-sort {
        position: relative;
        color: #4891FE;
        &:after {
          content: '';
          width: 12px;
          height: 8px;
          position: absolute;
          top: 10px;
          right: 60px;
          background-image: url("../List/right-icon.png");
          background-size: 100% 100%;
        }
      }
    }
  }
  .sort-background {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 40px;
    left: 0;
    background-color: rgba(7, 17, 27, 0.6);
  }
  .fold-enter-active, .fold-leave-active {
    transform: translate3d(0, 0, 0);
    transition: all .5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0, -100%, 0);
  }
</style>
