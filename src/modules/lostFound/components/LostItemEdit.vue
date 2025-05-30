<template>
  <div class="p-3">
    <h5 class="mb-3">분실물 수정</h5>
    <LostItemForm :initialData="item" @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import LostItemForm from './LostItemForm.vue';
import { updateLostItem } from '@/modules/lostFound/api/lostFound';

const props = defineProps({
  item: Object, // 수정할 기존 데이터
});

const emit = defineEmits(['updated', 'close']);

const handleSubmit = async (formData) => {
  await updateLostItem(props.item.id, formData);
  alert('수정되었습니다.');
  emit('updated'); // 부모에서 목록 다시 불러오게 하기 위함
  emit('close');   // 모달 닫기
};
</script>

<style scoped>
.p-3 {
  max-width: 800px;
}
</style>
