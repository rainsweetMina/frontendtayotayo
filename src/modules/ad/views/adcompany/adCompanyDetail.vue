<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="광고 회사 상세" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <div v-if="!company" class="flex justify-center items-center py-20 text-gray-400 text-base">로딩 중...</div>
        <div v-else>
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ company.name }}</h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                ID: {{ company.id }}
              </span>
            </div>
          </div>
          
          <div class="py-4">
            <div class="bg-gray-50 rounded-md p-4 mb-6 border border-gray-100">
              <div class="mb-2"><b>회사명:</b> {{ company.name }}</div>
              <div class="mb-2"><b>담당자명:</b> {{ company.managerName }}</div>
              <div class="mb-2"><b>연락처:</b> {{ company.contactNumber }}</div>
              <div class="mb-2"><b>이메일:</b> {{ company.email }}</div>
            </div>
          </div>
          
          <div class="pt-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
            <router-link 
              :to="`/admin/adcompany/edit/${company.id}`" 
              class="px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
            >수정</router-link>
            <button 
              @click="openDeleteConfirm" 
              class="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
            >삭제</button>
            <button 
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" 
              @click="goList"
            >목록</button>
          </div>
        </div>
      </div>
    </div>
    <CommonModal
      :isOpen="modalOpen"
      :title="modalTitle"
      :message="modalMessage"
      :confirmText="modalConfirmText"
      :confirmType="modalConfirmType"
      :showCancel="modalShowCancel"
      @close="closeModal"
      @confirm="modalConfirmAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAdCompanies, deleteAdCompany } from '@/modules/ad/api/adCompanyApi.js'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const route = useRoute()
const router = useRouter()
const company = ref(null)

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')
const modalShowCancel = ref(false)
let modalConfirmAction = () => { modalOpen.value = false }

const openModal = (title, message, confirmText = '확인', confirmType = 'primary', showCancel = false, onConfirm = null) => {
  modalTitle.value = title
  modalMessage.value = message
  modalConfirmText.value = confirmText
  modalConfirmType.value = confirmType
  modalShowCancel.value = showCancel
  modalOpen.value = true
  modalConfirmAction = onConfirm || (() => { modalOpen.value = false })
}

const closeModal = () => { modalOpen.value = false }

const fetchCompany = async () => {
  try {
    const companies = await fetchAdCompanies()
    const targetCompany = companies.find(c => c.id == route.params.id)
    
    if (targetCompany) {
      company.value = targetCompany
    } else {
      openModal('오류', '회사 정보를 찾을 수 없습니다.', '확인', 'danger')
      setTimeout(() => router.push('/admin/adcompany'), 1000)
    }
  } catch (e) {
    openModal('오류', '회사 정보를 불러올 수 없습니다.', '확인', 'danger')
    setTimeout(() => router.push('/admin/adcompany'), 1000)
  }
}

const goList = () => router.push('/admin/adcompany')

const openDeleteConfirm = () => {
  openModal('삭제 확인', '정말 삭제하시겠습니까?', '삭제', 'danger', true, handleDelete)
}

const handleDelete = async () => {
  modalOpen.value = false
  try {
    await deleteAdCompany(company.value.id)
    openModal('완료', '삭제되었습니다.', '확인', 'success', false, () => router.push('/admin/adcompany'))
  } catch (e) {
    openModal('오류', '삭제에 실패했습니다.', '확인', 'danger')
  }
}

onMounted(fetchCompany)
</script> 