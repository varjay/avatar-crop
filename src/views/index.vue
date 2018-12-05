<template>
  <div :class="'app-'+showType" id="ending">
    <transition name="ending">
      <ending v-if="showType === 'ending'" class="ending"></ending>
    </transition>
    <loading v-if='loading'/>
    <template v-else>
      <!-- <transition name="like">
        <like v-show="showType === 'like'"/>
      </transition> -->
      <div ref="draw" @click="touchback" id="draw" class="draw" :style="'background:url('+baseurl+data.bg[currentBg].url+') no-repeat'">
        <img class="full-moon" v-if="mongs > 0" :src="baseurl+'/img/petal.png'">
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
      <search></search>
    </template>
    <!-- <transition name="takepicture"> -->
      <!-- <div v-if="tietus.length > 0" @click="showType = 'like'" class="take-picture" :style="'background: url('+baseurl+'/img/takepicture.png) center;background-size: 100%;'">
      <div class="service-icon" :style="'background: url('+baseurl+'/img/takepicture.png) center;background-size: 100%;'"></div>
      </div> -->
    <!-- </transition> -->
    <div v-show="showType !== 'ending'" :class="['music']" @click="setMusic">
      <div v-if="Play" :style="'background:url('+baseurl+'/img/FHome/sOpen.png) center no-repeat;background-size:auto 85%;'"></div>
      <div v-else :style="'background:url('+baseurl+'/img/FHome/sClose.png) center no-repeat;background-size:auto 100%;'"></div>
    </div>
    <!-- 手写内容 -->
    <!-- 输入内容 -->
    <div class="inputMsg" v-if="inputShow">
      <textarea maxlength="14" v-model="mySelfTxt" placeholder="情话听不够，自已写一句!"></textarea>
      <div @click="myToMsg">确定</div>
    </div>
    <div class="videoBox" v-show="videoShow">
      <video id="video" :src="baseurl+'/video/1334.mp4'"  x5-video-player-type="h5" x5-video-player-fullscreen="true" preload="auto"></video>
    </div>
  </div>
</template>
<script>
import loading from '@/components/loading'
// import like from "@/components/like";
import tietu from '@/components/tie-tu'
import search from '@/components/search'
import ending from '@/components/ending'
import data from '@/js/data'
export default {
  components: {
    loading,
    // like,
    tietu,
    search,
    ending,
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
      currentBg: 1,
      personSort: '',
      showType: 'main',
      msg: '',
      Play: 0,
      baseurl: '',
      audio: null,
      inputShow: 0,
      mySelfTxt: '',
      videoShow: 0,
      mongs: -1,
      type: 1,
    }
  },
  created() {
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
    this.audio = new Audio(this.baseurl + '/music/bgm.mp3')
    this.audio.preload = 'auto'
    this.audio.loop = true
  },
  mounted() {
    document.addEventListener(
      'WeixinJSBridgeReady',
      function() {
        this.audio.play()
        this.Play = 1
      },
      false,
    )
  },
  methods: {
    touchback() {
      this.currentTieTu = ''
      this.target = -1
      this.personSort = ''
    },
    setMusic() {
      if (this.Play) {
        this.audio.pause()
        this.Play = 0
      } else {
        this.audio.play()
        this.Play = 1
      }
    },
    audioStop() {
      this.audio.pause()
      this.Play = 0
    },
    myToMsg() {
      this.mySelfTxt && (this.msg = this.mySelfTxt)
      this.inputShow = 0
    },
  },
}
</script>
<style lang="less" scoped>
.draw {
  width: 100%;
  height: 113.96731vw;
  background-size: cover !important;
  position: relative;
  background-position: center !important;
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
  background: #0f1f42;
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
