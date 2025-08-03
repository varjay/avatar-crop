import Avatar from './components/avatar.vue'

function install(app) {
  app.component('vue-avatar', Avatar)
}

const avatar = {
  install,
  Avatar
}

export default avatar
