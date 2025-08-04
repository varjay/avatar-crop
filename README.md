# Vue Avatar Crop

![演示动图](https://github.com/varjay/avatar-crop/raw/master/public/img/demo.gif)

一个支持 PC 端和移动端的 Vue 3 头像裁剪组件，提供直观的拖拽、缩放和裁剪功能。

## ✨ 特性

- 🖱️ **直观操作** - 支持鼠标拖拽和触摸手势
- 🔍 **灵活缩放** - 双指缩放和滑块缩放
- 📱 **响应式设计** - 自适应不同屏幕尺寸
- 🎨 **现代 UI** - 简洁美观的用户界面
- 📦 **轻量级** - 无外部依赖，体积小巧
- 🔧 **易于集成** - 简单的 API 设计

## 📦 安装

```bash
npm install vue-avatar-crop-wechat --save
```

## 🚀 快速开始

### 全局注册

```javascript
import {createApp} from 'vue'
import avatar from 'vue-avatar-crop-wechat'
import App from './App.vue'

const app = createApp(App)
app.use(avatar)
app.mount('#app')
```

### 局部引入

```javascript
import VueAvatar from 'vue-avatar-crop-wechat'

export default {
  components: {
    VueAvatar,
  },
}
```

### 基础用法

```vue
<template>
  <div>
    <!-- 文件选择 -->
    <input type="file" @change="handleFileChange" accept="image/*" />

    <!-- 头像裁剪组件 -->
    <vue-avatar v-if="selectedFile" :file="selectedFile" @cancel="handleCancel" @done="handleDone" />
  </div>
</template>

<script setup>
import {ref} from 'vue'

const selectedFile = ref(null)

function handleFileChange(event) {
  selectedFile.value = event.target.files[0]
}

function handleCancel() {
  selectedFile.value = null
}

function handleDone(result) {
  console.log('裁剪完成:', result)
  // result.base64 - base64格式图片
  // result.img - Blob格式图片
  // result.url - Blob URL地址

  selectedFile.value = null
}
</script>
```

## 📖 API 文档

### Props

| 参数 | 类型           | 默认值 | 说明                               |
| ---- | -------------- | ------ | ---------------------------------- |
| file | File \| String | null   | 要裁剪的图片文件或图片 URL         |
| edit | Boolean        | true   | 是否显示编辑界面（操作按钮和滑块） |

### Events

| 事件名 | 参数           | 说明                   |
| ------ | -------------- | ---------------------- |
| cancel | -              | 用户点击取消按钮时触发 |
| done   | result: Object | 用户确认裁剪时触发     |
| touch  | -              | 用户触摸图片时触发     |

### Done 事件返回值

```javascript
{
  base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...', // base64格式图片
  img: Blob,                                                    // Blob格式图片对象
  url: 'blob:http://localhost:3000/xxx-xxx-xxx'               // Blob URL地址
}
```

## 🎮 使用示例

### 完整示例

```vue
<template>
  <div class="avatar-demo">
    <!-- 上传区域 -->
    <div v-if="!currentFile" class="upload-area">
      <label for="file-input" class="upload-button"> 选择头像图片 </label>
      <input id="file-input" type="file" @change="selectFile" accept="image/*" style="display: none;" />
    </div>

    <!-- 裁剪组件 -->
    <vue-avatar v-if="currentFile" :file="currentFile" @cancel="cancelCrop" @done="completeCrop" @touch="onImageTouch" />

    <!-- 结果展示 -->
    <div v-if="croppedResult" class="result-area">
      <h3>裁剪结果</h3>
      <img :src="croppedResult.url" alt="裁剪后的头像" class="result-image" />
      <div class="result-actions">
        <button @click="downloadImage">下载图片</button>
        <button @click="resetDemo">重新选择</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const currentFile = ref(null)
const croppedResult = ref(null)

// 选择文件
function selectFile(event) {
  const file = event.target.files[0]
  if (file) {
    currentFile.value = file
  }
}

// 取消裁剪
function cancelCrop() {
  currentFile.value = null
}

// 完成裁剪
function completeCrop(result) {
  croppedResult.value = result
  currentFile.value = null

  // 可以在这里上传到服务器
  // uploadToServer(result.img)
}

// 图片触摸事件
function onImageTouch() {
  console.log('用户触摸了图片')
}

// 下载图片
function downloadImage() {
  if (croppedResult.value) {
    const link = document.createElement('a')
    link.download = 'avatar.jpg'
    link.href = croppedResult.value.url
    link.click()
  }
}

// 重置演示
function resetDemo() {
  croppedResult.value = null
  // 清空文件输入
  const input = document.getElementById('file-input')
  if (input) input.value = ''
}
</script>

<style scoped>
.avatar-demo {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.upload-area {
  text-align: center;
  padding: 40px;
  border: 2px dashed #ddd;
  border-radius: 8px;
}

.upload-button {
  display: inline-block;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.upload-button:hover {
  background: #0056b3;
}

.result-area {
  text-align: center;
  margin-top: 20px;
}

.result-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}

.result-actions {
  margin-top: 15px;
}

.result-actions button {
  margin: 0 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 仅预览模式

```vue
<template>
  <vue-avatar :file="imageUrl" :edit="false" />
</template>

<script setup>
const imageUrl = 'https://example.com/avatar.jpg'
</script>
```

## 🎯 操作指南

### PC 端操作

- **拖拽移动**: 鼠标按住图片拖拽
- **缩放调节**: 使用底部滑块调节缩放比例
- **确认裁剪**: 点击"确认"按钮完成裁剪
- **取消操作**: 点击"取消"按钮退出裁剪

### 移动端操作

- **单指拖拽**: 单指触摸拖拽移动图片位置
- **双指缩放**: 双指捏合/展开调节图片大小
- **滑块缩放**: 使用底部滑块精确调节缩放
- **触摸确认**: 点击"确认"按钮完成裁剪

## ⚙️ 技术特性

### 核心功能

- **智能适配**: 自动适配图片尺寸和屏幕大小
- **边界检测**: 防止图片移出裁剪区域
- **平滑动画**: 流畅的交互动画效果
- **内存管理**: 自动清理 Blob URL，防止内存泄漏

### 兼容性

- **Vue 版本**: Vue 3.x
- **浏览器**: 现代浏览器 (Chrome, Firefox, Safari, Edge)
- **移动端**: iOS Safari, Android Chrome
- **触摸支持**: 完整的触摸手势支持

## 🔧 开发指南

### 本地开发

```bash
# 克隆项目
git clone https://github.com/varjay/avatar-crop.git

# 安装依赖
cd avatar-crop
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 代码检查
npm run lint
```

### 项目结构

```
avatar-crop/
├── lib/                    # 组件源码
│   ├── index.js           # 入口文件
│   └── components/
│       └── avatar.vue     # 主组件
├── src/                   # 示例代码
│   ├── App.vue           # 示例应用
│   └── main.js           # 入口文件
├── public/               # 静态资源
└── package.json          # 项目配置
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

### 提交 Issue

- 详细描述问题和复现步骤
- 提供浏览器和设备信息
- 如果可能，请提供最小复现示例

### 提交 PR

- Fork 项目并创建特性分支
- 确保代码通过 ESLint 检查
- 添加必要的测试用例
- 更新相关文档

## 📄 许可证

[ISC License](LICENSE)

## 👨‍💻 作者

**virjay** - [GitHub](https://github.com/varjay)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
