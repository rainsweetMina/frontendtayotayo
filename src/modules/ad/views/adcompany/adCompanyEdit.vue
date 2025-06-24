<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-extrabold">광고 회사 수정</h2>
      <router-link
          to="/admin/adcompany"
          class="px-6 py-2 bg-gray-500 text-white text-lg rounded-lg font-semibold shadow hover:bg-gray-600 transition"
      >목록으로</router-link>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-lg text-gray-600">로딩 중...</div>
    </div>

    <div v-else-if="!company" class="flex justify-center items-center h-64">
      <div class="text-lg text-red-600">회사 정보를 찾을 수 없습니다.</div>
    </div>

    <div v-else class="bg-white shadow-lg rounded-xl p-8 max-w-4xl">
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">회사명 *</label>
            <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="회사명을 입력하세요"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">담당자명 *</label>
            <input
                v-model="form.managerName"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="담당자명을 입력하세요"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
            <input
                v-model="form.contactNumber"
                type="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="연락처를 입력하세요"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
            <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="이메일을 입력하세요"
            />
          </div>
        </div>
        
        <div class="flex gap-4 pt-6 border-t">
          <button
              type="submit"
              class="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >수정</button>
          <router-link
              to="/admin/adcompany"
              class="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >취소</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchAdCompanies, updateAdCompany } from '@/modules/ad/api/adCompanyApi.js'

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
    alert('회사 정보를 불러올 수 없습니다.')
    router.push('/admin/adcompany')
  }
}

const handleUpdate = async () => {
  try {
    await updateAdCompany(route.params.id, form.value)
    alert('광고 회사 정보가 수정되었습니다.')
    router.push('/admin/adcompany')
  } catch (e) {
    alert('수정에 실패했습니다.')
  }
}

onMounted(fetchData)
</script> 