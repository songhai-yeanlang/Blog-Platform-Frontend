<template>
  <div class="flex h-screen overflow-hidden w-full bg-[#f9f9ff] font-sans">
    <aside :class="[
      'flex flex-col h-screen bg-white border-r border-gray-100 shadow-sm shrink-0 z-40 transition-transform duration-300 md:translate-x-0 fixed md:static left-0 top-0',
      isMobileMenuOpen ? 'translate-x-0 w-60' : '-translate-x-full md:w-60'
    ]">
      <div class="flex items-center gap-2 px-5 py-6">
        <span class="font-bold text-lg text-gray-900 tracking-tight">Blog-Platform</span>
      </div>

      <nav class="flex-1 px-3 flex flex-col gap-1">
        <router-link to="/"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm">
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
          <span>My Post</span>
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
      <header
        class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="flex-1 max-w-md">
          <div
            class="flex items-center h-9 rounded-full border border-gray-200 bg-gray-50 px-3 gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <span class="material-symbols-outlined text-gray-400 text-[18px]">search</span>
            <input type="text" v-model="searchQuery" placeholder="React, PHP, JS"
              class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 h-full p-0 outline-none" />
            <div
              class="flex items-center gap-0.5 border-l border-gray-200 pl-2 ml-1 cursor-pointer text-gray-500 hover:text-gray-700">
              <span class="text-xs font-medium">Best</span>
              <span class="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative">
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">
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

      <main class="flex-1 overflow-y-auto px-6 py-6">
        <!-- Skeleton shimmer: 6 cards matching real layout -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
          >
            <!-- Image placeholder -->
            <div class="skeleton-shimmer h-36 w-full"></div>

            <div class="p-4">
              <!-- Category badge + date + views row -->
              <div class="flex items-center gap-2 mb-2">
                <div class="skeleton-shimmer h-3 rounded-sm w-14"></div>
                <div class="skeleton-shimmer h-2.5 rounded-full w-1.5"></div>
                <div class="skeleton-shimmer h-3 rounded w-16"></div>
                <div class="skeleton-shimmer h-2.5 rounded-full w-1.5"></div>
                <div class="skeleton-shimmer h-3 rounded w-14"></div>
              </div>

              <!-- Title lines -->
              <div class="skeleton-shimmer h-4 rounded w-full mb-1.5"></div>
              <div class="skeleton-shimmer h-4 rounded w-4/5 mb-3"></div>

              <!-- Body text lines -->
              <div class="skeleton-shimmer h-3 rounded w-full mb-1.5"></div>
              <div class="skeleton-shimmer h-3 rounded w-11/12 mb-3"></div>

              <!-- Tag pills -->
              <div class="flex gap-1.5 mb-3">
                <div class="skeleton-shimmer h-4 rounded-full w-10"></div>
                <div class="skeleton-shimmer h-4 rounded-full w-14"></div>
              </div>

              <!-- Author row -->
              <div class="flex items-center gap-2 pt-2.5 border-t border-gray-100">
                <div class="skeleton-shimmer w-7 h-7 rounded-full shrink-0"></div>
                <div class="skeleton-shimmer h-3 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

     
        <div v-else-if="filteredPosts.length === 0"
          class="flex flex-col items-center justify-center py-24 text-center gap-4">
          <span class="material-symbols-outlined text-6xl text-gray-300">find_in_page</span>
          <h2 class="text-xl font-semibold text-gray-700">No Posts Found</h2>
          <p class="text-gray-400 text-sm max-w-xs">We couldn't find any posts matching your search.</p>
          <button @click="searchQuery = ''"
            class="mt-2 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
            Clear Search
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article v-for="post in paginatedPosts" :key="post.id" @click="goToDetail(post.id)"
            class="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group border border-gray-100">
            <!-- Card-click loading overlay -->
            <div
              v-if="navigatingToId === post.id"
              class="absolute inset-0 z-20 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-xl"
            >
              <svg class="animate-spin h-7 w-7 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div class="relative h-36 overflow-hidden">
              <span
                class="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm tracking-widest uppercase">
                Popular
              </span>
              <button @click.stop="toggleFavorite(post.id)"
                class="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white shadow-sm transition-all border-none outline-none cursor-pointer">
                <span class="material-symbols-outlined text-[14px]"
                  :class="{ 'fill-icon text-red-500': isFavorite(post.id) }">
                  favorite
                </span>
              </button>
              <img :src="resolveBlogImageUrl(post.image)" :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            <div class="p-4">
              <div class="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400 mb-1.5">
                <span v-if="post.category_name"
                  class="bg-blue-50/80 text-primary text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase shrink-0">
                  {{ post.category_name }}
                </span>
                <span v-if="post.category_name" class="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
                <span>{{ formatDate(post.created_at) }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <div class="flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[11px] leading-none select-none">visibility</span>
                  <span class="leading-none">{{ post.views ?? 0 }} views</span>
                </div>
              </div>
              <h3 class="font-semibold text-primary text-sm leading-snug mb-1.5 line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="text-gray-400 text-[12px] line-clamp-2 mb-3 leading-normal">
                {{ stripHtmlTags(post.content) }}
              </p>

              <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1 mb-3">
                <span v-for="tag in post.tags" :key="tag.id"
                  class="text-[10px] bg-blue-50 text-primary px-2 py-0.5 rounded-full">
                  #{{ tag.name }}
                </span>
              </div>

              <div class="flex items-center gap-2 pt-2.5 border-t border-gray-100">
                <div
                  class="w-7 h-7 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                  <img v-if="post.author_avatar" :src="resolveAvatarUrl(post.author_avatar)"
                    class="w-full h-full object-cover" alt="author" />
                  <span v-else class="text-xs font-bold text-primary uppercase">
                    {{ post.author_name ? post.author_name[0] : 'A' }}
                  </span>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-800 leading-none">{{ post.author_name || 'Anonymous' }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore" class="flex items-center justify-center mt-8">
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
      </main>
      <ConfirmModal
        :show="showLogoutModal"
        :loading="logoutLoading"
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirm-text="Yes"
        cancel-text="No"
        @confirm="confirmLogout"
        @cancel="showLogoutModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { resolveAvatarUrl } from '@/utils/avatar'

const router = useRouter()
const authStore = useAuthStore()

const showLogoutModal = ref(false)
const logoutLoading = ref(false)
const navigatingToId = ref(null)

// fallbackAvatar is now handled inside resolveAvatarUrl (src/utils/avatar.js)

const isMobileMenuOpen = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const blogs = ref([])

const mockBlogs = [

]

const favorites = ref(JSON.parse(localStorage.getItem('blog_favorites') || '[]'))

const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((favId) => favId !== id)
  } else {
    favorites.value.push(id)
  }
  localStorage.setItem('blog_favorites', JSON.stringify(favorites.value))
}

