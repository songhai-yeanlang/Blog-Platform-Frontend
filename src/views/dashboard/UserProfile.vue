<template>
  <div class="flex h-screen overflow-hidden w-full bg-[#f9f9ff] font-sans">

    <!-- ── Sidebar ──────────────────────────────────────────────────────────── -->
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
          <span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span>
        </router-link>
        <router-link to="/new-post"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">add_circle</span><span>New Post</span>
        </router-link>
        <router-link to="/my-posts"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">description</span><span>My Blogs</span>
        </router-link>
      </nav>

      <div class="px-3 pb-5">
        <router-link to="/about-us" :class="[
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
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden" />

    <!-- ── Main ─────────────────────────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Header -->
      <header
        class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="flex-1">
          <nav class="flex items-center gap-1 text-sm text-gray-400">
            <router-link to="/dashboard" class="hover:text-primary transition-colors">Dashboard</router-link>
            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
            <span class="text-gray-700 font-medium">User Profile</span>
          </nav>
        </div>
        <div class="flex items-center gap-1">
          <NotificationBell />
          <router-link to="/favorites"
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[22px]">favorite</span>
          </router-link>

          <!-- Profile Dropdown -->
          <div class="relative" ref="profileDropdownRef">
            <button type="button" @click="isProfileDropdownOpen = !isProfileDropdownOpen"
              class="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent outline-none">
              <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" alt="avatar"
                class="w-8 h-8 rounded-full object-cover border-2 border-primary/30" />
              <span class="hidden md:inline text-sm font-medium text-gray-800">
                {{ authStore.user?.name || 'User' }}
              </span>
              <span class="material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': isProfileDropdownOpen }">
                arrow_drop_down
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div v-if="isProfileDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 animate-fade-in">
              <router-link to="/profile" @click="isProfileDropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50/50 hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[18px]">settings</span>
                <span>Setting</span>
              </router-link>
              <div class="border-t border-gray-50 my-1"></div>
              <button type="button" @click="triggerLogout"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50/50 transition-colors border-none bg-transparent text-left cursor-pointer outline-none">
                <span class="material-symbols-outlined text-[18px]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50/50">
        <!-- Loading State -->
        <div v-if="isLoading" class="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Left skeletal card -->
            <div class="w-full lg:w-80 bg-white rounded-2xl border border-gray-100 p-6 shrink-0 flex flex-col items-center">
              <div class="skeleton-shimmer w-24 h-24 rounded-full mb-4"></div>
              <div class="skeleton-shimmer h-4 w-32 rounded mb-2"></div>
              <div class="skeleton-shimmer h-3 w-40 rounded"></div>
              <div class="border-t border-gray-100 my-5 w-full"></div>
              <div class="skeleton-shimmer h-6 w-full rounded-lg mb-2"></div>
            </div>
            <!-- Right skeletal content -->
            <div class="flex-1 space-y-4">
              <div class="skeleton-shimmer h-6 w-40 rounded"></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 2" :key="i" class="skeleton-shimmer h-64 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="max-w-xl mx-auto px-4 py-16 text-center">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <span class="material-symbols-outlined text-red-500 text-[48px] mb-3">error_outline</span>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Failed to Load Profile</h3>
            <p class="text-sm text-gray-500 mb-6">{{ errorMessage }}</p>
            <BaseButton @click="loadData" variant="outline" class="mx-auto">
              Try Again
            </BaseButton>
          </div>
        </div>

        <!-- Main Workspace -->
        <div v-else class="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div class="flex flex-col lg:flex-row gap-6">
            
            <!-- Left Info Panel -->
            <div class="w-full lg:w-80 shrink-0">
              <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6 flex flex-col items-center text-center">
                <!-- Avatar -->
                <div class="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-primary/10 bg-white mb-4 shrink-0 flex items-center justify-center">
                  <img v-if="profile.avatar" :src="resolveAvatarUrl(profile.avatar, profile.name)" alt="avatar"
                    class="w-full h-full object-cover" />
                  <span v-else class="text-3xl font-extrabold text-primary uppercase">
                    {{ profile.name ? profile.name[0] : 'U' }}
                  </span>
                </div>

                <!-- Name & Email -->
                <h2 class="text-lg font-bold text-gray-955 leading-tight truncate px-2 max-w-full">
                  {{ profile.name || 'Anonymous' }}
                </h2>
                <p class="text-xs text-gray-400 mt-1 select-all px-2 max-w-full">
                  {{ profile.bio }}
                </p>

                <!-- Status Pills -->
                

                <div class="border-t border-gray-100 my-4 w-full"></div>

                <!-- Stats summary -->
                <div class="grid grid-cols-2 gap-4 w-full mb-4">
                  <div class="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-center">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Blogs</p>
                    <p class="text-lg font-extrabold text-gray-900 mt-0.5">{{ totalBlogs }}</p>
                  </div>
                  <div class="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-center">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Views</p>
                    <p class="text-lg font-extrabold text-gray-900 mt-0.5">{{ totalViews }}</p>
                  </div>
                </div>

                <!-- Bio -->
                <div v-if="profile.bio" class="w-full text-left bg-gray-50/30 border border-gray-100 rounded-xl p-3.5 mt-1">
                  <span class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</span>
                  <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{{ profile.email }}</p>
                </div>

                <!-- Contact phone if available -->
                <div v-if="profile.phone" class="w-full text-left bg-gray-50/30 border border-gray-100 rounded-xl p-3.5 mt-2 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[16px] text-gray-400">Phone</span>
                  <span class="text-xs text-gray-600 font-medium">{{ profile.phone }}</span>
                </div>

                <!-- Edit Profile Option for own settings -->
                <div v-if="isOwnProfile" class="w-full mt-5">
                  <router-link to="/profile">
                    <BaseButton variant="outline" class="w-full flex items-center justify-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px]">settings</span>
                      Edit My Settings
                    </BaseButton>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Right Content Panel -->
            <div class="flex-1 space-y-6">
              
              <!-- Section Header -->
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-base font-bold text-gray-900">Recent Publications</h2>
                  <p class="text-xs text-gray-400 mt-0.5">Explore articles written by {{ profile.name }}</p>
                </div>
                <span class="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full">
                  {{ totalBlogs }} {{ totalBlogs === 1 ? 'Post' : 'Posts' }}
                </span>
              </div>

              <!-- Blogs Grid -->
              <div v-if="blogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseCard
                  v-for="post in blogs.slice(0, visibleCount)"
                  :key="post.id"
                  :post="post"
                  :show-author="false"
                  :is-favorite="isFavorite(post.id)"
                  @toggle-favorite="toggleFavorite"
                />
              </div>

              <!-- Empty State -->
              <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <span class="material-symbols-outlined text-gray-300 text-[48px] mb-3">post_add</span>
                <h3 class="font-bold text-gray-900 text-base">No Public Publications</h3>
                <p class="text-xs text-gray-400 max-w-xs mx-auto mt-1">This user hasn't published any articles yet.</p>
              </div>

              <!-- Load More Button -->
              <div v-if="visibleCount < blogs.length" class="flex items-center justify-center mt-8">
                <button @click="loadMore" :disabled="isPageLoading"
                  class="flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:bg-transparent disabled:text-primary transition-all font-medium text-xs cursor-pointer shadow-sm">
                  <template v-if="isPageLoading">
                    <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    <span>Loading...</span>
                  </template>
                  <template v-else>
                    <span>Load More</span>
                  </template>
                </button>
               </div>

            </div>

          </div>
        </div>
      </main>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal :show="showLogoutModal" :loading="logoutLoading" title="Confirm Logout"
      message="Are you sure you want to log out of your account?" confirm-text="Yes" cancel-text="No"
      @confirm="confirmLogout" @cancel="showLogoutModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { getUserProfileById } from '@/api/api'
