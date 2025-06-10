<template>
  <Modal @close="$emit('close')">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">정보 수정</h2>
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 gap-3 text-sm">
          <div>
            <label class="block font-medium">물품명:</label>
            <input v-model="form.itemName" class="form-input w-full" required />
          </div>

          <div>
            <label class="block font-medium">버스회사:</label>
            <input v-model="form.busCompany" class="form-input w-full" required />
          </div>

          <div>
            <label class="block font-medium">버스번호:</label>
            <input v-model="form.busNumber" class="form-input w-full" required />
          </div>

          <div>
            <label class="block font-medium">습득일:</label>
            <input v-model="form.foundTime" type="date" class="form-input w-full" required />
          </div>

          <div>
            <label class="block font-medium">습득 장소:</label>
            <input v-model="form.foundPlace" class="form-input w-full" />
          </div>

          <div>
            <label class="block font-medium">내용:</label>
            <textarea v-model="form.content" class="form-textarea w-full" />
          </div>

          <div>
            <label class="block font-medium">보관 위치:</label>
            <input v-model="form.storageLocation" class="form-input w-full" />
          </div>

          <div>
            <label class="block font-medium">연락처:</label>
            <input v-model="form.handlerContact" class="form-input w-full" />
          </div>

          <div>
            <label class="block font-medium">이메일:</label>
            <input v-model="form.handlerEmail" type="email" class="form-input w-full" />
          </div>

          <div>
            <label class="block font-medium">상태:</label>
            <select v-model="form.status" class="form-select w-full">
              <option value="IN_STORAGE">보관중</option>
              <option value="RETURNED">수령완료</option>
            </select>
          </div>

          <div>
            <label class="block font-medium">분실물 ID (매칭용):</label>
            <input v-model="matchLostId" class="form-input w-full" placeholder="예: 10 (선택)" />
          </div>
        </div>

        <div class="mt-6 text-right space-x-2">
          <button
              type="button"
              class="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              @click="matchWithLostItem"
          >
            매칭
          </button>
          <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'
import Modal from '@/modules/lostFound/components/Modal.vue'
// import { updateFoundItem, matchFoundWithLost } from '@/modules/lostFound/api/foundAdmin'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['close', 'updated'])

const form = reactive({ ...props.item })
// const matchLostId = ref('')

watch(() => props.item, (newVal) => {
  Object.assign(form, newVal)
})

const submitForm = async () => {
  try {
    await updateFoundItem(form.id, form)
    emit('updated')
    emit('close')
  } catch (e) {
    console.error('수정 실패:', e)
  }
}

const matchWithLostItem = async () => {
  try {
    await matchFoundWithLost(form.id, matchLostId.value)
    emit('updated')
    emit('close')
  } catch (e) {
    console.error('매칭 실패:', e)
  }
}
</script>
