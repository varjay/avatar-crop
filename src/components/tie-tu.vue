<template>
</template>
<script>
export default {
  props: ['tietuIndex', 'tietu'],
  data() {
    return {
      zoon: 1,
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
      this.$parent.target = this.tietuIndex

      //设定当前的贴图
      this.$parent.currentTieTu = this.$parent.tietus[this.tietuIndex].z
      this.$parent.tietuIndex = this.tietuIndex

      if (this.tietu.d.hairs !== undefined) {
        this.$parent.personSort = this.tietu.i
      } else {
        this.$parent.personSort = ''
      }
    },
    touchmove: function(e) {
      if (this.t) {
        clearTimeout(this.t)
      }
      this.select = 'select-created'
      this.$parent.tietus[this.tietuIndex].top =
        e.touches[0].clientY - this.offsettop
      this.$parent.tietus[this.tietuIndex].left =
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
      this.$parent.tietus[this.tietuIndex].scale =
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
      Vue.set(this.$parent.tietus[this.tietuIndex], 'rotate', r)
      e.preventDefault()
    },
  },
}
</script>
<style lang="less" scoped>
.tietu {
  position: absolute;
}
</style>
