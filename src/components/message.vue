<template>
  <div class="message">
    <div class="bg"></div>
    <div class="msg-content">
      {{text}}
      <div class="btn-content">
        <a @click="$parent.showMsg = 0">确定</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['text'],
}
</script>
<style lang="less" scoped>
.message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 99999999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg {
  background: rgba(0, 0, 0, 0.27);
  height: 100%;
  width: 100%;
  position: absolute;
}
.msg-content {
  width: 80vw;
  padding: 6vh 10vw;
  background: #d1f1ff;
  position: relative;
  border-radius: 2vw;
  font-size: 5vw;
  padding-bottom: 3vh;
  box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.7);
}
.btn-content {
  margin-top: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    color: #102e40;
    background: #5fc6ff;
    display: block;
    width: 20vw;
    height: 10vw;
    text-align: center;
    line-height: 10vw;
    border-radius: 3vw;
  }
}
</style>
