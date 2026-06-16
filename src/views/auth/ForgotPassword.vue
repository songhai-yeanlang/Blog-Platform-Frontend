<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h3 class="auth-title">Forgot Password</h3>
      <p class="auth-subtitle">Enter your email to receive a recovery OTP code.</p>

      <form @submit.prevent="sendResetOtp">
        <label class="auth-label">Email Address</label>
        <div class="auth-input-group">
          <EnvelopeIcon class="input-icon-svg" :class="{ 'icon-error': errors.length }" />
          <input
            type="email"
            placeholder="name@example.com"
            v-model="form.email"
            :class="{ 'error-field': errors.length }"
            required
          />
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          <span v-if="loading" class="auth-spinner"></span>
          Send OTP Code
        </button>

        <!-- Red error text below button -->
        <span v-if="errors.length" class="button-error-text">
          <span v-for="(error, index) in errors" :key="index" style="display: block; margin-top: 0.375rem;">
            {{ error }}
          </span>
        </span>
      </form>

      <div class="auth-footer" v-if="otpSent">
        Got the code? <router-link :to="{ name: 'verify-otp', query: { email: form.email } }">Verify OTP</router-link>
      </div>

      <div class="auth-back-link">
        <router-link to="/login">
          <ArrowLeftIcon class="back-icon-svg" />
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api'
import '@/assets/auth.css'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const loading = ref(false)
const errors = ref([])
const successMessage = ref('')
const otpSent = ref(false)

const form = reactive({
  email: '',
})

const sendResetOtp = async () => {
  loading.value = true
  errors.value = []
  successMessage.value = ''

  try {
    const response = await api.post('/users/forgot-password', form)
    successMessage.value = response.data.message || 'OTP sent to your email!'
    otpSent.value = true

    // Redirect to the verify OTP page immediately
    router.push({
      name: 'verify-otp',
      query: {
        email: form.email,
        message: successMessage.value
      }
    })
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat().map(err =>
        err === 'User not found' ? 'Email not found' : err
      )
    } else {
      let errMsg = error.response?.data?.message || 'Failed to send OTP.'
      if (errMsg === 'User not found') {
        errMsg = 'Email not found'
      }
      errors.value = [errMsg]
    }
  } finally {
    loading.value = false
  }
}
</script>
