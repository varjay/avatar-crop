<template>
  <div class="ending">
    <div class="text-container">
      <div class="bgBox"></div>
      <div class="text" :style="{'font-size':fontsize+'vw'}">
        <div v-html="$parent.msg"></div>
        <div class="lineW"></div>
      </div>
      <!-- 按钮 -->
      <div class="selectBtn" v-if="!toEnd">
        <img @click="$parent.inputShow=1" :src="baseurl+'/img/FHome/write.png'" alt=""/>
        <img @click="toEndPage" :src="baseurl+'/img/FHome/ok.png'" alt=""/>        
      </div>
      <img v-else :src="baseurl+'/img/FHome/footer.jpg'" width="100%">
    </div>
    <img v-if="img" :src="img" class="end-img">
  </div>
</template>
<script>
//0公园,1海边,2街道,3露天
var Arr = [
  [
    '所有颜色都已沉静，唯有一样的月，一样的花，一样回头微笑的你',
    '总有当空丽月，总有盛放玫瑰，就缺一个你',
    '光点亮夜空，你穿梭花丛。一千年太久，就爱现在',
  ],
  [
    '如果要为幸福锦上添花，就是和你月下听浪的那一刹那',
    '这世界上最美的景，就是你眼中的星辰大海',
    '纵有星辰大海，纵有落英缤纷，有你的地方才有爱',
  ],
  [
    '想要和你一起压马路，满天的星斗知道我是认真的',
    '“一见钟情”只需要0.2S，牵你的手用尽一辈子',
    '在下一个路口，我就牵你的手陪你一起慢慢往前走',
  ],
  [
    '你不知道月光下的这两杯咖啡有一杯是为你而点',
    '月光正好，你正美。你喝着咖啡，我看着你',
    '你嘴角的咖啡泡沫，提醒我再靠近你一点',
  ],
]
export default {
  data() {
    return {
      baseurl: '',
      fontsize: 5.8,
      toEnd: 0,
      msg: '',
      img: '',
    }
  },
  // watch:{
  //   '$parent.msg'(n){
  //     this.msg=n.length<14?(n+`<br/>&nbsp;`):n
  //   }
  // },
  created() {
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
    // var length = this.$parent.msg.length
    // if (length > 26) {
    //   this.fontsize = 8
    // }
    // else if (length > 36) {
    //   this.fontsize = 8
    // }
    // else if(length > 44){
    //   this.fontsize = 6
    // }
    this.setMsg()
  },
  methods: {
    setMsg() {
      var n = this.$parent.currentBg
      var list = Arr[n]
      var l = list.length
      this.$parent.msg = list[Math.floor(Math.random() * l)]
    },
    toEndPage() {
      if (this.$parent.mongs > 0) {
        this.$parent.videoShow = 1
        this.$parent.audioStop()
        var dom = document.getElementById('video')
        dom.play()
        dom.addEventListener('ended', () => {
          this.$parent.videoShow = 0
          this.EndImg()
        })
        dom.addEventListener('pause', () => {
          this.$parent.videoShow = 0
          this.EndImg()
        })
      } else {
        this.EndImg()
      }
      this.toEnd = 1
    },
    EndImg() {
      setTimeout(() => {
        html2canvas(document.querySelector('#ending')).then(canvas => {
          this.img = canvas.toDataURL('image/png')
        })
      }, 500)
    },
  },
  // mounted(){

  // }
}
</script>
<style lang="less" scoped>
.ending {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.text-container {
  position: absolute;
  width: 100%;
  top: calc((100vh - (100vw * 1.60933)) / 2 + 100vw);
  > img {
    -webkit-transform: translateY(-4vw);
    -ms-transform: translateY(-4vw);
    transform: translateY(-4vw);
  }
}
.text {
  width: 100%;
  position: relative;
  color: #fff;
  line-height: 1.2;
  height: calc(
    100vh - (100vh - (100vw * 1.55933)) - 100vw - 100vw / 5.4651162791 - 1vw
  );
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
  flex-direction: column;
  img {
    width: 100%;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
  }
  > div,
  .line {
    padding: 0 5vw;
    line-height: 180%;
    height: 20vw;
  }
  .lineW {
    position: absolute;
    width: 90vw;
    height: 0;
    left: 5vw;
    top: 18vw;
    border-bottom: 1px solid #fff;
  }
}
.line {
  width: 90vw;
}
.selectBtn {
  width: 100%;
  text-align: center;
  img {
    width: 42vw;
    margin: 2vw 3vw;
    float: left;
    &:last-child {
      float: right;
    }
  }
}
.bgBox {
  display: none;
  position: absolute;
  z-index: -1;
  width: 96vw;
  top: -105vw;
  left: 2vw;
  background: #101e42;
  height: 135vw;
}
</style>
