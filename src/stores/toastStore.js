import { defineStore } from 'pinia'
import { ref } from 'vue'

// Module-level timer — persists across hot reloads
let _timer = null

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  const add = (message, type = 'success', duration = 3500) => {
    // Cancel any running auto-dismiss timer
    if (_timer !== null) {
      clearTimeout(_timer)
      _timer = null
    }

    // Replace ALL existing toasts with only the new one
    toasts.value = [{ id: Date.now(), message, type }]

    // Schedule auto-dismiss
    _timer = setTimeout(() => {
      toasts.value = []
      _timer = null
    }, duration)
  }

  const success = (message, duration) => add(message, 'success', duration)
  const error   = (message, duration) => add(message, 'error',   duration)
  const warning = (message, duration) => add(message, 'warning', duration)
  const info    = (message, duration) => add(message, 'info',    duration)

  const remove = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, success, error, warning, info, remove }
})
