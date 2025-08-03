<template>
  <div class="container">
    <!-- 主要绘制区域 -->
    <div class="draw" :style="drawStyle">
      <div
        v-if="target.url"
        ref="tietu"
        @click.stop=""
        :class="selectClass"
        :style="imageContainerStyle"
        class="tietu"
      >
        <div
          @mousedown.prevent="handleMouseDown"
          @mousemove.prevent="handleMouseMove"
          @mouseup.prevent="handleMouseUp"
          @mouseout.prevent="handleMouseUp"
          @touchstart.prevent="handleTouchStart"
          @touchmove.prevent="handleTouchMove"
          @touchend.prevent="handleTouchEnd"
          class="target"
          :style="imageTransformStyle"
        >
          <img 
            :src="target.url" 
            :width="target.w" 
            :height="target.h" 
            @click="$emit('touch')"
            alt="头像预览"
          />
        </div>
      </div>
      
      <!-- 遮罩层 -->
      <template v-if="edit">
        <div class="shadow bottom"></div>
        <div class="shadow top"></div>
        <div class="shadow left"></div>
        <div class="shadow right"></div>
      </template>
    </div>
    
    <!-- 缩放滑块 -->
    <div class="ac-slider-container" :style="sliderContainerStyle">
      <div
        class="ac-slider"
        @touchmove="handleSliderMove"
        @touchend="handleSliderEnd"
        @mousedown.prevent="handleSliderDown"
        @mousemove="handleSliderMove"
        @mouseup.prevent="handleSliderEnd"
        @mouseleave.prevent="handleSliderEnd"
      >
        <div class="ac-slider-bar" :style="sliderBarStyle">
          <div class="ac-slider-button"></div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div v-if="edit" class="operate">
      <div @click="$emit('cancel')"><em>取消</em></div>
      <div @click="handleGenerate"><em>确认</em></div>
    </div>
    
    <!-- 隐藏的画布用于生成最终图片 -->
    <canvas 
      style="display: none;" 
      :width="clothW" 
      :height="clothH" 
      ref="canvas"
    ></canvas>
  </div>
</template>
<script setup name="VueAvatar">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// Props 定义
const props = defineProps({
  file: {
    type: [File, String],
    default: null
  },
  edit: {
    type: Boolean,
    default: true,
  }
})

// 事件定义
const emit = defineEmits(['cancel', 'done', 'touch'])

// DOM 引用
const tietu = ref(null)
const canvas = ref(null)

// 常量定义
const VIEWPORT_RATIO = 0.875
const MIN_SCALE = 1
const MAX_SCALE = 3
const ANIMATION_DURATION = 200

// 状态管理
const state = reactive({
  // 拖拽相关
  offsetTop: 0,
  offsetLeft: 0,
  selectState: '',
  selectTimer: null,
  
  // 触摸相关
  touchMoveActive: false,
  firstTwoTouchSize: 0,
  firstScale: 1,
  
  // 鼠标相关
  mouseHold: false,
  
  // 滑块相关
  sliderPercent: 0,
  sliderMouseActive: false,
})

// 图片目标对象
const target = reactive({
  w: 0,
  h: 0,
  url: '',
  scale: 1,
  left: 0,
  top: 0,
  image: null,
  centerX: 0,
  centerY: 0,
  originCenterX: 0,
  originCenterY: 0,
  originW: 0,
  originH: 0,
})

// 源图片信息
const sourceImg = reactive({
  w: 0,
  h: 0,
  type: '',
})

// 画布尺寸
const canvasSize = reactive({
  width: document.documentElement.clientWidth * VIEWPORT_RATIO,
  height: document.documentElement.clientWidth * VIEWPORT_RATIO,
})

// 计算属性
const clothW = computed(() => canvasSize.width)
const clothH = computed(() => canvasSize.height)

