<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h3 class="auth-title">Login Account</h3>

      <div v-if="successMessage" class="auth-success-box">
        <CheckCircleIcon class="success-icon-svg" />
        <span>{{ successMessage }}</span>
      </div>

      <form @submit.prevent="login" autocomplete="on">
        <label class="auth-label">Email</label>
        <div class="auth-input-group">
          <EnvelopeIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            v-model="form.email"
            autocomplete="email"
            :class="{ 'error-field': errors.length }"
            required
          />
        </div>

        <label class="auth-label">Password</label>
        <div class="auth-input-group">
          <LockClosedIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            :type="showPassword ? 'text' : 'password'"
            name="password"
            placeholder="••••••••"
            v-model="form.password"
            autocomplete="current-password"
            class="has-toggle"
            :class="{ 'error-field': errors.length }"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <EyeSlashIcon v-if="showPassword" class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
            <EyeIcon v-else class="toggle-icon-svg" :class="{ 'icon-error': errors.length }" />
          </button>
        </div>

        <!-- Remember me + Forgot password row -->
        <div class="auth-forgot-row" style="display: flex; align-items: center; justify-content: space-between;">
          <label class="remember-me-label">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="remember-me-checkbox"
            />
            <span>Remember me</span>
          </label>
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
        New to Blog-Platform? <router-link to="/register">Create an account</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import api from '@/api/api'
import '@/assets/css/auth.css'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const REMEMBER_KEY = 'login_remember_email'
const REMEMBER_PASS_KEY = 'login_remember_password'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()
const loading = ref(false)
const errors = ref([])
const showPassword = ref(false)
const successMessage = ref('')
const rememberMe = ref(false)

const form = reactive({
  email: '',
  password: '',
})

onMounted(() => {
  if (route.query.message) {
    successMessage.value = route.query.message
  }

  // Restore remembered email and password
  const savedEmail = localStorage.getItem(REMEMBER_KEY)
  const savedPass = localStorage.getItem(REMEMBER_PASS_KEY)
  if (savedEmail) {
    form.email = savedEmail
    rememberMe.value = true
  }
  if (savedPass) {
    try {
      form.password = atob(savedPass)
    } catch {
      // ignore
    }
  }
})

const login = async () => {
  loading.value = true
  errors.value = []

  try {
    const response = await api.post('/auth/login', form)
    authStore.setToken(response.data.data.token)
    authStore.setUser(response.data.data.user)

    // Save or clear remembered email and password
    if (rememberMe.value) {
      localStorage.setItem(REMEMBER_KEY, form.email)
      localStorage.setItem(REMEMBER_PASS_KEY, btoa(form.password))
    } else {
      localStorage.removeItem(REMEMBER_KEY)
      localStorage.removeItem(REMEMBER_PASS_KEY)
    }

    // Ask the browser to save credentials via the Credential Management API
    if (window.PasswordCredential) {
      try {
        const cred = new PasswordCredential({
          id: form.email,
          password: form.password,
          name: authStore.user?.name || form.email,
        })
        await navigator.credentials.store(cred)
      } catch {
        // Silently ignore – not all browsers support this
      }
    }

    toastStore.success('Logged in successfully!')
    router.push('/dashboard')
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

