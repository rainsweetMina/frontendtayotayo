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
    console.log("✅ 습득물 데이터 로드:", val);
    // 기본 데이터 로드
    form.id = val.id;
    form.itemName = val.itemName || '';
    form.foundTime = val.foundTime?.split('T')[0] ?? '';
    form.foundPlace = val.foundPlace || '';
    form.content = val.content || '';
    form.storageLocation = val.storageLocation || '';
    form.handlerContact = val.handlerContact || '';
    form.handlerEmail = val.handlerEmail || '';
    form.status = val.status || 'IN_STORAGE';
    
    // 이미지 URL 저장 (디버깅용)
    console.log("📸 기존 이미지 URL:", val.photoUrl);
    
    // 버스 회사 데이터가 없으면 가져오기
    if (busCompanies.value.length === 0) {
      try {
        const { data } = await getBusCompanies();
        busCompanies.value = data;
        console.log("📋 버스 회사 목록:", busCompanies.value);
      } catch (e) {
        console.error('버스회사 목록 불러오기 실패:', e);
      }
    }
    
    // 버스 회사 찾기 (이름으로)
    const matched = busCompanies.value.find(c => c.companyName === val.busCompany);
    if (matched) {
      form.busCompanyId = matched.id;
      console.log("🚌 버스 회사 매칭됨:", matched.companyName, matched.id);
      
      // 선택된 회사의 노선 가져오기
      try {
        const { data } = await getBusRoutesByCompany(matched.id);
        busRoutes.value = data;
        console.log("🚏 노선 목록:", busRoutes.value);
        
        // 노선 선택
        if (busRoutes.value.includes(val.busNumber)) {
          form.busNumber = val.busNumber;
          console.log("🚏 노선 매칭됨:", val.busNumber);
        } else {
          console.warn("⚠️ 버스 노선 매칭 실패:", val.busNumber);
          // 노선 매칭 실패 시 직접 설정
          form.busNumber = val.busNumber || '';
        }
      } catch (e) {
        console.error('노선 목록 불러오기 실패:', e);
        // 오류 발생 시 직접 설정
        form.busNumber = val.busNumber || '';
      }
    } else {
      console.warn("⚠️ 버스 회사 매칭 실패:", val.busCompany);
      // 회사 매칭 실패 시 직접 설정
      form.busNumber = val.busNumber || '';
    }
  } else {
    // 초기화
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
    console.log("🧪 handlerId:", handlerId);
    if (!handlerId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 각 필드를 FormData에 직접 추가 (key-value로)
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
    formData.append('handlerId', handlerId.toString());

    // 수정 시 추가 필드
    if (props.item) {
      formData.append('id', props.item.id.toString());
      formData.append('photoUrl', props.item.photoUrl || '');
    }

    // 이미지 처리
    const isUpdate = !!props.item;
    const hasNewImage = !!imageFile.value;

    if (!isUpdate && !hasNewImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
    if (hasNewImage) {
      formData.append('image', imageFile.value);
    }
    // 이미지 변경이 없을 땐 그냥 이미지 필드는 생략 (서버에서 기존 이미지 유지)

    // API 호출
    if (isUpdate) {
      console.log(`📤 습득물 ID ${props.item.id} 수정 요청`);
      const response = await updateFoundItem(props.item.id, formData);
      console.log('수정 응답:', response);
    } else {
      const response = await registerFoundItem(formData);
      console.log('등록 응답:', response);
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
      form.status = 'IN_STORAGE';
      imageFile.value = null;
      if (fileInput.value) fileInput.value.value = '';
    }

    emit('submitted', formData);
  } catch (e) {
    console.error('폼 제출 오류:', e);
    console.error('상세 오류:', e.response?.data);

    let errorMessage = '저장 실패: ';
    if (e.response?.data?.message) {
      errorMessage += e.response.data.message;
    } else if (e.message) {
      errorMessage += e.message;
    } else {
      errorMessage += '알 수 없는 오류가 발생했습니다.';
    }

    alert(errorMessage);
  }
};

</script>

<style scoped>
th {
  vertical-align: middle;
  background-color: #f8f9fa;
}
</style>
