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
        <router-link to="/dashboard"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
            route.query.from === 'dashboard'
              ? 'bg-primary text-white font-medium shadow-sm'
              : 'text-gray-500 hover:bg-blue-50 hover:text-primary'
          ]">
          <span class="material-symbols-outlined text-[20px]">grid_view</span>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/new-post"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Post</span>
        </router-link>

        <router-link to="/my-posts"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
            route.query.from === 'my-posts'
              ? 'bg-primary text-white font-medium shadow-sm'
              : 'text-gray-500 hover:bg-blue-50 hover:text-primary'
          ]">
          <span class="material-symbols-outlined text-[20px]">description</span>
          <span>My Blogs</span>
        </router-link>

        <router-link to="/favorites"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
            route.query.from === 'favorites'
              ? 'bg-primary text-white font-medium shadow-sm'
              : 'text-gray-500 hover:bg-blue-50 hover:text-primary'
          ]">
          <span class="material-symbols-outlined text-[20px]">favorite</span>
          <span>Favorites</span>
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

    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden">
    </div>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <div class="flex items-center gap-3">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer border-none bg-transparent">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div>
            <h1 class="text-base font-semibold text-gray-900 leading-tight">Post Details</h1>
            <p class="text-xs text-gray-400">View and read the published blog post</p>
          </div>
        </div>

        <div class="flex-1"></div>

        <div class="flex items-center gap-1">
          <button
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative border-none bg-transparent">
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <router-link
            to="/favorites"
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[22px]">favorite</span>
          </router-link>

          <!-- Header Logout/Login Actions -->



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
              <div class="px-4 py-2 border-b border-gray-50">
                <p class="text-xs text-gray-400">Signed in as</p>
                <p class="text-sm font-bold text-gray-800 truncate">{{ authStore.user?.name || 'User' }}</p>
              </div>

              <router-link
                to="/profile"
                @click="isProfileDropdownOpen = false"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50/50 hover:text-primary transition-colors"
              >
                <span class="material-symbols-outlined text-[18px]">account_circle</span>
                <span>My Profile</span>
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

        <!-- Details Card matching EditPost visual structure -->
        <div v-else class="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in">
          <!-- Cover image -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="relative h-56 bg-gradient-to-br from-slate-50 to-blue-50">
              <img
                v-if="post.image"
                :src="resolveBlogImageUrl(post.image)"
                alt="Cover image"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center justify-center h-full">
                <span class="material-symbols-outlined text-[40px] text-blue-300 mb-2">image</span>
                <p class="text-xs text-gray-400">No cover image uploaded</p>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-sm font-semibold text-gray-700 mb-2">Post Title</h2>
            <div class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-base font-semibold">
              {{ post.title }}
            </div>
          </div>

          <!-- Content -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="text-sm font-semibold text-gray-700 mb-2">Content</h2>
            <div class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm whitespace-pre-wrap leading-relaxed min-h-[200px]">
              {{ post.content }}
            </div>
          </div>

          <!-- Category & Tags row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Category -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 class="text-sm font-semibold text-gray-700 mb-2">Category</h2>
              <div class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm font-medium">
                {{ post.category_name || 'Uncategorized' }}
              </div>
            </div>

            <!-- Tags -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 class="text-sm font-semibold text-gray-700 mb-2">Tags</h2>
              <div class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-wrap gap-2 min-h-[46px] items-center">
                <span
                  v-for="tag in post.tags"
                  :key="tag.id"
                  class="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20"
                >
                  #{{ tag.name }}
                </span>
                <span v-if="!post.tags || !post.tags.length" class="text-xs text-gray-400">No tags.</span>
              </div>
            </div>
          </div>

          <!-- Author and Stats Row -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                <img v-if="post.author_avatar" :src="resolveAvatarUrl(post.author_avatar)" class="w-full h-full object-cover" alt="author" />
                <span v-else class="text-sm font-bold text-primary uppercase">
                  {{ post.author_name ? post.author_name[0] : 'A' }}
                </span>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-800">{{ post.author_name || 'Anonymous' }}</p>
                <p class="text-xs text-gray-400 mt-0.5">Author / Contributor</p>
              </div>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-400 font-medium">
              <div class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <span class="material-symbols-outlined text-[15px]">calendar_today</span>
                <span>{{ formatDate(post.created_at) }}</span>
              </div>
              <div class="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <span class="material-symbols-outlined text-[15px]">visibility</span>
                <span>{{ post.views ?? 0 }} views</span>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center justify-end gap-3 pb-8">
            <button
              @click="goBack"
              class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
            >
              Back
            </button>
            <router-link
              v-if="isOwner"
              :to="`/edit-post/${post.id}`"
              class="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[18px]">edit</span>
              <span>Edit Post</span>
            </router-link>
          </div>
        </div>
      </main>
      <ConfirmModal :show="showLogoutModal" :loading="logoutLoading" title="Confirm Logout"
        message="Are you sure you want to log out of your account?" confirm-text="Yes" cancel-text="No"
        @confirm="confirmLogout" @cancel="showLogoutModal = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/api'
import { useAuthStore } from '@/stores/authStore'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { resolveAvatarUrl } from '@/utils/avatar'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showLogoutModal = ref(false)
const logoutLoading = ref(false)

const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref(null)

const triggerLogoutFromDropdown = () => {
  isProfileDropdownOpen.value = false
  handleLogout()
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

// fallbackAvatar is now handled inside resolveAvatarUrl (src/utils/avatar.js)

const isMobileMenuOpen = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const post = ref(null)

const mockBlogs = [

]

const goBack = () => {
  if (route.query.from === 'dashboard') {
    router.push('/dashboard')
  } else if (route.query.from === 'favorites') {
    router.push('/favorites')
  } else {
    router.push('/my-posts')
  }
}

const resolveBlogImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
  return `${base}${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const isOwner = computed(() => {
  const currentUserId = authStore.user?.user_id || authStore.user?.id
  return currentUserId && post.value && currentUserId === post.value.user_id
})



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
