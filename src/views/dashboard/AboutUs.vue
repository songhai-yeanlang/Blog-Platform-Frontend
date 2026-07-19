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
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden">
    </div>

    <!-- Main content -->
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
            <span class="text-gray-700 font-medium">About Us</span>
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

      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 px-6 py-8 relative overflow-hidden">
        <!-- Ambient blurred background gradients -->
        <div class="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/5 rounded-full filter blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div class="max-w-5xl mx-auto relative z-10">
          <!-- Main Grid Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">



            <!-- Left Column: About Platform & Purpose (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Platform Identity Card -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
                <div class="inline-flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                    B
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">Blog-Platform</h2>
                    <p class="text-xs text-gray-400">Version 1.2.0 • Develop by Songhai Yeanlang</p>
                  </div>
                </div>
                
                <h3 class="text-base font-bold text-gray-800 pt-2 border-t border-gray-50">What is this website used for?</h3>
                <p class="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Blog-Platform is a modern, high-performance publishing space designed for developers, creators, and storytellers. It acts as an open canvas where authors can easily write, layout, edit, and organize public blogs. Readers can follow along, bookmark their favorites, and leave thoughts in real-time.
                </p>
                <p class="text-gray-600 text-xs leading-relaxed">
                  Our system focuses on speed, security, clean UX, and modern micro-interactions (including socket notifications and inline comments control) to build a collaborative writing community.
                </p>
              </div>

              <!-- Key Platform Capabilities -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
                  <span>Core System Architecture</span>
                </h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Cap 1 -->
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <span class="material-symbols-outlined text-[24px] text-primary">edit_note</span>
                    <h4 class="font-bold text-xs text-gray-800">Rich Publishing</h4>
                    <p class="text-[10px] text-gray-500 leading-relaxed">
                      Features tags, dynamic category filters, view counters, and cover media uploading.
                    </p>
                  </div>
                  <!-- Cap 2 -->
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <span class="material-symbols-outlined text-[24px] text-primary">bolt</span>
                    <h4 class="font-bold text-xs text-gray-800">Real-time Sockets</h4>
                    <p class="text-[10px] text-gray-500 leading-relaxed">
                      Instant audio notification alerts to post authors whenever comments are posted.
                    </p>
                  </div>
                  <!-- Cap 3 -->
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <span class="material-symbols-outlined text-[24px] text-primary">forum</span>
                    <h4 class="font-bold text-xs text-gray-800">Inline Moderation</h4>
                    <p class="text-[10px] text-gray-500 leading-relaxed">
                      Writers can modify comments inline or delete comments directly on their posts.
                    </p>
                  </div>
                  <!-- Cap 4 -->
                  <div class="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                    <span class="material-symbols-outlined text-[24px] text-primary">favorite</span>
                    <h4 class="font-bold text-xs text-gray-800">Personal Favorites</h4>
                    <p class="text-[10px] text-gray-500 leading-relaxed">
                      Track and bookmark loved publications for continuous reading experience.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <!-- Right Column: Developer Profile (5 cols) -->
            <div class="lg:col-span-5 flex justify-center lg:justify-end lg:sticky lg:top-8">
              <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 text-center flex flex-col items-center gap-6 w-full max-w-[420px] relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
                <!-- Subtle card background dots mesh pattern -->
                <div class="absolute inset-0 opacity-[0.22] pointer-events-none" style="background-image: radial-gradient(rgba(59, 130, 246, 0.15) 1.2px, transparent 1.2px); background-size: 20px 20px;"></div>
                
                <!-- Floating Deco Elements (Grid Dots & Crosses) -->
                <div class="absolute top-4 right-4 flex flex-col gap-1 opacity-20">
                  <div class="flex gap-1">
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                  </div>
                  <div class="flex gap-1">
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span class="w-1 h-1 rounded-full bg-gray-600"></span>
                  </div>
                </div>
                <div class="absolute top-24 left-4 text-xs text-primary/30 font-bold select-none">+</div>

                <!-- Layered Creative Profile Graphic -->
                <div class="relative w-80 h-80 flex items-center justify-center select-none shrink-0 mt-2">
                  <!-- Abstract Outlined Rotating Ring -->
                  <div class="absolute inset-0 border border-primary/20 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] animate-[spin_30s_linear_infinite]"></div>
                  <div class="absolute inset-4 border border-dashed border-gray-250 rounded-full"></div>

                  <!-- Dark Blob Backdrop Layer -->
                  <div class="absolute w-52 h-52 bg-gray-900 rounded-[50%_50%_30%_70%_/_50%_60%_40%_60%] transform rotate-12 opacity-95"></div>

                  <!-- Blue Blob Backdrop Layer -->
                  <div class="absolute w-48 h-48 bg-primary rounded-[40%_60%_50%_50%_/_60%_40%_60%_40%] transform -rotate-12 translate-x-1.5 translate-y-1"></div>

                  <!-- Profile Image (Clipped Circle) -->
                  <div class="absolute w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl z-10 bg-white">
                    <img 
                      :src="devPhoto" 
                      class="w-full h-full object-cover mt-[45px] scale-[1.35] origin-center transition-transform duration-500 scale-[1.45] hover:scale-[1.55]" 
                      alt="SONGHAI Yeanlang" 
                    />
                  </div>

                  <!-- Decorative Star/Sparkle -->
                  <div class="absolute bottom-6 right-6 text-primary font-bold text-sm">✦</div>
                </div>

                <!-- Dev Stats & Details -->
                <div class="space-y-4 w-full">
                  <div class="space-y-1">
                    <h4 class="font-extrabold text-gray-900 text-xl tracking-tight">SONGHAI Yeanlang.</h4>
                    <p class="text-xs font-bold text-primary uppercase tracking-wide">
                      Full-Stack Developer
                    </p>
                    <p class="text-xs  tracking-wide">
                     +855 61 883 888 | langofficial19@gmail.com
                    </p>
                  </div>

                 
                </div>
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
import devPhoto from '@/assets/images/yeanlang.png'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { resolveAvatarUrl } from '@/utils/avatar'
import NotificationBell from '@/components/dashboard/NotificationBell.vue'

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
