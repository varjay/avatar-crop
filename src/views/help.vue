<template>
  <div class="help">
    <div class="search">
      <div v-if="(curr === 1) || (curr === 2)" class="scroll"></div>
      <div v-if="curr===3" class="dropdown" style="background: url('./img/drawdown_white.png') center center no-repeat;"></div>
      <div v-if="curr===4" class="done"  style="background: url('./img/btn/option-done-white.png') center center no-repeat;"></div>
    </div>
    <div class="text">
      <p v-if="curr===1">点击喜欢的元素<br>可在上方画板内编辑</p>
      <p v-else-if="curr===2">上下滑动素材区域<br>可查看更多素材</p>
      <p v-else-if="curr===3">点击向下箭头<br>完整显示画板</p>
      <p v-else-if="curr===4">点击相机图标<br>生成您编辑好的贺卡</p>
      <span @click="curr+=1"><em>下一步</em></span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scroll: 1,
      curr: 1,
    }
  },
  watch: {
    curr(n) {
      if (n > 4) {
        this.$parent.showHelp = 0
      }
    },
  },
}
</script>
<style lang="less" scoped>
.help {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 20001;
}
.done {
  right: 6vw;
  top: -9vw;
  height: 7vw;
  width: 8vw;
  position: absolute;
  background-size: 100% !important;
}
.dropdown {
  background-size: 100% !important;
  width: 8vw;
  height: 8vw;
  position: absolute;
  margin-left: calc(50% - 4vw);
  top: 0;
  animation: button 2s infinite linear;
}
.text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60vw;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  span {
    display: block;
    border: 1px solid;
    border-radius: 4vw;
    padding: 0 1.4vw;
    height: 6vw;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 6vw;
    em {
      font-size: 4.2vw;
      display: block;
      line-height: 6vw;
    }
  }
  p {
    font-size: 4vw;
    text-align: center;
    line-height: 1.8;
  }
}
.search {
  height: 70vw;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.scroll {
  position: absolute;
  bottom: 0;
  width: 92%;
  height: calc(100% - 6vh - 4vw);
  margin-left: 4%;
  margin-bottom: 4vw;
  border-radius: 3vw;
  border: 1px solid white;
}
</style>
