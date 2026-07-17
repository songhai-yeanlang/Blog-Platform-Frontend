<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    <transition-group name="toast-list">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-xl text-white shadow-xl text-sm font-semibold border border-white/10 w-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
        :class="getToastClass(toast.type)"
        @click="toastStore.remove(toast.id)"
      >
        <span class="material-symbols-outlined text-[22px] shrink-0">
          {{ getToastIcon(toast.type) }}
        </span>
        <span class="flex-1 leading-normal">{{ toast.message }}</span>
        <button class="flex items-center justify-center shrink-0 opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none text-white text-[18px] cursor-pointer">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()

const getToastClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-emerald-500/95 to-teal-600/95 backdrop-blur-md'
    case 'error':
      return 'bg-gradient-to-r from-red-500/95 to-rose-600/95 backdrop-blur-md'
    case 'warning':
      return 'bg-gradient-to-r from-amber-500/95 to-orange-600/95 backdrop-blur-md'
    case 'info':
    default:
      return 'bg-gradient-to-r from-blue-500/95 to-indigo-600/95 backdrop-blur-md'
  }
}

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return 'check_circle'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
}
</script>

<style scoped>
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(48px) scale(0.9);
}

.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-12px);
}

.toast-list-leave-active {
  position: absolute;
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
