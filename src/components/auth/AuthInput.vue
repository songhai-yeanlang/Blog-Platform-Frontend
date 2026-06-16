<template>
  <div class="auth-input-group">
    <slot name="icon"></slot>
    <input
      :id="id"
      :type="inputType"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      :class="[hasToggle ? 'has-toggle' : '']"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="hasToggle"
      type="button"
      class="toggle-password"
      @click="toggleVisible"
    >
      <EyeSlashIcon v-if="visible" class="toggle-icon-svg" />
      <EyeIcon v-else class="toggle-icon-svg" />
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  id: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  modelValue: String,
  required: Boolean,
})

defineEmits(['update:modelValue'])

const visible = ref(false)
const hasToggle = computed(() => props.type === 'password')
const inputType = computed(() => {
  if (props.type === 'password') return visible.value ? 'text' : 'password'
  return props.type
})

const toggleVisible = () => {
  visible.value = !visible.value
}
</script>
