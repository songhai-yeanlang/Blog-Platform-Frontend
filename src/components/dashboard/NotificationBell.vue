<template>
  <div class="relative" ref="bellContainerRef">
    <!-- Bell Button -->
    <button @click="toggleDropdown"
      class="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative"
      aria-label="Notifications">
      <span class="material-symbols-outlined text-[22px]">notifications</span>
      <span v-if="notifStore.unreadCount > 0"
        class="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full border border-white">
        {{ notifStore.unreadCount > 99 ? '99+' : notifStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div v-if="isOpen"
      class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in flex flex-col max-h-[480px]">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-2 border-b border-gray-50 shrink-0">
        <h3 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <span>Notifications</span>
          <span v-if="notifStore.unreadCount > 0"
            class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
            {{ notifStore.unreadCount }} new
          </span>
        </h3>
        <button v-if="notifStore.unreadCount > 0" @click="notifStore.markAllNotificationsAsRead"
          class="text-xs text-primary hover:underline font-semibold bg-transparent border-none cursor-pointer p-0">
          Mark all read
        </button>
      </div>

      <!-- Notification List -->
      <div class="flex-1 overflow-y-auto max-h-[380px] divide-y divide-gray-50">
        <div v-if="notifStore.isFetching && notifStore.notifications.length === 0"
          class="p-6 flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <template v-else-if="notifStore.notifications.length > 0">
          <div v-for="notif in notifStore.notifications" :key="notif.id" @click="handleNotificationClick(notif)" :class="[
            'flex gap-3 p-3.5 hover:bg-blue-50/20 cursor-pointer transition-colors relative group items-start',
            !notif.is_read ? 'bg-blue-50/10 font-medium' : ''
          ]">
            <!-- Unread Dot -->
            <span v-if="!notif.is_read" class="w-2 h-2 bg-primary rounded-full shrink-0 mt-2 absolute left-1.5"></span>

            <!-- Sender Avatar -->
            <img :src="resolveAvatarUrl(notif.sender_avatar, notif.sender_name)" alt="Avatar"
              class="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100" />

            <!-- Notification Content -->
            <div class="flex-1 min-w-0 pr-6" :class="{ 'opacity-60': notif.is_read }">
              <p class="text-xs text-gray-700 truncate block">
                <span class="font-bold text-gray-900">{{ notif.sender_name }}</span>
                commented on your post:
                <span class="font-semibold text-primary">"{{ notif.post_title }}"</span>
              </p>
              <span class="text-[10px] text-gray-450 mt-1 block">
                {{ formatRelativeTime(notif.created_at) }}
              </span>
            </div>

            <!-- Delete Button (Visible on Hover) -->
            <button @click.stop="notifStore.removeNotification(notif.id)"
              class="absolute right-2 top-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 cursor-pointer border-none"
              title="Delete notification">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </template>

        <div v-else class="flex flex-col items-center justify-center p-8 text-center text-gray-400 gap-2">
          <span class="material-symbols-outlined text-4xl text-gray-300">notifications_off</span>
          <p class="text-sm font-medium">All caught up!</p>
          <p class="text-xs text-gray-400 max-w-[200px]">No notifications to show right now.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { resolveAvatarUrl } from '@/utils/avatar'

const router = useRouter()
const notifStore = useNotificationStore()

const isOpen = ref(false)
const bellContainerRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    notifStore.fetchNotifications()
  }
}

const handleNotificationClick = async (notif) => {
  isOpen.value = false
  if (!notif.is_read) {
    await notifStore.markNotificationRead(notif.id)
  }
  router.push(`/post/${notif.post_id}`)
}

const handleClickOutside = (e) => {
  if (bellContainerRef.value && !bellContainerRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

const formatRelativeTime = (dateString) => {
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Fetch unread count on mount
  notifStore.fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
