<template>
  <div class="container py-4">
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">📦 습득물 등록</h5>
        <button
            @click="goBack"
            class="btn btn-outline-secondary btn-sm"
        >
          <i class="bi bi-arrow-left me-1"></i> 목록으로
        </button>
      </div>
      <FoundItemForm @submitted="handleSubmit" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import { registerFoundItem } from '@/modules/lostFound/api/foundAdmin'

const router = useRouter()

const goBack = () => {
  router.push('/admin/found')
}

// 🔥 여기서 dto, image를 파라미터로 받는다!
const handleSubmit = async ({ dto, image }) => {
  try {
    const formData = new FormData();
    formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
    );
    if (image) {
      formData.append("image", image);
    }
    await registerFoundItem(formData); // API 호출

    alert("등록 완료!");              // ✅ 알림
    router.push('/admin/found');      // ✅ 목록으로 이동
  } catch (e) {
    alert("저장 실패: " + (e.response?.data?.message || e.message));
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