// 计算属性 - 样式相关
const drawStyle = computed(() => ({
  width: `${clothW.value}px`,
  height: `${clothH.value}px`
}))

const imageContainerStyle = computed(() => ({
  top: `${target.top}px`,
  left: `${target.left}px`
}))

const imageTransformStyle = computed(() => ({
  transform: `scale(${target.scale})`
}))

const selectClass = computed(() => ({
  [state.selectState]: state.selectState !== ''
}))

const sliderContainerStyle = computed(() => ({
  width: `${clothW.value}px`
}))

const sliderBarStyle = computed(() => ({
  width: `${state.sliderPercent * 100}%`
}))

// 计算属性 - 缩放限制
const scaleRange = computed(() => ({
  min: MIN_SCALE,
  max: MAX_SCALE
}))

const maxWidth = computed(() => {
  return -(sourceImg.w * target.scale - clothW.value)
})

const maxHeight = computed(() => {
  return -(sourceImg.h * target.scale - clothH.value)
})

// 工具函数
const utils = {
  // 将 DataURL 转换为 Blob
  dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    const n = bstr.length
    const u8arr = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }
    return new Blob([u8arr], { type: mime })
  },

  // 限制数值在指定范围内
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  },

  // 清理定时器
  clearSelectTimer() {
    if (state.selectTimer) {
      clearTimeout(state.selectTimer)
      state.selectTimer = null
    }
  }
}

// 位置校正函数
function correctPosition() {
  const scaledCenterX = target.centerX * (target.scale - 1)
  const scaledCenterY = target.centerY * (target.scale - 1)
  
  // Y轴位置校正
  const adjustedTop = target.top - scaledCenterY
  if (adjustedTop > 0 || adjustedTop < maxHeight.value) {
    const distanceToTop = Math.abs(adjustedTop)
    const distanceToBottom = Math.abs(adjustedTop - maxHeight.value)
    
    if (distanceToTop < distanceToBottom) {
      target.top = scaledCenterY
    } else {
      target.top = maxHeight.value + scaledCenterY
    }
  }
  
  // X轴位置校正
  const adjustedLeft = target.left - scaledCenterX
  if (adjustedLeft > 0 || adjustedLeft < maxWidth.value) {
    const distanceToLeft = Math.abs(adjustedLeft)
    const distanceToRight = Math.abs(adjustedLeft - maxWidth.value)
    
    if (distanceToLeft < distanceToRight) {
      target.left = scaledCenterX
    } else {
      target.left = maxWidth.value + scaledCenterX
    }
  }
}

// 生成最终图片
function handleGenerate() {
  const canvasEl = canvas.value
  const ctx = canvasEl.getContext('2d')
  
  // 清空画布并设置白色背景
  ctx.clearRect(0, 0, clothW.value, clothH.value)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, clothW.value, clothH.value)
  
  // 绘制缩放后的图片
  const scaledCenterX = target.centerX * (target.scale - 1)
  const scaledCenterY = target.centerY * (target.scale - 1)
  
  ctx.drawImage(
    target.image,
    target.left - scaledCenterX,
    target.top - scaledCenterY,
    target.w * target.scale,
    target.h * target.scale,
  )
  
  // 生成结果
  const base64 = canvasEl.toDataURL(sourceImg.type)
  const blob = utils.dataURLtoBlob(base64)
  const url = URL.createObjectURL(blob)
  
  emit('done', {
    base64,
    img: blob,
    url,
  })
}

// 加载图片
function loadImage(file) {
  if (file instanceof File) {
    // 处理文件对象
    sourceImg.type = file.type
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      target.image = img
      
      const blob = utils.dataURLtoBlob(e.target.result)
      target.url = URL.createObjectURL(blob)
      
      img.onload = () => {
        calculateImageSize(img.width, img.height)
      }
    }
  } else if (typeof file === 'string') {
    // 处理URL字符串
    target.url = file
    const img = new Image()
    img.src = file
    target.image = img
    img.onload = () => {
      calculateImageSize(img.width, img.height)
    }
  }
}

