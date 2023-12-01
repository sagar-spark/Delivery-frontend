import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import PrintLayout from '@/layouts/PrintLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/pages/login',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
      },

      {
        path: '/assign-delivery',
        name: 'Assign Delivery',
        component: () => import('@/views/delivery/AssignDelivery.vue'),
      },

      {
        path: '/delivery-manifest',
        name: 'Delivery Manifest',
        component: () => import('@/views/delivery/DeliveryManifest.vue'),
      },

      {
        path: '/delivery-tracking',
        name: 'Delivery Tracking',
        component: () => import('@/views/delivery/DeliveryTracking.vue'),
      },

      {
        path: '/new-delivery-task',
        name: 'New Delivery Task',
        component: () => import('@/views/delivery/NewDeliveryTask.vue'),
      },

      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/delivery/Users.vue'),
      },

      {
        path: '/my-account',
        name: 'My Account',
        component: () => import('@/views/pages/MyAccount.vue'),
      },
      
      /////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////

    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'sso',
        name: 'SSO Interstitial',
        component: () => import('@/views/pages/InterstitialSSO'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'no-permission',
        name: 'No Permission',
        component: () => import('@/views/pages/PageNoPermission'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
