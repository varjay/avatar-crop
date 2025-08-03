<template>
  <div id="app" class="app">
    <!-- 头像裁剪区域 -->
    <div v-if="file" class="avatar-editor-container">
      <vue-avatar @cancel="cancel" @done="done" :file="file" @touch="touch" />
    </div>
    
    <!-- 主界面 -->
    <div class="main-container" v-if="!file">
      <div class="card">
        <h1 class="title">头像裁剪工具</h1>
        <div class="upload-area">
          <label for="avatar" class="upload-button">
            <span class="icon">+</span>
            <span>选择图片</span>
          </label>
          <input @change="changeUpload" id="avatar" type="file" accept="image/*" />
        </div>
        
        <!-- 裁剪结果直接显示在下方 -->
        <div v-if="croppedImageUrl" class="result-preview">
          <h2 class="subtitle">裁剪结果</h2>
          <div class="image-container">
            <img :src="croppedImageUrl" class="cropped-image-inline" alt="裁剪后的头像" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import avatar from '../lib/'
</script>

<script setup>
import { ref } from 'vue'

const file = ref(null)
const review = ref(false)
const croppedImageUrl = ref(null)
const croppedImage = ref(null)

async function changeUpload() {
  let a = document.getElementById('avatar')
  file.value = a.files[0]
}

function cancel() {
  file.value = null
}

/**
 * 处理头像裁剪完成事件
 * @param {Object} arg - 裁剪完成后返回的数据对象
 * @param {Blob} arg.blob - 裁剪后的图片Blob对象
 * @param {string} arg.base64 - 裁剪后的图片base64编码字符串
 * @param {string} arg.url - 裁剪后的图片URL地址
 */
function done(arg) {
  console.log('头像裁剪完成:', arg)
  
  // 保存裁剪结果
  if (arg) {
    // 存储裁剪后的图片数据
    croppedImage.value = arg
    
    // 优先使用返回的URL，如果没有则使用base64或创建blob URL
    if (arg.url) {
      // 使用组件返回的URL
      croppedImageUrl.value = arg.url
    } else if (arg.base64) {
      // 使用base64数据
      croppedImageUrl.value = arg.base64
    } else if (arg.blob) {
      // 从blob创建URL
      croppedImageUrl.value = URL.createObjectURL(arg.blob)
    }
    
    // 显示成功提示
    alert('头像裁剪成功！可以点击"查看裁剪结果"按钮预览')
  }
  
  // 清除文件选择，返回到主界面
  file.value = null
}

// 不再需要这个函数，因为裁剪结果直接显示在主界面
// function showCroppedPreview() {
//   review.value = true
// }

function touch() {
  console.log('触摸事件触发')
}
</script>
<style lang="less">
@import './sass/public.scss';

:root {
  --primary-color: #3498db;
  --secondary-color: #2980b9;
  --background-color: #f5f7fa;
  --card-color: #ffffff;
  --text-color: #333333;
  --border-radius: 12px;
  --shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.app {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

html,
body {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.main-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.card {
  background-color: var(--card-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 30px;
  text-align: center;
}

.title {
  font-size: 24px;
  color: var(--text-color);
  margin-bottom: 30px;
}

.upload-area {
  margin-bottom: 30px;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #ddd;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(52, 152, 219, 0.05);
  }
  
  .icon {
    font-size: 36px;
    color: #ccc;
    margin-bottom: 10px;
  }
  
  span {
    color: #888;
  }
}

input[type="file"] {
  display: none;
}

.result-preview {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.subtitle {
  font-size: 18px;
  color: var(--text-color);
  margin-bottom: 15px;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cropped-image-inline {
  max-width: 200px;
  max-height: 200px;
  border-radius: var(--border-radius); /* 正方形头像，保留圆角 */
  box-shadow: var(--shadow);
  border: 3px solid var(--primary-color);
  object-fit: cover; /* 确保图片填充整个区域 */
  aspect-ratio: 1 / 1; /* 保持1:1的宽高比，确保是正方形 */
}

.avatar-editor-container, .avatar-preview-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.preview-content {
  width: 100%;
  max-width: 500px;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cropped-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--border-radius);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.no-image {
  color: white;
  font-size: 18px;
}

.close-button {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-container {
    padding: 10px;
  }
  
  .card {
    padding: 20px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .upload-button {
    height: 120px;
  }
}
</style>
