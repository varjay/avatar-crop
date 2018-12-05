<template>
  <div
   ref="tietu"
   @click.stop=""
   :class="{[select]:1}"
   :style="{top:tietu.top>-9999?tietu.top+'px':tietu.top,left:tietu.left>-9999?tietu.left+'px':tietu.left,'z-index':z,transform:'scale('+tietu.scale+') rotate('+tietu.rotate+'deg)'}"
   class="tietu">
    <div
     :id="'tietu'+tietuIndex"
     @touchstart="touchstart"
     @touchmove="touchmove"
     @touchend="touchend"
     :class="{target:tietu.z == $parent.currentTieTu}">
       <template v-if="!tietu.d.hairs">
        <img :src="baseurl+tietu.d.url" :width="tietu.d.w/3" :height="tietu.d.h/3" :style="tietu.d.s">
       </template>
      <div v-else :style="{width:tietu.d.w+'px', height:tietu.d.h+'px'}" class="body">
        <img class="face" :src="baseurl+body.face.url" :width="body.face.w/4" :height="body.face.h/4" :style="{top:body.face.t+tietu.d.offset+'px',left:body.face.l+'px'}" />
        <img class="hair" :src="baseurl+body.hair.url" :width="body.hair.w/4" :height="body.hair.h/4" :style="{top:body.hair.t+tietu.d.offset+'px',left:body.hair.l+'px'}"  />
        <img class="leg" :src="baseurl+body.leg.url" :width="body.leg.w/4" :height="body.leg.h/4" :style="{top:body.leg.t+tietu.d.offset+'px',left:body.leg.l+'px'}" />
        <img class="coat" :src="baseurl+body.coat.url" :width="body.coat.w/4" :height="body.coat.h/4" :style="{top:body.coat.t+tietu.d.offset+'px',left:body.coat.l+'px'}" />
      </div>
      <span
       v-show="$parent.currentTieTu === tietu.z"
       :style="{transform:'scale('+1/tietu.scale+')',background: 'url('+baseurl+'/img/ico-del.png)'}"
       class="del"
       @click.stop="del"></span>
      <span
       :style="{transform:'scale('+1/tietu.scale+')',background: 'url('+baseurl+'/img/ico-scale.png)'}"
       class="scale"
       v-show="$parent.currentTieTu === tietu.z"
       @touchstart.stop="scalestart"
       @touchmove.stop="scalesmove"></span>
      <span
       :style="{transform:'scale('+1/tietu.scale+')',background: 'url('+baseurl+'/img/ico-rotate.png)'}"
       class="rotate"
       v-show="$parent.currentTieTu === tietu.z"
       @touchstart.stop="rotatetart"
       @touchmove.stop="rotatemove"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tietuIndex', 'tietu', 'z'],
  data() {
    return {
      zoon: 1,
      offsettop: 0,
      offsetleft: 0,
      defaulthypotenuse: 0, // 默认斜边长度
      select: '',
      t: null,

      // 身体部件
      face: 0,
      hair: 0,
      leg: 0,
      coat: 0,
      offsetAngle: 0,
      baseurl: '',
    }
  },
  computed: {
    body: function() {
      return {
        face: this.$parent.data.person[this.tietu.i].faces[this.face],
        hair: this.$parent.data.person[this.tietu.i].hairs[this.hair],
        leg: this.$parent.data.person[this.tietu.i].legs[this.leg],
        coat: this.$parent.data.person[this.tietu.i].coats[this.coat],
      }
    },
  },
  created() {
    this.face = this.tietu.d.face
    this.hair = this.tietu.d.hair
    this.leg = this.tietu.d.leg
    this.coat = this.tietu.d.coat
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
  },
  mounted() {
    var x = this.$refs.tietu.offsetWidth / 2
    var y = this.$refs.tietu.offsetHeight / 2
    this.defaulthypotenuse = Math.sqrt(x * x + y * y)
  },
  methods: {
    del: function(e) {
      if (this.tietu.sort === 'furniture') {
        this.$parent.mongs = -1
      }
      this.$parent.tietus.splice(this.tietuIndex, 1)
      this.$parent.target = -1
      this.select = ''
      this.$parent.personSort = ''
    },
    touchstart: function(e) {
      this.select = 'select-create'
      this.t = setTimeout(() => {
        this.select = 'select-created'
      }, 200)
      this.offsettop = e.touches[0].clientY - this.$refs.tietu.offsetTop
      this.offsetleft = e.touches[0].clientX - this.$refs.tietu.offsetLeft
      this.$parent.target = this.tietuIndex

      // 层级修改
      if (this.$parent.tietus[this.tietuIndex].sort !== 'furniture') {
        this.$parent.normalMax = this.$parent.tietus[this.tietuIndex].z =
          this.$parent.normalMax + 1
      } else {
        this.$parent.backMax = this.$parent.tietus[this.tietuIndex].z =
          this.$parent.backMax + 1
      }

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
    scalestart(e) {},
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
    rotatetart(e) {
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
          var opposite = y - ye
          //临边长度
          var border = xe - x
          r = (Math.atan(border / opposite) * 180) / Math.PI
          r = r + 270 - this.offsetAngle + 90
        } else {
          //对边长度
          var opposite =
            ye - this.$refs.tietu.offsetHeight / 2 - this.$refs.tietu.offsetTop
          //临边长度
          var border = e.touches[0].clientX - x
          r = (Math.atan(opposite / border) * 180) / Math.PI
          r = r + 180 - this.offsetAngle + 90
        }
      } else {
        if (xe > x) {
          //对边长度
          var opposite =
            ye - this.$refs.tietu.offsetHeight / 2 - this.$refs.tietu.offsetTop
          //临边长度
          var border = e.touches[0].clientX - x
          r = (Math.atan(opposite / border) * 180) / Math.PI
          r = r - this.offsetAngle + 90
        } else {
          //对边长度
          var opposite = ye - y
          //临边长度
          var border = x - xe
          r = (Math.atan(border / opposite) * 180) / Math.PI
          r = r + 90 - this.offsetAngle + 90
        }
      }
      Vue.set(this.$parent.tietus[this.tietuIndex], 'rotate', r)
      e.preventDefault()
    },
  },
  watch: {
    'tietu.d': {
      handler: function(n, o) {
        this.face = n.face
        this.hair = n.hair
        this.leg = n.leg
        this.coat = n.coat
      },
      deep: true,
    },
  },
}
</script>
<style lang="less" scoped>
.tietu {
  position: absolute;
}
</style>
