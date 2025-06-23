<template>
  <div class="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
    <h2 class="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ isEditMode ? '광고 수정' : '광고 등록' }} <!-- ✅ 동적 제목 -->
    </h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data" class="space-y-6">
      <!-- 제목 -->
      <div>
        <label class="block mb-1 font-bold text-gray-700">제목 <span class="text-red-500">*</span></label>
        <input
            v-model="form.title"
            type="text"
            class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            required
        />
      </div>
      <!-- 이미지 파일 (필수) -->
      <div>
        <label class="block mb-1 font-bold text-gray-700">이미지 파일 <span class="text-red-500">*</span></label>
        <input
            type="file"
            accept="image/*"
            @change="handleImage"
            class="block w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:border-blue-400"
            :required="!isEditMode"
        />
        <div v-if="preview" class="mt-3 flex justify-center">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-2 w-64 h-32 flex items-center justify-center">
            <img :src="preview" alt="미리보기" class="max-h-28 max-w-full rounded-md shadow" />
          </div>
        </div>
      </div>
      <!-- 링크 URL -->
      <div>
        <label class="block mb-1 font-bold text-gray-700">링크 URL <span class="text-red-500">*</span></label>
        <input
            v-model="form.linkUrl"
            type="url"
            placeholder="https://example.com"
            class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            required
        />
      </div>
      <!-- 시작일/종료일 -->
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1 font-bold text-gray-700">시작일 <span class="text-red-500">*</span></label>
          <input
              v-model="form.startDate"
              type="date"
              class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              required
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1 font-bold text-gray-700">종료일 <span class="text-red-500">*</span></label>
          <input
              v-model="form.endDate"
              type="date"
              class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              required
          />
        </div>
      </div>
      <!-- 광고회사 드롭다운 -->
      <div>
        <label class="block mb-1 font-bold text-gray-700">광고회사 <span class="text-red-500">*</span></label>
        <select
            v-model="form.companyId"
            class="form-select w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
            required
        >
          <option value="" disabled>선택</option>
          <option
              v-for="company in companyList"
              :key="company.id"
              :value="company.id"
          >
          {{ company.name }}
          </option>
        </select>
      </div>
      <!-- 팝업 여부 -->
      <div class="flex items-center gap-2">
        <input v-model="form.isPopup" type="checkbox" id="popup" class="accent-blue-500 w-5 h-5" />
        <label for="popup" class="text-gray-700 font-medium">팝업으로 표시</label>
      </div>
      <!-- 등록 버튼 -->
      <div class="pt-4 flex justify-between items-center">
        <router-link to="/admin/ad" class="text-gray-600 hover:underline">← 목록으로</router-link>
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition">
          {{ isEditMode ? '수정 완료' : '등록' }} <!-- ✅ 동적 버튼 -->
        </button>
      </div>
    </form>
  </div>
</template>


<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createAd, fetchAd, updateAd } from '@/modules/ad/api/adApi.js'
import { fetchAdCompanyDropdown } from '@/modules/ad/api/adCompanyApi.js'

const router = useRouter()
const route = useRoute()                         // ✅ 추가

// ✅ 수정 모드 여부 판단
const isEditMode = computed(() => !!route.params.id)

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
  if (!form.value.imageFile && !isEditMode.value) {
    alert('이미지 파일은 필수입니다.');
    return;
  }

  // ① 서버에 맞는 adDTO 만들기
  const adDTO = {
        title: form.value.title,
        linkUrl: form.value.linkUrl,
        startDateTime: form.value.startDate + "T00:00:00",
        endDateTime: form.value.endDate + "T23:59:59",
        companyId: form.value.companyId,
        showPopup: form.value.isPopup    // 필드명 대소문자 포함 정확히 맞춤!
      };

  // ② FormData에 'dto'라는 이름으로 JSON 붙이기!
  const fd = new FormData();
  fd.append('dto', new Blob([JSON.stringify(adDTO)], { type: 'application/json' }));
  if (form.value.imageFile) {
    fd.append('image', form.value.imageFile);
  }

  try {
    if (isEditMode.value) {
      await updateAd(route.params.id, fd) // ✅ 수정
      alert('수정 완료!')
    } else {
      await createAd(fd) // 등록
      alert('등록 완료!')
    }
    router.push('/admin/ad')
  } catch (e) {
    alert('전송 실패: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(async () => {
  // ✅ 광고회사 먼저 가져오기
  const rawList = await fetchAdCompanyDropdown()
  companyList.value = rawList.map(c => ({
    id: String(c.id || c.companyId),
    name: c.name || c.companyName
  }))
  console.log('📦 회사 목록', companyList.value)

  // ✅ 그 다음 광고 데이터 fetch
  if (isEditMode.value) {
    const ad = await fetchAd(route.params.id)
    console.log('🧾 서버에서 받은 광고:', ad)

    form.value.title = ad.title
    form.value.linkUrl = ad.linkUrl
    form.value.startDate = ad.startDateTime?.slice(0, 10)
    form.value.endDate = ad.endDateTime?.slice(0, 10)
    // ✅ 이 줄만 아래처럼 교체
    form.value.companyId = ad.companyId
        ? String(ad.companyId)
        : ad.company?.id
            ? String(ad.company.id)
            : ''
    form.value.isPopup = !!ad.showPopup  // ✅ 이렇게!
    preview.value = `${import.meta.env.VITE_IMAGE_BASE_URL}/ad/${ad.imageUrl}`
  }

  // 🔍 디버깅 로그
  watch(form, () => {
    console.log('🔥 선택된 companyId:', form.value.companyId)
  })
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
