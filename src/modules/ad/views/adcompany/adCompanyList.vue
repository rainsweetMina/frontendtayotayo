<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-extrabold">광고 회사 관리</h2>
      <router-link
          to="/admin/adcompany/create"
          class="px-6 py-2 bg-blue-600 text-white text-lg rounded-lg font-semibold shadow hover:bg-blue-700 transition"
      >회사 등록</router-link>
    </div>

    <!-- 검색바 -->
    <div class="mb-6">
      <SearchBar
        placeholder="회사명, 담당자명, 연락처, 이메일 검색"
        @search="handleSearch"
        @reset="resetSearch"
      />
    </div>

    <!-- 회사 목록 테이블 -->
    <div class="bg-white shadow-lg rounded-xl overflow-x-auto w-full">
      <table class="w-full text-base">
        <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 font-bold text-gray-700 text-center">ID</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">회사명</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">담당자명</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">연락처</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">이메일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">액션</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="company in pagedCompanyList"
            :key="company.id"
            class="border-b hover:bg-blue-50 transition cursor-pointer"
            @click="openDetail(company)"
        >
          <td class="py-3 px-4 text-center font-mono">{{ company.id }}</td>
          <td class="py-3 px-4 font-semibold">{{ company.name }}</td>
          <td class="py-3 px-4">{{ company.managerName }}</td>
          <td class="py-3 px-4 text-center">{{ company.contactNumber }}</td>
          <td class="py-3 px-4 text-center">{{ company.email }}</td>
          <td class="py-3 px-4">
            <div class="flex justify-center items-center gap-2">
              <router-link
                  :to="`/admin/adcompany/edit/${company.id}`"
                  class="px-4 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition"
                  @click.stop
              >수정</router-link>
              <button
                  class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition"
                  @click.stop="handleDelete(company.id)"
              >삭제</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      
      <!-- 검색 결과가 없을 때 -->
      <div v-if="filteredCompanyList.length === 0" class="py-8 text-center text-gray-500">
        <p v-if="searchKeyword">"{{ searchKeyword }}"에 대한 검색 결과가 없습니다.</p>
        <p v-else>등록된 광고 회사가 없습니다.</p>
      </div>

      <!-- 페이지네이션 UI -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <nav class="flex items-center space-x-1" aria-label="Pagination">
          <button
            class="px-3 py-1 rounded border text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 mr-1"
            :disabled="page === 1"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
            @click="() => { if (page > 1) page--; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
          >이전</button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="px-3 py-1 rounded border text-sm font-medium mx-0.5"
            :class="[
              page === p ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold underline' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
              'transition-colors duration-150'
            ]"
            @click="() => { page = p; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
          >{{ p }}</button>
          <button
            class="px-3 py-1 rounded border text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 ml-1"
            :disabled="page === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
            @click="() => { if (page < totalPages) page++; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
          >다음</button>
        </nav>
      </div>
    </div>

    <!-- 광고 회사 상세 팝업 -->
    <div v-if="detailCompany" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          @click="closeDetail"
          aria-label="닫기"
        >&times;</button>
        
        <h3 class="text-2xl font-bold mb-6 text-center">{{ detailCompany.name }}</h3>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center py-2 border-b">
            <span class="font-semibold text-gray-700">회사 ID:</span>
            <span class="text-gray-900">{{ detailCompany.id }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b">
            <span class="font-semibold text-gray-700">담당자명:</span>
            <span class="text-gray-900">{{ detailCompany.managerName }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b">
            <span class="font-semibold text-gray-700">연락처:</span>
            <span class="text-gray-900">{{ detailCompany.contactNumber }}</span>
          </div>
          
          <div class="flex justify-between items-center py-2 border-b">
            <span class="font-semibold text-gray-700">이메일:</span>
            <span class="text-gray-900">{{ detailCompany.email }}</span>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6 pt-4 border-t">
          <router-link
              :to="`/admin/adcompany/edit/${detailCompany.id}`"
              class="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition"
          >수정</router-link>
          <button
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              @click="handleDeleteFromDetail(detailCompany.id)"
          >삭제</button>
          <button
              class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              @click="closeDetail"
          >닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAdCompanies, deleteAdCompany } from '@/modules/ad/api/adCompanyApi.js'
import SearchBar from '@/modules/ad/components/SearchBar.vue'

const companyList = ref([])
const detailCompany = ref(null)
const searchKeyword = ref('')
const page = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(companyList.value.length / pageSize))
const pagedCompanyList = computed(() =>
  companyList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const openDetail = (company) => {
  detailCompany.value = company
}

const closeDetail = () => {
  detailCompany.value = null
}

const fetchData = async () => {
  try {
    companyList.value = (await fetchAdCompanies()).sort((a, b) => b.id - a.id)
    console.log('Fetched companies:', companyList.value)
  } catch (e) {
    alert('광고 회사 목록을 불러올 수 없습니다.')
  }
}

// 검색 기능
const handleSearch = (keyword) => {
  console.log('Search keyword:', keyword)
  searchKeyword.value = keyword
}

const resetSearch = () => {
  searchKeyword.value = ''
}

// 필터링된 회사 목록
const filteredCompanyList = computed(() => {
  console.log('Computing filtered list, keyword:', searchKeyword.value)
  console.log('Original list length:', companyList.value.length)
  
  if (!searchKeyword.value) {
    return companyList.value
  }
  
  const keyword = searchKeyword.value.toLowerCase()
  const filtered = companyList.value.filter(company => {
    const matches = 
      (company.name && company.name.toLowerCase().includes(keyword)) ||
      (company.managerName && company.managerName.toLowerCase().includes(keyword)) ||
      (company.contactNumber && company.contactNumber.toLowerCase().includes(keyword)) ||
      (company.email && company.email.toLowerCase().includes(keyword))
    
    console.log(`Company ${company.name}: matches = ${matches}`)
    return matches
  })
  
  console.log('Filtered list length:', filtered.length)
  return filtered
})

const handleDelete = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await deleteAdCompany(id)
    await fetchData()
    alert('삭제되었습니다.')
  } catch (e) {
    alert('삭제에 실패했습니다.')
  }
}

const handleDeleteFromDetail = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await deleteAdCompany(id)
    await fetchData()
    closeDetail()
    alert('삭제되었습니다.')
  } catch (e) {
    alert('삭제에 실패했습니다.')
  }
}

onMounted(fetchData)
</script> 