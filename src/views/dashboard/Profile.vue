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
            <span class="text-gray-700 font-medium">My Profile</span>
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
      <main class="flex-1 overflow-y-auto bg-gray-50/50">
        <!-- ── Skeleton ─────────────────────────────────────────────────── -->
        <div v-if="isLoading" class="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
            <!-- Left skeletal column -->
            <div class="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/45 p-6 flex flex-col items-center shrink-0">
              <div class="skeleton-shimmer w-24 h-24 rounded-full mb-4"></div>
              <div class="skeleton-shimmer h-4 w-32 rounded mb-2"></div>
              <div class="skeleton-shimmer h-3 w-40 rounded"></div>
              <div class="border-t border-gray-100 my-5 w-full"></div>
              <div class="skeleton-shimmer h-9 w-full rounded-lg mb-2"></div>
              <div class="skeleton-shimmer h-9 w-full rounded-lg"></div>
            </div>
            <!-- Right skeletal column -->
            <div class="flex-1 p-6 md:p-8 space-y-4">
              <div class="skeleton-shimmer h-5 w-40 rounded"></div>
              <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
              <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
            </div>
          </div>
        </div>

        <!-- ── Main Profile Settings Card ───────────────────────────────── -->
        <div v-else class="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
            
            <!-- Left Navigation Sidebar -->
            <div class="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30 p-6 flex flex-col shrink-0 items-center md:items-stretch">
              <!-- Avatar Upload Area -->
              <div class="relative group mb-4 w-fit mx-auto">
                <div class="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-primary/10 bg-white shrink-0">
                  <img :src="avatarPreview || resolveAvatarUrl(profile.avatar, profile.name)" alt="avatar"
                    class="w-full h-full object-cover" />
                  <!-- Uploading Spinner -->
                  <div v-if="avatarUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                  </div>
                </div>
                <label v-if="!avatarUploading" for="avatarInput"
                  class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span class="material-symbols-outlined text-white text-[20px]">photo_camera</span>
                </label>
                <input id="avatarInput" type="file" accept="image/*" class="hidden" :disabled="avatarUploading"
                  @change="handleAvatarChange" />
              </div>

              <!-- Basic info -->
              <div class="text-center w-full">
                <h2 class="text-base font-bold text-gray-950 leading-tight truncate px-2">{{ profile.name || 'Anonymous' }}</h2>
                <p class="text-xs text-gray-400 mt-1 select-all  px-2">{{ profile.bio }}</p>
              </div>

              <div class="border-t border-gray-100 my-4 w-full"></div>

              <!-- Vertical menu buttons stack -->
              <nav class="flex flex-col gap-1 w-full">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="activeTab = tab.key"
                  class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none outline-none text-left w-full"
                  :class="activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm shadow-primary/10'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 bg-transparent'"
                >
                  <span class="material-symbols-outlined text-[18px]">{{ tab.icon }}</span>
                  <span>{{ tab.label }}</span>
                </button>
              </nav>
            </div>

            <!-- Right Content Panel -->
            <div class="flex-1 p-6 md:p-8">
              <transition name="tab-fade" mode="out-in">
                
                <!-- Tab View: Personal Info -->
                <div v-if="activeTab === 'info'" key="info" class="h-full flex flex-col justify-between">
                  <div class="space-y-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h2 class="text-base font-bold text-gray-900">Personal Information</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Manage your public display name, phone, and biography</p>
                      </div>
                      <button v-if="!isEditing" @click="startEdit"
                        class="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-75 transition-opacity cursor-pointer bg-transparent border-none">
                        <span class="material-symbols-outlined text-[16px]">edit</span>Edit Profile
                      </button>
                    </div>

                    <form @submit.prevent="submitProfile" class="space-y-5">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Full Name -->
                        <div>
                          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                          <div v-if="!isEditing"
                            class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-750 min-h-[42px] flex items-center">
                            {{ profile.name || '—' }}
                          </div>
                          <input v-else v-model="form.name" type="text" placeholder="Your full name"
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-850 outline-none transition-all bg-white focus:border-primary focus:ring-1 focus:ring-primary/20" />
                        </div>

                        <!-- Phone Number -->
                        <div>
                          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                          <div v-if="!isEditing"
                            class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-750 min-h-[42px] flex items-center">
                            {{ profile.phone || '—' }}
                          </div>
                          <input v-else v-model="form.phone" type="tel" placeholder="+855 12 345 678"
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-850 outline-none transition-all bg-white focus:border-primary focus:ring-1 focus:ring-primary/20" />
                        </div>
                      </div>

                      <!-- Bio -->
                      <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Bio</label>
                        <div v-if="!isEditing"
                          class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-750 min-h-[72px] whitespace-pre-wrap">
                          {{ profile.bio || '—' }}
                        </div>
                        <textarea v-else v-model="form.bio" rows="3" placeholder="Tell us something about yourself…"
                          class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-855 outline-none transition-all bg-white resize-none focus:border-primary focus:ring-1 focus:ring-primary/20" />
                      </div>

                      <!-- Email (Read-only) -->
                      <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <div class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-400 min-h-[42px] flex items-center select-all">
                          {{ profile.email }}
                        </div>
                      </div>

                      <!-- Edit Actions -->
                      <div v-if="isEditing" class="flex items-center gap-2 pt-1">
                        <BaseButton type="submit" :loading="isSaving" icon="save">
                          Save Changes
                        </BaseButton>
                        <BaseButton type="button" variant="secondary" @click="cancelEdit">
                          Cancel
                        </BaseButton>
                      </div>
                    </form>
                  </div>
                </div>

                <!-- Tab View: Change Password -->
                <div v-else-if="activeTab === 'password'" key="password" class="h-full flex flex-col justify-between">
                  <div class="space-y-6">
                    <div>
                      <h2 class="text-base font-bold text-gray-900">Change Password</h2>
                      <p class="text-xs text-gray-400 mt-0.5">Maintain a strong password with a mix of letters, numbers, and symbols</p>
                    </div>

                    <form @submit.prevent="submitChangePassword" class="space-y-5">
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <!-- Current Password -->
                        <div class="sm:col-span-2">
                          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Current Password</label>
                          <div class="relative">
                            <input v-model="pwForm.currentPassword" :type="showPw.current ? 'text' : 'password'"
                              placeholder="Enter current password"
                              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                              autocomplete="current-password" />
                            <button type="button" @click="showPw.current = !showPw.current"
                              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none outline-none">
                              <span class="material-symbols-outlined text-[18px]">{{ showPw.current ? 'visibility_off' : 'visibility' }}</span>
                            </button>
                          </div>
                        </div>

                        <!-- New Password -->
                        <div>
                          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
                          <div class="relative">
                            <input v-model="pwForm.newPassword" :type="showPw.new ? 'text' : 'password'"
                              placeholder="Enter new password"
                              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-850 outline-none transition-all bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                              autocomplete="new-password" />
                            <button type="button" @click="showPw.new = !showPw.new"
                              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none outline-none">
                              <span class="material-symbols-outlined text-[18px]">{{ showPw.new ? 'visibility_off' : 'visibility' }}</span>
                            </button>
                          </div>
                          <!-- Strength indicator -->
                          <div v-if="pwForm.newPassword" class="mt-2 space-y-1">
                            <div class="flex gap-1">
                              <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
                                :class="i <= pwStrength.score ? pwStrength.color : 'bg-gray-200'">
                              </div>
                            </div>
                            <p class="text-[10px] font-medium" :class="pwStrength.textColor">{{ pwStrength.label }}</p>
                          </div>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                          <div class="relative">
                            <input v-model="pwForm.confirmPassword" :type="showPw.confirm ? 'text' : 'password'"
                              placeholder="Re-enter new password"
                              class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-850 outline-none transition-all bg-white focus:border-primary focus:ring-1 focus:ring-primary/20"
                              :class="{ 'border-red-400': pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword }"
                              autocomplete="new-password" />
                            <button type="button" @click="showPw.confirm = !showPw.confirm"
                              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none outline-none">
                              <span class="material-symbols-outlined text-[18px]">{{ showPw.confirm ? 'visibility_off' : 'visibility' }}</span>
                            </button>
                          </div>
                          <p v-if="pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword"
                            class="text-[10px] text-red-500 mt-1.5 flex items-center gap-0.5">
                            <span class="material-symbols-outlined text-[12px]">error</span>
                            Passwords do not match
                          </p>
                        </div>
                      </div>

                      <div class="flex justify-end mt-2">
                        <BaseButton type="submit" :disabled="!canChangePw" :loading="isChangingPw" icon="lock_reset">
                          Update Password
                        </BaseButton>
                      </div>
                    </form>
                  </div>
                </div>

              </transition>
            </div>
          </div>
        </div>
      </main>
    </div>



    <!-- ── Logout confirm ─────────────────────────────────────────────────────── -->
    <ConfirmModal :show="showLogoutModal" :loading="logoutLoading" title="Confirm Logout"
      message="Are you sure you want to log out of your account?" confirm-text="Yes" cancel-text="No"
      @confirm="confirmLogout" @cancel="showLogoutModal = false" />

    <!-- Avatar Crop & Scale Modal -->
    <div v-if="showCropModal"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 flex flex-col gap-5">
        <div class="text-center space-y-1">
          <h3 class="text-lg font-bold text-gray-900">Crop Profile Photo</h3>
          <p class="text-xs text-gray-400">Drag to reposition, use slider to zoom</p>
        </div>

        <!-- Crop Viewport Container (256x256) -->
        <div
          class="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-inner select-none cursor-move">
          <!-- Image under mask -->
          <img :src="cropImageSrc" @load="onImageLoaded" @mousedown="onDragStart" @touchstart="onDragStart" :style="{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
            transformOrigin: 'center',
            userSelect: 'none',
            pointerEvents: 'auto'
          }" class="absolute top-1/2 left-1/2 max-w-none" alt="Crop target" />
          <!-- Circular Mask overlay -->
          <div class="absolute inset-0 rounded-2xl pointer-events-none"
            style="box-shadow: 0 0 0 9999px rgba(0,0,0,0.55);"></div>
          <div class="absolute inset-4 rounded-full border-2 border-white/80 pointer-events-none shadow-sm"></div>
        </div>

        <!-- Zoom Slider -->
        <div class="flex items-center gap-3 px-2">
          <span class="material-symbols-outlined text-gray-400 text-[18px] select-none">zoom_out</span>
          <input type="range" v-model.number="scale" min="1" max="3" step="0.01"
            class="flex-1 accent-primary h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
          <span class="material-symbols-outlined text-gray-400 text-[18px] select-none">zoom_in</span>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center gap-3 pt-2">
          <button type="button" @click="showCropModal = false"
            class="flex-1 py-2.5 rounded-xl border border-gray-250 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
            Cancel
          </button>
          <button type="button" @click="submitAvatar"
            class="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm shadow-primary/10 hover:bg-primary/95 transition-all cursor-pointer border-none">
            Save & Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { getMyProfile, updateMyProfile, uploadAvatar, changePassword } from '@/api/api'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()
