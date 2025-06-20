<template>
  <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-6">광고 등록</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- 제목 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">제목:</label>
        <input v-model="form.title" type="text" class="form-input w-full" required />
      </div>
      <!-- 이미지 파일 (필수) -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">이미지 파일: <span class="text-red-500">*</span></label>
        <input type="file" accept="image/*" @change="handleImage" required />
        <div v-if="preview" class="mt-2">
          <img :src="preview" alt="미리보기" class="max-h-32 rounded border" />
        </div>
      </div>
      <!-- 링크 URL -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">링크 URL:</label>
        <input v-model="form.linkUrl" type="url" class="form-input w-full" required />
      </div>
      <!-- 시작일/종료일 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">시작일:</label>
        <input v-model="form.startDate" type="date" class="form-input w-full" required />
      </div>
      <div class="mb-4">
        <label class="block font-semibold mb-1">종료일:</label>
        <input v-model="form.endDate" type="date" class="form-input w-full" required />
      </div>
      <!-- 광고회사 드롭다운 -->
      <div class="mb-4">
        <label class="block font-semibold mb-1">광고회사:</label>
        <select v-model="form.companyId" class="form-select w-full" required>
          <option value="" disabled>선택</option>
          <option v-for="company in companyList" :key="company.id" :value="company.id">
            {{ company.companyName }}  <!-- ← 필드명에 주의 -->
          </option>
        </select>
      </div>
      <!-- 팝업 여부 -->
      <div class="mb-4 flex items-center">
        <input v-model="form.isPopup" type="checkbox" id="popup" />
        <label for="popup" class="ml-2">팝업으로 표시</label>
      </div>
      <!-- 등록 버튼 -->
      <div>
        <button type="submit" class="btn btn-primary w-full">등록</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createAd } from '@/modules/ad/api/adApi.js'
import { fetchAdCompanyDropdown } from '@/modules/ad/api/adCompanyApi.js'

const router = useRouter()
const form = ref({
  title: '',
  linkUrl: '',
  startDate: '',
  endDate: '',
  companyId: '',
  isPopup: false,
  imageFile: null
})

const companyList = ref([])
const preview = ref(null)

const handleImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.imageFile = file
    preview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (!form.value.imageFile) {
    alert('이미지 파일은 필수입니다.')
    return
  }
  // FormData로 보내기 (이미지 포함)
  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('linkUrl', form.value.linkUrl)
  fd.append('startDate', form.value.startDate)
  fd.append('endDate', form.value.endDate)
  fd.append('companyId', form.value.companyId)
  fd.append('isPopup', form.value.isPopup)
  fd.append('image', form.value.imageFile)

  try {
    await createAd(fd)
    alert('등록 완료!')
    router.push('/admin/ad')
  } catch (e) {
    alert('등록 실패')
  }
}

onMounted(async () => {
  companyList.value = await fetchAdCompanyDropdown()
})
</script>

<style scoped>
.form-input, .form-select {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.5em;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.7em;
  font-weight: bold;
}
.btn-primary:hover {
  background: #1d4ed8;
}
</style>
