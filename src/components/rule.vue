<template>
  <div class="message">
    <div class="bg"></div>
    <div class="msg-content">
      <div class="content">
        <h1>OB圣诞活动规则</h1>
        <p>选取喜爱的元素到画板上，定制专属的OB圣诞贺卡。<br>将圣诞贺卡分享至朋友圈，集满5个赞，即可参与抽奖。</p>
        <img :src="baseurl+'./img/rule.png'" width="100%" style="height: 85.21vw;" />
        <div class="des">
          <h2>活动说明</h2>
          <p>1. 朋友圈晒图需集满5个赞，不能设置分组可见，需至少保存7天；</p>
          <p>2. 优惠券由客服确认后直接发放，实物奖品由快递寄出；</p>
          <p>3. 每个淘宝账号仅有1次抽奖机会；活动仅限中国大陆地区。</p>
        </div>
        <p># 以上活动解释权归OliviaBurton天猫旗舰店所有</p>
      </div>
      <div class="btn-content">
        <a style="background: url('./img/X.png') center no-repeat;" @click="$parent.showRule = 0"></a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['text'],
  data() {
    return {
      baseurl: window.baseurl
    }
  },
}
</script>
<style lang="less" scoped>
.message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 99999999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg {
  height: 100%;
  width: 100%;
  position: absolute;
}
.msg-content {
  padding: 5vw 3vw;
  width: 90vw;
  background: rgba(255, 255, 255, 0.87);
  position: relative;
  border-radius: 2vw;
  font-size: 5vw;
  border: 1px solid #a7a9aa;
  .content {
    border-radius: 2vw;
    text-align: center;
    color: #545454;
    line-height: 1.7;
    h1 {
      font-size: 4vw;
      margin-top: 2vw;
    }
    p {
      font-size: 3.2vw;
    }
    ul {
      li {
        font-size: 3.5vw;
        font-weight: bold;
        em {
          display: block;
          font-size: 3vw;
          font-weight: normal;
        }
      }
    }
  }
}
.btn-content {
  position: absolute;
  right: 0;
  top: 0;
  padding: 2vw;
  a {
    display: block;
    width: 4vw;
    height: 4vw;
    background-size: contain !important;
  }
}
.des {
  text-align: left;
  h2 {
    font-size: 3.5vw;
  }
}
</style>
