<template>
    <div>
        <script :id=id type="text/plain"></script>
    </div>
</template>
<script>
  export default {
    name: 'UE',
    data() {
      return {
        editor: {}
      }
    },
    props: {
      defaultMsg: {
        type: String,
        default: '默认文本'
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
    },
    watch: {
      'defaultMsg': function(newVal, oldVal) {
        let _this = this;
        this.editor = UE.getEditor(_this.id, _this.config); // 初始化UE
        this.editor.addListener("ready", function() {
          _this.editor.setContent(newVal); // 确保UE加载完成后，放入内容。
        });
      }
    },
    mounted() {
      let _this = this;
      this.editor = UE.getEditor(_this.id, _this.config); // 初始化UE
      this.editor.addListener("ready", function() {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent();
      },
      hasContents() {
        return this.editor.hasContents();
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style>

</style>