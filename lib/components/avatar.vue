<template>
  <div class="container">
    <div class="draw" :style="{width: clothW + 'px', height: clothH + 'px'}">
      <div
        v-if="target.url"
        ref="tietu"
        @click.stop=""
        :class="{[select]: 1}"
        :style="{top: target.top + 'px', left: target.left + 'px'}"
        class="tietu"
      >
        <div
          @mousedown.prevent="mousedown"
          @mousemove.prevent="mousemove"
          @mouseup.prevent="mouseup"
          @touchstart.prevent="touchstart"
          @mouseout.prevent="mouseup"
          @touchmove.prevent="touchmove"
          @touchend.prevent="touchend"
          class="target"
          :style="{transform: `scale(${target.scale})`}"
        >
          <img :src="target.url" :width="target.w" :height="target.h" @click="$emit('touch')" />
        </div>
      </div>
      <template v-if="edit">
        <div class="shadow bottom"></div>
        <div class="shadow top"></div>
        <div class="shadow left"></div>
        <div class="shadow right"></div>
      </template>
    </div>
    <div class="ac-slider-container" :style="{width: `${clothW}px`}">
      <div class="ac-slider" @touchmove="sliderMove" @touchend="sliderEnd" @mousemove="sliderMove">
        <div class="ac-slider-bar" :style="{width: `${pecent * 100}%`}">
          <div class="ac-slider-button"></div>
        </div>
      </div>
    </div>
    <div v-if="edit" class="operate">
      <div @click="$emit('cancel')"><em>取消</em></div>
      <div @click="generate"><em>确认</em></div>
    </div>
    <canvas style="display: none;" :width="clothW" :height="clothH" ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  props: {
    file: null,
    edit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      offsettop: 0,
      offsetleft: 0,
      defaulthypotenuse: 0, // 默认斜边长度
      select: '',
      t: null,
      // 身体部件
      offsetAngle: 0,
      // 原始图片
      target: {
        w: 0,
        h: 0,
        url: '',
        scale: 1,
        left: 0,
        top: 0,
        Image: null,
        diffw: 0,
        diffh: 0,
        difforiginw: 0,
        difforiginh: 0,
        originw: 0,
        originh: 0,
      },
      sourceImg: {
        w: 0,
        h: 0,
        type: '',
      },
      clothW: document.documentElement.clientWidth * 0.875,
      clothH: document.documentElement.clientWidth * 0.875,
      touchmoveActive: 0,
      firstTwoTouchSize: 0,
      firstScale: 1,
      mouse: {
        hold: false,
      },
      pecent: 0,
    }
  },
  computed: {
    maxWidth() {
      return -(this.sourceImg.w * this.target.scale - this.clothW)
    },
    maxHeight() {
      return -(this.sourceImg.h * this.target.scale - this.clothH)
    },
  },
  created() {
    if (!this.edit) {
      this.clothW = document.documentElement.clientWidth
      this.clothH = document.documentElement.clientHeight
    }
    this.getSize(this.file)
  },
  methods: {
    // 位置校正
    positionCorrect() {
      let top = this.target.top - this.target.diffh * (this.target.scale - 1)
      if (top > 0 || top < this.maxHeight) {
        if (Math.abs(top) > Math.abs(Math.abs(top) - Math.abs(this.maxHeight))) {
          this.target.top = this.maxHeight + this.target.diffh * (this.target.scale - 1)
          // console.log('在错误的位置：上 = 下')
        } else {
          this.target.top = 0 + this.target.diffh * (this.target.scale - 1)
          // console.log('在错误的位置：上 = 上')
        }
      }
      let left = this.target.left - this.target.diffw * (this.target.scale - 1)
      if (left > 0 || left < this.maxWidth) {
        if (Math.abs(left) > Math.abs(Math.abs(left) - Math.abs(this.maxWidth))) {
          this.target.left = this.maxWidth + this.target.diffw * (this.target.scale - 1)
          // console.log('在错误的位置：左 = 右')
        } else {
          this.target.left = 0 + this.target.diffw * (this.target.scale - 1)
          // console.log('在错误的位置：左 = 左')
        }
      }
    },
    generate() {
      let canvas = this.$refs.canvas
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, this.clothW, this.clothH)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, this.clothW, this.clothH)
      ctx.drawImage(
        this.target.Image,
        this.target.left - this.target.diffw * (this.target.scale - 1),
        this.target.top - this.target.diffh * (this.target.scale - 1),
        this.target.w * this.target.scale,
        this.target.h * this.target.scale,
      )
      let imgurl = canvas.toDataURL(this.sourceImg.type)
      let blob = this.dataURLtoBlob(imgurl)
      let url = URL.createObjectURL(blob)
      this.$emit('done', {
        base64: imgurl,
        img: blob,
        url,
      })
    },
    // 获得图片尺寸
    getSize(file) {
      let that = this
      if (typeof file === 'object') {
        this.sourceImg.type = file.type
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          that.target.Image = new Image()
          that.target.Image.src = e.target.result
          let blob = that.dataURLtoBlob(e.target.result)
          let url = URL.createObjectURL(blob)
          that.target.url = url
          that.target.Image.onload = function() {
            that.computedSize(this.width, this.height)
          }
        }
      } else {
        that.target.url = file
        let img = new Image()
        img.src = file
        img.onload = function() {
          // console.log(img.width, img.height)
          that.computedSize(img.width, img.height)
        }
      }
    },
    computedSize(width, height) {
      // 计算出适当的尺寸和位置
      let scale
      if (width > height && this.edit) {
        scale = height / this.clothH
        height = height / scale
        width = width / scale
        this.target.top = 0
        this.target.left = -(width - this.clothW) / 2
      } else {
        scale = width / this.clothW
        width = width / scale
        height = height / scale
        if (width > height && height < this.clothH) {
          this.clothH = height
        }
        this.target.top = -(height - this.clothH) / 2
        this.target.left = 0
      }
      this.sourceImg.w = width
      this.sourceImg.h = height
      this.target.w = width
      this.target.h = height
      this.target.diffw = width / 2
      this.target.diffh = height / 2
      this.target.difforiginw = this.target.diffw - this.target.left
      this.target.difforiginh = this.target.diffh - this.target.top
      this.target.originw = width / 2
      this.target.originh = height / 2
      let x = width / 2
      let y = height / 2
      this.defaulthypotenuse = Math.sqrt(x * x + y * y)
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {type: mime})
    },
    moveImg(touchs) {
      // Y 轴移动处理
      let top = touchs.clientY - this.offsettop - this.target.diffh * (this.target.scale - 1)
      // console.log(top, this.maxHeight)
      if (top > 0) {
        this.target.top = ((this.maxHeight + (this.sourceImg.h - this.clothH)) / 2) * -1
      } else if (top < this.maxHeight) {
        this.target.top = (this.maxHeight - (this.sourceImg.h - this.clothH)) / 2
      } else {
        this.target.top = touchs.clientY - this.offsettop
      }

      // X 轴移动处理
      let left = touchs.clientX - this.offsetleft - this.target.diffw * (this.target.scale - 1)
      if (left > 0) {
        this.target.left = ((this.maxWidth + (this.sourceImg.w - this.clothW)) / 2) * -1
      } else if (left < this.maxWidth) {
        this.target.left = (this.maxWidth - (this.sourceImg.w - this.clothW)) / 2
      } else {
        this.target.left = touchs.clientX - this.offsetleft
      }
      this.target.originw = this.sourceImg.w - (this.target.left + this.target.difforiginw)
      this.target.originh = this.sourceImg.h - (this.target.top + this.target.difforiginh)
    },
    holdStart(touchs) {
      this.select = 'select-create'
      this.t = setTimeout(() => {
        this.select = 'select-created'
      }, 200)
      this.offsettop = touchs.clientY - this.$refs.tietu.offsetTop
      this.offsetleft = touchs.clientX - this.$refs.tietu.offsetLeft
    },
    touchstart(e) {
      this.holdStart(e.touches[0])
      // 超过1个手指触摸时，去掉touchmove
      if (e.touches.length > 1) {
        this.touchmoveActive = 0
      } else {
        this.touchmoveActive = 1
      }
    },
    touchmove(e) {
      // 两个手指不操作
      if (e.touches.length > 1 || !this.touchmoveActive) {
        this.pinch(e)
        return
      }
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-created'
      this.moveImg(e.touches[0])
    },
    touchend(e) {
      if (e.touches.length < 2) {
        this.firstTwoTouchSize = 0
        this.firstScale = 1
        if (this.target.scale < 1) {
          this.target.scale = 1
        }
        this.positionCorrect()
      }
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-destroy'
      setTimeout(() => {
        this.select = ''
      }, 200)
    },
    mousedown(e) {
      this.mouse.hold = true
      this.holdStart(e)
    },
    mousemove(e) {
      if (this.mouse.hold) {
        this.moveImg(e)
      }
    },
    mouseup() {
      this.mouse.hold = false
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-destroy'
      setTimeout(() => {
        this.select = ''
      }, 200)
    },
    pinch(e) {
      let x = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
      let y = Math.abs(e.touches[0].clientY - e.touches[1].clientY)
      let long = Math.sqrt(x * x + y * y)
      if (this.firstTwoTouchSize === 0) {
        this.firstTwoTouchSize = long
        this.firstScale = this.target.scale
      }
      let scale = long / this.firstTwoTouchSize
      this.target.scale = this.firstScale * scale
    },
    sliderMove(e) {
      let clientWidth = document.documentElement.clientWidth
      if (e.touches && e.touches[0]) {
        e = e.touches[0]
      }
      let x = e.clientX - clientWidth * 0.0625
      if (x < 0) {
        x = 0
      } else if (x > this.clothW) {
        x = this.clothW
      }
      this.target.scale = 1 + x / this.clothW
      this.pecent = x / this.clothW
    },
    sliderEnd() {
      this.positionCorrect()
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding-bottom: 54px;
}
.draw {
  position: relative;
  background-color: #1d1d1d;
  z-index: 1;
}
.tietu {
  position: absolute;
  right: 0;
  top: 0;
  background-size: 100% !important;
  &.select-create,
  &.select-created {
    .target {
      cursor: grabbing;
    }
  }
  .target {
    cursor: grab;
    display: inline-block;
    img {
      display: block;
    }
  }
}
.shadow {
  position: absolute;
  width: 87.5vw;
  background: rgba(0, 0, 0, 0.7);
  height: 100vh;
  pointer-events: none;
  &.top {
    top: -100vh;
    border-bottom: 1px solid white;
    &:before {
      content: '';
      display: block;
      width: 1px;
      background-color: white;
      height: 87.5vw;
      position: absolute;
      top: 100vh;
      left: 0;
    }
    &:after {
      content: '';
      display: block;
      width: 1px;
      background-color: white;
      height: 87.5vw;
      position: absolute;
      top: 100vh;
      right: 0;
    }
  }
  &.bottom {
    top: 87.5vw;
    border-top: 1px solid white;
  }
  &.left,
  &.right {
    top: -50vh;
    height: 200vh;
  }
  &.left {
    left: -87.5vw;
  }
  &.right {
    right: -87.5vw;
  }
}
.operate {
  height: 54px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.4);
  > div {
    width: 24%;
    height: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      background: rgba(255, 255, 255, 0.2);
      em {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    em {
      font-size: 14px;
    }
  }
}
.ac-slider-container {
  position: relative;
  z-index: 2;
  padding-top: 30px;
}
.ac-slider {
  position: relative;
  height: 2px;
  background-color: #7d8084;
  width: 100%;
  &:before {
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    bottom: -8px;
    content: '';
    display: block;
    width: 100%;
  }
  .ac-slider-bar {
    position: relative;
    background-color: #1989fa;
    height: 2px;
  }
  .ac-slider-button {
    position: absolute;
    top: -11px;
    right: -12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: white;
    overflow: hidden;
  }
}
</style>
