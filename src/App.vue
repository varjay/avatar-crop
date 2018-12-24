<template>
  <div id="app" class="app">
    <div v-if="file" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;">
      <vue-avatar @cancel="cancel" @done="done" :file="file" />
    </div>
    <div>
      <input @change="changeUpload" id="avatar" type="file">
    </div>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      file: null,
    }
  },
  methods: {
    async changeUpload() {
      let a = document.getElementById('avatar')
      this.file = a.files[0]
    },
    cancel() {
      this.file = null
    },
    done(arg) {
      console.log(arg)
    },
  },
}
</script>
<style lang="less">
@import './less/public.less';
.app {
  position: fixed;
  height: 100%;
  width: 100%;
}
html,
body {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
body > img {
  position: fixed;
  left: 0;
  width: 100vw;
  top: 0;
  margin-top: calc((100vh - (100vw * 1.608)) / 2);
}
</style>
