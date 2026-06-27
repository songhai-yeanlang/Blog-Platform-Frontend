<template>
  <!-- Global route-transition loading bar -->
  <div v-if="isRouteLoading" class="route-progress-bar"></div>
  <router-view></router-view>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isRouteLoading = ref(false)

router.beforeEach(() => {
  isRouteLoading.value = true
})

router.afterEach(() => {
  // Small delay so the bar is visible even for instant navigations
  setTimeout(() => {
    isRouteLoading.value = false
  }, 400)
})
</script>

<style>
/* ---- Global route loading progress bar ---- */
.route-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #4f46e5, #6366f1, #818cf8, #4f46e5);
  background-size: 200% 100%;
  animation: route-progress 0.8s linear infinite, route-progress-width 0.4s ease-out forwards;
  z-index: 9999;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
}

@keyframes route-progress {
  0%   { background-position: 0% 0%; }
  100% { background-position: -200% 0%; }
}

@keyframes route-progress-width {
  from { width: 0%; }
  to   { width: 85%; }
}

/* ---- Global skeleton shimmer ---- */
@keyframes skeleton-wave {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #e8eaed 25%,
    #f4f5f7 50%,
    #e8eaed 75%
  );
  background-size: 800px 100%;
  animation: skeleton-wave 1.4s ease-in-out infinite;
  border-radius: 4px;
}
</style>