// 计算图片尺寸和位置
function calculateImageSize(originalWidth, originalHeight) {
  let scale
  let width = originalWidth
  let height = originalHeight
  
  if (width > height && props.edit) {
    // 横图处理
    scale = height / clothH.value
    height = height / scale
    width = width / scale
    target.top = 0
    target.left = -(width - clothW.value) / 2
  } else {
    // 竖图或方图处理
    scale = width / clothW.value
    width = width / scale
    height = height / scale
    
    if (width > height && height < clothH.value) {
      canvasSize.height = height
    }
    
    target.top = -(height - clothH.value) / 2
    target.left = 0
  }
  
  // 更新图片信息
  sourceImg.w = width
  sourceImg.h = height
  target.w = width
  target.h = height
  target.centerX = width / 2
  target.centerY = height / 2
  target.originCenterX = target.centerX - target.left
  target.originCenterY = target.centerY - target.top
  target.originW = width / 2
  target.originH = height / 2
}

// 图片移动处理
function moveImage(event) {
  const scaledCenterX = target.centerX * (target.scale - 1)
  const scaledCenterY = target.centerY * (target.scale - 1)
  
  // Y轴移动处理
  const newTop = event.clientY - state.offsetTop
  const adjustedTop = newTop - scaledCenterY
  
  if (adjustedTop > 0) {
    target.top = ((maxHeight.value + (sourceImg.h - clothH.value)) / 2) * -1
  } else if (adjustedTop < maxHeight.value) {
    target.top = (maxHeight.value - (sourceImg.h - clothH.value)) / 2
  } else {
    target.top = newTop
  }

  // X轴移动处理
  const newLeft = event.clientX - state.offsetLeft
  const adjustedLeft = newLeft - scaledCenterX
  
  if (adjustedLeft > 0) {
    target.left = ((maxWidth.value + (sourceImg.w - clothW.value)) / 2) * -1
  } else if (adjustedLeft < maxWidth.value) {
    target.left = (maxWidth.value - (sourceImg.w - clothW.value)) / 2
  } else {
    target.left = newLeft
  }
  
  // 更新原点位置
  target.originW = sourceImg.w - (target.left + target.originCenterX)
  target.originH = sourceImg.h - (target.top + target.originCenterY)
}

// 开始拖拽
function startDrag(event) {
  state.selectState = 'select-create'
  state.selectTimer = setTimeout(() => {
    state.selectState = 'select-created'
  }, ANIMATION_DURATION)
  
  state.offsetTop = event.clientY - tietu.value.offsetTop
  state.offsetLeft = event.clientX - tietu.value.offsetLeft
}

// 结束拖拽
function endDrag() {
  utils.clearSelectTimer()
  state.selectState = 'select-destroy'
  setTimeout(() => {
    state.selectState = ''
  }, ANIMATION_DURATION)
}

// 触摸事件处理
function handleTouchStart(e) {
  startDrag(e.touches[0])
  state.touchMoveActive = e.touches.length === 1
}

function handleTouchMove(e) {
  if (e.touches.length > 1 || !state.touchMoveActive) {
    handlePinch(e)
    return
  }
  
  utils.clearSelectTimer()
  state.selectState = 'select-created'
  moveImage(e.touches[0])
}

function handleTouchEnd(e) {
  if (e.touches.length < 2) {
    state.firstTwoTouchSize = 0
    state.firstScale = 1
    target.scale = Math.max(target.scale, MIN_SCALE)
    correctPosition()
  }
  endDrag()
}

// 鼠标事件处理
function handleMouseDown(e) {
  state.mouseHold = true
  startDrag(e)
}

function handleMouseMove(e) {
  if (state.mouseHold) {
    moveImage(e)
  }
}

function handleMouseUp() {
  state.mouseHold = false
  endDrag()
}

