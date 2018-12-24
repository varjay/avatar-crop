import Vue from 'vue'
import App from './App'
import avatar from '../lib/'
Vue.use(avatar)

window.Vue = Vue

window.RootApp = new Vue({
  render: h => h(App),
}).$mount('#app')
