<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="광고 회사 수정" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">광고 회사 수정</h2>
        <div v-if="loading" class="text-center py-12 text-gray-500">로딩 중...</div>
        <div v-else-if="!company" class="text-center py-12 text-red-600">회사 정보를 찾을 수 없습니다.</div>
        <div v-else>
          <form @submit.prevent="handleUpdate">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">회사명 *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                  placeholder="회사명을 입력하세요"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">담당자명 *</label>
                <input
                  v-model="form.managerName"
                  type="text"
                  required
                  class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                  placeholder="담당자명을 입력하세요"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">연락처 *</label>
                <input
                  v-model="form.contactNumber"
                  type="tel"
                  required
                  class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                  placeholder="연락처를 입력하세요"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-700">이메일 *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                @click="$router.push('/admin/adcompany')"
              >취소</button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >수정</button>
            </div>
          </form>
        </div>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchAdCompanies, updateAdCompany } from '@/modules/ad/api/adCompanyApi.js'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const company = ref(null)

const form = ref({
  name: '',
  managerName: '',
  contactNumber: '',
  email: ''
})

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')

const fetchData = async () => {
  try {
    const companies = await fetchAdCompanies()
    const targetCompany = companies.find(c => c.id == route.params.id)
    
    if (targetCompany) {
      company.value = targetCompany
      form.value = {
        name: targetCompany.name,
        managerName: targetCompany.managerName,
        contactNumber: targetCompany.contactNumber,
        email: targetCompany.email
      }
    }
    loading.value = false
  } catch (e) {
    showErrorModal('회사 정보를 불러올 수 없습니다.', true)
  }
}

const handleUpdate = async () => {
  try {
    await updateAdCompany(route.params.id, form.value)
    showSuccessModal('광고 회사 정보가 수정되었습니다.')
  } catch (e) {
    showErrorModal('수정에 실패했습니다.')
  }
}

function showSuccessModal(msg) {
  modalTitle.value = '완료'
  modalMessage.value = msg
  modalConfirmText.value = '확인'
  modalConfirmType.value = 'success'
  modalOpen.value = true
}

function showErrorModal(msg, redirect = false) {
  modalTitle.value = '오류'
  modalMessage.value = msg
  modalConfirmText.value = '확인'
  modalConfirmType.value = 'danger'
  modalOpen.value = true
  if (redirect) setTimeout(() => router.push('/admin/adcompany'), 1000)
}

function handleModalClose() {
  modalOpen.value = false
  if (modalConfirmType.value === 'success') {
    router.push('/admin/adcompany')
  }
}

onMounted(fetchData)
</script> 