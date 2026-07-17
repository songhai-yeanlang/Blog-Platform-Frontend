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
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm">
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

          <router-link to="/profile"
            class="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
            <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" alt="avatar"
              class="w-8 h-8 rounded-full object-cover border border-gray-200" />
            <span class="hidden md:inline text-sm font-medium text-gray-800">
              {{ authStore.user?.name || 'User' }}
            </span>
            <span class="material-symbols-outlined text-[18px] text-gray-400">arrow_drop_down</span>
          </router-link>
        </div>
      </header>

      <!-- Body -->
      <main class="flex-1 overflow-y-auto px-6 py-6">

        <!-- Page Header inside main container -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-xl font-bold text-gray-900 leading-tight animate-fade-in">My Posts</h1>
            <p class="text-xs text-gray-400 mt-1">Manage and edit your published posts</p>
          </div>
          <router-link to="/new-post"
            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors w-fit">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>New Post</span>
          </router-link>
        </div>

        <!-- Stats strip -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <p class="text-xs text-gray-400 mb-1">Total Posts</p>
            <p class="text-2xl font-bold text-gray-900">{{ blogs.length }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <p class="text-xs text-gray-400 mb-1">Total Views</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalViews }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <p class="text-xs text-gray-400 mb-1">Categories</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueCategories }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <p class="text-xs text-gray-400 mb-1">Tags Used</p>
            <p class="text-2xl font-bold text-gray-900">{{ uniqueTags }}</p>
          </div>
        </div>

        <!-- Skeleton shimmer -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <div class="skeleton-shimmer h-48 w-full"></div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="skeleton-shimmer h-3 rounded-sm w-14"></div>
                <div class="skeleton-shimmer h-2.5 rounded-full w-1.5"></div>
                <div class="skeleton-shimmer h-3 rounded w-20"></div>
              </div>
              <div class="skeleton-shimmer h-4 rounded w-full mb-1.5"></div>
              <div class="skeleton-shimmer h-4 rounded w-3/4 mb-3"></div>
              <div class="skeleton-shimmer h-3 rounded w-full mb-1.5"></div>
              <div class="skeleton-shimmer h-3 rounded w-5/6 mb-4"></div>
              <div class="flex gap-1.5">
                <div class="skeleton-shimmer h-4 rounded-full w-10"></div>
                <div class="skeleton-shimmer h-4 rounded-full w-14"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredPosts.length === 0 && !searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div class="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <span class="material-symbols-outlined text-5xl text-primary/40">edit_note</span>
          </div>
          <h2 class="text-xl font-semibold text-gray-700">No posts yet</h2>
          <p class="text-gray-400 text-sm max-w-xs">You haven't published any posts. Start writing your first one!</p>
          <router-link to="/new-post"
            class="mt-2 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            Write Your First Post
          </router-link>
        </div>

        <!-- No search results -->
        <div v-else-if="filteredPosts.length === 0 && searchQuery"
          class="flex flex-col items-center justify-center py-24 text-center gap-4">
          <span class="material-symbols-outlined text-6xl text-gray-300">find_in_page</span>
          <h2 class="text-xl font-semibold text-gray-700">No Results Found</h2>
          <p class="text-gray-400 text-sm max-w-xs">No posts match "{{ searchQuery }}"</p>
          <button @click="searchQuery = ''"
            class="mt-2 bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
            Clear Search
          </button>
        </div>

        <!-- Posts grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="post in paginatedPosts"
            :key="post.id"
            class="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group flex flex-col"
          >
            <!-- Cover image -->
            <div class="relative h-48 overflow-hidden cursor-pointer" @click="goToDetail(post.id)">
              <div
                v-if="navigatingToId === post.id"
                class="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex items-center justify-center"
              >
                <svg class="animate-spin h-7 w-7 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <img
                :src="resolveBlogImageUrl(post.image)"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <!-- Category badge -->
              <span v-if="post.category_name"
                class="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm tracking-widest uppercase">
                {{ post.category_name }}
              </span>
            </div>

            <!-- Card body -->
            <div class="p-4 flex flex-col flex-1">
              <div class="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400 mb-1.5">
                <span>{{ formatDate(post.created_at) }}</span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <div class="flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[11px] leading-none">visibility</span>
                  <span>{{ post.views ?? 0 }} views</span>
                </div>
              </div>

              <h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                @click="goToDetail(post.id)">
                {{ post.title }}
              </h3>
              <p class="text-gray-400 text-[12px] line-clamp-2 mb-3 leading-normal flex-1">
                {{ stripHtmlTags(post.content) }}
              </p>

              <!-- Tags -->
              <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1 mb-3">
                <span v-for="tag in post.tags" :key="tag.id"
                  class="text-[10px] bg-blue-50 text-primary px-2 py-0.5 rounded-full">
                  #{{ tag.name }}
                </span>
              </div>

              <!-- Actions row -->
              <div class="flex justify-end pt-3 border-t border-gray-100 mt-auto">
            
                <div class="flex items-center gap-2">
                  <router-link :to="`/edit-post/${post.id}`"
                    class="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                    <span class="material-symbols-outlined text-[15px]">edit</span>
                    Edit
                  </router-link>
                  <button @click="confirmDelete(post)"
                    class="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0">
                    <span class="material-symbols-outlined text-[15px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="flex items-center justify-center mt-8">
          <button @click="loadMore" :disabled="isPageLoading"
            class="flex items-center justify-center gap-2 px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 transition-all font-medium text-xs cursor-pointer shadow-sm">
            <template v-if="isPageLoading">
              <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </template>
            <template v-else>
              <span>Load More</span>
            </template>
          </button>
        </div>

      </main>
    </div>

    <!-- Logout confirm modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm mx-4 flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <span class="material-symbols-outlined text-red-500 text-[32px]">logout</span>
        </div>
        <div class="text-center">
          <h3 class="text-base font-semibold text-gray-900 mb-1">Log out?</h3>
          <p class="text-sm text-gray-500">Are you sure you want to log out of your account?</p>
        </div>
        <div class="flex w-full gap-3">
          <button @click="showLogoutModal = false"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button @click="confirmLogout" :disabled="logoutLoading"
            class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
            <span v-if="logoutLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Log out
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm mx-4 flex flex-col items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <span class="material-symbols-outlined text-red-500 text-[32px]">delete_forever</span>
        </div>
        <div class="text-center">
          <h3 class="text-base font-semibold text-gray-900 mb-1">Delete Post?</h3>
          <p class="text-sm text-gray-500">
            Are you sure you want to delete
            <span class="font-semibold text-gray-700">"{{ postToDelete?.title }}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div class="flex w-full gap-3">
          <button @click="showDeleteModal = false"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button @click="deletePost" :disabled="deleteLoading"
            class="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
            <span v-if="deleteLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { resolveAvatarUrl } from '@/utils/avatar'
