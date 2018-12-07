<template>
  <div class="ending">
    <div class="text-container">
      <div class="bgBox"></div>
      <img v-if="toEnd" :src="baseurl+'/img/FHome/footer.jpg'" width="100%">
    </div>
    <img v-if="img" :src="img" class="end-img">
  </div>
</template>
<script>
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
    this.endImg()
  },
  methods: {
    endImg() {
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
  top: calc((100vh - (100vw * 1.77)) / 2 + 100vw);
  > img {
    -webkit-transform: translateY(-4vw);
    -ms-transform: translateY(-4vw);
    transform: translateY(-4vw);
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
