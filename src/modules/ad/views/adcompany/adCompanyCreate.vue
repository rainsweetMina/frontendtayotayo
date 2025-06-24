<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-extrabold">광고 회사 등록</h2>
      <router-link
          to="/admin/adcompany"
          class="px-6 py-2 bg-gray-500 text-white text-lg rounded-lg font-semibold shadow hover:bg-gray-600 transition"
      >목록으로</router-link>
    </div>

    <div class="bg-white shadow-lg rounded-xl p-8 max-w-4xl">
      <form @submit.prevent="handleCreate" class="space-y-6">
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
          >등록</button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createAdCompany } from '@/modules/ad/api/adCompanyApi.js'

const router = useRouter()

const form = ref({
  name: '',
  managerName: '',
  contactNumber: '',
  email: ''
})

const handleCreate = async () => {
  try {
    await createAdCompany(form.value)
    alert('광고 회사가 등록되었습니다.')
    router.push('/admin/adcompany')
  } catch (e) {
    alert('등록에 실패했습니다.')
  }
}
</script> 