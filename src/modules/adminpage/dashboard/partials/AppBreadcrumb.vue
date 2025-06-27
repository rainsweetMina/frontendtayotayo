<template>
  <div class="flex items-center text-sm text-gray-500 mb-4">
    <router-link to="/admin/dashboard" class="hover:text-blue-600">Dashboard</router-link>
    <span class="mx-2">&gt;</span>
    <span class="text-gray-800">{{ breadcrumb }}</span>
  </div>
</template>

<script setup>
defineProps({
  breadcrumb: {
    type: String,
    required: true
  }
});
</script> 