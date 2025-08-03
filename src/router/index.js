import index from '../views/index.vue'
// import notfound from "../views/notfound";
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    nav: true,
    name: 'Family',
    meta: {
      title: 'Family',
      nav: 1,
    },
    component: index,
  },
  {
    path: '/notfound',
    name: '404',
    meta: {
      hide: 1,
    },
    component: index,
  },
  {
    path: '*',
    redirect: '/notfound',
  },
]

export default new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})
