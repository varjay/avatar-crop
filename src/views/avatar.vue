<template>
  <div class="container">
    <div class="draw">
      <div
       v-if="target.url"
       ref="tietu"
       @click.stop=""
       :class="{[select]:1}"
       :style="{top:target.top+'px',left:target.left+'px',transform:`scale(${target.scale},${target.scale}) rotate(${target.rotate}deg)`}"
       class="tietu">
        <div
         @touchstart="touchstart"
         @touchmove="touchmove"
         @touchend="touchend"
         class="target">
          <img :src="target.url" :width="target.w" :height="target.h" :style="{transform: `scale(${scaleMirror},1)`, transition: '0.3s'}">
          <span
           :style="{transform:'scale('+1/target.scale+')',background: 'url(/img/ico-scale.png)'}"
           class="scale"
           @touchmove.stop="scalesmove"></span>
          <span
           :style="{transform:'scale('+1/target.scale+')',background: 'url(/img/ico-rotate.png)'}"
           class="rotate"
           @touchstart.stop="rotatetart"
           @touchmove.stop="rotatemove"></span>
           <span
           :style="{transform:'scale('+1/target.scale+')',background: 'url(/img/ico-mirror.png)'}"
           @click="mirror"
           class="mirror"
           ></span>
        </div>
      </div>
    </div>
    <br>
    <div @click="generate" style="color: white;">确认</div>
    <canvas :width="clothW" :height="clothH" ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  props: ['file'],
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
      scaleMirror: 1,
      // 原始图片
      target: {
        w: 0,
        h: 0,
        url: '',
        scale: 1,
        rotate: 0,
        left: 118.73828125,
        top: 134.6796875,
        Image: null,
        diffw: 0,
        diffh: 0,
      },
      sourceImg: {
        w: 0,
        h: 0,
      },
      clothW: 14 * window.rem,
      clothH: 14 * window.rem,
    }
  },
  created() {
    this.getSize(this.file)
  },
  methods: {
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
    },
    // 获得图片尺寸
    getSize(file) {
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        that.target.Image = new Image()
        that.target.Image.src = e.target.result
        let blob = that.dataURLtoBlob(e.target.result)
        let url = URL.createObjectURL(blob)
        that.target.url = url
        that.target.Image.onload = function() {
          let width = this.width
          let height = this.height

          // 计算出适当的尺寸和位置
          let scale
          if (width > height) {
            scale = height / that.clothH
            height = height / scale
            width = width / scale
            that.target.top = 0
            that.target.left = -(width - that.clothW) / 2
          } else {
            scale = width / that.clothH
            width = width / scale
            height = height / scale
            that.target.top = -(height - that.clothH) / 2
            that.target.left = 0
          }
          that.sourceImg.w = width
          that.sourceImg.h = height
          that.target.w = width
          that.target.h = height
          that.target.diffw = width / 2
          that.target.diffh = height / 2
          let x = width / 2
          let y = height / 2
          that.defaulthypotenuse = Math.sqrt(x * x + y * y)
        }
      }
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    mirror() {
      if (this.scaleMirror === 1) {
        this.scaleMirror = -1
      } else {
        this.scaleMirror = 1
      }
    },
    touchstart: function(e) {
      this.select = 'select-create'
      this.t = setTimeout(() => {
        this.select = 'select-created'
      }, 200)
      this.offsettop = e.touches[0].clientY - this.$refs.tietu.offsetTop
      this.offsetleft = e.touches[0].clientX - this.$refs.tietu.offsetLeft
    },
    touchmove: function(e) {
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-created'
      let top = e.touches[0].clientY - this.offsettop - this.target.diffh * (this.target.scale - 1)
      if (top < 0 && top > -(this.sourceImg.h - this.clothH)) {
        this.target.top = e.touches[0].clientY - this.offsettop
      }
      let left = e.touches[0].clientX - this.offsetleft - this.target.diffw * (this.target.scale - 1)
      if (left < 0 && left > -(this.sourceImg.w - this.clothW)) {
        this.target.left = e.touches[0].clientX - this.offsetleft
      }
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
    scalesmove(e) {
      // 计算 中心x轴 到 e的x轴 值
      var x =
        e.touches[0].clientX -
        this.$refs.tietu.offsetWidth / 2 -
        this.$refs.tietu.offsetLeft
      // 计算 中心y轴 到 e的y轴 值
      var y =
        e.touches[0].clientY -
        this.$refs.tietu.offsetHeight / 2 -
        this.$refs.tietu.offsetTop
      //斜边长度
      var hypotenuse = Math.sqrt(x * x + y * y)
      this.target.scale = hypotenuse / this.defaulthypotenuse
      e.preventDefault()
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #525252;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}
.draw {
  position: relative;
  width: 14rem;
  height: 14rem;
  background-color: #1d1d1d;
  z-index: 1;
  overflow: hidden;
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
.tietu .scale {
  bottom: 0;
  right: 0;
  background-size: 100% !important;
}
.tietu .rotate {
  right: 0;
  top: 0;
  background-size: 100% !important;
}
.tietu .mirror {
  left: 0;
  bottom: 0;
  background-size: 100% !important;
}
</style>
