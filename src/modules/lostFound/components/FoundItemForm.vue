<template>
  <div>
    <div v-if="!authStore.isAuthenticated" class="alert alert-warning">
      <i class="bi bi-exclamation-triangle me-2"></i>
      관리자 로그인이 필요한 기능입니다.
    </div>
    <form v-else @submit.prevent="handleSubmit">
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

      <div class="mb-3">
        <label class="form-label">습득일</label>
        <input type="date" class="form-control" v-model="form.foundTime" required />
      </div>

      <div class="mb-3">
        <label class="form-label">습득장소</label>
        <input class="form-control" v-model="form.foundPlace" />
      </div>

      <div class="mb-3">
        <label class="form-label">보관장소</label>
        <input class="form-control" v-model="form.storageLocation" />
      </div>

      <div class="mb-3">
        <label class="form-label">연락처</label>
        <input class="form-control" v-model="form.handlerContact" />
      </div>

      <div class="mb-3">
        <label class="form-label">이메일</label>
        <input type="email" class="form-control" v-model="form.handlerEmail" />
      </div>

      <div class="mb-3">
        <label class="form-label">내용</label>
        <textarea class="form-control" v-model="form.content" />
      </div>

      <div class="mb-3">
        <label class="form-label">사진 {{ props.item ? '' : '(필수)' }}</label>
        <input
            class="form-control"
            type="file"
            accept="image/*"
            :required="!props.item"
            ref="fileInput"
            @change="handleFileChange"
        />
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary">저장</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import {
  registerFoundItem,
  updateFoundItem,
  getBusCompanies,
  getBusRoutesByCompany
} from '@/modules/lostFound/api/foundAdmin';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({ item: Object });
const emit = defineEmits(['submitted']);

const authStore = useAuthStore();
const busCompanies = ref([]);
const busRoutes = ref([]);
const imageFile = ref(null);
const fileInput = ref(null);

const form = reactive({
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
});

onMounted(async () => {
  try {
    const { data } = await getBusCompanies();
    busCompanies.value = data;
  } catch (e) {
    alert('버스회사 목록 불러오기 실패');
  }
});

watch(() => form.busCompanyId, async (id) => {
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
});

watch(() => props.item, (val) => {
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
    });
  }
}, { immediate: true });

const handleFileChange = (e) => {
  const file = e.target?.files?.[0];
  if (file) {
    imageFile.value = file;
  }
};

const handleSubmit = async () => {
  console.log("🔥 저장 버튼 클릭됨");
  try {
    const formData = new FormData();

    // 필수 입력 확인
    if (!form.itemName || !form.busCompanyId || !form.busNumber || !form.foundTime) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 버스회사 이름 얻기
    const selected = busCompanies.value.find(c => c.id === form.busCompanyId);
    if (!selected) {
      alert('유효한 버스회사를 선택해주세요.');
      return;
    }

    // 로그인한 사용자 정보
    const handlerId = authStore.id;
    console.log("🧪 handlerId:", handlerId);  // 직접 확인해봐
    if (!handlerId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // ✅ DTO 객체 생성
    const dto = {
      itemName: form.itemName,
      busCompany: selected.companyName,
      busNumber: form.busNumber,
      foundTime: form.foundTime,
      foundPlace: form.foundPlace || '',
      content: form.content || '',
      storageLocation: form.storageLocation || '',
      handlerContact: form.handlerContact || '',
      handlerEmail: form.handlerEmail || '',
      handlerId: handlerId.toString()
    };

    // ✅ JSON -> Blob -> FormData에 넣기
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    // ✅ 이미지 파일 넣기
    if (!props.item && !imageFile.value) {
      alert('이미지를 선택해주세요.');
      return;
    }
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    // 콘솔 확인용
    console.log("📛 handlerId:", handlerId);
    console.log("📤 제출할 FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    // API 호출
    if (form.id) {
      await updateFoundItem(form.id, formData);
      alert('수정 완료');
    } else {
      await registerFoundItem(formData);
      alert('등록 완료');

      // 폼 초기화
      form.itemName = '';
      form.busCompanyId = '';
      form.busNumber = '';
      form.foundTime = '';
      form.foundPlace = '';
      form.content = '';
      form.storageLocation = '';
      form.handlerContact = '';
      form.handlerEmail = '';
      imageFile.value = null;
      if (fileInput.value) fileInput.value.value = '';
    }

    emit('submitted');
  } catch (e) {
    console.error('폼 제출 오류:', e);
    console.error('상세 오류:', e.response?.data);
    alert('저장 실패: ' + (e.response?.data?.message || '오류가 발생했습니다.'));
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
