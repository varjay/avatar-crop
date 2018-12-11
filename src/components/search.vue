<template>
  <div class="search-container" :class="{'drawdown-state': drawdownState, bee: currentSort==='bee', snow: currentSort==='snow'}">
    <div v-if="sum > 0" class="screenshot">
      <em @click="toEnd" class="service-icon" :style="'background: url('+baseurl+'/img/btn/option-done.png) center no-repeat;background-size: 100%;'"></em>
    </div>
    <div class="sort">
      <ul class="fix">
        <li class="curr"><span><em>{{sortName}}</em></span></li>
        <li><span @click="showRule = 1"><em>活动规则</em></span></li>
      </ul>
      <div v-if="currentSort==='bee'" class="drawdown" @click="drawdown" style="background: url('./img/drawdown_bee.png') center no-repeat;"></div>
      <div v-else class="drawdown" @click="drawdown" style="background: url('./img/drawdown.png') center no-repeat;"></div>
    </div>
    <div class="content">
      <ul ref="content" class="fix" :class="currentSort">
        <li v-for="(d,i) in sortData" :key="i" @click="addbox(d,i)">
          <div v-if="currentSort === 'furniture'" class="box" :style="'background:url('+baseurl+d.burl+') no-repeat center;'"></div>
          <div v-else class="box" :style="'background:url('+baseurl+d.url+') no-repeat center;'"></div>
        </li>
      </ul>
    </div>
    <message v-if="showRule" v-model="showRule">
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
    </message>
  </div>
