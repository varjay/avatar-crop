<template>
  <div>
    <input id="taokouling" style="opacity: 0;position: absolute;border: 0;display: block;padding: 0;" type="text" readonly value="【oliviaburton旗舰店】，復·制这段描述￥RayhbNUl0YP￥后咑閞👉手机淘宝👈或者用浏览器咑閞https://m.tb.cn/h.3LaUpaN查看">
    <div :class="'app-'+showType" id="ending">
      <transition name="ending">
        <ending v-if="showType === 'ending'" class="ending"></ending>
      </transition>
      <transition name="preview">
        <preview v-if="showType === 'preview'" />
      </transition>
      <loading v-if='loading'/>
      <template v-else>
        <div class="draw-container" :class="{overhidden: showType==='preview'}">
          <!-- <transition name="like">
            <like v-show="showType === 'like'"/>
          </transition> -->
          <div ref="draw" @click="touchback" id="draw" class="draw" :style="'background:url('+baseurl+data.bg[currentBg].url+') no-repeat'">
            <!-- <img class="full-moon" v-if="mongs > 0" :src="baseurl+'/img/petal.png'"> -->
            <tietu v-for="(item , index) in tietus" v-bind:tietu='item' v-bind:tietuIndex='index' :z="item.z" :key="index"></tietu>
            <template v-if="showType === 'ending'">
              <div class="top"></div>
              <div class="right"></div>
              <div class="bottom"></div>
              <div class="left"></div>
              <div class="top2"></div>
              <div class="right2"></div>
              <div class="bottom2"></div>
              <div class="left2"></div>
            </template>
          </div>
          <div v-if="(showType==='ending') || (showType==='main')" style="width: 100%;position: absolute;height: calc(100vh - 100vw * 1.36);background: white;z-index: 2;"></div>
          <img v-if="(showType==='preview') || (showType==='ending')" style="height: 24.8vw;display: block;position: absolute;z-index: 3;" :src="baseurl+'/img/FHome/footer.jpg'" width="100%">
          <div style="height: 24.8vw;"></div>
        </div>
        <search v-show="showType==='main'"></search>
        <help v-if="showHelp" />
      </template>
    </div>
    <message v-if="(showType === 'ending') && show" v-model="show">
      <p style="font-size: 4.3vw;">长按保存图片，晒图朋友圈集5个赞<br>
      前往OliviaBurton天猫旗舰店<br>
      联系客服获取抽奖链接</p>
    </message>
  </div>
</template>
<script>
import loading from '@/components/loading'
import tietu from '@/components/tie-tu'
import search from '@/components/search'
import ending from '@/components/ending'
import help from '@/views/help'
import data from '@/js/data'
import message from '@/views/message'
import preview from '@/views/preview'
export default {
  components: {
    loading,
    tietu,
    search,
    ending,
    help,
    message,
    preview,
  },
  data() {
    return {
      data: data,
      loading: true,
      tietus: [],
      tietuIndex: '',
      target: 0,
      normalMax: 0,
      backMax: 0,
      currentTieTu: '',
      currentBg: 0,
      personSort: '',
      showType: 'main',
      msg: '',
      Play: 0,
      baseurl: '',
      inputShow: 0,
      mySelfTxt: '',
      videoShow: 0,
      mongs: -1,
      showHelp: 1,
      // 截图后的提示
      show: 1,
    }
  },
  created() {
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
  },
  methods: {
    touchback() {
      this.currentTieTu = ''
      this.target = -1
      this.personSort = ''
    },
    myToMsg() {
      this.mySelfTxt && (this.msg = this.mySelfTxt)
      this.inputShow = 0
    },
  },
}
</script>
<style lang="less" scoped>
.draw-container {
  &.overhidden {
    overflow: hidden;
  }
}
.draw {
  width: 100%;
  height: calc(100vw * 1.36);
  background-size: cover !important;
  position: relative;
  background-position: top !important;
  z-index: 1;
}
.app-ending {
  .draw {
    top: 0vw;
  }
}
.take-picture {
  position: fixed;
  top: calc(100vw - 8vh);
  right: 7vw;
  width: 9vw;
  height: 9vw;
  line-height: 9vw;
  text-align: center;
  border-radius: 50%;
  z-index: 99999;
}
.endingImg {
  position: fixed;
  width: 100vw;
  left: 0;
  top: 0;
}
.music {
  position: absolute;
  width: 10vw;
  height: 10vw;
  top: 5vw;
  right: 5vw;
  z-index: 20004;
  div {
    display: block;
    width: 10vw;
    height: 10vw;
  }
}
.inputMsg {
  position: absolute;
  text-align: center;
  background: rgba(209, 241, 255, 0.44);
  width: 100%;
  height: 100%;
  z-index: 21000;
  top: 0;
  left: 0;
  textarea {
    background: #d1f1ff;
    width: 80vw;
    height: 35vh;
    border: 0;
    font-size: 5.8vw;
    padding: 2vw;
    border-radius: 3vw;
    margin: 30vh auto 5vw auto;
  }
  div {
    position: fixed;
    color: #102e40;
    background: #5fc6ff;
    border: 0;
    border-radius: 3vw;
    margin: -21vw auto 0 39vw;
    width: 20vw;
    height: 10vw;
    line-height: 10vw;
  }
}
.videoBox {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 21100;
  video {
    width: 100%;
  }
}
.full-moon {
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
}
.top,
.right,
.bottom,
.left {
  z-index: 99999;
  position: absolute;
}
.top {
  width: calc(100% + 4vw);
  height: 2vw;
  top: -2vw;
  left: -2vw;
}
.right {
  width: 2vw;
  right: -2vw;
  height: calc(100% + 4vw);
  top: -2vw;
}
.bottom {
  width: calc(100% + 4vw);
  height: 23vw;
  bottom: -23vw;
  left: -2vw;
}
.left {
  width: 2vw;
  left: -2vw;
  height: calc(100% + 4vw);
  top: -2vw;
}
.top2,
.right2,
.left2,
.bottom2 {
  z-index: 99999;
  position: absolute;
  background: white;
}
.top2 {
  width: calc(100% + 4vw);
  height: 80vw;
  top: -82vw;
  left: -2vw;
}
.right2 {
  width: 20vw;
  right: -21.9vw;
  height: calc(100% + 40vw);
  top: -20vw;
}
.left2 {
  width: 20vw;
  left: -21.9vw;
  height: calc(100% + 40vw);
  top: -20vw;
}
.bottom2 {
  height: 50vw;
  width: calc(100% + 4vw);
  bottom: -72vw;
  position: absolute;
  left: -2vw;
}
</style>
