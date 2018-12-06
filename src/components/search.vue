<template>
  <div class="search-container">
    <div class="screenshot">
      <em @click="toEnd" class="service-icon" :style="'background: url('+baseurl+'/img/btn/option-done.png) center no-repeat;background-size: 100%;'"></em>
    </div>
    <div class="sort">
      <ul class="fix">
        <li><span><em>小蜜蜂</em></span></li>
        <li><span><em>活动规则</em></span></li>
      </ul>
    </div>
    <div v-show="$parent.personSort !== ''" class="person-content-container">
      <ul class="person-sort">
        <li @click="changePersontType('face')" :class="{curr:persontype === 'face'}"><em :style="'background: url('+baseurl+'/img/btn/person1.png) center no-repeat;'"></em></li>
        <li @click="changePersontType('hair')" :class="{curr:persontype === 'hair'}"><em :style="'background: url('+baseurl+'/img/btn/person2.png) center no-repeat;'"></em></li>
        <li @click="changePersontType('coat')" :class="{curr:persontype === 'coat'}"><em :style="'background: url('+baseurl+'/img/btn/person3.png) center no-repeat;'"></em></li>
        <li @click="changePersontType('leg')" :class="{curr:persontype === 'leg'}"><em :style="'background: url('+baseurl+'/img/btn/person4.png) center no-repeat;'"></em></li>
        <!-- <li @click="persontype=''" :class="{curr:persontype === ''}"><em>配饰</em></li> -->
      </ul>
      <ul ref="personContent" class="person-content fix">
        <li v-for="(d,i) in personData" :key="'person'+i" @click="changePerson(i)">
          <div class="personbox" :style="'background:url('+baseurl+d.url+') no-repeat center;'"></div>
        </li>
      </ul>
    </div>
    <div class="content">
      <ul ref="content" class="fix" :class="currentSort">
        <li v-for="(d,i) in sortData" :key="i" @click="addbox(d,i)">
          <div v-if="currentSort === 'furniture'" class="box" :style="'background:url('+baseurl+d.burl+') no-repeat center;'"></div>
          <div v-else class="box" :style="'background:url('+baseurl+d.url+') no-repeat center;'"></div>
        </li>
      </ul>
    </div>
    <message v-if="showMsg" text="贺兰大人在等你晒月光哦~"></message>
  </div>
</template>
<script>
import message from './message'
export default {
  components: {
    message,
  },
  data() {
    return {
      currentSort: 'others',
      persontype: 'hair',
      baseurl: '',
      showMsg: 0,
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
  },
  created() {
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
    changeSort(name, _i) {
      this.$parent.personSort = ''
      this.currentSort = name
      this.$refs.content.scrollTop = 0 //回滚顶部
      if (_i !== undefined) {
        var d = this.$parent.data.person[_i]
        this.addPerson(d, _i)
        this.$parent.personSort = _i
      }
    },
    addPerson(d, i) {
      d = JSON.parse(JSON.stringify(d))
      var normalMax = this.generatNormalMax()
      var w = document.documentElement.clientWidth
      this.$parent.tietus.push({
        d,
        i,
        sort: this.currentSort,
        z: normalMax,
        scale: 1,
        rotate: 0,
        left: w / 2 - d.w / 2,
        top: w / 2 - d.h / 2,
      })
      Vue.set(this.$parent, 'currentTieTu', normalMax)
      this.$parent.personSort = i
      this.$parent.tietuIndex = this.$parent.tietus.length - 1
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
      if (this.$parent.mongs === -1) {
        this.showMsg = 1
        this.currentSort = 'furniture'
        this.$parent.personSort = ''
        return
      }
      this.$parent.showType = 'ending'
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
  height: calc(100vh - 113.96731vw);
  z-index: 20000;
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
      border: 1px solid #d8eaf2;
      border-radius: 6vh;
      width: 22vw;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1vw;
    }
    em {
      font-size: 4vw;
      color: #aebcc3;
    }
  }
  // .curr{
  //   background: #c9edf3;
  // }
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