</template>
<script>
import message from '@/views/message'
export default {
  components: {
    message,
  },
  data() {
    return {
      currentSort: 'bee',
      persontype: 'hair',
      baseurl: '',
      showRule: 0,
      drawdownState: 0,
      sortName: '',
    }
  },
  computed: {
    sortData() {
      return this.$parent.data[this.currentSort]
    },
    personData() {
      try {
        return this.$parent.data.person[
          this.$parent.tietus[this.$parent.tietuIndex].i
        ][this.persontype + 's']
      } catch (e) {
        return []
      }
    },
    sum() {
      return this.$parent.tietus.length
    },
  },
  created() {
    if (this.$parent.currentBg === 0) {
      this.currentSort = 'bee'
      this.sortName = '小蜜蜂'
    } else {
      this.currentSort = 'snow'
      this.sortName = '雪球'
    }
    if (process.env.NODE_ENV === 'production') {
      this.baseurl = window.baseurl
    }
  },
  methods: {
    generatNormalMax() {
      var normalMax = 0
      if (this.currentSort !== 'furniture') {
        if (!this.$parent.normalMax) {
          normalMax = 1000
        } else {
          normalMax = this.$parent.normalMax + 1
        }
        this.$parent.normalMax = normalMax
      } else {
        this.$parent.backMax = normalMax = this.$parent.backMax + 1
      }
      return normalMax
    },
    addbox(d, i) {
      if (this.currentSort === 'bg') {
        this.changeBg(i)
        return
      }
      if (this.currentSort === 'furniture') {
        this.changeFur(i)
        return
      }
      var normalMax = this.generatNormalMax()
      var w = document.documentElement.clientWidth
      this.$parent.tietus.push({
        d,
        i,
        sort: this.currentSort,
        z: normalMax,
        scale: 1,
        rotate: 0,
        left: w / 2 - d.w / 2 / 3,
        top: w / 2 - d.h / 2 / 3,
      })
    },
    changeBg(i) {
      this.$parent.currentBg = i
    },
    changePersontType(v) {
      this.persontype = v
      this.$refs.personContent.scrollTop = 0 //回滚顶部
    },
    changePerson(i) {
      Vue.set(
        this.$parent.tietus[this.$parent.tietuIndex].d,
        this.persontype,
        i,
      )
    },
    changeFur(_i) {
      if (_i === 0) {
        this.$parent.mongs = 1
      } else {
        this.$parent.mongs = 0
      }

      // 判断是否已经存在
      var arr = this.$parent.tietus
      var preData = this.$parent.data['furniture'][_i]
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].sort === 'furniture') {
          this.$parent.tietus[i].d = preData
          this.$parent.tietus[i].left = preData.left
          this.$parent.tietus[i].top = preData.top
          this.$parent.tietus[i].i = _i
          return
        }
      }

      var normalMax = this.generatNormalMax()
      // var w = document.documentElement.clientWidth
      this.$parent.tietus.push({
        d: preData,
        i,
        sort: this.currentSort,
        z: normalMax,
        scale: 1,
        rotate: 0,
        left: preData.left,
        top: preData.top,
      })
    },
    toEnd() {
      this.$parent.showType = 'preview'
    },
    drawdown() {
      this.drawdownState = !this.drawdownState
    },
  },
}
</script>
<style lang="less" scoped>
.screenshot {
  right: 6vw;
  top: -9vw;
  height: 7vw;
  width: 8vw;
  position: absolute;
}
.upDownBtn {
  transition: 0.5s;
}
.search-container {
  transition: 0.3s;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 70vw;
  z-index: 20000;
  &.drawdown-state {
    height: 6vh;
    .drawdown {
      transform: rotate(180deg);
    }
  }
  &.bee {
    .sort {
      li {
        span {
          border: 1px solid #ddbdba;
          em {
            color: #d4ada9;
          }
        }
        &.curr {
          span {
            background: #e3c9c6;
            border-color: #e3c9c6;
          }
        }
      }
    }
  }
  &.snow {
    .sort {
      li {
        span {
          border: 1px solid #dce7ec;
          em {
            color: #aebcc3;
          }
        }
      }
    }
  }
}
.sort {
  background: white;
  border-top-left-radius: 5vw;
  border-top-right-radius: 5vw;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  ul {
    border-radius: 3vw 3vw 0 0;
    position: relative;
  }
  li {
    float: left;
    height: 6vh;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      border-radius: 6vh;
      width: 22vw;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    em {
      font-size: 3.8vw;
      height: 3vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .curr {
    span {
      background: #d8eaf2;
      em {
        color: white !important;
        font-size: 5vw;
      }
    }
  }
}
.drawdown {
  background-size: 100% !important;
  width: 8vw;
  height: 8vw;
  position: absolute;
  margin-left: calc(50% - 4vw);
  top: 0;
}
.content {
  height: calc(100% - 6vh);
  position: relative;
  display: flex;
  justify-content: center;
  padding-bottom: 4vw;
  background: white;
  ul {
    background: #f6f9fa;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 10%;
    width: 92%;
    border-radius: 3vw;
    border: 1px solid #f3f5f6;
    li {
      float: left;
      width: 25%;
      height: 50%;
      overflow: hidden;
      padding: 1vw;
      .box {
        background-size: contain !important;
        width: 100%;
        height: 100%;
      }
    }
  }
  .person {
    padding: 0 10vw;
    li {
      width: 40vw;
      height: 100%;
    }
  }
  .bg {
    padding: 3% 5%;
    li {
      height: 100%;
      div {
        background-size: cover !important;
        border-radius: 1vw;
      }
    }
  }
  .furniture {
    li {
      width: 33.33333333%;
      height: 100%;
      padding: 3vw;
    }
  }
}
.person-content-container {
  position: absolute;
  width: 100%;
  height: calc(100% - 5vh);
  background: #c9edf3;
  display: flex;
  z-index: 10;
  border-radius: 5vw;
  overflow: hidden;
  padding: 1vw;
}
.person-sort {
  height: 100%;
  background: #8dc7e5;
  border-radius: 5vw;
  overflow: hidden;
  box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.7);
  li {
    height: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14vw;
    padding: 1vw;
    em {
      display: block;
      width: 100%;
      height: 100%;
      background-size: contain !important;
    }
  }
  // .curr{
  //   background: #f5f5f5;
  // }
}
.person-content {
  flex: 1;
  overflow: auto;
  li {
    width: 21vw;
    height: 100%;
    float: left;
    padding: 0 2vw;
    display: flex;
    align-items: center;
  }
}
.personbox {
  width: 100%;
  height: 100%;
  height: 14vw;
  background-size: contain !important;
}
.nomore {
  float: left;
  width: 100%;
  text-align: center;
  margin: 2vh 0;
  color: #aaa;
  font-size: 2vh;
}

.service-icon {
  display: block;
  width: 100%;
  height: 100%;
  -webkit-animation: icon-bounce 1.2s infinite alternate;
  -moz-animation: icon-bounce 1.2s infinite alternate;
  -o-animation: icon-bounce 1.2s infinite alternate;
  animation: icon-bounce 1.2s infinite alternate;
}
</style>
