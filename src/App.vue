<template>
  <div id="app" class="app" @touchmove="test">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    // console.log(this.$route)
  },
  methods: {
    test(e) {
      // e.preventDefault()
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
  margin-top: calc((100vh - (100vw * 1.77)) / 2);
}
</style>
