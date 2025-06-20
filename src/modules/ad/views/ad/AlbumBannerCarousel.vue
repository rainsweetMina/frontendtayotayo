<template>
  <div class="relative w-full h-[200px] md:h-[220px] rounded-xl overflow-hidden">
    <!-- 슬라이드 이미지 영역 -->
    <div class="w-full h-full flex transition-transform duration-500"
         :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(ad, idx) in banners" :key="ad.id" class="min-w-full relative cursor-pointer group"
           @click="goToAdLink(ad.linkUrl)">
        <img :src="`${IMAGE_BASE_URL}/ad/${ad.imageUrl}`"
             :alt="ad.title"
             class="w-full h-full object-contain bg-white" />
<!--        <div class="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-400/40 flex flex-col justify-center text-white p-6">-->
<!--          <h3 class="text-sm mb-2">{{ formatDate(ad.startDate) }} ~ {{ formatDate(ad.endDate) }}</h3>-->
<!--          <h2 class="text-2xl font-bold mb-2">{{ ad.title }}</h2>-->
<!--          <p class="text-base">{{ ad.description }}</p>-->
<!--        </div>-->
      </div>
    </div>
    <!-- 좌우 버튼 -->
    <button @click="prev" class="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white z-10">
      <svg class="w-5 h-5 text-blue-800" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button @click="next" class="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white z-10">
      <svg class="w-5 h-5 text-blue-800" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <!-- 인디케이터(동그라미) -->
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
      <span
          v-for="(ad, idx) in banners"
          :key="ad.id"
          :class="['w-2 h-2 rounded-full', idx === currentIndex ? 'bg-blue-600' : 'bg-white/70 border']"
          @click="goTo(idx)"
          style="cursor:pointer"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ banners: { type: Array, default: () => [] } })
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const currentIndex = ref(0)

// 좌우 이동 함수
function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length
}
function next() {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length
}
function goTo(idx) {
  currentIndex.value = idx
}
function goToAdLink(url) {
  if (url) window.open(url, '_blank')
}
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${(d.getMonth()+1).toString().padStart(2,'0')}.${d.getDate().toString().padStart(2,'0')}`
}

// 자동 롤링(3초마다)
let interval = null
watch(
    () => props.banners.length,
    (len) => {
      if (interval) clearInterval(interval)
      if (len > 1) {
        interval = setInterval(() => next(), 3500)
      }
    },
    { immediate: true }
)
</script>
