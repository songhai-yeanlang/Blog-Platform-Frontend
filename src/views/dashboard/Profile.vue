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
        <router-link to="/dashboard" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">grid_view</span><span>Dashboard</span>
        </router-link>
        <router-link to="/new-post" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">add_circle</span><span>New Post</span>
        </router-link>
       
        <router-link to="/my-posts" class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-primary text-sm transition-colors">
          <span class="material-symbols-outlined text-[20px]">description</span><span>My Blogs</span>
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
    <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden" />

    <!-- ── Main ─────────────────────────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Header -->
      <header class="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shrink-0 sticky top-0 z-20 gap-4">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
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
                class="w-8 h-8 rounded-full object-cover border-2 border-primary/30" />
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
      <main class="flex-1 overflow-y-auto">

        <!-- ── Skeleton ─────────────────────────────────────────────────── -->
        <div v-if="isLoading" class="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div class="skeleton-shimmer h-36"></div>
            <div class="p-6 flex items-end gap-5 -mt-10">
              <div class="skeleton-shimmer w-24 h-24 rounded-full border-4 border-white shrink-0"></div>
              <div class="flex-1 pb-2 space-y-2">
                <div class="skeleton-shimmer h-5 w-40 rounded"></div>
                <div class="skeleton-shimmer h-3 w-56 rounded"></div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div v-for="n in 4" :key="n" class="space-y-2">
              <div class="skeleton-shimmer h-3 w-20 rounded"></div>
              <div class="skeleton-shimmer h-10 w-full rounded-lg"></div>
            </div>
          </div>
        </div>

        <!-- ── Profile Hero ─────────────────────────────────────────────── -->
        <div v-else class="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">

          <!-- Hero Card -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <!-- Cover -->
            <div class="h-36 relative overflow-hidden bg-gradient-to-br from-primary via-blue-500 to-indigo-400">
              <div class="absolute inset-0" style="background-image:radial-gradient(circle at 20% 50%,rgba(255,255,255,.15) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(255,255,255,.1) 0%,transparent 50%)"></div>
              <div class="absolute bottom-4 right-5 text-white/20 text-8xl font-black leading-none select-none">BP</div>
            </div>

            <!-- Avatar row -->
            <div class="px-6 pb-5">
              <div class="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">

                <!-- Avatar + camera -->
                <div class="relative group w-fit">
                  <img
                    :src="avatarPreview || resolveAvatarUrl(profile.avatar, profile.name)"
                    alt="avatar"
                    class="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg ring-2 ring-primary/10"
                  />
                  <label for="avatarInput"
                    class="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <span class="material-symbols-outlined text-white text-[22px]">photo_camera</span>
                  </label>
                  <input id="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                  <!-- New avatar indicator -->
                  <span v-if="avatarFile"
                    class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse">
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0 pt-14 sm:pt-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-xl font-bold text-gray-900 truncate">{{ profile.name || '—' }}</h1>
                    <span class="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      :class="profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary/10 text-primary'">
                      <span class="material-symbols-outlined text-[11px]">{{ profile.role === 'admin' ? 'shield' : 'person' }}</span>
                      {{ profile.role }}
                    </span>
                    <span class="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      :class="profile.is_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'">
                      <span class="material-symbols-outlined text-[11px]">{{ profile.is_verified ? 'verified' : 'schedule' }}</span>
                      {{ profile.is_verified ? 'Verified' : 'Pending' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-0.5">{{ profile.email }}</p>
                  <p v-if="profile.phone" class="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">phone</span>{{ profile.phone }}
                  </p>
                </div>

                <!-- Save avatar button -->
                <button v-if="avatarFile" @click="submitAvatar" :disabled="avatarUploading"
                  class="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer shadow-sm shadow-primary/30">
                  <svg v-if="avatarUploading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span v-else class="material-symbols-outlined text-[16px]">cloud_upload</span>
                  {{ avatarUploading ? 'Uploading…' : 'Upload Photo' }}
                </button>
              </div>

              <!-- Stats row -->
              <div class="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100">
                <div class="text-center">
                  <p class="text-xs text-gray-400">Account</p>
                  <p class="text-sm font-bold text-gray-700">#{{ profile.id }}</p>
                </div>
                <div class="w-px h-8 bg-gray-100"></div>
                <div class="text-center">
                  <p class="text-xs text-gray-400">Status</p>
                  <p class="text-sm font-bold" :class="profile.is_active ? 'text-green-600' : 'text-red-500'">
                    {{ profile.is_active ? 'Active' : 'Inactive' }}
                  </p>
                </div>
                <div class="w-px h-8 bg-gray-100"></div>
                <div class="text-center">
                  <p class="text-xs text-gray-400">Email</p>
                  <p class="text-sm font-bold" :class="profile.is_verified ? 'text-green-600' : 'text-amber-500'">
                    {{ profile.is_verified ? 'Verified' : 'Unverified' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Tabs ──────────────────────────────────────────────────── -->
          <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-none outline-none"
              :class="activeTab === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 bg-transparent'">
              <span class="material-symbols-outlined text-[16px]">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>

          <!-- ── Tab: Personal Info ────────────────────────────────────── -->
          <transition name="tab-fade" mode="out-in">
            <div v-if="activeTab === 'info'" key="info" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-base font-bold text-gray-900">Personal Information</h2>
                  <p class="text-xs text-gray-400 mt-0.5">Update your name, phone number and bio</p>
                </div>
                <button v-if="!isEditing" @click="startEdit"
                  class="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none">
                  <span class="material-symbols-outlined text-[17px]">edit</span>Edit
                </button>
              </div>

              <form @submit.prevent="submitProfile" class="space-y-5">

                <!-- Name -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <div v-if="!isEditing" class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-800 min-h-[42px] flex items-center">{{ profile.name || '—' }}</div>
                    <input v-else v-model="form.name" type="text" placeholder="Your full name" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white focus:border-primary focus:ring-2" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div v-if="!isEditing" class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-800 min-h-[42px] flex items-center">{{ profile.phone || '—' }}</div>
                    <input v-else v-model="form.phone" type="tel" placeholder="+855 12 345 678" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white focus:border-primary focus:ring-2" />
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
                  <div v-if="!isEditing" class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-800 min-h-[72px] whitespace-pre-wrap">{{ profile.bio || '—' }}</div>
                  <textarea v-else v-model="form.bio" rows="3" placeholder="Tell us something about yourself…" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white resize-none focus:border-primary focus:ring-2" />
                </div>

                <!-- Email readonly -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email <span class="font-normal normal-case text-gray-400">(cannot be changed)</span></label>
                  <div class="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-400 min-h-[42px] flex items-center">{{ profile.email }}</div>
                </div>

                <!-- Buttons -->
                <div v-if="isEditing" class="flex items-center gap-3 pt-1">
                  <button type="submit" :disabled="isSaving"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer shadow-sm shadow-primary/20">
                    <svg v-if="isSaving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span v-else class="material-symbols-outlined text-[16px]">save</span>
                    {{ isSaving ? 'Saving…' : 'Save Changes' }}
                  </button>
                  <button type="button" @click="cancelEdit"
                    class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-transparent">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- ── Tab: Change Password ─────────────────────────────────── -->
            <div v-else-if="activeTab === 'password'" key="password" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div class="mb-6">
                <h2 class="text-base font-bold text-gray-900">Change Password</h2>
                <p class="text-xs text-gray-400 mt-0.5">Must be at least 8 characters with uppercase, lowercase, number &amp; special character</p>
              </div>

              <form @submit.prevent="submitChangePassword" class="space-y-5 max-w-md">

                <!-- Current password -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
                  <div class="relative">
                    <input
                      v-model="pwForm.currentPassword"
                      :type="showPw.current ? 'text' : 'password'"
                      placeholder="Enter current password"
                      class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white focus:border-primary focus:ring-2"
                      autocomplete="current-password"
                    />
                    <button type="button" @click="showPw.current = !showPw.current"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none outline-none">
                      <span class="material-symbols-outlined text-[18px]">{{ showPw.current ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>

                <!-- New password -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                  <div class="relative">
                    <input
                      v-model="pwForm.newPassword"
                      :type="showPw.new ? 'text' : 'password'"
                      placeholder="Enter new password"
                      class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white focus:border-primary focus:ring-2"
                      autocomplete="new-password"
                    />
                    <button type="button" @click="showPw.new = !showPw.new"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none outline-none">
                      <span class="material-symbols-outlined text-[18px]">{{ showPw.new ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                  <!-- Strength indicator -->
                  <div v-if="pwForm.newPassword" class="mt-2 space-y-1.5">
                    <div class="flex gap-1">
                      <div v-for="i in 4" :key="i"
                        class="h-1 flex-1 rounded-full transition-all duration-300"
                        :class="i <= pwStrength.score ? pwStrength.color : 'bg-gray-200'">
                      </div>
                    </div>
                    <p class="text-[11px]" :class="pwStrength.textColor">{{ pwStrength.label }}</p>
                  </div>
                </div>

                <!-- Confirm password -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                  <div class="relative">
                    <input
                      v-model="pwForm.confirmPassword"
                      :type="showPw.confirm ? 'text' : 'password'"
                      placeholder="Re-enter new password"
                      class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none transition-all bg-white focus:border-primary focus:ring-2"
                      :class="{ 'border-red-400': pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword }"
                      autocomplete="new-password"
                    />
                    <button type="button" @click="showPw.confirm = !showPw.confirm"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none outline-none">
                      <span class="material-symbols-outlined text-[18px]">{{ showPw.confirm ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                  <p v-if="pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword"
                    class="text-[11px] text-red-500 mt-1.5 flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[13px]">error</span>
                    Passwords do not match
                  </p>
                </div>

                <button type="submit" :disabled="isChangingPw || !canChangePw"
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-primary/20">
                  <svg v-if="isChangingPw" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span v-else class="material-symbols-outlined text-[16px]">lock_reset</span>
                  {{ isChangingPw ? 'Updating…' : 'Update Password' }}
                </button>
              </form>
            </div>
          </transition>

        </div>
      </main>
    </div>



    <!-- ── Logout confirm ─────────────────────────────────────────────────────── -->
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

const router    = useRouter()
const authStore = useAuthStore()

// ── Tabs ───────────────────────────────────────────────────────────────────
const tabs = [
  { key: 'info',     label: 'Personal Info',    icon: 'person'     },
  { key: 'password', label: 'Change Password',  icon: 'lock_reset' },
]
const activeTab = ref('info')

// ── State ──────────────────────────────────────────────────────────────────
const isLoading       = ref(true)
const isEditing       = ref(false)
const isSaving        = ref(false)
const isChangingPw    = ref(false)
const avatarFile      = ref(null)
const avatarPreview   = ref(null)
const avatarUploading = ref(false)
const isMobileMenuOpen = ref(false)
const showLogoutModal  = ref(false)
const logoutLoading    = ref(false)

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
  if (pw.length >= 8)                        score++
  if (/[A-Z]/.test(pw))                      score++
  if (/[0-9]/.test(pw))                      score++
  if (/[!@#$%^&*()_+\-=\[\]{}|;',.<>?]/.test(pw)) score++

  const map = [
    { score: 0, label: '',        color: 'bg-gray-300',  textColor: 'text-gray-400' },
    { score: 1, label: 'Weak',    color: 'bg-red-400',   textColor: 'text-red-500'  },
    { score: 2, label: 'Fair',    color: 'bg-amber-400', textColor: 'text-amber-500'},
    { score: 3, label: 'Good',    color: 'bg-blue-400',  textColor: 'text-blue-500' },
    { score: 4, label: 'Strong',  color: 'bg-green-500', textColor: 'text-green-600'},
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
  profile.id          = data.id
  profile.name        = data.name        ?? ''
  profile.email       = data.email       ?? ''
  profile.phone       = data.phone       ?? ''
  profile.bio         = data.bio         ?? ''
  profile.avatar      = data.avatar      ?? null
  profile.role        = data.role        ?? 'user'
  profile.is_verified = !!data.is_verified
  profile.is_active   = !!data.is_active
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
const startEdit  = () => { form.name = profile.name; form.phone = profile.phone; form.bio = profile.bio; isEditing.value = true }
const cancelEdit = () => { isEditing.value = false }

const submitProfile = async () => {
  isSaving.value = true
  try {
    const { data } = await updateMyProfile({
      name:  form.name  || undefined,
      phone: form.phone || undefined,
      bio:   form.bio   || undefined,
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
const handleAvatarChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  avatarFile.value    = file
  avatarPreview.value = URL.createObjectURL(file)
}

const submitAvatar = async () => {
  if (!avatarFile.value) return
  avatarUploading.value = true
  try {
    const { data } = await uploadAvatar(avatarFile.value)
    applyProfile(data.data)
    authStore.setUser(data.data)
    avatarFile.value    = null
    avatarPreview.value = null
    showToast('Profile photo updated!')
  } catch (err) {
    showToast(err?.response?.data?.message ?? 'Avatar upload failed.', 'error')
  } finally {
    avatarUploading.value = false
  }
}

// ── Change password ────────────────────────────────────────────────────────
const submitChangePassword = async () => {
  if (!canChangePw.value) return
  isChangingPw.value = true
  try {
    await changePassword({
      currentPassword: pwForm.currentPassword,
      newPassword:     pwForm.newPassword,
    })
    pwForm.currentPassword = ''
    pwForm.newPassword     = ''
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
  try { await api.post('/auth/logout') } catch {}
  finally {
    logoutLoading.value  = false
    showLogoutModal.value = false
    authStore.logout()
    router.push('/')
  }
}

onMounted(loadProfile)
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.tab-fade-enter-from   { opacity: 0; transform: translateY(8px); }
.tab-fade-leave-to     { opacity: 0; transform: translateY(-4px); }

</style>
