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
            <span class="text-gray-700 font-medium">About Us</span>
          </nav>
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

      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 px-6 py-8">
        <div class="max-w-4xl mx-auto space-y-8">
          <!-- Hero Section -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8 md:p-12 text-center flex flex-col items-center gap-4 relative">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-2">
              B
            </div>
            <h2 class="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight">Welcome to Blog-Platform</h2>
            <p class="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed">
              We design and build a premium digital space where writers can seamlessly manifest their thoughts, share stories, and reach audiences globally.
            </p>
          </div>

          <!-- Features/Values Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
              <span class="material-symbols-outlined text-[32px] text-primary">edit_note</span>
              <h3 class="font-bold text-gray-900 text-base">Intuitive Writing</h3>
              <p class="text-gray-500 text-xs leading-relaxed">
                Enjoy a clean editor that lets you focus entirely on your content and structure without distractions.
              </p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
              <span class="material-symbols-outlined text-[32px] text-primary">category</span>
              <h3 class="font-bold text-gray-900 text-base">Organized Content</h3>
              <p class="text-gray-500 text-xs leading-relaxed">
                Group posts by dynamic searchable categories and checkable tags to keep everything easily accessible.
              </p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
              <span class="material-symbols-outlined text-[32px] text-primary">analytics</span>
              <h3 class="font-bold text-gray-900 text-base">Simple Analytics</h3>
              <p class="text-gray-500 text-xs leading-relaxed">
                Track view counts, check overall statistics, and watch your readers grow day-by-day.
              </p>
            </div>
          </div>

          <!-- Team section -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div class="text-center md:text-left space-y-1">
              <h3 class="text-lg font-bold text-gray-900">Developer Profile</h3>
              <p class="text-gray-400 text-xs">The creator behind the Blog-Platform</p>
            </div>
            
            <div class="flex flex-col md:flex-row items-center gap-6 pt-2">
              <div class="w-24 h-24 rounded-full border border-gray-150 overflow-hidden shrink-0 flex items-center justify-center bg-primary/10">
                <img :src="resolveAvatarUrl(authStore.user?.avatar, authStore.user?.name)" class="w-full h-full object-cover" alt="Developer profile" />
              </div>
              <div class="space-y-2 text-center md:text-left">
                <h4 class="font-bold text-gray-800 text-base">{{ authStore.user?.name || 'Lang Dev' }}</h4>
                <p class="text-xs text-primary font-semibold bg-primary/5 px-2.5 py-1 rounded-md inline-block">Full Stack Developer</p>
                <p class="text-gray-500 text-xs leading-relaxed">
                  Building interactive applications that offer polished user experiences and premium designs.
                </p>
              </div>
            </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/api'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { resolveAvatarUrl } from '@/utils/avatar'

const router = useRouter()
const authStore = useAuthStore()

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
</script>
