<template>
  <div class="card p-4 bg-light">
    <h5 class="text-center mb-4">
      {{ props.initialData ? '분실물 수정' : '분실물 등록' }}
    </h5>
    <form @submit.prevent="onSubmit" class="mb-4">
      <!-- 1. 분실물 -->
      <div class="mb-3">
        <label class="form-label">분실물</label>
        <input v-model="form.title" type="text" class="form-control" required />
      </div>

      <!-- 2. 분실일 -->
      <div class="mb-3">
        <label class="form-label">분실일</label>
        <input v-model="form.lostTime" type="datetime-local" class="form-control" required />
      </div>

      <!-- 3. 버스 회사 -->
      <div class="mb-3">
        <label class="form-label">버스 회사</label>
        <select v-model="form.busCompanyId" @change="fetchBuses" class="form-select" required>
          <option disabled value="">선택하세요</option>
          <option v-for="company in busCompanies" :key="company.id" :value="company.id">
            {{ company.companyName }}
          </option>
        </select>
      </div>

      <!-- 4. 노선번호 -->
      <div class="mb-3">
        <label class="form-label">노선번호</label>
        <select v-model="form.busNumber" class="form-select" required>
          <option disabled value="">선택하세요</option>
          <option v-for="bus in buses" :key="bus" :value="bus">{{ bus }}</option>
        </select>
      </div>

      <!-- 5. 내용 -->
      <div class="mb-3">
        <label class="form-label">내용</label>
        <textarea v-model="form.content" class="form-control" rows="3"></textarea>
      </div>

      <!-- 등록/수정 버튼 -->
      <button type="submit" class="btn btn-primary">
        {{ props.initialData ? '수정' : '등록' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { getBusCompanies, getBusesByCompany } from '@/modules/lostFound/api/lostFound'

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
