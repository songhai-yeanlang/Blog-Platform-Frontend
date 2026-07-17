<template>
  <div class="flex h-screen overflow-hidden w-full bg-[#f9f9ff] font-sans">
    <!-- Persistent Sidebar -->
    <aside :class="[
      'flex flex-col h-screen bg-white border-r border-gray-100 shadow-sm shrink-0 z-40 transition-transform duration-300 md:translate-x-0 fixed md:static left-0 top-0',
      isMobileMenuOpen ? 'translate-x-0 w-60' : '-translate-x-full md:w-60'
    ]">
      <div class="flex items-center gap-2 px-5 py-6">
        <span class="font-bold text-lg text-gray-900 tracking-tight">Blog-Post</span>
      </div>

      <nav class="flex-1 px-3 flex flex-col gap-1">
        <router-link to="/"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">grid_view</span>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/new-post"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Post</span>
        </router-link>



        <router-link to="/my-posts"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">description</span>
          <span>My Blogs</span>
        </router-link>
      </nav>

      <div class="px-3 pb-5 space-y-2">


        <button v-if="authStore.token" @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm transition-colors cursor-pointer bg-transparent">
          <span class="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </button>


      </div>
    </aside>

    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden">
    </div>

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Persistent Header -->
      <header
        class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer border-none bg-transparent">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="flex-1 max-w-md"></div>

        <div class="flex items-center gap-1">
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative border-none bg-transparent">
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
            <span class="material-symbols-outlined text-[22px]">favorite</span>
          </button>

          <!-- Header Logout/Login Actions -->



          <router-link to="/profile"
            class="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
            <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" alt="avatar"
              class="w-8 h-8 rounded-full object-cover border border-gray-200" />
            <span class="hidden md:inline text-sm font-medium text-gray-800">
              {{ authStore.user ? authStore.user.name : 'Mr. Jhone' }}
            </span>
            <span class="material-symbols-outlined text-[18px] text-gray-400">arrow_drop_down</span>
          </router-link>
        </div>
      </header>

      <!-- Main Scrollable Area -->
      <main class="flex-1 overflow-y-auto px-6 py-6">
        <!-- Skeleton shimmer: mirrors the real post-detail layout -->
        <div v-if="isLoading"
          class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <!-- Hero image placeholder -->
          <div class="skeleton-shimmer w-full h-72 rounded-none"></div>

          <div class="p-6 md:p-10 space-y-5">
            <!-- Category badge + date + views -->
            <div class="flex items-center gap-3">
              <div class="skeleton-shimmer h-4 rounded-sm w-16"></div>
              <div class="skeleton-shimmer h-3 rounded-full w-1.5"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-24"></div>
              <div class="skeleton-shimmer h-3 rounded-full w-1.5"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-16"></div>
            </div>

            <!-- Title (2 lines) -->
            <div class="space-y-2">
              <div class="skeleton-shimmer h-7 rounded w-full"></div>
              <div class="skeleton-shimmer h-7 rounded w-3/4"></div>
            </div>

            <!-- Author row -->
            <div class="flex items-center gap-3 py-3 border-y border-gray-100">
              <div class="skeleton-shimmer w-10 h-10 rounded-full shrink-0"></div>
              <div class="space-y-1.5">
                <div class="skeleton-shimmer h-3.5 rounded w-28"></div>
                <div class="skeleton-shimmer h-3 rounded w-20"></div>
              </div>
            </div>

            <!-- Body paragraphs -->
            <div class="space-y-2.5">
              <div class="skeleton-shimmer h-3.5 rounded w-full"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-full"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-11/12"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-4/5"></div>
            </div>
            <div class="space-y-2.5">
              <div class="skeleton-shimmer h-3.5 rounded w-full"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-full"></div>
              <div class="skeleton-shimmer h-3.5 rounded w-2/3"></div>
            </div>

            <!-- Tags -->
            <div class="flex gap-2 pt-1">
              <div class="skeleton-shimmer h-5 rounded-full w-14"></div>
              <div class="skeleton-shimmer h-5 rounded-full w-18"></div>
              <div class="skeleton-shimmer h-5 rounded-full w-12"></div>
            </div>
          </div>
        </div>

        <div v-if="errorMessage"
          class="max-w-4xl mx-auto bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined">error</span>
          <span>{{ errorMessage }}</span>
        </div>

        <div v-else-if="!post" class="max-w-4xl mx-auto text-center py-20 bg-white rounded-2xl border border-gray-100">
          <span class="material-symbols-outlined text-5xl text-gray-300">find_in_page</span>
          <h2 class="text-lg font-semibold text-gray-700 mt-3">Post Not Found</h2>
          <button @click="goBack"
            class="mt-4 bg-primary text-white px-5 py-2 rounded-full text-xs font-semibold cursor-pointer">
            Go Back
          </button>
        </div>

        <!-- Details Card Component -->
        <PostDetailCard v-else :post="post" @back="goBack" />
      </main>
      <ConfirmModal :show="showLogoutModal" :loading="logoutLoading" title="Confirm Logout"
        message="Are you sure you want to log out of your account?" confirm-text="Yes" cancel-text="No"
        @confirm="confirmLogout" @cancel="showLogoutModal = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/api'
import { useAuthStore } from '@/stores/authStore'
import PostDetailCard from '@/components/dashboard/PostDetailCard.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { resolveAvatarUrl } from '@/utils/avatar'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showLogoutModal = ref(false)
const logoutLoading = ref(false)

// fallbackAvatar is now handled inside resolveAvatarUrl (src/utils/avatar.js)

const isMobileMenuOpen = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const post = ref(null)

const mockBlogs = [

]

const goBack = () => {
  router.push('/dashboard')
}

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  logoutLoading.value = true
  try {
    await api.post('/auth/logout')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    logoutLoading.value = false
    showLogoutModal.value = false
  }
  authStore.logout()
  router.push('/')
}

// resolveAvatarUrl is imported from @/utils/avatar

const loadPost = async () => {
  isLoading.value = true
  errorMessage.value = ''
  const postId = route.params.id

  // Minimum 800ms skeleton display so shimmer is always visible
  const delay = new Promise(resolve => setTimeout(resolve, 800))

  try {
    // Fire view increment and data fetch in parallel with the delay
    const [res] = await Promise.all([
      (async () => {
        if (authStore.token) {
          await api.post(`/add-blog-view/${postId}`).catch(() => null)
        }
        return api.get('/get-all-blogs').catch(() => null)
      })(),
      delay
    ])

    let list = []
    if (res?.data?.success && res.data.data?.length) {
      list = res.data.data
    } else {
      list = mockBlogs
    }

    const found = list.find(b => String(b.id) === String(postId))
    if (found) {
      post.value = { ...found }
      // For guest users, simulate the view count increment locally in session storage
      if (!authStore.token) {
        const viewedSession = sessionStorage.getItem(`viewed_post_${postId}`)
        if (!viewedSession) {
          post.value.views = (post.value.views || 0) + 1
          sessionStorage.setItem(`viewed_post_${postId}`, 'true')
        }
      }
    } else {
      post.value = null
    }
  } catch {
    const found = mockBlogs.find(b => String(b.id) === String(postId))
    post.value = found || null
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPost)
</script>
