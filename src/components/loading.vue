<template>
  <div id="load" class="loadPage" :class="{fly}">
    <div class="loadpage-container">
      <div class="choose" style="background:url(./img/pr1/choose.jpg) center no-repeat;">
        <div @click="choose(0)" class="area1"></div>
        <div @click="choose(1)" class="area2"></div>
        <div class="choose-warn" style="background: url('./img/pr1/choose_warn.png') center no-repeat;background-size: contain;"></div>
      </div>
      <div v-if="bgShow" class="bg">
        <div class="bg1-container">
          <div class="bg1" style="background: url('./img/pr1/bg1.jpg');"></div>
        </div>
        <div class="bg1-container bg2">
          <div class="bg1" style="background: url('./img/pr1/bg2.jpg');">
            <div class="midd">
              <div class="loadline">
                <!-- 进渡条 -->
                <!-- <div class="loading">
                  <div class="light"><div :style="'width:'+Percentage+'%'"></div></div>
                  <div class="loadbg homeImg"></div>
                  <div class="upFlower"></div>
                </div> -->
                <!-- 按钮 -->
                <div class="button" @click="inPage" :class="{'button-anime': buttonType === 'start'}">
                  <transition name="loading">
                    <em v-if="buttonType==='loading'">{{loadingText}}</em>
                  </transition>
                  <transition name="loading">
                    <span v-if="buttonType==='start'">&lt; START &gt;</span>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="bgShow" class="snow">
        <div class="snowimg homeImg" style="background: url('./img/pr1/snow.png');"></div>
      </div>
    </div>
    <div class="bee" style="background: url('./img/pr1/bee.png') no-repeat;"></div>
  </div>
