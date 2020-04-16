<template>
  <div id="app" class="app">
    <div v-if="file" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;">
      <vue-avatar @cancel="cancel" @done="done" :file="file" @touch="touch" />
    </div>
    <div>
      <input @change="changeUpload" id="avatar" type="file" />
    </div>
    <br />
    <br />
    <br />
    ==================
    <br />
    <button @click="review = !review">现在图片预览</button>
    <div v-if="review" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;">
      <vue-avatar
        file="http://192.168.101.252:5050/uInfo?token=c446af4ebd64a620080a8e22808c820729f5b98ad32fdc8b3e9b86b989ee61ee&image_type=thumbs&file_id=if1957082a6ec7f82c7a763909043a2cf"
        :edit="false"
        @touch="touch"
      />
    </div>
  </div>
</template>
<script>
import avatar from '../lib/'
console.log(avatar)
export default {
  name: 'app',
  data() {
    return {
      file: null,
      review: false,
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
    touch() {
      console.log('点击了')
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
