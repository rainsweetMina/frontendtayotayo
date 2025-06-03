<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label class="form-label">물품명</label>
      <input class="form-control" v-model="form.itemName" required />
    </div>

    <div class="mb-3">
      <label class="form-label">버스회사</label>
      <select class="form-select" v-model="form.busCompanyId" required>
        <option value="" disabled>선택</option>
        <option v-for="company in busCompanies" :key="company.id" :value="company.id">
          {{ company.companyName }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">노선번호</label>
      <select class="form-select" v-model="form.busNumber" required>
        <option value="" disabled>선택</option>
        <option v-for="route in busRoutes" :key="route" :value="route">
          {{ route }}
        </option>
      </select>
    </div>

    <div class="mb-3"><label class="form-label">습득일</label><input type="date" class="form-control" v-model="form.foundTime" required /></div>
    <div class="mb-3"><label class="form-label">습득장소</label><input class="form-control" v-model="form.foundPlace" /></div>
    <div class="mb-3"><label class="form-label">보관장소</label><input class="form-control" v-model="form.storageLocation" /></div>
    <div class="mb-3"><label class="form-label">연락처</label><input class="form-control" v-model="form.handlerContact" /></div>
    <div class="mb-3"><label class="form-label">이메일</label><input type="email" class="form-control" v-model="form.handlerEmail" /></div>
    <div class="mb-3">
      <label class="form-label">상태</label>
      <select class="form-select" v-model="form.status">
        <option value="KEEPING">보관중</option>
        <option value="RETURNED">수령완료</option>
      </select>
    </div>
    <div class="mb-3"><label class="form-label">내용</label><textarea class="form-control" v-model="form.content" /></div>
    <div class="mb-3"><label class="form-label">사진 (필수)</label><input class="form-control" type="file" ref="imageInput" accept="image/*" /></div>

    <div class="text-end"><button type="submit" class="btn btn-primary">저장</button></div>
  </form>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import {
  registerFoundItem,
  updateFoundItem,
  getBusCompanies,
  getBusRoutesByCompany
} from '@/modules/lostFound/api/foundAdmin';

const props = defineProps({ item: Object });
const emit = defineEmits(['submitted']);

const busCompanies = ref([]);
const busRoutes = ref([]);
const imageInput = ref(null);

const form = reactive({
  id: null,
  itemName: '',
  busCompanyId: '',  // 선택한 버스회사 ID
  busNumber: '',
  foundTime: '',
  foundPlace: '',
  content: '',
  storageLocation: '',
  handlerContact: '',
  handlerEmail: '',
  status: 'KEEPING',
});

onMounted(async () => {
  try {
    const { data } = await getBusCompanies();
    busCompanies.value = data;
  } catch (e) {
    alert('버스회사 목록 불러오기 실패');
  }
});

watch(
    () => form.busCompanyId,
    async (id) => {
      if (!id) {
        busRoutes.value = [];
        return;
      }
      try {
        const { data } = await getBusRoutesByCompany(id);
        busRoutes.value = data;
      } catch (e) {
        alert('노선 목록 불러오기 실패');
      }
    }
);

watch(
    () => props.item,
    (val) => {
      if (val) {
        form.id = val.id;
        form.itemName = val.itemName;
        form.busNumber = val.busNumber;
        form.foundTime = val.foundTime?.split('T')[0] ?? '';
        form.foundPlace = val.foundPlace;
        form.content = val.content;
        form.storageLocation = val.storageLocation;
        form.handlerContact = val.handlerContact;
        form.handlerEmail = val.handlerEmail;
        form.status = val.status;

        const matched = busCompanies.value.find(c => c.companyName === val.busCompany);
        form.busCompanyId = matched?.id || '';
      } else {
        Object.assign(form, {
          id: null,
          itemName: '',
          busCompanyId: '',
          busNumber: '',
          foundTime: '',
          foundPlace: '',
          content: '',
          storageLocation: '',
          handlerContact: '',
          handlerEmail: '',
          status: 'KEEPING',
        });
      }
    },
    { immediate: true }
);

const handleSubmit = async () => {
  const imageFile = imageInput.value?.files[0];
  if (!imageFile && !form.id) {
    alert('이미지는 필수입니다.');
    return;
  }

  const formData = new FormData();

  // ✅ busCompanyId를 busCompany(이름)로 변환하여 전송
  const selected = busCompanies.value.find(c => c.id === form.busCompanyId);
  if (!selected) {
    alert('유효한 버스회사를 선택해주세요.');
    return;
  }

  formData.append('busCompany', selected.companyName); // ⬅️ DTO에 맞는 필드
  for (const key in form) {
    if (key !== 'busCompanyId' && form[key] !== null && form[key] !== undefined) {
      formData.append(key, form[key]);
    }
  }

  if (imageFile) formData.append('image', imageFile);

  try {
    if (form.id) {
      await updateFoundItem(form.id, formData);
      alert('수정 완료');
    } else {
      await registerFoundItem(formData);
      alert('등록 완료');
    }
    emit('submitted');
  } catch (e) {
    alert('저장 실패: ' + (e.response?.data?.message || '오류 발생'));
  }
};
</script>

<style scoped>
form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
