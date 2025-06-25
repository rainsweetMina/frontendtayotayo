<template>
  <FoundItemForm @submitted="handleSubmit" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import { registerFoundItem } from '@/modules/lostFound/api/foundAdmin'

const router = useRouter()

const handleSubmit = () => {
  router.push('/admin/found')
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
