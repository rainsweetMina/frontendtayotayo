<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="분실물 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          분실물 게시판
        </h2>

        <!-- 검색 및 필터 -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <select class="border rounded-md px-3 py-2">
              <option value="all">전체</option>
              <option value="found">습득물</option>
              <option value="lost">분실물</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              class="border rounded-md px-3 py-2 w-64"
            />
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              검색
            </button>
          </div>
          <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            글쓰기
          </button>
        </div>

        <!-- 게시판 목록 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  번호
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  구분
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="i in 10" :key="i" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ i }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ i % 2 === 0 ? '습득물' : '분실물' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ i % 2 === 0 ? '검은색 지갑을 주웠습니다' : '검은색 지갑을 잃어버렸습니다' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  사용자{{ i }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2024-03-{{ i }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      i % 3 === 0
                        ? 'bg-green-100 text-green-800'
                        : i % 3 === 1
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ i % 3 === 0 ? '완료' : i % 3 === 1 ? '처리중' : '대기' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div class="flex justify-center mt-4">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <a
              href="#"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              이전
            </a>
            <a
              v-for="i in 5"
              :key="i"
              href="#"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {{ i }}
            </a>
            <a
              href="#"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              다음
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '../partials/AppBreadcrumb.vue';
</script> 