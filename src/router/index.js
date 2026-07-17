import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import VerifyEmail from '@/views/auth/VerifyEmail.vue'
import VerifyOtp from '@/views/auth/VerifyOtp.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
 
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
    },
    {
      path: '/verify-otp',
      name: 'verify-otp',
      component: VerifyOtp,
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ResetPassword,
    },
       {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: () => import('@/views/dashboard/PostDetail.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/dashboard/Profile.vue'),
    },
    {
      path: '/new-post',
      name: 'new-post',
      component: () => import('@/views/dashboard/NewPost.vue'),
    },
    {
      path: '/my-posts',
      name: 'my-posts',
      component: () => import('@/views/dashboard/MyBlogs.vue'),
    },
    {
      path: '/edit-post/:id',
      name: 'edit-post',
      component: () => import('@/views/dashboard/EditPost.vue'),
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmail,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// Route navigation guard to validate auth state
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const isLoggedIn = !!(token && user)

  const authPages = ['login', 'register', 'forgot-password', 'verify-otp', 'change-password']
  const publicPages = ['verify-email', ...authPages]

  const isAuthPage = authPages.includes(to.name)
  const isPublicPage = publicPages.includes(to.name)

  if (isLoggedIn) {
    // If logged in, redirect away from auth pages (login, register, etc.) to the dashboard
    if (isAuthPage) {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  } else {
    // If not logged in, only allow accessing public pages. Redirect to login for any other route.
    if (!isPublicPage) {
      next({ name: 'login' })
    } else {
      next()
    }
  }
})

export default router
