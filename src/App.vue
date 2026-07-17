<template>
  <router-view />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import ToastContainer from '@/components/ToastContainer.vue'

const authStore = useAuthStore()

// Sync the authenticated user's profile on every full-page load
onMounted(() => authStore.fetchProfile())
</script>

<style>
/* ---- Global skeleton shimmer ---- */
@keyframes skeleton-wave {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

.skeleton-shimmer {
  background: linear-gradient(90deg, #e8eaed 25%, #f4f5f7 50%, #e8eaed 75%);
  background-size: 800px 100%;
  animation: skeleton-wave 1.4s ease-in-out infinite;
  border-radius: 4px;
}
</style>