import { useAuthStore } from '@/stores/authStore'
import { resolveAvatarUrl } from '@/utils/avatar'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import NotificationBell from '@/components/dashboard/NotificationBell.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const isLoading = ref(true)
const errorMessage = ref('')
const profile = ref({})
const blogs = ref([])
const totalBlogs = ref(0)
const totalViews = ref(0)

// Pagination
const visibleCount = ref(6)
const isPageLoading = ref(false)

// UI States
const isMobileMenuOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref(null)
const showLogoutModal = ref(false)
const logoutLoading = ref(false)

// Favorites local tracker
const favorites = ref(JSON.parse(localStorage.getItem('blog_favorites') || '[]'))

// Computed Check
const isOwnProfile = computed(() => {
  return String(profile.value.id) === String(authStore.user?.id)
})

// Click away handler for dropdown
const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isProfileDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadData()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch route params change (e.g. going between user profiles)
watch(() => route.params.id, () => {
  visibleCount.value = 6
  loadData()
})

const loadData = async () => {
  if (!route.params.id) return
  
  isLoading.value = true
  errorMessage.value = ''
  blogs.value = [] // Reset blogs array for new profile view
  
  const delay = new Promise(resolve => setTimeout(resolve, 600))
  
  try {
    const [profileRes] = await Promise.all([
      getUserProfileById(route.params.id),
      delay
    ])
    
    if (profileRes.data?.success && profileRes.data.data) {
      profile.value = profileRes.data.data
      const initialBlogs = await loadBlogs()
      applyBlogs(initialBlogs)
    } else {
      errorMessage.value = 'User not found.'
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Failed to fetch user profile.'
  } finally {
    isLoading.value = false
  }
}

const loadBlogs = async () => {
  if (!profile.value.user_id) return []
  
  try {
    const res = await api.get('/get-all-blogs', {
      params: {
        userId: profile.value.user_id,
        limit: 100
      }
    })
    
    if (res.data?.success) {
      const allBlogs = res.data.data || []
      totalBlogs.value = allBlogs.length
      return allBlogs
    }
  } catch (err) {
    console.error('Failed to load user blogs:', err)
  }
  return []
}

const applyBlogs = (newBlogs) => {
  blogs.value = newBlogs
  totalViews.value = blogs.value.reduce((sum, b) => sum + (Number(b.views) || 0), 0)
}

const loadMore = () => {
  isPageLoading.value = true
  setTimeout(() => {
    visibleCount.value += 6
    isPageLoading.value = false
  }, 800)
}

// Favorites management
const isFavorite = (id) => favorites.value.includes(id)

const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((favId) => favId !== id)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem('blog_favorites', JSON.stringify(favorites.value))
}

// Logout actions
const triggerLogout = () => {
  isProfileDropdownOpen.value = false
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  logoutLoading.value = true
  try {
    await authStore.logout()
    router.push('/')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    logoutLoading.value = false
    showLogoutModal.value = false
  }
}
</script>

<style scoped>
.skeleton-shimmer {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
