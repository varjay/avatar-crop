<template>
  <div id="load" class="loadPage" :style="'background: url(./img/FHome/bg.png) center top no-repeat;background-size:100% auto;'">
    <div class="loadline">
      <!-- 进渡条 -->
      <div class="loading" v-if="!showBtn">
        <div class="light"><div :style="'width:'+Percentage+'%'"></div></div>
        <div class="loadbg homeImg" :style="'background:url(./img/FHome/loading.png) center no-repeat;background-size:auto 100%;'"></div>
        <div class="upFlower" :style="'background: url(./img/FHome/h1.png) center no-repeat;background-size:100% auto;'"></div>
      </div>
      <!-- 按钮 -->
      <div class="button homeImg" :style="'background: url(./img/FHome/go.png) center no-repeat;'" @click="inPage" v-else></div>
    </div>
    <div class="footLogo" :style="'background:url(./img/FHome/footTxt.png) center no-repeat;background-size:auto 100%;'"></div>
    <template v-show="homeImg">
      <!-- 流星 -->
      <div class="Meteor1 homeImg" :style="'background:url(./img/FHome/y1.png) center no-repeat;background-size:auto 100%;'"></div>
      <div class="Meteor2 homeImg" :style="'background:url(./img/FHome/y2.png) center no-repeat;background-size:auto 100%;'"></div>
      <div class="Meteor3 homeImg" :style="'background:url(./img/FHome/y3.png) center no-repeat;background-size:auto 100%;'"></div>
      <!-- 花辨 -->
      <div class="Flower1 homeImg" :style="'background:url(./img/FHome/h1.png) center no-repeat;background-size:auto 100%;'"></div>
      <div class="Flower2 homeImg" :style="'background:url(./img/FHome/h2.png) center no-repeat;background-size:auto 100%;'"></div>
    </template>
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
      this.$parent.loading = false
      clearInterval(window.times)
      try {
        this.$parent.audio.play()
        this.$parent.Play = 1
      } catch (e) {
        1
      }
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
.loadPage {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 21000;
  h3 {
    text-align: center;
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
.Meteor1 {
  position: absolute;
  width: 20vw;
  height: 15vw;
  top: 72vw;
  left: 25vw;
  transition: 0.5s;
  animation: luxin1 2s infinite;
  -webkit-animation: luxin1 2s infinite;
  z-index: 2;
}
.Meteor2 {
  position: absolute;
  width: 30vw;
  height: 21vw;
  top: 20vw;
  left: 40vw;
  transition: 0.5s;
  animation: luxin2 3s infinite;
  -webkit-animation: luxin2 3s infinite;
  z-index: 2;
}
.Meteor3 {
  position: absolute;
  width: 20vw;
  height: 15vw;
  top: 45vw;
  left: 63vw;
  transition: 0.5s;
  animation: luxin3 2.2s infinite;
  -webkit-animation: luxin3 2.2s infinite;
  z-index: 2;
}
.Flower1 {
  position: absolute;
  width: 15vw;
  height: 10vw;
  top: 132vw;
  left: 24vw;
  transition: 0.5s;
  animation: flower1 3.2s infinite ease-out;
  -webkit-animation: flower1 3.2s infinite ease-out;
  z-index: 3;
}
.Flower2 {
  position: absolute;
  width: 15vw;
  height: 10vw;
  top: 92vw;
  left: 11vw;
  transition: 0.5s;
  animation: flower2 2.2s infinite ease-out;
  -webkit-animation: flower2 2.2s infinite ease-out;
  z-index: 3;
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
  top: 30vh;
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
  width: 50vw;
  height: 13vh;
  background-size: auto 100% !important;
  // border-radius: 18vw;
  text-align: center;
  &:active {
    -webkit-filter: brightness(1.3);
    filter: brightness(1.3);
  }
}
// 流星1
@keyframes luxin1 {
  0% {
    opacity: 0;
    top: 57vw;
    left: 38vw;
  }
  50% {
    opacity: 1;
    top: 68vw;
    left: 28vw;
  }
  100% {
    opacity: 0;
    top: 72vw;
    left: 25vw;
  }
}

@-webkit-keyframes luxin1 /*Safari and Chrome*/ {
  0% {
    opacity: 0;
    top: 57vw;
    left: 38vw;
  }
  50% {
    opacity: 1;
    top: 68vw;
    left: 28vw;
  }
  100% {
    opacity: 0;
    top: 72vw;
    left: 25vw;
  }
}
// 流星2
@keyframes luxin2 {
  0% {
    opacity: 0;
    top: 5vw;
    left: 54vw;
  }
  50% {
    opacity: 1;
    top: 27vw;
    left: 34vw;
  }
  100% {
    opacity: 0;
    top: 32vw;
    left: 30vw;
  }
}

@-webkit-keyframes luxin2 /*Safari and Chrome*/ {
  0% {
    opacity: 0;
    top: 5vw;
    left: 54vw;
  }
  50% {
    opacity: 1;
    top: 27vw;
    left: 34vw;
  }
  100% {
    opacity: 0;
    top: 32vw;
    left: 30vw;
  }
}
// 流星3
@keyframes luxin3 {
  0% {
    opacity: 0;
    top: 26vw;
    left: 80vw;
  }
  50% {
    opacity: 1;
    top: 33vw;
    left: 74vw;
  }
  100% {
    opacity: 0;
    top: 45vw;
    left: 63vw;
  }
}

@-webkit-keyframes luxin3 /*Safari and Chrome*/ {
  0% {
    opacity: 0;
    top: 26vw;
    left: 80vw;
  }
  50% {
    opacity: 1;
    top: 33vw;
    left: 74vw;
  }
  100% {
    opacity: 0;
    top: 45vw;
    left: 63vw;
  }
}
// 花1
@keyframes flower1 {
  0% {
    opacity: 0;
    top: 90vw;
    left: 24vw;
  }
  20% {
    opacity: 1;
    top: 102vw;
    left: 19vw;
  }
  60% {
    opacity: 1;
    top: 121vw;
    left: 24vw;
  }
  80% {
    opacity: 1;
    top: 127vw;
    left: 19vw;
  }
  100% {
    opacity: 0;
    top: 132vw;
    left: 24vw;
  }
}

@-webkit-keyframes flower1 /*Safari and Chrome*/ {
  0% {
    opacity: 0;
    top: 90vw;
    left: 24vw;
  }
  20% {
    opacity: 1;
    top: 102vw;
    left: 19vw;
  }
  60% {
    opacity: 1;
    top: 121vw;
    left: 24vw;
  }
  80% {
    opacity: 1;
    top: 127vw;
    left: 19vw;
  }
  100% {
    opacity: 0;
    top: 132vw;
    left: 24vw;
  }
}
// 花2
@keyframes flower2 {
  0% {
    opacity: 0;
    top: 70vw;
    left: 11vw;
  }
  20% {
    opacity: 1;
    top: 77vw;
    left: 16vw;
  }
  35% {
    opacity: 1;
    top: 80vw;
    left: 11vw;
  }
  60% {
    opacity: 1;
    top: 83vw;
    left: 16vw;
  }
  80% {
    opacity: 1;
    top: 86vw;
    left: 11vw;
  }
  100% {
    opacity: 0;
    top: 92vw;
    left: 11vw;
  }
}

@-webkit-keyframes flower2 /*Safari and Chrome*/ {
  0% {
    opacity: 0;
    top: 33vw;
    left: 11vw;
  }
  20% {
    opacity: 1;
    top: 55vw;
    left: 16vw;
  }
  35% {
    opacity: 1;
    top: 65vw;
    left: 11vw;
  }
  60% {
    opacity: 1;
    top: 72vw;
    left: 16vw;
  }
  80% {
    opacity: 1;
    top: 86vw;
    left: 11vw;
  }
  100% {
    opacity: 0;
    top: 92vw;
    left: 11vw;
  }
}
.footLogo {
  position: absolute;
  bottom: -1.5vw;
  height: 29vw;
  width: 100vw;
}
</style>
