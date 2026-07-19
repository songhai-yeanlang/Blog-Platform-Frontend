import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './authStore'
import { useToastStore } from './toastStore'
import {
  getNotifications as apiGetNotifications,
  getUnreadCount as apiGetUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification as apiDeleteNotification
} from '@/api/api'

export const useNotificationStore = defineStore('notification', () => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const notifications = ref([])
  const unreadCount = ref(0)
  const socket = ref(null)
  const isFetching = ref(false)

  // Socket base URL is derived from API base URL (remove /api)
  const socketUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api')
    .replace(/\/api\/?$/, '')

  const initSocket = () => {
    // If socket already exists, do not re-create
    if (socket.value) return

    const userId = authStore.user?.id
    if (!userId) return

    socket.value = io(socketUrl, {
      transports: ['websocket', 'polling']
    })

    socket.value.on('connect', () => {
      console.log('[Socket] Connected to server, emitting join for user:', userId)
      socket.value.emit('join', userId)
    })

    socket.value.on('new_notification', (notif) => {
      console.log('[Socket] Received new notification:', notif)
      notifications.value.unshift(notif)
      unreadCount.value++
      
      // Trigger a beautiful audio cue / toast
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav')
        audio.volume = 0.4
        audio.play().catch(() => {})
      } catch (err) {
        // Audio error is safe to ignore
      }

      toastStore.info(`${notif.sender_name} commented on "${notif.post_title}"`)
    })

    socket.value.on('disconnect', () => {
      console.log('[Socket] Disconnected from server')
    })
  }

  const closeSocket = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  const fetchNotifications = async () => {
    if (!authStore.token) return
    isFetching.value = true
    try {
      const { data } = await apiGetNotifications()
      if (data.success) {
        notifications.value = data.data
        unreadCount.value = data.unreadCount
      }
    } catch (err) {
      console.error('[NotificationStore] Failed to fetch notifications:', err)
    } finally {
      isFetching.value = false
    }
  }

  const markNotificationRead = async (id) => {
    try {
      const { data } = await apiMarkAsRead(id)
      if (data.success) {
        const notif = notifications.value.find(n => n.id === id)
        if (notif && !notif.is_read) {
          notif.is_read = 1
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
      }
    } catch (err) {
      console.error('[NotificationStore] Failed to mark as read:', err)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      const { data } = await apiMarkAllAsRead()
      if (data.success) {
        notifications.value.forEach(n => {
          n.is_read = 1
        })
        unreadCount.value = 0
        toastStore.success('All notifications marked as read')
      }
    } catch (err) {
      console.error('[NotificationStore] Failed to mark all as read:', err)
    }
  }

  const removeNotification = async (id) => {
    try {
      const { data } = await apiDeleteNotification(id)
      if (data.success) {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index !== -1) {
          const wasUnread = !notifications.value[index].is_read
          notifications.value.splice(index, 1)
          if (wasUnread) {
            unreadCount.value = Math.max(0, unreadCount.value - 1)
          }
          toastStore.success('Notification deleted')
        }
      }
    } catch (err) {
      console.error('[NotificationStore] Failed to delete notification:', err)
    }
  }

  // Watch for auth changes to connect/disconnect socket and fetch data
  watch(
    () => authStore.token,
    (newToken) => {
      if (newToken) {
        initSocket()
        fetchNotifications()
      } else {
        closeSocket()
        notifications.value = []
        unreadCount.value = 0
      }
    },
    { immediate: true }
  )

  // Watch for user profile changes to sync socket room join
  watch(
    () => authStore.user?.id,
    (newId, oldId) => {
      if (newId && newId !== oldId) {
        closeSocket()
        initSocket()
      }
    }
  )

  return {
    notifications,
    unreadCount,
    isFetching,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsAsRead,
    removeNotification,
    initSocket,
    closeSocket
  }
})
