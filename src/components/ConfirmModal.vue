<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <Transition name="scale">
        <div v-if="show" class="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 text-center">
            <!-- Icon/Visual -->
            <div class="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-bounce-subtle">
              <span class="material-symbols-outlined text-[26px]">logout</span>
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ message }}</p>
          </div>
          
          <div class="flex border-t border-gray-100 bg-gray-50/50 p-4 gap-3 justify-end">
            <button
              @click="$emit('cancel')"
              :disabled="loading"
              class="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg cursor-pointer transition-colors bg-transparent border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ cancelText }}
            </button>
            <button
              @click="$emit('confirm')"
              :disabled="loading"
              class="px-4 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer shadow-sm shadow-red-500/20 transition-all border-none outline-none flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <!-- Spinner while loading -->
              <svg
                v-if="loading"
                class="animate-spin h-3.5 w-3.5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ loading ? 'Logging out…' : confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Logout'
  },
  message: {
    type: String,
    default: 'Are you sure you want to log out of your account?'
  },
  confirmText: {
    type: String,
    default: 'Yes, Logout'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}
</style>
