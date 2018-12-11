<template>
  <div class="message">
    <div class="bg"></div>
    <div class="msg-content">
      <div class="content">
        <slot />
      </div>
      <div class="btn-content">
        <a style="background: url('./img/X.png') center no-repeat;" @click="$parent.showRule = 0"></a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseurl: window.baseurl
    }
  },
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
  height: 100%;
  width: 100%;
  position: absolute;
}
.msg-content {
  padding: 5vw 3vw;
  width: 90vw;
  background: rgba(255, 255, 255, 0.87);
  position: relative;
  border-radius: 2vw;
  font-size: 5vw;
  border: 1px solid #a7a9aa;
  .content {
    border-radius: 2vw;
    text-align: center;
    color: #545454;
    line-height: 1.7;
    h1 {
      font-size: 4vw;
      margin-top: 2vw;
    }
    p {
      font-size: 3.2vw;
    }
    ul {
      li {
        font-size: 3.5vw;
        font-weight: bold;
        em {
          display: block;
          font-size: 3vw;
          font-weight: normal;
        }
      }
    }
  }
}
.btn-content {
  position: absolute;
  right: 0;
  top: 0;
  padding: 2vw;
  a {
    display: block;
    width: 4vw;
    height: 4vw;
    background-size: contain !important;
  }
}
.des {
  text-align: left;
  h2 {
    font-size: 3.5vw;
  }
}
</style>
