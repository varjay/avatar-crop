import Avatar from './components/avatar.vue'

function install(app) {
  app.component('v-avatar-cropper', Avatar)
}

const avatar = {
  install,
  Avatar
}

export default avatar
