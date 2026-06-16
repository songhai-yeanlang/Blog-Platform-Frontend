<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h3 class="auth-title">Verify OTP</h3>
      <p class="auth-subtitle">Enter the 6-digit recovery code sent to your email.</p>

      <form @submit.prevent="verifyOtp">
        <label class="auth-label">OTP Code</label>
        <div class="otp-container">
          <input
            v-for="(_, index) in otp"
            :key="index"
            :ref="el => (otpRefs[index] = el)"
            type="text"
            maxlength="1"
            :class="['otp-input', otp[index] ? 'filled' : '', errors.length ? 'error-field' : '']"
            v-model="otp[index]"
            @input="onOtpInput(index)"
            @keydown.backspace="onOtpBackspace(index, $event)"
            @paste="onOtpPaste($event)"
          />
        </div>

        <button type="submit" class="auth-btn" :disabled="loading || otpCode.length < 6">
          <span v-if="loading" class="auth-spinner"></span>
          Verify Code
         
        </button>

        <!-- Display validation errors as simple red text below the button (no alert box background/borders) -->
        <span v-if="errors.length" class="button-error-text">
          <span v-for="(error, index) in errors" :key="index" style="display: block; margin-top: 0.375rem;">
            {{ error }}
          </span>
        </span>
      </form>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/api'
import '@/assets/auth.css'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const errors = ref([])

const otp = reactive(['', '', '', '', '', ''])
const otpRefs = ref([])
const otpCode = computed(() => otp.join(''))

const email = ref('')

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email
  }
})

const onOtpInput = (index) => {
  if (otp[index] && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

const onOtpBackspace = (index, event) => {
  if (!otp[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

const onOtpPaste = (event) => {
  const paste = event.clipboardData.getData('text').trim()
  if (/^\d{6}$/.test(paste)) {
    for (let i = 0; i < 6; i++) {
      otp[i] = paste[i]
    }
    otpRefs.value[5]?.focus()
    event.preventDefault()
  }
}

const verifyOtp = async () => {
  loading.value = true
  errors.value = []

  if (otpCode.value.length < 6) {
    errors.value = ['Please enter the complete 6-digit code.']
    loading.value = false
    return
  }

  try {
    // Verify the OTP with the backend. Send ONLY the otp parameter to avoid Joi unknown key validation errors.
    const response = await api.post('/users/verify-otp', {
      otp: otpCode.value,
    })

    // Store the returned reset token in authStore so it is sent in the Authorization header for reset-password
    if (response.data?.data?.token) {
      authStore.setToken(response.data.data.token)
    }

    // Only redirect on success
    router.push({
      name: 'reset-password',
      query: {
        email: email.value,
        otp: otpCode.value,
      },
    })
  } catch (error) {
    // Always show a clear, friendly message for wrong/expired OTP
    errors.value = ['OTP is invalid']

    // Clear all OTP boxes so the user can re-enter a new code
    for (let i = 0; i < 6; i++) {
      otp[i] = ''
    }
    // Focus back on the first box
    otpRefs.value[0]?.focus()
  } finally {
    loading.value = false
  }
}
</script>
