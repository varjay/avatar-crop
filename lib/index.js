import Avatar from './components/avatar'

function install (Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('vue-avatar', Avatar)
}

const avatar = {
  install: install,
  Avatar
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(avatar)
}

export default avatar
