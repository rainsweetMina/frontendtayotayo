<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 pt-16">
        <div class="container mx-auto px-6 py-8">
          <slot />
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './AppSidebar.vue'
import Header from './AppHeader.vue'
import Footer from './AppFooter.vue'
</script>
