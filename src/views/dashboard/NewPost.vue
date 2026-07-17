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
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm">
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

    <!-- Mobile overlay -->
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden"></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <div class="flex items-center gap-3">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <div>
            <h1 class="text-base font-semibold text-gray-900 leading-tight">New a Post</h1>
            <p class="text-xs text-gray-400">Create and publish a new blog post</p>
          </div>
        </div>

        <router-link to="/profile"
          class="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
          <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" alt="avatar"
            class="w-8 h-8 rounded-full object-cover border border-gray-200" />
          <span class="hidden md:inline text-sm font-medium text-gray-800">
            {{ authStore.user?.name || 'User' }}
          </span>
          <span class="material-symbols-outlined text-[18px] text-gray-400">arrow_drop_down</span>
        </router-link>
      </header>

      <!-- Form body -->
      <main class="flex-1 overflow-y-auto px-6 py-6">
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
          <div class="max-w-3xl mx-auto flex flex-col gap-6">

            <!-- Cover image upload -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <label class="block cursor-pointer group" for="post-image">
                <div
                  v-if="!imagePreview"
                  class="flex flex-col items-center justify-center h-56 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-2xl m-0 transition-all group-hover:border-primary group-hover:bg-blue-50"
                >
                  <span class="material-symbols-outlined text-[40px] text-blue-300 mb-2 group-hover:text-primary transition-colors">add_photo_alternate</span>
                  <p class="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">Click to upload a cover image</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <div v-else class="relative h-56 group">
                  <img :src="imagePreview" alt="Cover preview" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                    <span class="material-symbols-outlined text-white text-[36px]">edit</span>
                    <span class="text-white text-sm font-medium ml-2">Change Image</span>
                  </div>
                </div>
              </label>
              <input
                id="post-image"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onImageChange"
              />
            </div>

            <!-- Title -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Post Title <span class="text-red-400">*</span></label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Enter an engaging title..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                required
              />
            </div>

            <!-- Content -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Content <span class="text-red-400">*</span></label>
              <textarea
                v-model="form.content"
                placeholder="Write your blog post content here..."
                rows="14"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-y leading-relaxed"
                required
              ></textarea>
              <p class="text-xs text-gray-400 mt-2 text-right">{{ form.content.length }} characters</p>
            </div>

            <!-- Category & Tags row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Category -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Category <span class="text-red-400">*</span></label>
                <div v-if="categoriesLoading" class="h-11 bg-gray-100 rounded-xl animate-pulse"></div>
                <select
                  v-else
                  v-model="form.category_id"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <!-- Tags -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <div v-if="tagsLoading" class="h-11 bg-gray-100 rounded-xl animate-pulse"></div>
                <div v-else>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tag in tags"
                      :key="tag.id"
                      type="button"
                      @click="toggleTag(tag.id)"
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                      ]"
                    >
                      {{ tag.name }}
                    </button>
                  </div>
                  <p v-if="tags.length === 0" class="text-xs text-gray-400 mt-2">No tags available.</p>
                </div>
              </div>
            </div>

            <!-- Error message -->
            <div v-if="errorMsg" class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              <span class="material-symbols-outlined text-[20px]">error</span>
              <span>{{ errorMsg }}</span>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center justify-end gap-3 pb-8">
              <router-link to="/dashboard"
                class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </router-link>
              <button
                type="submit"
                :disabled="submitting"
                class="px-8 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span class="material-symbols-outlined text-[18px]" v-else>publish</span>
                {{ submitting ? 'Publishing...' : 'Publish Post' }}
              </button>
            </div>

          </div>
        </form>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { getAllCategories, getAllTags, createBlog } from '@/api/api'
import api from '@/api/api'
import { resolveAvatarUrl } from '@/utils/avatar'

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

// Form state
const form = reactive({
  title: '',
  content: '',
  category_id: '',
})
const selectedTags = ref([])
const imageFile = ref(null)
const imagePreview = ref('')
const submitting = ref(false)
const errorMsg = ref('')

// Categories & Tags
const categories = ref([])
const tags = ref([])
const categoriesLoading = ref(true)
const tagsLoading = ref(true)

const fetchMeta = async () => {
  try {
    const [catRes, tagRes] = await Promise.all([getAllCategories(), getAllTags()])
    categories.value = catRes.data?.data || catRes.data || []
    tags.value = tagRes.data?.data || tagRes.data || []
  } catch {
    // silently handle — categories/tags may just be empty
  } finally {
    categoriesLoading.value = false
    tagsLoading.value = false
  }
}

const toggleTag = (id) => {
  const idx = selectedTags.value.indexOf(id)
  if (idx === -1) selectedTags.value.push(id)
  else selectedTags.value.splice(idx, 1)
}

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const handleSubmit = async () => {
  errorMsg.value = ''
  submitting.value = true

  try {
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('content', form.content)
    fd.append('category_id', form.category_id)
    fd.append('tags', JSON.stringify(selectedTags.value))
    if (imageFile.value) fd.append('image', imageFile.value)

    await createBlog(fd)
    toastStore.success('Post published successfully!')
    router.push('/dashboard')
  } catch (error) {
    errorMsg.value =
      error.response?.data?.message ||
      Object.values(error.response?.data?.errors || {}).flat()[0] ||
      'Failed to publish post. Please try again.'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchMeta)
</script>
