<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-icon-circle">
        <EnvelopeOpenIcon class="circle-icon-svg" />
      </div>

      <h3 class="auth-title">Check your email</h3>
      <p class="auth-subtitle">
        We've sent a 6-digit code to your email.<br />Enter it below to verify.
      </p>



      <form @submit.prevent="verifyCode">
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
          Verify Account
          <ArrowRightIcon class="btn-icon-svg" />
        </button>

        <!-- Red error text below button -->
        <span v-if="errors.length" class="button-error-text">
          <span v-for="(error, index) in errors" :key="index" style="display: block; margin-top: 0.375rem;">
            {{ error }}
          </span>
        </span>
      </form>

      <div class="auth-resend">
        <span>Didn't receive the code?</span>
        <a href="#" @click.prevent="resendCode">
          <ArrowPathIcon class="resend-icon-svg" />
          Resend Code
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/api'
import '@/assets/auth.css'
import { EnvelopeOpenIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const errors = ref([])

const otp = reactive(['', '', '', '', '', ''])
const otpRefs = ref([])

const otpCode = computed(() => otp.join(''))

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

const verifyCode = async () => {
  loading.value = true
  errors.value = []

  try {
    await api.post('/users/verify-email', {
      email: route.query.email,
      code: otpCode.value,
    })
    router.push({ name: 'reset-password', query: { email: route.query.email, code: otpCode.value } })
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else {
      errors.value = [error.response?.data?.message || 'Verification failed.']
    }
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  errors.value = []
  try {
    await api.post('/users/forgot-password', { email: route.query.email })
  } catch (error) {
    errors.value = [error.response?.data?.message || 'Failed to resend code.']
  }
}
</script>