import { resolveAvatarUrl } from '@/utils/avatar'
import ConfirmModal from '@/components/ConfirmModal.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import NotificationBell from '@/components/dashboard/NotificationBell.vue'

const router = useRouter()
const authStore = useAuthStore()

// ── Tabs ───────────────────────────────────────────────────────────────────
const tabs = [
  { key: 'info', label: 'Personal Info', icon: 'person' },
  { key: 'password', label: 'Change Password', icon: 'lock_reset' },
]
const activeTab = ref('info')

// ── State ──────────────────────────────────────────────────────────────────
const isLoading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const isChangingPw = ref(false)
const avatarFile = ref(null)
const avatarPreview = ref(null)
const avatarUploading = ref(false)
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

const profile = reactive({
  id: null, name: '', email: '', phone: '', bio: '',
  avatar: null, role: '', is_verified: false, is_active: false,
})
const form = reactive({ name: '', phone: '', bio: '' })

const pwForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showPw = reactive({ current: false, new: false, confirm: false })

// ── Password strength ──────────────────────────────────────────────────────
const pwStrength = computed(() => {
  const pw = pwForm.newPassword
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[!@#$%^&*()_+\-=\[\]{}|;',.<>?]/.test(pw)) score++

  const map = [
    { score: 0, label: '', color: 'bg-gray-300', textColor: 'text-gray-400' },
    { score: 1, label: 'Weak', color: 'bg-red-400', textColor: 'text-red-500' },
    { score: 2, label: 'Fair', color: 'bg-amber-400', textColor: 'text-amber-500' },
    { score: 3, label: 'Good', color: 'bg-blue-400', textColor: 'text-blue-500' },
    { score: 4, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' },
  ]
  return { score, ...map[score] }
})

const canChangePw = computed(() =>
  pwForm.currentPassword &&
  pwForm.newPassword &&
  pwForm.confirmPassword &&
  pwForm.newPassword === pwForm.confirmPassword &&
  pwStrength.value.score >= 3
)

// ── Helpers ────────────────────────────────────────────────────────────────
const showToast = (message, type = 'success') => {
  if (type === 'error') {
    toastStore.error(message)
  } else {
    toastStore.success(message)
  }
}

const applyProfile = (data) => {
  profile.id = data.id
  profile.name = data.name ?? ''
  profile.email = data.email ?? ''
  profile.phone = data.phone ?? ''
  profile.bio = data.bio ?? ''
  profile.avatar = data.avatar ?? null
  profile.role = data.role ?? 'user'
  profile.is_verified = !!data.is_verified
  profile.is_active = !!data.is_active
}

// ── Load profile ───────────────────────────────────────────────────────────
const loadProfile = async () => {
  isLoading.value = true
  try {
    const { data } = await getMyProfile()
    applyProfile(data.data)
    authStore.setUser(data.data)
  } catch {
    showToast('Failed to load profile.', 'error')
  } finally {
    isLoading.value = false
  }
}

// ── Edit profile ───────────────────────────────────────────────────────────
const startEdit = () => { form.name = profile.name; form.phone = profile.phone; form.bio = profile.bio; isEditing.value = true }
const cancelEdit = () => { isEditing.value = false }

const submitProfile = async () => {
  isSaving.value = true
  try {
    const { data } = await updateMyProfile({
      name: form.name || undefined,
      phone: form.phone || undefined,
      bio: form.bio || undefined,
    })
    applyProfile(data.data)
    authStore.setUser(data.data)
    isEditing.value = false
    showToast('Profile updated successfully!')
  } catch (err) {
    showToast(err?.response?.data?.message ?? 'Update failed. Please try again.', 'error')
  } finally {
    isSaving.value = false
  }
}

// ── Avatar ─────────────────────────────────────────────────────────────────
const showCropModal = ref(false)
const cropImageSrc = ref('')
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const displayWidth = ref(256)
const displayHeight = ref(256)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const handleAvatarChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    cropImageSrc.value = reader.result
    showCropModal.value = true
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

const onImageLoaded = (e) => {
  const img = e.target
  const minSide = 256
  if (img.naturalWidth > img.naturalHeight) {
    displayHeight.value = minSide
    displayWidth.value = (img.naturalWidth / img.naturalHeight) * minSide
  } else {
    displayWidth.value = minSide
    displayHeight.value = (img.naturalHeight / img.naturalWidth) * minSide
  }
  position.value = { x: 0, y: 0 }
  scale.value = 1
}

const onDragStart = (e) => {
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  dragStart.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }

  if (e.touches) {
    document.addEventListener('touchmove', onDragMove, { passive: false })
    document.addEventListener('touchend', onDragEnd)
  } else {
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragEnd)
  }
}

