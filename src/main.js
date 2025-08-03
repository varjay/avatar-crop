import { createApp } from 'vue'
import App from './App.vue'
import avatar from '../lib/'

const app = createApp(App)
app.use(avatar)
app.mount('#app')

window.RootApp = app