import api from '@/api/api'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Sidebar / logout
const isMobileMenuOpen = ref(false)
const showLogoutModal = ref(false)
const logoutLoading = ref(false)

const handleLogout = () => { showLogoutModal.value = true }
const confirmLogout = async () => {
  logoutLoading.value = true
  try { await api.post('/auth/logout') } catch { /* ignore */ } finally {
    logoutLoading.value = false
    showLogoutModal.value = false
  }
  authStore.logout()
  router.push('/')
}

// Posts state
const blogs = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const visibleCount = ref(6)
const isPageLoading = ref(false)
const navigatingToId = ref(null)

// Delete modal
const showDeleteModal = ref(false)
const postToDelete = ref(null)
const deleteLoading = ref(false)

// Stats
const totalViews = computed(() => blogs.value.reduce((sum, b) => sum + (b.views ?? 0), 0))
const uniqueCategories = computed(() => new Set(blogs.value.map(b => b.category_name).filter(Boolean)).size)
const uniqueTags = computed(() => new Set(blogs.value.flatMap(b => (b.tags || []).map(t => t.id))).size)

// Pagination
const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) return blogs.value
  const q = searchQuery.value.toLowerCase().trim()
  return blogs.value.filter(p =>
    p.title?.toLowerCase().includes(q) ||
    p.content?.toLowerCase().includes(q) ||
    p.category_name?.toLowerCase().includes(q) ||
    p.tags?.some(t => t.name?.toLowerCase().includes(q))
  )
})

const paginatedPosts = computed(() => filteredPosts.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredPosts.value.length)

watch(searchQuery, () => { visibleCount.value = 6 })

const loadMore = () => {
  isPageLoading.value = true
  setTimeout(() => {
    visibleCount.value += 6
    isPageLoading.value = false
  }, 600)
}

const goToDetail = (id) => {
  navigatingToId.value = id
  router.push(`/post/${id}`)
}

// Delete
const confirmDelete = (post) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const deletePost = async () => {
  if (!postToDelete.value) return
  deleteLoading.value = true
  try {
    await api.delete(`/delete-blog/${postToDelete.value.id}`)
    blogs.value = blogs.value.filter(b => b.id !== postToDelete.value.id)
    toastStore.success('Post deleted successfully!')
    showDeleteModal.value = false
    postToDelete.value = null
  } catch (error) {
    toastStore.success('') // clear
    const msg = error.response?.data?.message || 'Failed to delete post.'
    toastStore.error(msg)
  } finally {
    deleteLoading.value = false
  }
}

// Fetch owner blogs
const fetchData = async () => {
  isLoading.value = true
  const delay = new Promise(resolve => setTimeout(resolve, 800))
  try {
    const [res] = await Promise.all([
      api.get('/get-owner-blogs').catch(() => null),
      delay,
    ])
    blogs.value = res?.data?.data || res?.data || []
  } catch {
    blogs.value = []
  } finally {
    isLoading.value = false
  }
}

// Helpers
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
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

onMounted(fetchData)
</script>