const isFavorite = (id) => {
  return favorites.value.includes(id)
}

const visibleCount = ref(6)
const isPageLoading = ref(false)

const loadMore = () => {
  isPageLoading.value = true
  setTimeout(() => {
    visibleCount.value += 6
    isPageLoading.value = false
  }, 800)
}

const goToDetail = (id) => {
  navigatingToId.value = id
  router.push(`/post/${id}`)
}

const hasMore = computed(() => {
  return visibleCount.value < filteredPosts.value.length
})

watch(searchQuery, () => {
  visibleCount.value = 6
})

const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return blogs.value

  const query = searchQuery.value.toLowerCase().trim()
  return blogs.value.filter((post) => (
    post.title?.toLowerCase().includes(query) ||
    post.content?.toLowerCase().includes(query) ||
    post.category_name?.toLowerCase().includes(query) ||
    post.tags?.some((tag) => tag.name?.toLowerCase().includes(query))
  ))
})

const paginatedPosts = computed(() => {
  return filteredPosts.value.slice(0, visibleCount.value)
})



const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  // Minimum 800ms skeleton display so shimmer is always visible
  const delay = new Promise(resolve => setTimeout(resolve, 800))

  try {
    const [res] = await Promise.all([
      api.get('/get-all-blogs').catch(() => null),
      delay
    ])
    if (res?.data?.success && res.data.data?.length) {
      blogs.value = res.data.data
    } else {
      blogs.value = mockBlogs
    }
  } catch {
    blogs.value = mockBlogs
  } finally {
    isLoading.value = false
  }
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
