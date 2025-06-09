<template>
  <div class="card p-4 bg-light">
    <h5 class="text-center mb-4">분실물 상세 정보</h5>

    <div class="mb-3">
      <label class="form-label fw-bold">분실물</label>
      <input class="form-control" :value="item?.title || '-'" readonly />
    </div>

    <div class="mb-3">
      <label class="form-label fw-bold">분실일</label>
      <input class="form-control" :value="formatDate(item?.lostTime)" readonly />
    </div>

    <div class="mb-3">
      <label class="form-label fw-bold">버스 회사</label>
      <input class="form-control" :value="item?.busCompany || '-'" readonly />
    </div>

    <div class="mb-3">
      <label class="form-label fw-bold">노선번호</label>
      <input class="form-control" :value="item?.busNumber || '-'" readonly />
    </div>

    <div class="mb-3">
      <label class="form-label fw-bold">내용</label>
      <textarea class="form-control" :value="item?.content || '-'" readonly rows="4" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object
});

defineEmits(['close']);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
};
</script>
