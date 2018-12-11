<template>
  <div class="ending">
    <img v-if="toEnd" :src="baseurl+'/img/FHome/footer.jpg'" width="100%">
    <img v-if="img" :src="img" class="end-img">
  </div>
</template>
<script>
export default {
  data() {
    return {
      baseurl: '',
      fontsize: 5.8,
      toEnd: 1,
      msg: '',
      img: '',
      tips: 0,
      show: 1,
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
    this.endImg()
  },
  methods: {
    endImg() {
      setTimeout(() => {
        html2canvas(document.querySelector('#ending')).then(canvas => {
          this.img = canvas.toDataURL('image/png')
          this.tips = 1
          setTimeout(() => {
            this.tips = 0
          }, 13000)
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
  z-index: 2;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 25vw;
  overflow: hidden;
  img {
    height: 100%;
  }
}
.text-container {
  position: absolute;
  width: 100%;
  top: calc((100vh - (100vw * 1.608)) / 2 + 100vw);
  > img {
  }
}
.line {
  width: 90vw;
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
