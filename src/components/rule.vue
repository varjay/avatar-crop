<template>
  <div class="message">
    <div class="bg"></div>
    <div class="msg-content">
      <div class="content">
        <h1>OB圣诞活动规则</h1>
        <p>定制专属OB圣诞贺卡并分享到朋友圈，即可参与惊喜抽奖</p>
        <h1>奖品设置</h1>
        <ul>
          <li>价值1689元中国定制版小蜜蜂腕表（1名）</li>
          <li>价值999元圣诞专供雪球腕表（1名）</li>
          <li>30元无门槛券 + 299元金蜂化妆镜<em>&lt;每天限量200个，赠完即止&gt;</em></li>
          <li>30元无门槛券 + 199元小蜜蜂胸针<em>&lt;天猫店铺购表即赠，随包裹发放&gt;</em></li>
        </ul>
        <h1>活动时间</h1>
        <p>2018年12月13日-12月23日</p>
        <h1>领奖方式</h1>
        <p>将定制贺卡分享至朋友圈，集5个赞，凭朋友圈截图</p>
        <p>联系天猫其简单客服，获取抽奖连接；</p>
        <p>优惠券有客服确认后直接发放，实物奖品由快递发出</p>
        <span>淘宝/天猫搜索：oliviaburton旗舰店 </span>
        <p>- 朋友圈晒图不能设置分组可见，需至少保存7天；</p>
        <p>- 未按上述领奖方式操作兑奖，视为自动放弃奖品；</p>
        <p>- 每个账户仅有1次抽奖机会；</p>
        <p>- 活动地区仅限中国大陆地区。</p>
        <p># 以上活动解释权归OliviaBurton天猫旗舰店所有</p>
      </div>
      <div class="btn-content">
        <a @click="$parent.showRule = 0"></a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['text'],
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
  background: rgba(0, 0, 0, 0.27);
  height: 100%;
  width: 100%;
  position: absolute;
}
.msg-content {
  padding: 5vw 3vw;
  padding-top: 8vw;
  width: 90vw;
  background: rgba(255, 255, 255, 0.87);
  position: relative;
  border-radius: 2vw;
  font-size: 5vw;
  .content {
    border: 1px solid #5c788f;
    border-radius: 2vw;
    padding: 1vw;
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
    span {
      color: #a67a73;
      font-size: 4vw;
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
    width: 4.5vw;
    height: 4.5vw;
    background: url('/img/X.png') center no-repeat;
    background-size: contain;
  }
}
</style>
