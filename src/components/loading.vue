<template>
  <div id="load" class="loadPage" :class="{fly}">
    <div class="loadpage-container">
      <div class="choose" style="background:url(./img/pr1/choose.jpg) center no-repeat;">
        <div></div>
      </div>
      <div v-if="bgShow" class="bg">
        <div class="bg1-container">
          <div class="bg1">
            <em>妙趣横生的腕间花园</em>
          </div>
        </div>
        <div class="bg1-container bg2">
          <div class="bg1">
            <div class="midd">
              <em>献给童心不变的你！</em>
            </div>
            <div class="loadline">
              <!-- 进渡条 -->
              <div class="loading" v-if="!showBtn">
                <div class="light"><div :style="'width:'+Percentage+'%'"></div></div>
                <div class="loadbg homeImg" :style="'background:url(./img/FHome/loading.png) center no-repeat;background-size:auto 100%;'"></div>
                <div class="upFlower" :style="'background: url(./img/FHome/h1.png) center no-repeat;background-size:100% auto;'"></div>
              </div>
              <!-- 按钮 -->
              <div class="button" @click="inPage" v-else>
                <em>定制你的OB圣诞贺卡</em><br><br>
                <span>&lt; START &gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="bgShow" class="snow">
        <div class="snowimg homeImg"></div>
      </div>
    </div>
    <div class="bee"></div>
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
      showBtn: false,
      homeImg: false,
      baseurl: '',
      bgShow: 1,
      fly: 0,
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
      this.fly = 1
      setTimeout(() => {
        this.bgShow = 0
      }, 3000)
      // this.$parent.loading = false
      // clearInterval(window.times)
      // try {
      //   this.$parent.audio.play()
      //   this.$parent.Play = 1
      // } catch (e) {
      //   1
      // }
    },
    getLoadImg(arr) {
      var onloadarr = []
      var vm = this
      function BackFun() {
        vm.loadNum += 1
        if (vm.Percentage == 100) {
          setTimeout(() => {
            vm.showBtn = true
          }, 1000)
        }
      }
      for (var i = 0; i < arr.length; i++) {
        onloadarr[i] = new Image()
        onloadarr[i].src = arr[i]
        onloadarr[i].onload = () => {
          BackFun()
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(window.times)
  },
}
</script>
<style lang="less" scoped>
.choose {
  position: absolute;
  background-size: contain !important;
  height: calc(100vw * 1.77777778);
  width: 100%;
  max-height: 100vh;
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
  height: calc(100vw * 1.7777777778);
  width: 100%;
  max-height: 100vh;
}
.bg {
  height: 100%;
  position: relative;
  .bg1-container {
    height: 50%;
  }
  .bg1 {
    height: 100%;
    overflow: hidden;
    background-size: 100vw !important;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    // transform: scale(1.01);
    em {
      color: white;
    }
  }
  .bg1 {
    background: url('/img/pr1/bg1.jpg');
  }
  .bg2 {
    transform: rotateX(180deg);
    .bg1 {
      background: url('/img/pr1/bg2.jpg');
      // transform: scale(1.01);
      em {
        padding-top: 1.5vh;
        display: block;
      }
    }
    .midd {
      transform: rotateX(180deg);
    }
  }
}
.bee {
  width: 8vw;
  height: 16vw;
  background: url('/img/pr1/bee.png') no-repeat;
  background-size: contain;
  position: absolute;
  transform: translateX(100vw);
}
.fly {
  .bee {
    transition: 0.9s cubic-bezier(1, 1, 0, 0);
    transform: translateX(-8vw);
  }
  .bg1 {
    animation: pr1bg1 3s cubic-bezier(1, 1, 0, 0);
  }
  .snow {
    opacity: 0;
    transition: 3s;
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
  position: absolute;
  width: 100vw;
  z-index: 10;
  top: 10vh;
  transform: rotateX(180deg);
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
        background: #db0428;
        height: 6.5vw;
        border-radius: 2vh;
        -webkit-box-shadow: 3px 3px 3px #333 inset; /* For Chrome5+, Safari5+ */
        box-shadow: 3px 3px 3px #333 inset; /* For Latest Opera */
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
  display: block;
  margin: 0 auto;
  width: 100%;
  height: 13vh;
  text-align: center;
  em {
    font-size: 4.5vw;
  }
  span {
    font-size: 6vw;
    color: #ae726d;
  }
}
.snow {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  pointer-events: none;
  .snowimg {
    height: 100%;
    background: url('/img/pr1/snow.png');
    background-size: cover;
    background-position-y: 0;
    animation: snow 80s infinite cubic-bezier(1, 1, 0, 0);
  }
}
// 蜜蜂背景
@keyframes pr1bg1 {
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
  // 80% {
  //   width: 100%;
  //   width: 0;
  //   height: 50%;
  //   border-bottom-right-radius: 100%;
  // }
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
  // 80% {
  //   width: 100%;
  //   width: 0;
  //   height: 50%;
  //   border-bottom-right-radius: 100%;
  // }
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
</style>
