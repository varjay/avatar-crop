<template>
  <div>
    <div class="draw">
      <div
       v-if="sourceImg.url"
       ref="tietu"
       @click.stop=""
       :class="{[select]:1}"
       :style="{top:sourceImg.top+'px',left:sourceImg.left+'px',transform:`scale(${sourceImg.scale},${sourceImg.scale}) rotate(${sourceImg.rotate}deg)`}"
       class="tietu">
        <div
         @touchstart="touchstart"
         @touchmove="touchmove"
         @touchend="touchend"
         class="target">
          <img :src="sourceImg.url" :width="sourceImg.w/3" :height="sourceImg.h/3" :style="{transform: `scale(${scaleMirror},1)`, transition: '0.3s'}">
          <span
           :style="{transform:'scale('+1/sourceImg.scale+')',background: 'url(/img/ico-scale.png)'}"
           class="scale"
           @touchmove.stop="scalesmove"></span>
          <span
           :style="{transform:'scale('+1/sourceImg.scale+')',background: 'url(/img/ico-rotate.png)'}"
           class="rotate"
           @touchstart.stop="rotatetart"
           @touchmove.stop="rotatemove"></span>
           <span
           :style="{transform:'scale('+1/sourceImg.scale+')',background: 'url(/img/ico-mirror.png)'}"
           @click="mirror"
           class="mirror"
           ></span>
        </div>
      </div>
    </div>
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
      sourceImg: {
        w: 0,
        h: 0,
        url: '',
        scale: 1,
        rotate: 0,
        left: 118.73828125,
        top: 134.6796875,
      }
    }
  },
  created() {
    console.log(this.file)
    this.getSize(this.file)
  },
  methods: {
    // 获得图片尺寸
    getSize(file) {
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        let image = new Image()
        image.src = e.target.result
        let blob = that.dataURLtoBlob(e.target.result)
        let url = URL.createObjectURL(blob)
        that.sourceImg.url = url
        image.onload = function() {
          that.sourceImg.w = this.width
          that.sourceImg.h = this.height
          let x = this.width / 2
          let y = this.height / 2
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
      this.sourceImg.top = e.touches[0].clientY - this.offsettop
      this.sourceImg.left = e.touches[0].clientX - this.offsetleft
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
      this.sourceImg.scale = hypotenuse / this.defaulthypotenuse
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
      this.sourceImg.rotate = r
      e.preventDefault()
    },
  },
}
</script>
<style lang="less" scoped>
.draw {
  position: relative;
  margin-top: 1rem;
  margin-left: 1rem;
  width: 14rem;
  height: 14rem;
  background-color: black;
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
