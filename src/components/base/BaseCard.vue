<template>
    <article
        class="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col group relative">
        <!-- Card-click loading overlay -->
        <div v-if="navigating"
            class="absolute inset-0 z-20 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-2xl">
            <svg class="animate-spin h-7 w-7 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </div>

        <!-- Cover image & Overlay -->
        <div class="relative h-48 overflow-hidden cursor-pointer shrink-0" @click="emit('click-card', post.id)">
            <!-- Category badge -->
            <span v-if="post.category_name"
                class="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm tracking-widest uppercase">
                {{ post.category_name }}
            </span>

            <!-- Favorite button -->
            <button v-if="showFavoriteButton" type="button" @click.stop="emit('toggle-favorite', post.id)"
                class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-red-500 shadow-sm transition-all hover:scale-105 border-none cursor-pointer outline-none">
                <span class="material-symbols-outlined text-[14px]" :class="{ 'fill-icon': isFavorite }">
                    favorite
                </span>
            </button>

            <img :src="resolveBlogImageUrl(post.image)" :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <!-- Card body -->
        <div class="p-4 flex flex-col flex-1">
            <!-- Date & Views -->
            <div class="flex  flex-wrap items-center gap-1.5 text-[10px] text-gray-400 mb-1.5">
                <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">calendar_today</span>
                    {{ formatDate(post.created_at) }}
                </span>
                <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                <div class="flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[11px] leading-none select-none">visibility</span>
                    <span class="leading-none">{{ post.views ?? 0 }} views</span>
                </div>
            </div>

            <!-- Title -->
            <h3 class="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                @click="emit('click-card', post.id)">
                {{ post.title }}
            </h3>

            <!-- Content snippet -->
            <p class="text-gray-400 text-[12px] line-clamp-2 mb-3 leading-normal flex-1">
                {{ stripHtmlTags(post.content) }}
            </p>

            <!-- Tags list -->
            <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1 mb-3 items-center">
                <span v-for="tag in post.tags.slice(0, 3)" :key="tag.id"
                    class="text-[10px] bg-blue-50 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                    #{{ tag.name }}
                </span>
                <span v-if="post.tags.length > 3"
                    class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap font-semibold cursor-help"
                    :title="post.tags.slice(3).map(t => '#' + t.name).join(', ')">
                    +{{ post.tags.length - 3 }}
                </span>
            </div>

            <!-- Footer slot: Author profile OR Actions signature -->
            <router-link
                v-if="showAuthor"
                :to="post.author_account_id ? '/user-profile/' + post.author_account_id : '#'"
                class="flex items-center gap-2 pt-2.5 border-t border-gray-100 mt-auto hover:opacity-80 transition-opacity cursor-pointer group/author no-underline"
            >
                <div
                    class="w-7 h-7 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                    <img v-if="post.author_avatar" :src="resolveAvatarUrl(post.author_avatar, post.author_name)"
                        class="w-full h-full object-cover" alt="author avatar" />
                    <span v-else class="text-xs font-bold text-primary uppercase">
                        {{ post.author_name ? post.author_name[0] : 'A' }}
                    </span>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-800 leading-none group-hover/author:text-primary transition-colors">
                        {{ post.author_name || 'Anonymous' }}
                    </p>
                </div>
            </router-link>

            <!-- Actions Row for owner management -->
            <div v-if="showActions" class="flex justify-end pt-3 border-t border-gray-100 mt-auto">
                <div class="flex items-center gap-2">
                    <button type="button" @click.stop="emit('edit', post.id)"
                        class="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0">
                        <span class="material-symbols-outlined text-[15px]">edit</span>
                        Edit
                    </button>
                    <button type="button" @click.stop="emit('delete', post)"
                        class="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0">
                        <span class="material-symbols-outlined text-[15px]">delete</span>
                        Delete
                    </button>
                </div>
            </div>

        </div>
    </article>
</template>

<script setup>
import { resolveAvatarUrl } from '@/utils/avatar'

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    showFavoriteButton: {
        type: Boolean,
        default: true,
    },
    navigating: {
        type: Boolean,
        default: false,
    },
    showAuthor: {
        type: Boolean,
        default: true,
    },
    showActions: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['click-card', 'toggle-favorite', 'edit', 'delete'])

const resolveBlogImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
    return `${base}${path}`
}

const stripHtmlTags = (str) => {
    if (!str) return ''
    return str.replace(/<\/?[^>]+(>|$)/g, '')
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}
</script>
