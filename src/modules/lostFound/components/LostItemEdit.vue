<template>
  <LostItemForm :initialData="item" @submit="handleSubmit" />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import LostItemForm from './LostItemForm.vue';
import { updateLostItem } from '@/modules/lostFound/api/lostFound';

const props = defineProps({ item: Object });
const emit = defineEmits(['updated', 'close']);

const handleSubmit = async (formData) => {
  await updateLostItem(props.item.id, formData);
  alert('수정되었습니다.');
  emit('updated');
  emit('close');
};
</script>


<style scoped>
.modal-body {
  padding: 1.5rem;
}
</style>
