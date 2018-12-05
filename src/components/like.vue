<template>
  <div class="likeContent" :style="'background: white;'">
    <div class="lcontent">
      <div class="box liketitle">经过系统分析，最适合你的告白语是：</div>
      <div class="box">
        <div class="systemText"><img :src="msg" alt="" /></div>
      </div>
      <div class="dislikeBtn" :style="'background:url('+baseurl+'/img/loading/noLike.png) center no-repeat;'" @click="getMsg"></div>
      <div class="box sendText">
        <textarea class="inputText" v-model="inMsg" placeholder="您亲手写下的字句，对我来说好过所有告白文案。"></textarea>
      </div>
      <div class="confirm" :style="'background:url('+baseurl+'/img/loading/like.png) center no-repeat;'" @click="confirmText"></div>
    </div>
  </div>
</template>
<script>
function getText() {
  var l = 20
  var key = Math.floor(Math.random() * l + 1)
  return baseurl + `/img/text/${key}.png`
}
export default {
  data() {
    return {
      baseurl: '',
      msg: '',
      inMsg: '',
    }
  },
  created() {
    this.confirmText()
    // this.getMsg()
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
  },
  methods: {
    getMsg() {
      this.msg = getText()
    },
    confirmText() {
      this.$parent.endToLike = false
      this.$parent.msg = this.inMsg ? this.inMsg : this.msg
      this.$parent.showType = 'ending'
    },
  },
}
</script>
<style lang="less" scoped>
.likeContent {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 20100;
  background: url(/img/loading/bg.jpg);
}
.lcontent {
  display: block;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.systemText {
  // line-height: 150%;
  font-size: 5.8vw;
  font-weight: 100;
  color: #ee718e;
  height: auto;
  img {
    width: 100%;
    display: block;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
}
.box {
  display: block;
  margin: 0 auto;
  text-align: center;
  padding: 3vw;
}
.liketitle {
  color: #53afae;
  margin-top: 5vh;
  font-size: 5vw;
}
.sendText {
  textarea {
    width: 80vw;
    height: 22vh;
    font-size: 5.8vw;
    line-height: 150%;
    color: #ee718e;
    border: 0;
    border-radius: 6px;
    padding: 2vw 3vw;
  }
}
.dislikeBtn,
.confirm {
  display: block;
  margin: 3vh auto;
  width: 80vw;
  height: 19vw;
}
.dislikeBtn {
  background-size: auto 100% !important;
}
.confirm {
  background-size: auto 100% !important;
  margin-bottom: 12vh;
}
</style>
