<template>
  <div class="flex h-screen overflow-hidden w-full bg-[#f9f9ff] font-sans">
    <!-- Sidebar -->
    <aside :class="[
      'flex flex-col h-screen bg-white border-r border-gray-100 shadow-sm shrink-0 z-40 transition-transform duration-300 md:translate-x-0 fixed md:static left-0 top-0',
      isMobileMenuOpen ? 'translate-x-0 w-60' : '-translate-x-full md:w-60'
    ]">
      <div class="flex items-center gap-2 px-5 py-6">
        <span class="font-bold text-lg text-gray-900 tracking-tight">Blog-Platform</span>
      </div>

      <nav class="flex-1 px-3 flex flex-col gap-1">
        <router-link to="/dashboard"
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

      <div class="px-3 pb-5">
        <router-link to="/about-us"
          :class="[
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer w-full text-center',
            $route.path === '/about-us'
              ? 'bg-primary border-primary text-white shadow-sm hover:bg-primary/95'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-primary/30'
          ]">
          <span class="material-symbols-outlined text-[20px]">info</span>
          <span>About Us</span>
        </router-link>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden"></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="flex-1">
          <nav class="flex items-center gap-1 text-sm text-gray-400">
            <router-link to="/dashboard" class="hover:text-primary transition-colors">Dashboard</router-link>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            <span class="text-gray-700 font-medium">Favorites</span>
          </nav>
        </div>

        <div class="flex items-center gap-1">
          <NotificationBell />
          
          <!-- Favorite Header Button (linked to Favorites view) -->
          <router-link
            to="/favorites"
            class="w-9 h-9 rounded-full flex items-center justify-center text-primary bg-primary/10 transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[22px]">favorite</span>
          </router-link>

          <!-- Profile Dropdown -->
          <div class="relative" ref="profileDropdownRef">
            <button
              type="button"
              @click="isProfileDropdownOpen = !isProfileDropdownOpen"
              class="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent outline-none"
            >
              <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" alt="avatar"
                class="w-8 h-8 rounded-full object-cover border border-gray-200" />
              <span class="hidden md:inline text-sm font-medium text-gray-800">
                {{ authStore.user?.name || 'User' }}
              </span>
              <span class="material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isProfileDropdownOpen }">
                arrow_drop_down
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isProfileDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 animate-fade-in"
            >
              <router-link
                to="/profile"
                @click="isProfileDropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50/50 hover:text-primary transition-colors"
              >
                <span class="material-symbols-outlined text-[18px]">settings</span>
                <span>Setting</span>
              </router-link>

              <div class="border-t border-gray-50 my-1"></div>

              <button
                type="button"
                @click="triggerLogoutFromDropdown"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50/50 transition-colors border-none bg-transparent text-left cursor-pointer outline-none"
              >
                <span class="material-symbols-outlined text-[18px]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 px-6 py-8">
        <div class="max-w-6xl mx-auto space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Favorite Posts</h2>
              <p class="text-xs text-gray-400 mt-0.5">Your curated collection of favorite articles</p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
              {{ filteredPosts.length }} Saved
            </span>
          </div>

          <!-- Loading state -->
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-4 space-y-4 animate-pulse">
              <div class="w-full h-44 bg-gray-200 rounded-xl"></div>
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-6 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="filteredPosts.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center gap-4">
            <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <span class="material-symbols-outlined text-[32px]">favorite</span>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-gray-900 text-base">No Favorite Posts Yet</h3>
              <p class="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed">
                Explore interesting topics on the dashboard and click the heart icon to save articles here.
              </p>
            </div>
            <router-link to="/dashboard" class="px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 shadow-sm shadow-primary/20 transition-all">
              Go to Dashboard
            </router-link>
          </div>

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BaseCard
              v-for="post in filteredPosts"
              :key="post.id"
              :post="post"
              :is-favorite="true"
              @click-card="goToDetail"
              @toggle-favorite="toggleFavorite"
            />
          </div>
        </div>
      </main>
    </div>

    <!-- Logout confirm modal -->
    <ConfirmModal :show="showLogoutModal" :loading="logoutLoading" title="Confirm Logout"
      message="Are you sure you want to log out of your account?" confirm-text="Yes" cancel-text="No"
      @confirm="confirmLogout" @cancel="showLogoutModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/api'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { resolveAvatarUrl } from '@/utils/avatar'
import BaseCard from '@/components/base/BaseCard.vue'
import NotificationBell from '@/components/dashboard/NotificationBell.vue'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const showLogoutModal = ref(false)
const logoutLoading = ref(false)

const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref(null)

const blogs = ref([])
const isLoading = ref(false)
const favorites = ref(JSON.parse(localStorage.getItem('blog_favorites') || '[]'))

const triggerLogoutFromDropdown = () => {
  isProfileDropdownOpen.value = false
  handleLogout()
}

const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((favId) => favId !== id)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem('blog_favorites', JSON.stringify(favorites.value))
}

const handleClickOutside = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    isProfileDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const filteredPosts = computed(() => {
  return blogs.value.filter(post => favorites.value.includes(post.id))
})

const goToDetail = (id) => {
  router.push({ path: `/post/${id}`, query: { from: 'dashboard' } })
}

const fetchData = async () => {
  isLoading.value = true
  // Minimum 800ms skeleton display
  const delay = new Promise(resolve => setTimeout(resolve, 800))
  try {
    const [res] = await Promise.all([
      api.get('/get-all-blogs').catch(() => null),
      delay
    ])
    if (res?.data?.success && res.data.data?.length) {
      blogs.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to load blogs:', err)
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => { showLogoutModal.value = true }

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

const resolveBlogImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
  return `${base}${path}`
}

const stripHtmlTags = (str) => {
  if (!str) return ''
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(fetchData)
</script>

<style scoped>
.font-fill {
  font-variation-settings: 'FILL' 1;
}
</style>
