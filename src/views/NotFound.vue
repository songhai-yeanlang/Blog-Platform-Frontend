<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f0f3ff] via-[#f9f9ff] to-[#e7eeff] font-sans px-4 relative overflow-hidden">
    <!-- Decorative subtle floating blur shapes -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative z-10 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
      <!-- Animated Icon Container -->
      <div class="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center text-primary animate-bounce-slow">
        <span class="material-symbols-outlined text-[44px]">explore</span>
      </div>

      <!-- Animated Huge 404 -->
      <h1 class="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 tracking-wider mb-2 select-none select-none-effect">
        404
      </h1>

      <h2 class="text-xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h2>

      <p class="text-gray-500 text-sm leading-relaxed mb-8">
        Oops! The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>

      <!-- Back to Safety Action -->
      <router-link
        :to="authStore.token ? '/dashboard' : '/'"
        class="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Back to {{ authStore.token ? 'Dashboard' : 'Login' }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.select-none-effect {
  text-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}
</style>
