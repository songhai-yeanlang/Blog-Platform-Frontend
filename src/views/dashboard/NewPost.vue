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

        <div class="flex items-center gap-1">
          <button
            type="button"
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative border-none bg-transparent"
          >
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <router-link
            to="/favorites"
            class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
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
                <div v-else class="relative" ref="categoryDropdownRef">
                  <!-- Dropdown Trigger -->
                  <button
                    type="button"
                    @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer text-left"
                  >
                    <span :class="selectedCategoryName ? 'text-gray-900 font-medium' : 'text-gray-500'">
                      {{ selectedCategoryName || 'Select a category...' }}
                    </span>
                    <span class="material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isCategoryDropdownOpen }">
                      keyboard_arrow_down
                    </span>
                  </button>

                  <!-- Dropdown Content -->
                  <div
                    v-if="isCategoryDropdownOpen"
                    class="absolute left-0 right-0 mt-2 z-50 bg-white border border-gray-100 rounded-xl shadow-lg p-2 flex flex-col gap-1.5"
                  >
                    <!-- Search Input -->
                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50">
                      <span class="material-symbols-outlined text-gray-400 text-[18px]">search</span>
                      <input
                        type="text"
                        v-model="categorySearchQuery"
                        placeholder="Search category..."
                        class="flex-1 bg-transparent border-none text-xs text-gray-800 outline-none p-0 focus:ring-0 focus:outline-none"
                      />
                      <button
                        v-if="categorySearchQuery"
                        type="button"
                        @click="categorySearchQuery = ''"
                        class="text-gray-400 hover:text-gray-600 text-xs border-none bg-transparent cursor-pointer"
                      >
                        ×
                      </button>
                    </div>

                    <!-- Options List -->
                    <div class="max-h-40 overflow-y-auto flex flex-col gap-1">
                      <div
                        v-for="cat in filteredCategories"
                        :key="cat.id"
                        @click="selectCategory(cat.id)"
                        :class="[
                          'px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-between',
                          String(form.category_id) === String(cat.id)
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-gray-700 hover:bg-blue-50/50 hover:text-primary'
                        ]"
                      >
                        <span>{{ cat.name }}</span>
                        <span
                          v-if="String(form.category_id) === String(cat.id)"
                          class="material-symbols-outlined text-[16px] text-primary"
                        >
                          check
                        </span>
                      </div>
                      <p v-if="filteredCategories.length === 0" class="text-xs text-gray-400 py-3 text-center">No categories found.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                <div v-if="tagsLoading" class="h-11 bg-gray-100 rounded-xl animate-pulse"></div>
                <div v-else class="relative" ref="tagsDropdownRef">
                  <!-- Dropdown Trigger -->
                  <button
                    type="button"
                    @click="isTagsDropdownOpen = !isTagsDropdownOpen"
                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer text-left"
                  >
                    <span class="text-gray-500">
                      {{ selectedTags.length ? `${selectedTags.length} tag(s) selected` : 'Select tags...' }}
                    </span>
                    <span class="material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isTagsDropdownOpen }">
                      keyboard_arrow_down
                    </span>
                  </button>

                  <!-- Dropdown Content -->
                  <!-- Dropdown Content -->
                  <div
                    v-if="isTagsDropdownOpen"
                    class="absolute left-0 right-0 mt-2 z-50 bg-white border border-gray-100 rounded-xl shadow-lg p-2 flex flex-col gap-1.5"
                  >
                    <!-- Search Input -->
                    <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50">
                      <span class="material-symbols-outlined text-gray-400 text-[18px]">search</span>
                      <input
                        type="text"
                        v-model="tagSearchQuery"
                        placeholder="Search tag..."
                        class="flex-1 bg-transparent border-none text-xs text-gray-800 outline-none p-0 focus:ring-0 focus:outline-none"
                      />
                      <button
                        v-if="tagSearchQuery"
                        type="button"
                        @click="tagSearchQuery = ''"
                        class="text-gray-400 hover:text-gray-600 text-xs border-none bg-transparent cursor-pointer"
                      >
                        ×
                      </button>
                    </div>

                    <!-- Options List -->
                    <div class="max-h-40 overflow-y-auto flex flex-col gap-1">
                      <div
                        v-for="tag in filteredTags"
                        :key="tag.id"
                        @click="toggleTag(tag.id)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50/50 hover:text-primary cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          :checked="selectedTags.includes(tag.id)"
                          @click.stop="toggleTag(tag.id)"
                          class="rounded text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        />
                        <span class="font-medium">{{ tag.name }}</span>
                      </div>
                      <p v-if="filteredTags.length === 0" class="text-xs text-gray-400 py-3 text-center">No tags found.</p>
                    </div>
                  </div>

                  <!-- Selected Tags Pills -->
                  <div v-if="selectedTags.length" class="flex flex-wrap gap-1.5 mt-3">
                    <div
                      v-for="tagId in selectedTags"
                      :key="tagId"
                      class="flex items-center gap-1.5 pl-3 pr-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20"
                    >
                      <span>#{{ tags.find(t => t.id === tagId)?.name || 'Tag' }}</span>
                      <button
                        type="button"
                        @click="toggleTag(tagId)"
                        class="hover:bg-primary/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors text-[10px] cursor-pointer border-none bg-transparent"
                      >
                        ×
                      </button>
                    </div>
                  </div>
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
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { getAllCategories, getAllTags, createBlog } from '@/api/api'
import api from '@/api/api'
import { resolveAvatarUrl } from '@/utils/avatar'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isMobileMenuOpen = ref(false)
const showLogoutModal = ref(false)
const logoutLoading = ref(false)

const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref(null)

const triggerLogoutFromDropdown = () => {
  isProfileDropdownOpen.value = false
  handleLogout()
}

const handleClickOutside = (e) => {
  if (tagsDropdownRef.value && !tagsDropdownRef.value.contains(e.target)) {
    isTagsDropdownOpen.value = false
  }
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    isCategoryDropdownOpen.value = false
  }
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

const tagsDropdownRef = ref(null)
const isTagsDropdownOpen = ref(false)
const tagSearchQuery = ref('')

const filteredTags = computed(() => {
  if (!tagSearchQuery.value.trim()) return tags.value
  const query = tagSearchQuery.value.toLowerCase().trim()
  return tags.value.filter(t => t.name?.toLowerCase().includes(query))
})

const categoryDropdownRef = ref(null)
const isCategoryDropdownOpen = ref(false)
const categorySearchQuery = ref('')

const selectCategory = (id) => {
  form.category_id = id
  isCategoryDropdownOpen.value = false
  categorySearchQuery.value = ''
}

const filteredCategories = computed(() => {
  if (!categorySearchQuery.value.trim()) return categories.value
  const query = categorySearchQuery.value.toLowerCase().trim()
  return categories.value.filter(c => c.name?.toLowerCase().includes(query))
})

const selectedCategoryName = computed(() => {
  const found = categories.value.find(c => String(c.id) === String(form.category_id))
  return found ? found.name : ''
})



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