const onDragMove = (e) => {
  if (!isDragging.value) return
  if (e.cancelable) e.preventDefault()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY

  let newX = clientX - dragStart.value.x
  let newY = clientY - dragStart.value.y

  const halfW = (displayWidth.value * scale.value) / 2
  const halfH = (displayHeight.value * scale.value) / 2

  const limitX = Math.max(0, halfW - 112)
  const limitY = Math.max(0, halfH - 112)

  position.value = {
    x: Math.max(-limitX, Math.min(limitX, newX)),
    y: Math.max(-limitY, Math.min(limitY, newY))
  }
}

const onDragEnd = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.removeEventListener('touchmove', onDragMove)
  document.removeEventListener('touchend', onDragEnd)
}

const cropImage = () => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 300
    canvas.height = 300
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 300, 300)

      ctx.translate(150, 150)

      const ratio = 300 / 224
      const baseScaleX = displayWidth.value / img.naturalWidth
      const baseScaleY = displayHeight.value / img.naturalHeight

      ctx.scale(scale.value * ratio * baseScaleX, scale.value * ratio * baseScaleY)

      const drawX = -img.naturalWidth / 2 + (position.value.x / (baseScaleX * scale.value * ratio))
      const drawY = -img.naturalHeight / 2 + (position.value.y / (baseScaleY * scale.value * ratio))

      ctx.drawImage(img, drawX, drawY)

      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/webp', 0.9)
    }
    img.src = cropImageSrc.value
  })
}

