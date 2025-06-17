<template>
  <div>
    <div v-if="!authStore.isAuthenticated" class="alert alert-warning">
      <i class="bi bi-exclamation-triangle me-2"></i>
      관리자 로그인이 필요한 기능입니다.
    </div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="row">
        <!-- 이미지 영역 -->
        <div class="col-md-4 text-center mb-3">
          <div v-if="props.item && props.item.photoUrl" class="mb-3">
            <img
                :src="`${IMAGE_BASE_URL}/found/${props.item.photoUrl}`"
                alt="현재 이미지"
                class="img-fluid rounded shadow-sm mb-2"
                style="max-height: 200px;"
            />
          </div>
          <div class="form-group">
            <label class="form-label d-block">사진 {{ props.item ? '' : '(필수)' }}</label>
            <input
                class="form-control"
                type="file"
                accept="image/*"
                :required="!props.item"
                ref="fileInput"
                @change="handleFileChange"
            />
            <small class="form-text text-muted" v-if="props.item && props.item.photoUrl">
              새 이미지를 업로드하면 기존 이미지가 교체됩니다.
            </small>
          </div>
        </div>
        <!-- 폼 영역 -->
        <div class="col-md-8">
          <table class="table table-bordered">
            <tbody>
            <tr>
              <th class="bg-light" style="width: 30%">
                <label for="itemName" class="form-label m-0">물품명</label>
              </th>
              <td>
                <input id="itemName" class="form-control" v-model="form.itemName" required />
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="busCompanyId" class="form-label m-0">버스회사</label>
              </th>
              <td>
                <select id="busCompanyId" class="form-select" v-model="form.busCompanyId" required>
                  <option value="" disabled>선택</option>
                  <option v-for="company in busCompanies" :key="company.id" :value="company.id">
                    {{ company.companyName }}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="busNumber" class="form-label m-0">노선번호</label>
              </th>
              <td>
                <select id="busNumber" class="form-select" v-model="form.busNumber" required>
                  <option value="" disabled>선택</option>
                  <option v-for="route in busRoutes" :key="route" :value="route">
                    {{ route }}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="foundTime" class="form-label m-0">습득일</label>
              </th>
              <td>
                <input id="foundTime" type="date" class="form-control" v-model="form.foundTime" required />
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="foundPlace" class="form-label m-0">습득장소</label>
              </th>
              <td>
                <input id="foundPlace" class="form-control" v-model="form.foundPlace" />
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="storageLocation" class="form-label m-0">보관장소</label>
              </th>
              <td>
                <input id="storageLocation" class="form-control" v-model="form.storageLocation" />
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="handlerContact" class="form-label m-0">연락처</label>
              </th>
              <td>
                <input id="handlerContact" class="form-control" v-model="form.handlerContact" />
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="handlerEmail" class="form-label m-0">이메일</label>
              </th>
              <td>
                <input id="handlerEmail" type="email" class="form-control" v-model="form.handlerEmail" />
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="status" class="form-label m-0">상태</label>
              </th>
              <td>
                <select id="status" class="form-select" v-model="form.status">
                  <option value="IN_STORAGE">보관중</option>
                  <option value="RETURNED">수령완료</option>
                </select>
              </td>
            </tr>
            <tr>
              <th class="bg-light">
                <label for="content" class="form-label m-0">내용</label>
              </th>
              <td>
                <textarea id="content" class="form-control" v-model="form.content" rows="3"></textarea>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="text-end mt-3">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-save me-1"></i> 저장
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import {
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
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

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

watch(() => props.item, async (val) => {
  if (val) {
    form.id = val.id;
    form.itemName = val.itemName || '';
    form.foundTime = val.foundTime?.split('T')[0] ?? '';
    form.foundPlace = val.foundPlace || '';
    form.content = val.content || '';
    form.storageLocation = val.storageLocation || '';
    form.handlerContact = val.handlerContact || '';
    form.handlerEmail = val.handlerEmail || '';
    form.status = val.status || 'IN_STORAGE';
    if (busCompanies.value.length === 0) {
      const { data } = await getBusCompanies();
      busCompanies.value = data;
    }
    const matched = busCompanies.value.find(c => c.companyName === val.busCompany);
    if (matched) {
      form.busCompanyId = matched.id;
      const { data } = await getBusRoutesByCompany(matched.id);
      busRoutes.value = data;
      form.busNumber = val.busNumber;
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

const handleSubmit = () => {
  if (!form.itemName || !form.busCompanyId || !form.busNumber || !form.foundTime) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }
  const selected = busCompanies.value.find(c => c.id === form.busCompanyId);
  if (!selected) {
    alert('유효한 버스회사를 선택해주세요.');
    return;
  }
  const handlerId = authStore.id;
  if (!handlerId) {
    alert('로그인이 필요합니다.');
    return;
  }

  // ✅ FormData로 만들어서 emit!
  const formData = new FormData();
  formData.append('itemName', form.itemName);
  formData.append('busCompany', selected.companyName);
  formData.append('busNumber', form.busNumber);
  formData.append('foundTime', form.foundTime);
  formData.append('foundPlace', form.foundPlace || '');
  formData.append('content', form.content || '');
  formData.append('storageLocation', form.storageLocation || '');
  formData.append('handlerContact', form.handlerContact || '');
  formData.append('handlerEmail', form.handlerEmail || '');
  formData.append('status', form.status || 'IN_STORAGE');
  formData.append('handlerId', handlerId);
  if (props.item && props.item.id) {
    formData.append('id', props.item.id);
  }
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  emit('submitted', formData);
};
</script>

<style scoped>
th {
  vertical-align: middle;
  background-color: #f8f9fa;
}
</style>
