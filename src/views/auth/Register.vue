<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h3 class="auth-title">Create an Account</h3>

      <form @submit.prevent="register">
        <label class="auth-label">Name</label>
        <div class="auth-input-group">
          <UserIcon class="input-icon-svg" :class="{ 'icon-error': nameError }" />
          <input 
            type="text" 
            placeholder="John Doe" 
            v-model="form.name" 
            :class="{ 'error-field': nameError }" 
            required 
          />
        </div>

        <label class="auth-label">Email Address</label>
        <div class="auth-input-group">
          <EnvelopeIcon class="input-icon-svg" :class="{ 'icon-error': emailError }" />
          <input 
            type="email" 
            placeholder="name@example.com" 
            v-model="form.email" 
            :class="{ 'error-field': emailError }" 
            required 
          />
        </div>

        <label class="auth-label">Password</label>
        <div class="auth-input-group">
          <LockClosedIcon class="input-icon-svg" :class="{ 'icon-error': passwordError }" />
          <input 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="••••••••" 
            v-model="form.password"
            class="has-toggle" 
            :class="{ 'error-field': passwordError }" 
            required 
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            <EyeSlashIcon v-if="showPassword" class="toggle-icon-svg" :class="{ 'icon-error': passwordError }" />
            <EyeIcon v-else class="toggle-icon-svg" :class="{ 'icon-error': passwordError }" />
          </button>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading" class="auth-spinner"></span>
          Create Account
        </button>

        <!-- Display all validation errors as simple red text below the button (no alert box background/borders) -->
        <span v-if="errors.length" class="button-error-text">
          <span v-for="(error, index) in errors" :key="index" style="display: block; margin-top: 0.375rem;">
            {{ error }}
          </span>
        </span>
      </form>

      <div class="auth-footer">
        Already have an account? <router-link to="/">Log in here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'
import '@/assets/css/auth.css'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const loading = ref(false)
const errors = ref([])
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
})

// Specific field errors parsed from backend response to highlight input borders
const nameError = computed(() => {
  return errors.value.find(err => err.toLowerCase().includes('name') || err.toLowerCase().includes('username')) || ''
})

const emailError = computed(() => {
  return errors.value.find(err => err.toLowerCase().includes('email')) || ''
})

const passwordError = computed(() => {
  return errors.value.find(err => err.toLowerCase().includes('password')) || ''
})

const register = async () => {
  loading.value = true
  errors.value = []

  try {
    await api.post('/auth/register', form)
    // Redirect directly to the login page on success
    router.push({ name: 'login' })
  } catch (error) {
    if (error.response?.data?.details) {
      errors.value = error.response.data.details
    } else if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else {
      errors.value = [error.response?.data?.message || 'Registration failed.']
    }
  } finally {
    loading.value = false
  }
}
</script>
