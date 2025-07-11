<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb :breadcrumb="isEditMode ? '광고 수정' : '광고 등록'" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          {{ isEditMode ? '광고 수정' : '광고 등록' }}
        </h2>
        
        <form @submit.prevent="handleSubmit" enctype="multipart/form-data" class="space-y-6">
          <!-- 제목 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">제목 *</label>
            <input
                v-model="form.title"
                type="text"
                class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                required
            />
          </div>
          
          <!-- 이미지 파일 (필수) -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">이미지 파일 *</label>
            <input
                type="file"
                accept="image/*"
                @change="handleImage"
                class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                :required="!isEditMode"
            />
            <div v-if="preview" class="mt-3 flex justify-center">
              <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 w-full max-w-2xl">
                <img :src="preview" alt="미리보기" class="w-full h-auto rounded-md shadow-lg" style="max-height: 400px; object-fit: contain;" />
              </div>
            </div>
          </div>
          
          <!-- 링크 URL -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">링크 URL *</label>
            <input
                v-model="form.linkUrl"
                type="url"
                placeholder="https://example.com"
                class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                required
            />
          </div>
          
          <!-- 시작일/종료일 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">시작일 *</label>
              <input
                  v-model="form.startDate"
                  type="date"
                  class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                  required
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">종료일 *</label>
              <input
                  v-model="form.endDate"
                  type="date"
                  class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                  required
              />
            </div>
          </div>
          
          <!-- 광고회사 드롭다운 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">광고회사 *</label>
            <select
                v-model="form.companyId"
                class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition bg-white"
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
            <label for="popup" class="text-sm font-medium text-gray-700">팝업으로 표시</label>
          </div>
          
          <!-- 버튼 -->
          <div class="flex justify-end space-x-3 mt-8">
            <button
                type="button"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                @click="$router.push('/admin/ad')"
            >취소</button>
            <button
                type="submit"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {{ isEditMode ? '수정' : '등록' }}
            </button>
          </div>
        </form>
        
        <CommonModal
          :isOpen="modalOpen"
          :title="modalTitle"
          :message="modalMessage"
          :confirmText="modalConfirmText"
          :confirmType="modalConfirmType"
          :showCancel="false"
          @close="handleModalClose"
          @confirm="handleModalClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { createAd, fetchAd, updateAd } from '@/modules/ad/api/adApi.js'
import { fetchAdCompanyDropdown } from '@/modules/ad/api/adCompanyApi.js'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const router = useRouter()
const route = useRoute()

// 수정 모드 여부 판단
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

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')

const handleImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.imageFile = file
    preview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  if (!form.value.imageFile && !isEditMode.value) {
    showErrorModal('이미지 파일은 필수입니다.')
    return
  }

  // 서버에 맞는 adDTO 만들기
  const adDTO = {
        title: form.value.title,
        linkUrl: form.value.linkUrl,
        startDateTime: form.value.startDate + "T00:00:00",
        endDateTime: form.value.endDate + "T23:59:59",
        companyId: form.value.companyId,
        showPopup: form.value.isPopup
      }

  try {
    if (isEditMode.value) {
      await updateAd(route.params.id, adDTO, form.value.imageFile)
      showSuccessModal('수정 완료!')
    } else {
      await createAd(adDTO, form.value.imageFile)
      showSuccessModal('등록 완료!')
    }
  } catch (e) {
    showErrorModal('전송 실패: ' + (e.response?.data?.message || e.message))
  }
}

function showSuccessModal(msg) {
  modalTitle.value = '완료'
  modalMessage.value = msg
  modalConfirmText.value = '확인'
  modalConfirmType.value = 'success'
  modalOpen.value = true
}

function showErrorModal(msg) {
  modalTitle.value = '오류'
  modalMessage.value = msg
  modalConfirmText.value = '확인'
  modalConfirmType.value = 'danger'
  modalOpen.value = true
}

function handleModalClose() {
  modalOpen.value = false
  if (modalConfirmType.value === 'success') {
    router.push('/admin/ad')
  }
}

onMounted(async () => {
  // 광고회사 먼저 가져오기
  const rawList = await fetchAdCompanyDropdown()
  companyList.value = rawList.map(c => ({
    id: String(c.id || c.companyId),
    name: c.name || c.companyName
  }))
  console.log('📦 회사 목록', companyList.value)

  // 그 다음 광고 데이터 fetch
  if (isEditMode.value) {
    const ad = await fetchAd(route.params.id)
    console.log('🧾 서버에서 받은 광고:', ad)

    form.value.title = ad.title
    form.value.linkUrl = ad.linkUrl
    form.value.startDate = ad.startDateTime?.slice(0, 10)
    form.value.endDate = ad.endDateTime?.slice(0, 10)
    form.value.companyId = ad.companyId
        ? String(ad.companyId)
        : ad.company?.id
            ? String(ad.company.id)
            : ''
    form.value.isPopup = !!ad.showPopup
    preview.value = `${import.meta.env.VITE_IMAGE_BASE_URL}/ad/${ad.imageUrl}`
  }

  // 디버깅 로그
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
