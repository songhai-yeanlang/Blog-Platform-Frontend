<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h3 class="auth-title">Reset Password</h3>
      <p class="auth-subtitle">Enter your new password to secure your account.</p>

      <form @submit.prevent="resetPassword">
        <!-- New Password -->
        <label class="auth-label">New Password</label>
        <div class="auth-input-group">
          <LockClosedIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter new password"
            v-model="form.newPassword"
            class="has-toggle"
            :class="{ 'error-field': errors.length }"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <EyeSlashIcon v-if="showPassword" class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
            <EyeIcon v-else class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
          </button>
        </div>

        <!-- Confirm Password -->
        <label class="auth-label" style="margin-top: 1rem;">Confirm Password</label>
        <div class="auth-input-group">
          <LockClosedIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm new password"
            v-model="form.confirmPassword"
            class="has-toggle"
            :class="{ 'error-field': errors.length }"
            required
          />
          <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
            <EyeSlashIcon v-if="showConfirmPassword" class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
            <EyeIcon v-else class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
          </button>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading || !form.newPassword || !form.confirmPassword">
          <span v-if="loading" class="auth-spinner"></span>
          Reset Password
          <ArrowRightIcon class="btn-icon-svg" />
        </button>

        <!-- Display validation errors as simple red text below the button -->
        <span v-if="errors.length" class="button-error-text">
          <span v-for="(error, index) in errors" :key="index" style="display: block; margin-top: 0.375rem;">
            {{ error }}
          </span>
        </span>
      </form>

      <div class="auth-back-link">
        <router-link to="/">
          <ArrowLeftIcon class="back-icon-svg" />
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/api'
import '@/assets/auth.css'
import {
  LockClosedIcon, EyeIcon, EyeSlashIcon,
  ArrowRightIcon, ArrowLeftIcon, InformationCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const errors = ref([])
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  // If no reset token is found in store, the session is invalid
  if (!authStore.token) {
    errors.value = ['Required details are missing. Please start the recovery process again.']
  }
})

const resetPassword = async () => {
  loading.value = true
  errors.value = []

  if (!authStore.token) {
    errors.value = ['Required details are missing. Please start the recovery process again.']
    loading.value = false
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    errors.value = ['Passwords do not match. Please try again.']
    loading.value = false
    return
  }

  try {
    // Send newPassword and confirmPassword according to resetPasswordSchema in the backend
    await api.post('/auth/reset-password', {
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword,
    })

    // Clear reset token from store upon successful password reset
    authStore.logout()
    
    // Redirect to login page on success
    router.push({ name: 'login' })
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else if (error.response?.data?.details) {
      errors.value = error.response.data.details
    } else {
      errors.value = [error.response?.data?.message || 'Failed to reset password.']
    }
  } finally {
    loading.value = false
  }
}
</script>