// 双指缩放处理
function handlePinch(e) {
  if (e.touches.length < 2) return
  
  const touch1 = e.touches[0]
  const touch2 = e.touches[1]
  const distance = Math.sqrt(
    Math.pow(touch1.clientX - touch2.clientX, 2) + 
    Math.pow(touch1.clientY - touch2.clientY, 2)
  )
  
  if (state.firstTwoTouchSize === 0) {
    state.firstTwoTouchSize = distance
    state.firstScale = target.scale
  }
  
  const scaleRatio = distance / state.firstTwoTouchSize
  target.scale = utils.clamp(
    state.firstScale * scaleRatio, 
    scaleRange.value.min, 
    scaleRange.value.max
  )
}

// 滑块事件处理
function handleSliderMove(e) {
  if (!e.touches && !state.sliderMouseActive) {
    return
  }
  
  const clientWidth = document.documentElement.clientWidth
  const touch = e.touches ? e.touches[0] : e
  let x = touch.clientX - clientWidth * 0.0625
  
  x = utils.clamp(x, 0, clothW.value)
  
  const ratio = x / clothW.value
  target.scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * ratio
  state.sliderPercent = ratio
}

function handleSliderEnd() {
  correctPosition()
  state.sliderMouseActive = false
}

function handleSliderDown() {
  state.sliderMouseActive = true
}

// 生命周期
onMounted(() => {
  if (!props.edit) {
    canvasSize.width = document.documentElement.clientWidth
    canvasSize.height = document.documentElement.clientHeight
  }
  
  if (props.file) {
    loadImage(props.file)
  }
})

onUnmounted(() => {
  utils.clearSelectTimer()
  
  // 清理创建的 URL 对象
  if (target.url && target.url.startsWith('blob:')) {
    URL.revokeObjectURL(target.url)
  }
})
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding-bottom: 54px;
}
.draw {
  position: relative;
  background-color: #1d1d1d;
  z-index: 1;
}
.tietu {
  position: absolute;
  right: 0;
  top: 0;
  background-size: 100% !important;
  &.select-create,
  &.select-created {
    .target {
      cursor: grabbing;
    }
  }
  .target {
    cursor: grab;
    display: inline-block;
    img {
      display: block;
    }
  }
}
.shadow {
  position: absolute;
  width: 87.5vw;
  background: rgba(0, 0, 0, 0.7);
  height: 100vh;
  pointer-events: none;
  &.top {
    top: -100vh;
    border-bottom: 1px solid white;
    &:before {
      content: '';
      display: block;
      width: 1px;
      background-color: white;
      height: 87.5vw;
      position: absolute;
      top: 100vh;
      left: 0;
    }
    &:after {
      content: '';
      display: block;
      width: 1px;
      background-color: white;
      height: 87.5vw;
      position: absolute;
      top: 100vh;
      right: 0;
    }
  }
  &.bottom {
    top: 87.5vw;
    border-top: 1px solid white;
  }
  &.left,
  &.right {
    top: -50vh;
    height: 200vh;
  }
  &.left {
    left: -87.5vw;
  }
  &.right {
    right: -87.5vw;
  }
}
.operate {
  height: 54px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.4);
  > div {
    width: 24%;
    height: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      background: rgba(255, 255, 255, 0.2);
      em {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    em {
      font-size: 14px;
    }
  }
}
.ac-slider-container {
  position: relative;
  z-index: 2;
  padding-top: 30px;
}
.ac-slider {
  position: relative;
  height: 2px;
  background-color: #7d8084;
  width: 100%;
  &:before {
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    bottom: -8px;
    content: '';
    display: block;
    width: 100%;
    cursor: pointer;
  }
  .ac-slider-bar {
    position: relative;
    background-color: #1989fa;
    height: 2px;
  }
  .ac-slider-button {
    position: absolute;
    top: -11px;
    right: -12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: white;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
