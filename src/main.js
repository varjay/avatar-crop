import Vue from 'vue'
import App from './App'
import avatar from '../lib/'
Vue.use(avatar)

window.Vue = Vue

window.rem = document.documentElement.clientWidth / 16
window.em = Math.sqrt((rem - 20) * 0.9) + 20
document.querySelector('html').style.fontSize = rem + 'px'
document.body.style.fontSize = em + 'px'

Vue.config.productionTip = false
window.RootApp = new Vue({
  render: h => h(App),
}).$mount('#app')
