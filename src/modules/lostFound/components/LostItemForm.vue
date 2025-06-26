<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-900 text-center mb-6">
      {{ props.initialData ? '분실물 수정' : '분실물 등록' }}
    </h2>
    
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- 1. 분실물 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          분실물 <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.title" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          placeholder="분실한 물건을 입력해주세요"
          required 
        />
      </div>

      <!-- 2. 분실일 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          분실일 <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="form.lostTime" 
          type="datetime-local" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          required 
        />
      </div>

      <!-- 3. 버스 회사 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          버스 회사 <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="form.busCompanyId" 
          @change="fetchBuses" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          required
        >
          <option disabled value="">선택하세요</option>
          <option v-for="company in busCompanies" :key="company.id" :value="company.id">
            {{ company.companyName }}
          </option>
        </select>
      </div>

      <!-- 4. 노선번호 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          노선번호 <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="form.busNumber" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          required
        >
          <option disabled value="">선택하세요</option>
          <option v-for="bus in buses" :key="bus" :value="bus">{{ bus }}</option>
        </select>
      </div>

      <!-- 5. 내용 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          내용
        </label>
        <textarea 
          v-model="form.content" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          rows="4"
          placeholder="분실물에 대한 추가 설명을 입력해주세요"
        ></textarea>
      </div>

      <!-- 등록/수정 버튼 -->
      <div class="flex justify-center pt-4">
        <button 
          type="submit" 
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg v-if="!props.initialData" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          {{ props.initialData ? '수정' : '등록' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { getBusCompanies, getBusesByCompany } from '@/modules/lostFound/api/lostPublic.js'

const emit = defineEmits(['submit'])

const props = defineProps({
  initialData: Object
})

const form = reactive({
  title: '',
  content: '',
  busCompanyId: '',
  busCompany: '',
  busNumber: '',
  lostTime: '',
})

const busCompanies = ref([])
const buses = ref([])

onMounted(async () => {
  const { data } = await getBusCompanies();
  busCompanies.value = data;

  if (props.initialData) {
    Object.assign(form, props.initialData);

    // 날짜 변환
    if (form.lostTime) {
      const dt = new Date(form.lostTime);
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      const hh = String(dt.getHours()).padStart(2, '0');
      const min = String(dt.getMinutes()).padStart(2, '0');
      form.lostTime = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    }

    const company = busCompanies.value.find(c => c.companyName === form.busCompany);
    form.busCompanyId = company?.id || '';

    if (form.busCompanyId) {
      await fetchBuses();
    }
  }
});

const fetchBuses = async () => {
  if (!form.busCompanyId) return
  const { data } = await getBusesByCompany(form.busCompanyId)
  buses.value = data

  const selectedCompany = busCompanies.value.find(c => c.id === form.busCompanyId)
  form.busCompany = selectedCompany ? selectedCompany.companyName : ''
}

const onSubmit = () => {
  emit('submit', { ...form })
  if (!props.initialData) {
    // 등록 시에만 초기화
    form.title = ''
    form.content = ''
    form.busCompanyId = ''
    form.busCompany = ''
    form.busNumber = ''
    form.lostTime = ''
    buses.value = []
  }
}
</script>

<style scoped>
.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
</style>
