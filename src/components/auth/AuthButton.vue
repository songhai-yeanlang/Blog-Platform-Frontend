<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="auth-btn"
  >
    <span v-if="loading" class="auth-spinner"></span>
    <slot />
    <i v-if="icon && !loading" :class="`bi ${icon}`"></i>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'submit',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>
