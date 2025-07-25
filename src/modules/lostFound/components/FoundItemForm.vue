<template>
  <div>
    <div v-if="authStore.role !== 'ADMIN' && authStore.role !== 'BUS'" class="flex items-center gap-2 p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
      <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
      <span class="font-medium">관리자 로그인이 필요한 기능입니다.</span>
    </div>
    <form v-else @submit="handleSubmit" class="max-w-4xl mx-auto">
      <div class="space-y-6">
        <!-- 이미지 영역 -->
        <div class="flex flex-col items-center">
          <div v-if="props.item?.photoUrl" class="mb-2">
            <img 
              v-if="props.item?.photoUrl" 
              :src="`/uploads/found/${props.item.photoUrl}`" 
              alt="기존 이미지" 
              class="w-32 h-32 object-cover rounded-lg border"
            />
          </div>
          <div class="w-full max-w-md">
            <label class="block font-bold mb-2 text-gray-700">사진 <span v-if="!props.item" class="text-red-500">*</span></label>
            <input
              class="block w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
              type="file"
              accept="image/*"
              :required="!props.item"
              ref="fileInput"
              @change="handleFileChange"
            />
            <small v-if="props.item && props.item.photoUrl" class="text-xs text-gray-500">새 이미지를 업로드하면 기존 이미지가 교체됩니다.</small>
          </div>
        </div>
        <!-- 폼 영역 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="itemName" class="block font-bold mb-1 text-gray-700">물품명 <span class="text-red-500">*</span></label>
            <input id="itemName" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.itemName" required />
          </div>
          <div>
            <label for="foundTime" class="block font-bold mb-1 text-gray-700">습득일 <span class="text-red-500">*</span></label>
            <input id="foundTime" type="date" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.foundTime" required />
          </div>
          <div>
            <label for="busCompanyId" class="block font-bold mb-1 text-gray-700">버스회사 <span class="text-red-500">*</span></label>
            <select id="busCompanyId" class="form-select w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white" v-model="form.busCompanyId" required>
              <option value="" disabled>선택</option>
              <option v-for="company in busCompanies" :key="company.id" :value="company.id">
                {{ company.companyName }}
              </option>
            </select>
          </div>
          <div>
            <label for="busNumber" class="block font-bold mb-1 text-gray-700">노선번호 <span class="text-red-500">*</span></label>
            <select id="busNumber" class="form-select w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white" v-model="form.busNumber" required>
              <option value="" disabled>선택</option>
              <option v-for="route in busRoutes" :key="route" :value="route">
                {{ route }}
              </option>
            </select>
          </div>
          <div>
            <label for="foundPlace" class="block font-bold mb-1 text-gray-700">습득장소</label>
            <input id="foundPlace" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.foundPlace" />
          </div>
          <div>
            <label for="storageLocation" class="block font-bold mb-1 text-gray-700">보관장소</label>
            <input id="storageLocation" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.storageLocation" />
          </div>
          <div>
            <label for="handlerContact" class="block font-bold mb-1 text-gray-700">연락처</label>
            <input id="handlerContact" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.handlerContact" />
          </div>
          <div>
            <label for="handlerEmail" class="block font-bold mb-1 text-gray-700">이메일</label>
            <input id="handlerEmail" type="email" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.handlerEmail" />
          </div>
          <div>
            <label for="status" class="block font-bold mb-1 text-gray-700">상태</label>
            <select id="status" class="form-select w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white" v-model="form.status">
              <option value="IN_STORAGE">보관중</option>
              <option value="RETURNED">수령완료</option>
            </select>
          </div>
        </div>
        <div class="lg:col-span-2">
          <label for="content" class="block font-bold mb-1 text-gray-700">내용</label>
          <textarea id="content" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" v-model="form.content" rows="4"></textarea>
        </div>
        <div class="flex justify-between items-center pt-6">
          <router-link to="/admin/found" class="text-gray-600 hover:underline flex items-center">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            목록으로
          </router-link>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            저장
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import {
  getBusCompanies,
  getBusRoutesByCompany,
  registerFoundItem,
  updateFoundItem
} from '@/modules/lostFound/api/foundAdmin';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({ item: Object });
const emit = defineEmits(['submitted', 'error']);

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
  status: 'IN_STORAGE'
});

