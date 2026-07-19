<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none shadow-sm disabled:opacity-60 disabled:cursor-not-allowed',
      variantClasses[variant]
    ]"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4 text-current shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon -->
    <span
      v-if="icon && !loading"
      class="material-symbols-outlined text-[20px] shrink-0"
    >
      {{ icon }}
    </span>

    <!-- Button Text / Slot -->
    <span class="leading-none flex items-center">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'danger', 'outline'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
})

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary/95 border border-primary',
  secondary: 'border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-primary hover:border-primary/30',
  danger: 'bg-red-500 text-white hover:bg-red-600 border border-red-500',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white bg-transparent'
}
</script>
