<template>
  <div class="flex h-screen overflow-hidden w-full bg-[#f9f9ff] font-sans">
    <!-- Persistent Sidebar -->
    <aside :class="[
      'flex flex-col h-screen bg-white border-r border-gray-100 shadow-sm shrink-0 z-40 transition-transform duration-300 md:translate-x-0 fixed md:static left-0 top-0',
      isMobileMenuOpen ? 'translate-x-0 w-60' : '-translate-x-full md:w-60'
    ]">
      <div class="flex items-center gap-2 px-5 py-6">
        <span class="font-bold text-lg text-gray-900 tracking-tight">Blog-Platform</span>
      </div>

      <nav class="flex-1 px-3 flex flex-col gap-1">
        <router-link to="/dashboard" :class="[
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

        <router-link to="/my-posts" :class="[
          'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
          route.query.from === 'my-posts'
            ? 'bg-primary text-white font-medium shadow-sm'
            : 'text-gray-500 hover:bg-blue-50 hover:text-primary'
        ]">
          <span class="material-symbols-outlined text-[20px]">description</span>
          <span>My Blogs</span>
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
          <NotificationBell />
          <router-link to="/favorites"
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[22px]">favorite</span>
          </router-link>

          <!-- Header Logout/Login Actions -->



          <!-- Profile Dropdown -->
          <div class="relative" ref="profileDropdownRef">
            <button type="button" @click="isProfileDropdownOpen = !isProfileDropdownOpen"
              class="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity border-none bg-transparent outline-none">
              <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" alt="avatar"
                class="w-8 h-8 rounded-full object-cover border border-gray-200" />
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

              <button type="button" @click="triggerLogoutFromDropdown"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50/50 transition-colors border-none bg-transparent text-left cursor-pointer outline-none">
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
        <!-- Side-by-side grid layout -->
        <div v-else class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 animate-fade-in items-start">
          
          <!-- Left Column: Blog Post Details -->
          <div class="flex-1 w-full flex flex-col gap-6">
            <!-- Cover image -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="relative h-56 bg-gradient-to-br from-slate-50 to-blue-50">
                <img v-if="post.image" :src="resolveBlogImageUrl(post.image)" alt="Cover image"
                  class="w-full h-full object-cover" />
                <div v-else class="flex flex-col items-center justify-center h-full">
                  <span class="material-symbols-outlined text-[40px] text-blue-300 mb-2">image</span>
                  <p class="text-xs text-gray-400">No cover image uploaded</p>
                </div>
              </div>
            </div>

            <!-- Author and Stats Row -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <router-link
                :to="post.author_account_id ? '/user-profile/' + post.author_account_id : '#'"
                class="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group/author no-underline"
              >
                <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                  <img v-if="post.author_avatar" :src="resolveAvatarUrl(post.author_avatar)" class="w-full h-full object-cover" alt="author" />
                  <span v-else class="text-sm font-bold text-primary uppercase">
                    {{ post.author_name ? post.author_name[0] : 'A' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800 group-hover/author:text-primary transition-colors">
                    {{ post.author_name || 'Anonymous' }}
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">Author / Contributor</p>
                </div>
              </router-link>
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
                  <span v-for="tag in post.tags" :key="tag.id"
                    class="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    #{{ tag.name }}
                  </span>
                  <span v-if="!post.tags || !post.tags.length" class="text-xs text-gray-400">No tags.</span>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-end gap-3 pt-2 pb-8">
              <button @click="goBack"
                class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                Back
              </button>
              <router-link v-if="isOwner" :to="`/edit-post/${post.id}`"
                class="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">edit</span>
                <span>Edit Post</span>
              </router-link>
            </div>
          </div>

          <!-- Right Column: Comments Section (Fixed width on desktop) -->
          <div class="w-full lg:w-96 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 sticky top-6">
            <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">chat_bubble</span>
              <span>Comments ({{ comments.length }})</span>
            </h2>

            <!-- Add Comment Form -->
            <form @submit.prevent="submitComment" class="flex gap-3 items-start">
              <img
                :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)"
                alt="My Avatar"
                class="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
              />
              <div class="flex-1 flex flex-col gap-2">
                <textarea
                  v-model="newCommentText"
                  placeholder="Add a public comment..."
                  rows="2"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-gray-50/50"
                  required
                ></textarea>
                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="isSubmittingComment || !newCommentText.trim()"
                    class="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer border-none"
                  >
                    <span v-if="isSubmittingComment" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                    <span v-else class="material-symbols-outlined text-[15px]">send</span>
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </form>

            <!-- Comments List -->
            <div v-if="comments.length > 0" class="flex flex-col gap-4 mt-2 divide-y divide-gray-50 max-h-[400px] overflow-y-auto pr-1">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="flex gap-3 pt-4 first:pt-0 group relative items-start"
              >
                <router-link
                  :to="comment.author_account_id ? '/user-profile/' + comment.author_account_id : '#'"
                  class="shrink-0"
                >
                  <img
                    :src="resolveAvatarUrl(comment.author_avatar, comment.author_name)"
                    alt="Commenter Avatar"
                    class="w-8 h-8 rounded-full object-cover border border-gray-100"
                  />
                </router-link>
                <div class="flex-1 min-w-0 pr-8">
                  <div class="flex items-center gap-2">
                    <router-link
                      :to="comment.author_account_id ? '/user-profile/' + comment.author_account_id : '#'"
                      class="text-xs font-bold text-gray-800 hover:text-primary no-underline"
                    >
                      {{ comment.author_name || 'Anonymous' }}
                    </router-link>
                    <span class="text-[10px] text-gray-400">
                      {{ formatCommentTime(comment.created_at) }}
                    </span>
                  </div>
                  <!-- Text Content / Edit Field -->
                  <div v-if="editingCommentId === comment.id" class="mt-1 flex flex-col gap-2">
                    <textarea
                      v-model="editingCommentText"
                      rows="2"
                      class="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-gray-50/50"
                      required
                    ></textarea>
                    <div class="flex gap-2 justify-end">
                      <button
                        @click="cancelEditComment"
                        class="px-3 py-1 border border-gray-200 text-gray-500 rounded-lg text-[10px] font-semibold hover:bg-gray-50 cursor-pointer bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        @click="submitEditComment(comment.id)"
                        :disabled="isUpdatingComment || !editingCommentText.trim()"
                        class="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-semibold hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
                      >
                        <span v-if="isUpdatingComment" class="animate-spin h-2.5 w-2.5 border-2 border-white border-t-transparent rounded-full mr-1 inline-block"></span>
                        Save
                      </button>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-650 mt-1 whitespace-pre-wrap leading-relaxed">
                    {{ comment.content }}
                  </p>
                </div>

                <!-- Action buttons (visible to owner on hover) -->
                <div v-if="canDeleteComment(comment) && editingCommentId !== comment.id" class="absolute right-0 top-3.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="canEditComment(comment)"
                    @click="startEditComment(comment)"
                    class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 cursor-pointer border-none"
                    title="Edit comment"
                  >
                    <span class="material-symbols-outlined text-[15px]">edit</span>
                  </button>
                  <button
                    @click="triggerDeleteComment(comment.id)"
                    class="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer border-none"
                    title="Delete comment"
                  >
                    <span class="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-6 text-gray-400 flex flex-col items-center gap-1.5">
              <span class="material-symbols-outlined text-3xl text-gray-300">chat_bubble_outline</span>
              <p class="text-xs font-semibold">No comments yet</p>
              <p class="text-[10px] text-gray-400">Be the first to share your thoughts!</p>
            </div>
          </div>

        </div>
      </main>
      <ConfirmModal :show="showLogoutModal" :loading="logoutLoading" title="Confirm Logout"
        message="Are you sure you want to log out of your account?" confirm-text="Yes" cancel-text="No"
        @confirm="confirmLogout" @cancel="showLogoutModal = false" />
      <ConfirmModal :show="showDeleteCommentModal" :loading="deleteCommentLoading" title="Delete Comment"
        message="Are you sure you want to delete this comment?" confirm-text="Delete" cancel-text="Cancel"
        @confirm="confirmDeleteComment" @cancel="showDeleteCommentModal = false" />
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
import NotificationBell from '@/components/dashboard/NotificationBell.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showLogoutModal = ref(false)
const logoutLoading = ref(false)

const showDeleteCommentModal = ref(false)
const deleteCommentLoading = ref(false)
const commentIdToDelete = ref(null)

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

// Comments State & Logic
import { createComment, getAllComments, updateComment as apiUpdateComment, deleteComment as apiDeleteComment } from '@/api/api'
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()
const comments = ref([])
const newCommentText = ref('')
const isSubmittingComment = ref(false)

// Edit comment states
const editingCommentId = ref(null)
const editingCommentText = ref('')
const isUpdatingComment = ref(false)

const startEditComment = (comment) => {
  editingCommentId.value = comment.id
  editingCommentText.value = comment.content
}

const cancelEditComment = () => {
  editingCommentId.value = null
  editingCommentText.value = ''
}

const submitEditComment = async (commentId) => {
  if (!editingCommentText.value.trim()) return
  isUpdatingComment.value = true
  try {
    const { data } = await apiUpdateComment(commentId, {
      content: editingCommentText.value.trim()
    })
    if (data.success) {
      const commentIndex = comments.value.findIndex(c => c.id === commentId)
      if (commentIndex !== -1) {
        comments.value[commentIndex].content = data.data.content
      }
      cancelEditComment()
      toastStore.success('Comment updated successfully')
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to update comment'
    toastStore.error(msg)
  } finally {
    isUpdatingComment.value = false
  }
}


const loadComments = async () => {
  try {
    const { data } = await getAllComments(route.params.id)
    if (data.success) {
      comments.value = data.data
    }
  } catch (err) {
    console.error('Failed to load comments:', err)
  }
}

const submitComment = async () => {
  if (!newCommentText.value.trim()) return
  isSubmittingComment.value = true
  try {
    const { data } = await createComment({
      post_id: Number(route.params.id),
      content: newCommentText.value.trim()
    })
    if (data.success) {
      // Append comment locally or reload
      comments.value.push(data.data)
      newCommentText.value = ''
      toastStore.success('Comment posted successfully')
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'Failed to post comment'
    toastStore.error(msg)
  } finally {
    isSubmittingComment.value = false
  }
}

const canDeleteComment = (comment) => {
  const currentUserId = authStore.user?.user_id || authStore.user?.id
  const isPostOwner = post.value && currentUserId === post.value.user_id
  // Allowed if current user is either comment author or post owner
  return currentUserId && (comment.user_id === currentUserId || isPostOwner)
}

const canEditComment = (comment) => {
  const currentUserId = authStore.user?.user_id || authStore.user?.id
  // Only the author of the comment can edit it
  return currentUserId && comment.user_id === currentUserId
}

const triggerDeleteComment = (commentId) => {
  commentIdToDelete.value = commentId
  showDeleteCommentModal.value = true
}

const confirmDeleteComment = async () => {
  if (!commentIdToDelete.value) return
  deleteCommentLoading.value = true
  try {
    const { data } = await apiDeleteComment(commentIdToDelete.value)
    if (data.success) {
      comments.value = comments.value.filter(c => c.id !== commentIdToDelete.value)
      toastStore.success('Comment deleted')
      showDeleteCommentModal.value = false
    }
  } catch (err) {
    toastStore.error('Failed to delete comment')
  } finally {
    deleteCommentLoading.value = false
    commentIdToDelete.value = null
  }
}

const formatCommentTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date

  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

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
      // Load comments for this post
      await loadComments()
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