</template>
<script>
window.times = null
export default {
  data() {
    return {
      loadNum: 0,
      loadFull: 100,
      imgKey: 0,
      imgList: ['man1', 'wom1', 'dog'],
      homeImg: false,
      baseurl: '',
      bgShow: 1,
      fly: 0,
      loadingText: '',
      buttonType: 'loading',
    }
  },
  computed: {
    Percentage() {
      return Math.floor((this.loadNum / this.loadFull) * 100)
    },
  },
  mounted() {
    setTimeout(() => {
      var arr = document.getElementsByClassName('homeImg')
      var href = '' // document.origin
      var img = []
      var leng = 0
      var vm = this
      function backfun() {
        leng += 1
        if (leng === arr.length) {
          vm.homeImg = true
        }
      }
      for (var i in arr) {
        var lName = arr[i].localName
        if (lName == 'div') {
          var url = arr[i].style.backgroundImage
          var str = url.replace(/url\("(.+?)"\)/, '$1')
          img[i] = new Image()
          img[i].src = href + str
          img[i].onload = () => {
            backfun()
          }
        }
      }
    }, 200)
  },
  created() {
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
    this.setFullNum()
    this.player()
  },
  methods: {
    setFullNum() {
      var list = JSON.parse(JSON.stringify(this.$parent.data))
      var picarr = []
      var href = ''
      var getArr = arr => {
        var img = []
        for (var i = 0, l = arr.length; i < l; i++) {
          img.push(setUrl(arr[i].url))
        }
        return img
      }
      var setUrl = url => {
        var img = ''
        if (url.indexOf('http') > -1) {
          img = url
        } else {
          img = href + this.baseurl + url
        }
        return img
      }
      for (var i in list) {
        if (list.hasOwnProperty(i)) {
          var obj = Object.prototype.toString.call(list[i])
          if (obj === '[object Array]') {
            for (var j = 0, l = list[i].length; j < l; j++) {
              var imgurl = list[i][j]
              if (imgurl.url) {
                picarr.push(setUrl(imgurl.url))
              }
              if (imgurl.hairs) {
                picarr = picarr.concat(getArr(imgurl.hairs))
              }
              if (imgurl.coats) {
                picarr = picarr.concat(getArr(imgurl.coats))
              }
              if (imgurl.legs) {
                picarr = picarr.concat(getArr(imgurl.legs))
              }
            }
          } else {
            if (list[i].face) {
              picarr = picarr.concat(getArr(list[i].face))
            }
          }
        }
      }
      this.loadFull = picarr.length
      this.getLoadImg(picarr)
      return picarr
    },
    player() {
      // if(times){
      //   clearInterval(times)
      // }
      // times=setInterval(()=>{
      //   this.imgKey++
      //   if(this.imgKey>this.imgList.length-1){
      //     this.imgKey=0
      //   }
      //   },1000)
    },
    inPage() {
      let input = document.getElementById('taokouling')
      input.select()
      input.setSelectionRange(0, input.value.length)
      document.execCommand('copy')
      this.fly = 1
      setTimeout(() => {
        this.bgShow = 0
      }, 2500)
    },
    getLoadImg(arr) {
      var onloadarr = []
      let backFun = () => {
        this.loadNum += 1
        if (this.Percentage == 100) {
          this.loadingText = '定制你的 OB 圣诞贺卡'
          setTimeout(() => {
            this.buttonType = 'start'
          }, 500)
        } else if (this.Percentage > 90) {
          this.loadingText = '定制你的 OB 圣诞贺'
        } else if (this.Percentage > 80) {
          this.loadingText = '定制你的 OB 圣诞'
        } else if (this.Percentage > 70) {
          this.loadingText = '定制你的 OB 圣'
        } else if (this.Percentage > 60) {
          this.loadingText = '定制你的 OB'
        } else if (this.Percentage > 50) {
          this.loadingText = '定制你的 O'
        } else if (this.Percentage > 40) {
          this.loadingText = '定制你的'
        } else if (this.Percentage > 30) {
          this.loadingText = '定制你'
        } else if (this.Percentage > 20) {
          this.loadingText = '定制'
        } else if (this.Percentage > 10) {
          this.loadingText = '定'
        }
      }
      for (var i = 0; i < arr.length; i++) {
        onloadarr[i] = new Image()
        onloadarr[i].src = arr[i]
        onloadarr[i].onload = () => {
          backFun()
        }
      }
    },
    choose(w) {
      this.$parent.currentBg = w
      this.$parent.loading = false
      clearInterval(window.times)
      // try {
      //   this.$parent.audio.play()
      //   this.$parent.Play = 1
      // } catch (e) {
      //   1
      // }
    },
  },
  beforeDestroy() {
    clearInterval(window.times)
  },
}
</script>
<style lang="less" scoped>
.choose {
  height: calc(100vw * 1.608);
  width: 100%;
  position: absolute;
  background-size: 100% !important;
  .choose-warn {
    position: absolute;
    top: 59.3vw;
    width: 100%;
    height: 42vw;
    animation: button 2s infinite linear;
  }
}
.loadPage {
  position: fixed;
  width: 100vw;
  height: 100%;
  z-index: 21000;
  display: flex;
  align-items: center;
  background: #f3f1f2;
  h3 {
    text-align: center;
  }
}
.loadpage-container {
  height: calc(100vw * 1.608);
  width: 100%;
}
.bg {
  height: 100%;
  position: relative;
  z-index: 1;
  .bg1-container {
    height: 50%;
  }
  .bg1 {
    height: 100%;
    overflow: hidden;
    background-size: 100vw !important;
    transform: translateY(1px);
    box-shadow: 0 -1px 0 #f3f1f2;
  }
  .bg2 {
    transform: rotateX(180deg);
    .midd {
      transform: rotateX(180deg);
      height: calc(50vw * 1.608);
    }
  }
}
.bee {
  width: 8vw;
  height: 16vw;
  background-size: contain !important;
  position: absolute;
  transform: translateX(100vw);
  top: calc(100% / 2 - 8vw);
  z-index: 3;
}
.fly {
  .bee {
    transition: 0.9s linear;
    transform: translateX(-10vw);
  }
  .bg1 {
    animation: pr1bg1 3s linear;
  }
  .snow {
    opacity: 0;
    transition: 2.5s;
  }
}
.loadbg {
  width: 100%;
  height: 20vw;
}
.upFlower {
  position: absolute;
  z-index: 11;
  height: 10vh;
  width: 10vw;
  top: 0vh;
  left: 4vw;
}
.logo {
  display: block;
  text-align: center;
  width: 100vw;
  .limg {
    display: block;
    width: 80vw;
    height: 6vh;
    background-size: auto 100% !important;
    margin: 4vh auto 0 auto;
  }
}
.loadTitle {
  display: block;
  margin: 2vh auto 2vh auto;
  height: 20vh;
  // font-size: 8vw;
  background-size: auto 100% !important;
  width: 100vw;
}
.loadinfo {
  display: block;
  font-size: 2vw;
  text-align: center;
}
.loadline {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  .loading {
    position: relative;
    // overflow: hidden;
    border-radius: 5vh;
    // height: 2vh;
    display: block;
    width: 82vw;
    margin: 47vh auto 0 auto;
    // background:#ddd;
    .light {
      display: block;
      -webkit-transition: 0.5s linear;
      transition: 0.5s linear;
      display: block;
      height: 6.5vw;
      position: absolute;
      z-index: 3;
      top: 3vh;
      width: 63vw;
      left: 8vw;
      div {
        display: block;
        background: #bfbfbf;
        height: 1vw;
        border-radius: 2vh;
      }
    }
  }
}
.swiper {
  position: absolute;
  bottom: 25vh;
  width: 100vw;
  height: 40vh;
  margin: 0 auto;
  // background: #32e181;
  .simg {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    transition: 0.5s;
  }
  .show {
    opacity: 1;
  }
  .man1 {
    background-size: auto 100% !important;
  }
  .wom1 {
    background-size: auto 100% !important;
  }
  .dog {
    background-size: auto 50% !important;
  }
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 8vh;
  font-size: 0.7em;
  em {
    font-size: 1em;
    display: block;
    width: 10.2em;
    text-align: left;
  }
  span {
    position: absolute;
    font-size: 6vw;
    color: #ae726d;
    white-space:nowrap;
  }
  &.button-anime {
    span {
      display: block;
      animation: button 2s infinite linear;
    }
  }
}
.snow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  pointer-events: none;
  z-index: 2;
  .snowimg {
    height: 100%;
    background-size: cover !important;
    background-position-y: 0 !important;
    animation: snow 80s infinite linear;
  }
}
// 蜜蜂背景
@keyframes pr1bg1 {
  0% {
    border-bottom-right-radius: 0;
    width: 100%;
    height: 100%;
  }
  22% {
    border-bottom-right-radius: 100%;
    width: 100%;
    height: 100%;
  }
  60% {
    width: 100%;
    width: 0;
    height: 0;
    border-bottom-right-radius: 100%;
  }
  100% {
    width: 0;
    height: 0;
    border-bottom-right-radius: 100%;
  }
}
@-webkit-keyframes pr1bg1 {
  0% {
    border-bottom-right-radius: 0;
    width: 100%;
    height: 100%;
  }
  30% {
    border-bottom-right-radius: 100%;
    width: 100%;
    height: 100%;
  }
  60% {
    width: 100%;
    width: 0;
    height: 0;
    border-bottom-right-radius: 100%;
  }
  100% {
    width: 0;
    height: 0;
    border-bottom-right-radius: 100%;
  }
}

// 雪花
@keyframes snow {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 10000px;
  }
}

@-webkit-keyframes snow /*Safari and Chrome*/ {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 10000px;
  }
}

.area1,
.area2 {
  height: 39%;
  width: 100%;
}
.area2 {
  position: absolute;
  bottom: 0;
}
.loading-enter-active, .loading-leave-active {
  transition: 2s;
  opacity: 1;
}
.loading-enter, .loading-leave-to{
  opacity: 0;
}
</style>
