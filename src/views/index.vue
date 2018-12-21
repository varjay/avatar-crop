<template>
  <div>
    <div class="draw">
      <div
       ref="tietu"
       @click.stop=""
       :class="{[select]:1}"
       :style="{top:tietu.top+'px',left:tietu.left+'px',transform:`scale(${tietu.scale},${tietu.scale}) rotate(${tietu.rotate}deg)`}"
       class="tietu">
        <div
         @touchstart="touchstart"
         @touchmove="touchmove"
         @touchend="touchend"
         class="target">
          <img :src="tietu.d.url" :width="tietu.d.w/3" :height="tietu.d.h/3" :style="{transform: `scale(${scaleMirror},1)`, transition: '0.3s'}">
          <span
           :style="{transform:'scale('+1/tietu.scale+')',background: 'url(/img/ico-scale.png)'}"
           class="scale"
           @touchmove.stop="scalesmove"></span>
          <span
           :style="{transform:'scale('+1/tietu.scale+')',background: 'url(/img/ico-rotate.png)'}"
           class="rotate"
           @touchstart.stop="rotatetart"
           @touchmove.stop="rotatemove"></span>
           <span
           :style="{transform:'scale('+1/tietu.scale+')',background: 'url(/img/ico-mirror.png)'}"
           @click="mirror"
           class="mirror"
           ></span>
        </div>
      </div>
    </div>
    <div>
      <input type="file">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tietu: {
          d: {url: '/img/img.jpg', w: 300, h: 300},
          scale: 1,
          rotate: 0,
          left: 118.73828125,
          top: 134.6796875,
        },
      offsettop: 0,
      offsetleft: 0,
      defaulthypotenuse: 0, // 默认斜边长度
      select: '',
      t: null,
      // 身体部件
      offsetAngle: 0,
      // 镜像
      scaleMirror: 1,
    }
  },
  mounted() {
    var x = this.$refs.tietu.offsetWidth / 2
    var y = this.$refs.tietu.offsetHeight / 2
    this.defaulthypotenuse = Math.sqrt(x * x + y * y)
  },
  methods: {
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
      this.tietu.top =
        e.touches[0].clientY - this.offsettop
      this.tietu.left =
        e.touches[0].clientX - this.offsetleft
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
      this.tietu.scale =
        hypotenuse / this.defaulthypotenuse
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
      this.tietu.rotate = r
      e.preventDefault()
    },
  },
}
</script>
<style lang="less" scoped>
.draw {
  width: 100%;
  height: calc(100vw * 1.36);
  background-color: black;
  z-index: 1;
}
.tietu {
  position: absolute;
  &.select-create{
    transition:.2s;
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  &.select-created{
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  &.select-destroy{
    transition:.2s;
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.tietu span{
  position: absolute;
  display: block;
  width: 5vw;
  height: 5vw;
  color: #000;
  margin: -2.5vw -2.5vw;
}
.target {
  box-shadow: 0 0 0 1px white;
  img {
    display: block;
  }
}
.tietu .scale{
  bottom: 0;
  right: 0;
  background-size: 100% !important;
}
.tietu .rotate{
  right: 0;
  top: 0;
  background-size: 100% !important;
}
.tietu .mirror{
  left: 0;
  bottom: 0;
  background-size: 100% !important;
}
</style>
