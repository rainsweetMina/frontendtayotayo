<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">게시글 현황</h3>
      
      <div class="grid grid-cols-3 gap-4">
        <!-- 공지사항 -->
        <div class="bg-blue-50 p-3 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">공지사항</p>
                <p class="text-xs text-gray-500">총 {{ stats.notices.total }}개</p>
              </div>
            </div>
            <div class="bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800">
              +{{ stats.notices.today }}
            </div>
          </div>
        </div>
        
        <!-- Q&A -->
        <div class="bg-green-50 p-3 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Q&A</p>
                <p class="text-xs text-gray-500">
                  총 {{ stats.qna.total }}개
                  <span class="text-xs text-gray-400"></span>
                </p>
              </div>
            </div>
            <div class="bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-800">
              +{{ stats.qna.today }}
            </div>
          </div>
        </div>
        
        <!-- 광고 -->
        <div class="bg-purple-50 p-3 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">광고</p>
                <p class="text-xs text-gray-500">
                  총 {{ stats.advertisements.total }}개
                  <span class="text-xs text-gray-400"></span>
                </p>
              </div>
            </div>
            <div class="bg-purple-100 rounded-full px-3 py-1 text-sm font-semibold text-purple-800">
              +{{ stats.advertisements.today }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      notices: { today: 0, total: 0 },
      qna: { today: 0, total: 0 },
      advertisements: { today: 0, total: 0 }
    })
  }
});
</script> 