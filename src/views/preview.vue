<template>
  <div class="preview" :class="{type2: $parent.currentBg === 1}">
    <div class="button">
      <div class="back" @click="$parent.showType='main'"><em>返回编辑</em></div>
      <div class="done" @click="$parent.showType='ending'"><em>生成贺卡</em></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseurl: window.baseurl,
    }
  },
  beforeCreate() {
    let app = document.getElementById('app')
    app.style = "background: url('./img/preview/bg.jpg') no-repeat;"
  },
  beforeDestroy() {
    let app = document.getElementById('app')
    app.style = ''
  },
}
</script>
<style lang="less" scoped>
.preview {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: calc(100vw * 1.608);
  &.type2 {
    .button {
      div {
        background: #c4e0ec;
      }
    }
  }
}
.button {
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 10vw;
  div {
    color: white;
    background: #e8bfb0;
    display: inline-block;
    border: 1px solid white;
    border-radius: 10vh;
    height: 9vw;
    padding: 0 4vw;
    &:first-child {
      margin-right: 9vw;
    }
    em {
      font-size: 5.2vw;
      line-height: 8.5vw;
    }
  }
}
img {
  position: absolute;
  bottom: 0;
}
</style>
