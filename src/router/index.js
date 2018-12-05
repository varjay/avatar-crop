import index from '@/views/index'
// import notfound from "@/views/notfound";

var routes = [
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
export default routes
