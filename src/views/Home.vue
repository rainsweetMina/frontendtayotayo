<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">타요타요</h1>
            </div>
          </div>
          <div class="flex items-center">
            <router-link
              to="/admin/dashboard"
              class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              관리자 페이지
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              타요타요에 오신 것을 환영합니다
            </h2>
            <p class="text-gray-600">
              타요타요는 편리한 버스 운행 정보를 제공하는 서비스입니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// No additional logic needed for now
</script> 