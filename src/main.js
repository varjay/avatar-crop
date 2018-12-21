// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import html2canvas from 'html2canvas'
window.Vue = Vue
window.html2canvas = html2canvas

window.rem = document.documentElement.clientWidth / 16
window.em = Math.sqrt((rem - 20) * 0.9) + 20
document.querySelector('html').style.fontSize = rem + 'px'
document.body.style.fontSize = em + 'px'

Vue.config.productionTip = false
window.RootApp = new Vue({
  render: h => h(App),
}).$mount('#app')
