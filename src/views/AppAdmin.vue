<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="Admin" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize">
          Admin Dashboard
        </h2>

        <div class="mt-4">
          <p class="text-gray-600">
            Welcome to the admin dashboard. This is a protected route.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '../partials/AppBreadcrumb.vue';
</script> 