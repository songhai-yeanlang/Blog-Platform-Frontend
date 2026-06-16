<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h3 class="auth-title">Login Account</h3>

      <div v-if="successMessage" class="auth-success-box">
        <CheckCircleIcon class="success-icon-svg" />
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="login">
        <label class="auth-label">Email</label>
        <div class="auth-input-group">
          <EnvelopeIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            type="email"
            placeholder="Enter your email"
            v-model="form.email"
            :class="{ 'error-field': errors.length }"
            required
          />
        </div>

        <label class="auth-label">Password</label>
        <div class="auth-input-group">
          <LockClosedIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            v-model="form.password"
            class="has-toggle"
            :class="{ 'error-field': errors.length }"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <EyeSlashIcon v-if="showPassword" class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
            <EyeIcon v-else class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
          </button>
        </div>

        <div class="auth-forgot-row">
          <router-link to="/forgot-password" class="auth-link">Forgot password?</router-link>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading" class="auth-spinner"></span>
          Sign In
        </button>

        <!-- Red error text below button -->
        <span v-if="errors.length" class="button-error-text">
          <span v-for="(error, index) in errors" :key="index" style="display: block; margin-top: 0.375rem;">
            {{ error }}
          </span>
        </span>
      </form>

      <div class="auth-footer">
        New to TripDhaka? <router-link to="/register">Create an account</router-link>
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
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const errors = ref([])
const showPassword = ref(false)
const successMessage = ref('')

const form = reactive({
  email: '',
  password: '',
})

onMounted(() => {
  if (route.query.message) {
    successMessage.value = route.query.message
  }
})

const login = async () => {
  loading.value = true
  errors.value = []

  try {
    const response = await api.post('/users/login', form)
    authStore.setToken(response.data.data.token)
    authStore.setUser(response.data.data.user)
    router.push('/')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else {
      errors.value = [error.response?.data?.message || 'Login failed.']
    }
  } finally {
    loading.value = false
  }
}
</script>
