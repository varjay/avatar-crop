<template>
  <div class="container">
    <div class="draw" id="myElement" :style="{width: clothW+'px', height: clothH+'px'}">
      <div
       v-if="target.url"
       ref="tietu"
       @click.stop=""
       :class="{[select]:1}"
       :style="{top:target.top+'px',left:target.left+'px',transform:`scale(${target.scale}) rotate(${target.rotate}deg)`}"
       class="tietu">
        <div
         @touchstart="touchstart"
         @touchmove="touchmove"
         @touchend="touchend"
         class="target">
          <img
           :src="target.url"
           :width="target.w"
           :height="target.h"
           @click="$emit('touch')"
          >
        </div>
      </div>
      <template v-if="edit">
        <div class="shadow bottom"></div>
        <div class="shadow top"></div>
        <div class="shadow left"></div>
        <div class="shadow right"></div>
      </template>
    </div>
    <br v-if="edit">
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
      // 镜像
      // 原始图片
      target: {
        w: 0,
        h: 0,
        url: '',
        scale: 1,
        rotate: 0,
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
      hammerIncrement: 1,
      touchmoveActive: 0,
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
  mounted() {
    let that = this
    let myElement = document.getElementById('myElement')
    let mc = new Hammer.Manager(myElement)
    let pinch = new Hammer.Pinch()
    mc.add([pinch])
    mc.on('pinch', function(ev) {
      let newScale = that.target.scale + (ev.scale - that.hammerIncrement)
      if (newScale >= 1) {
        // that.target.scale = that.target.scale + (ev.scale - that.hammerIncrement) * that.target.scale
        that.target.scale = that.target.scale + (ev.scale - that.hammerIncrement)
      }
      that.hammerIncrement = ev.scale
    })
    mc.on('pinchend', function() {
      that.hammerIncrement = 1
      // 缩放完位置校正
      that.positionCorrect()
    })
  },
  methods: {
    // 位置校正
    positionCorrect() {
      let top = this.target.top - this.target.diffh * (this.target.scale - 1)
      if (top > 0 || top < this.maxHeight) {
        if (
          Math.abs(top) > Math.abs(Math.abs(top) - Math.abs(this.maxHeight))
        ) {
          this.target.top =
            this.maxHeight + this.target.diffh * (this.target.scale - 1)
          console.log('在错误的位置：上 = 下')
        } else {
          this.target.top = 0 + this.target.diffh * (this.target.scale - 1)
          console.log('在错误的位置：上 = 上')
        }
      }
      let left = this.target.left - this.target.diffw * (this.target.scale - 1)
      if (left > 0 || left < this.maxWidth) {
        if (
          Math.abs(left) > Math.abs(Math.abs(left) - Math.abs(this.maxWidth))
        ) {
          this.target.left =
            this.maxWidth + this.target.diffw * (this.target.scale - 1)
          console.log('在错误的位置：左 = 右')
        } else {
          this.target.left = 0 + this.target.diffw * (this.target.scale - 1)
          console.log('在错误的位置：左 = 左')
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
        img.onload = function(e) {
          console.log(img.width, img.height)
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
    touchstart: function(e) {
      this.select = 'select-create'
      this.t = setTimeout(() => {
        this.select = 'select-created'
      }, 200)
      this.offsettop = e.touches[0].clientY - this.$refs.tietu.offsetTop
      this.offsetleft = e.touches[0].clientX - this.$refs.tietu.offsetLeft
      // 超过1个手指触摸时，去掉touchmove
      if (e.touches.length > 1) {
        this.touchmoveActive = 0
      } else {
        this.touchmoveActive = 1
      }
    },
    touchmove: function(e) {
      // 两个手指不操作
      if (e.touches.length > 1 || !this.touchmoveActive) {
        return
      }
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-created'
      let top =
        e.touches[0].clientY -
        this.offsettop -
        this.target.diffh * (this.target.scale - 1)
      if (top < 0 && top > this.maxHeight) {
        this.target.top = e.touches[0].clientY - this.offsettop
      }
      let left =
        e.touches[0].clientX -
        this.offsetleft -
        this.target.diffw * (this.target.scale - 1)
      if (left < 0 && left > this.maxWidth) {
        this.target.left = e.touches[0].clientX - this.offsetleft
      }
      this.target.originw = this.sourceImg.w - (this.target.left + this.target.difforiginw)
      this.target.originh = this.sourceImg.h - (this.target.top + this.target.difforiginh)
      e.preventDefault()
    },
    touchend() {
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-destroy'
      setTimeout(() => {
        this.select = ''
      }, 200)
    },
    rotatetart() {
      this.offsetAngle =
        (Math.atan(
          this.$refs.tietu.offsetWidth /
            2 /
            (this.$refs.tietu.offsetHeight / 2),
        ) *
          180) /
        Math.PI
    },
    rotatemove(e) {
      //对比y值，当前位置是否在中心点下方
      //Y值
      var y = this.$refs.tietu.offsetHeight / 2 + this.$refs.tietu.offsetTop
      var ye = e.touches[0].clientY
      var x = this.$refs.tietu.offsetWidth / 2 + this.$refs.tietu.offsetLeft
      var xe = e.touches[0].clientX
      var r

      //偏移角度

      if (ye < y) {
        if (xe > x) {
          //对边长度
          let opposite = y - ye
          //临边长度
          let border = xe - x
          r = (Math.atan(border / opposite) * 180) / Math.PI
          r = r + 270 - this.offsetAngle + 90
        } else {
          //对边长度
          let opposite =
            ye - this.$refs.tietu.offsetHeight / 2 - this.$refs.tietu.offsetTop
          //临边长度
          let border = e.touches[0].clientX - x
          r = (Math.atan(opposite / border) * 180) / Math.PI
          r = r + 180 - this.offsetAngle + 90
        }
      } else {
        if (xe > x) {
          //对边长度
          let opposite =
            ye - this.$refs.tietu.offsetHeight / 2 - this.$refs.tietu.offsetTop
          //临边长度
          let border = e.touches[0].clientX - x
          r = (Math.atan(opposite / border) * 180) / Math.PI
          r = r - this.offsetAngle + 90
        } else {
          //对边长度
          let opposite = ye - y
          //临边长度
          let border = x - xe
          r = (Math.atan(border / opposite) * 180) / Math.PI
          r = r + 90 - this.offsetAngle + 90
        }
      }
      this.target.rotate = r
      e.preventDefault()
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
}
.draw {
  position: relative;
  background-color: #1d1d1d;
  z-index: 1;
}
.tietu {
  position: absolute;
  &.select-create {
    transition: 0.2s;
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  &.select-created {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  &.select-destroy {
    transition: 0.2s;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.tietu span {
  position: absolute;
  display: block;
  width: 5vw;
  height: 5vw;
  color: #000;
  margin: -2.5vw -2.5vw;
}
.target {
  img {
    display: block;
  }
}
.tietu .rotate {
  right: 0;
  top: 0;
  background-size: 100% !important;
}
.shadow {
  position: absolute;
  width: 87.5vw;
  background: rgba(0, 0, 0, 0.7);
  height: 100vh;
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
    height: 200vh;
  }
  &.left {
    top: -50vh;
    left: -87.5vw;
  }
  &.right {
    right: -87.5vw;
    top: -50vw;
  }
}
.operate {
  height: 16vw;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
  > div {
    width: 24%;
    text-align: center;
    display: block;
    height: 100%;
    line-height: 16vw;
    em {
      font-size: 4.2vw;
    }
  }
}
</style>
