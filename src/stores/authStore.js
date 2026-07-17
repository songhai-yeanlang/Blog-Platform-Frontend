import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMyProfile } from '@/api/api'

export const useAuthStore = defineStore('auth', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // ─── Mutations ────────────────────────────────────────────────────────────
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (newUser) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  /**
   * Fetch the authenticated user's profile from the server and sync it to the
   * store + localStorage. Logs the user out if the token is invalid / expired.
   */
  const fetchProfile = async () => {
    if (!token.value) return

    // Do not fetch profile on public/auth paths (like verify-otp, change-password, etc.)
    const path = window.location.pathname
    const isAuthPath = ['/', '/register', '/forgot-password', '/verify-otp', '/change-password', '/verify-email'].includes(path)
    if (isAuthPath) return

    try {
      const { data } = await getMyProfile()
      setUser(data.data)
    } catch (err) {
      const status  = err?.response?.status
      const message = err?.response?.data?.message ?? err.message
      console.warn('[AuthStore] fetchProfile failed:', message)

      // Only clear the session when the token is actually rejected by the server.
      // Network errors, 500s, etc. should NOT log the user out.
      if (status === 401) {
        logout()
      }
    }
  }

  return { token, user, setToken, setUser, logout, fetchProfile }
})
