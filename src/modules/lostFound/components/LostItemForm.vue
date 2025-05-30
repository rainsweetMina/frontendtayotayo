<template>
  <div class="card p-4 bg-light">
    <h5 class="text-center mb-4">분실물 등록</h5>
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
          <option v-for="bus in buses" :key="bus" :value="bus">
            {{ bus }}
          </option>
        </select>
      </div>

      <!-- 5. 내용 -->
      <div class="mb-3">
        <label class="form-label">내용</label>
        <textarea v-model="form.content" class="form-control" rows="3"></textarea>
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="btn btn-primary">등록</button>
    </form>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getBusCompanies, getBusesByCompany } from '@/modules/lostFound/api/lostFound';

const emit = defineEmits(['submit']);

const form = reactive({
  title: '',
  content: '',
  busCompanyId: '',
  busCompany: '',
  busNumber: '',
  lostTime: '',
});

const busCompanies = ref([]);
const buses = ref([]);

onMounted(async () => {
  const { data } = await getBusCompanies();
  busCompanies.value = data;
});

const fetchBuses = async () => {
  if (!form.busCompanyId) return;
  const { data } = await getBusesByCompany(form.busCompanyId);
  buses.value = data;

  const selectedCompany = busCompanies.value.find(c => c.id === form.busCompanyId);
  form.busCompany = selectedCompany ? selectedCompany.companyName : '';
};

const onSubmit = () => {
  emit('submit', { ...form });
  form.title = '';
  form.content = '';
  form.busCompanyId = '';
  form.busCompany = '';
  form.busNumber = '';
  form.lostTime = '';
  buses.value = [];
};
</script>

<style scoped>
.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
</style>
