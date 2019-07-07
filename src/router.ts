import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/chat',
    },
    {
      path: '/admin',
      redirect: '/admin/login',
    },
    {
      path: '/admin/login',
      name: 'Login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      component: () => import('./views/Dashboard.vue'),
    },
    {
      path: '/admin/intents',
      name: 'Intents',
      component: () => import('./views/Intents.vue'),
    },
    {
      path: '/admin/contents',
      name: 'TextContents',
      component: () => import('./views/TextContents.vue'),
    },
    {
      path: '/admin/answers',
      name: 'TextAnswers',
      component: () => import('./views/TextAnswers.vue'),
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: () => import('./views/Users.vue'),
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('./views/Chat.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/admin/']
  const authRequired =
    !publicPages.includes(to.path) && to.path !== '/admin/login' && to.path !== '/chat'
  const loggedIn = localStorage.getItem('jwt')

  if (authRequired && !loggedIn) {
    return next({
      path: '/admin/login',
      query: { redirect: to.fullPath },
    })
  }

  next()
})

export default router
