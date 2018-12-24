# avatar-crop
![image](https://github.com/varjay/avatar-crop/raw/master/public/img/demo.gif)
### 安装
```
npm i vue-avatar-crop-wechat --save
```

### 如何使用
``` js
// 导入
import avatar from 'vue-avatar-crop-wechat'
Vue.use(avatar)

// 使用
<vue-avatar @cancel="cancel" @done="done" :file="file" />
```

### 参数
``` js
// cancel: 取消操作，没有参数。
// done: 返回
{
  base64: 'base64图片',
  img: 'blob图片',
  url: 'blob的url地址',
}
```

### Lints and fixes files
```
npm run lint
```
