import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { getToken } from '@/utils/auth'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { 
          title: '首页',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/permission/index.vue'),
        name: 'Permission',
        meta: { 
          title: '权限管理',
          icon: 'lock'
        }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/role/index.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'user'
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/user/index.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'user'
        }
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/menu/index.vue'),
        name: 'Menu',
        meta: {
          title: '菜单管理',
          icon: 'menu'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  
  if (to.path === '/login') {
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router 