onMounted(async () => {
  try {
    const { data } = await getBusCompanies();
    busCompanies.value = data;
  } catch (e) {
    emit('error', '버스회사 목록 불러오기 실패');
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
    emit('error', '노선 목록 불러오기 실패');
  }
});

watch(() => props.item, async (val) => {
  if (val) {
    form.id = val.id;
    form.itemName = val.itemName || '';
    form.foundTime = val.foundTime ? val.foundTime.split('T')[0] : '';
    form.foundPlace = val.foundPlace || '';
    form.content = val.content || '';
    form.storageLocation = val.storageLocation || '';
    form.handlerContact = val.handlerContact || '';
    form.handlerEmail = val.handlerEmail || '';
    form.status = val.status || 'IN_STORAGE';
    if (busCompanies.value.length === 0) {
      try {
        const { data } = await getBusCompanies();
        busCompanies.value = data;
      } catch (e) {
        emit('error', '버스회사 목록 불러오기 실패');
        return;
      }
    }
    const matched = busCompanies.value.find(c => c.companyName === val.busCompany);
    if (matched) {
      form.busCompanyId = matched.id;
      try {
        const { data } = await getBusRoutesByCompany(matched.id);
        busRoutes.value = data;
        form.busNumber = val.busNumber;
      } catch (e) {
        emit('error', '노선 목록 불러오기 실패');
      }
    } else {
      form.busCompanyId = '';
      form.busNumber = val.busNumber || '';
    }
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
      status: 'IN_STORAGE'
    });
  }
}, { immediate: true });

const handleFileChange = (e) => {
  const file = e.target?.files?.[0];
  if (file) {
    imageFile.value = file;
  }
};

const resetForm = () => {
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
    status: 'IN_STORAGE'
  });
  imageFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.itemName || !form.busCompanyId || !form.busNumber || !form.foundTime) {
    emit('error', '필수 항목을 모두 입력해주세요.');
    return;
  }
  const selected = busCompanies.value.find(c => c.id === form.busCompanyId);
  if (!selected) {
    emit('error', '유효한 버스회사를 선택해주세요.');
    return;
  }
  const handlerId = authStore.id;
  if (!handlerId) {
    emit('error', '로그인이 필요합니다.');
    return;
  }

  // 날짜 포맷 변환
  let foundTime = form.foundTime;
  if (foundTime && !foundTime.includes('T')) {
    foundTime = foundTime + 'T00:00:00';
  }

  // dto 객체 생성
  const dto = {
    itemName: form.itemName,
    busCompany: selected.companyName,
    busNumber: form.busNumber,
    foundTime: form.foundTime + 'T00:00:00',
    foundPlace: form.foundPlace || '',
    content: form.content || '',
    storageLocation: form.storageLocation || '',
    handlerContact: form.handlerContact || '',
    handlerEmail: form.handlerEmail || '',
    status: form.status || 'IN_STORAGE',
    handlerId: handlerId,
  };
  if (props.item && props.item.id) {
    dto.id = props.item.id;
  }

  // FormData 생성 및 전송
  const formData = new FormData();
  formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  try {
    if (props.item && props.item.id) {
      // 수정
      console.log('formData----------수정>', dto, formData)
      await updateFoundItem(props.item.id, formData);
    } else {
      // 등록
      await registerFoundItem(formData);
      resetForm();
    }
    emit('submitted');
  } catch (e) {
    emit('error', '저장 실패: ' + (e.response?.data?.message || e.message));
  }
};


// 날짜 포맷
const formatDate = (date) => {
  if (!date) return '-'
  
  try {
    // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss) 처리
    const dateStr = date.includes('T') ? date.split('T')[0] : date
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('날짜 포맷 오류:', error)
    return date
  }
}

</script>

<style scoped>
th {
  vertical-align: middle;
  background-color: #f8f9fa;
}
</style>