const submitAvatar = async () => {
  avatarUploading.value = true
  showCropModal.value = false
  try {
    const croppedBlob = await cropImage()
    const file = new File([croppedBlob], 'avatar.webp', { type: 'image/webp' })
    const { data } = await uploadAvatar(file)
    applyProfile(data.data)
    authStore.setUser(data.data)
    showToast('Profile photo updated!')
  } catch (err) {
    showToast(err?.response?.data?.message ?? 'Avatar upload failed.', 'error')
  } finally {
    avatarUploading.value = false
    cropImageSrc.value = ''
  }
}

// ── Change password ────────────────────────────────────────────────────────
const submitChangePassword = async () => {
  if (!canChangePw.value) return
  isChangingPw.value = true
  try {
    await changePassword({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
      confirmPassword: pwForm.confirmPassword,
    })
    pwForm.currentPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
    showToast('Password changed successfully!')
  } catch (err) {
    showToast(err?.response?.data?.message ?? 'Failed to change password.', 'error')
  } finally {
    isChangingPw.value = false
  }
}

// ── Logout ─────────────────────────────────────────────────────────────────
const handleLogout = () => { showLogoutModal.value = true }

const confirmLogout = async () => {
  logoutLoading.value = true
  try { await api.post('/auth/logout') } catch { }
  finally {
    logoutLoading.value = false
    showLogoutModal.value = false
    authStore.logout()
    router.push('/')
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
