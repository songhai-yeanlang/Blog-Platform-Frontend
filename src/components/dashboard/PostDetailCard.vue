<template>
  <div
    class="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/80 transition-all duration-300">
    <!-- Post Image Container -->
    <div class="relative h-64 md:h-[400px] overflow-hidden bg-gray-50">
      <img :src="resolveBlogImageUrl(post.image)" :alt="post.title" class="w-full h-full object-cover" />
      <!-- Glassmorphic back overlay & favorite toggle -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none">
      </div>

      <button @click="$emit('back')"
        class="absolute top-5 left-5 z-10 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:text-primary hover:bg-white transition-all shadow-sm border-none outline-none cursor-pointer text-xs font-semibold">
        <span class="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>Back</span>
      </button>

      <button @click="handleToggleFavorite"
        class="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-sm border-none outline-none cursor-pointer">
        <span class="material-symbols-outlined text-[18px]" :class="{ 'fill-icon text-red-500': isFavoriteState }">
          favorite
        </span>
      </button>
    </div>

    <!-- Post Details Body -->
    <div class="p-6 md:p-10">
      <!-- Category and Metadata -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <span v-if="post.category_name"
            class="bg-blue-50 text-primary text-[11px] font-bold px-3 py-1 rounded-md tracking-wider uppercase">
            {{ post.category_name }}
          </span>
          <span class="text-xs text-gray-400 font-medium">{{ formatDate(post.created_at) }}</span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Views -->
          <div class="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            <span class="material-symbols-outlined text-[13px] align-middle select-none">visibility</span>
            <span class="align-middle font-medium">{{ post.views ?? 0 }} views</span>
          </div>

          <!-- Owner Actions -->
          <div v-if="isOwner" class="flex items-center gap-2 border-l border-gray-200 pl-3">
            <router-link :to="`/edit-post/${post.id}`"
              class="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors font-medium">
              <span class="material-symbols-outlined text-[15px]">edit</span>
              <span>Edit</span>
            </router-link>
            <button @click="$emit('delete', post)"
              class="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0 font-medium outline-none">
              <span class="material-symbols-outlined text-[15px]">delete</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
        {{ post.title }}
      </h1>

      <!-- Author block -->
      <div class="flex items-center gap-3 mb-8 p-4 rounded-xl bg-gray-50/50 border border-gray-100/60">
        <div
          class="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-gray-100 flex items-center justify-center shrink-0 shadow-sm">
          <img v-if="post.author_avatar" :src="resolveAvatarUrl(post.author_avatar)" class="w-full h-full object-cover"
            alt="author" />
          <span v-else class="text-sm font-bold text-primary uppercase">
            {{ post.author_name ? post.author_name[0] : 'A' }}
          </span>
        </div>
        <div>
          <p class="text-sm font-bold text-gray-800">{{ post.author_name || 'Anonymous' }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Author / Contributor</p>
        </div>
      </div>

      <!-- Main Content Block -->
      <article
        class="prose prose-blue max-w-none text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line mb-8">
        {{ post.content }}
      </article>

      <!-- Tags Block -->
      <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
        <span v-for="tag in post.tags" :key="tag.id"
          class="text-[11px] font-medium bg-blue-50/70 text-primary px-3 py-1 rounded-full border border-blue-100/40">
          #{{ tag.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

defineEmits(['back', 'delete'])

const authStore = useAuthStore()

const isOwner = computed(() => {
  return authStore.user && props.post && authStore.user.id === props.post.user_id
})

const favorites = ref(JSON.parse(localStorage.getItem('blog_favorites') || '[]'))
const isFavoriteState = ref(favorites.value.includes(props.post.id))

const handleToggleFavorite = () => {
  const currentFavs = JSON.parse(localStorage.getItem('blog_favorites') || '[]')
  let updatedFavs = []
  if (currentFavs.includes(props.post.id)) {
    updatedFavs = currentFavs.filter(id => id !== props.post.id)
    isFavoriteState.value = false
  } else {
    updatedFavs = [...currentFavs, props.post.id]
    isFavoriteState.value = true
  }
  localStorage.setItem('blog_favorites', JSON.stringify(updatedFavs))
}

const resolveAvatarUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
  return `${base}${path}`
}

const resolveBlogImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
  return `${base}${path}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
