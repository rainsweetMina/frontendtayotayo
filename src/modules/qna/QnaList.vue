<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-extrabold">QnA 관리</h2>
      <router-link to="/admin/qna" class="hidden"></router-link>
    </div>
    <div class="mb-6">
      <SearchBar placeholder="제목, 내용, 작성자, 답변 검색" @search="handleSearch" @reset="resetSearch" />
    </div>
    <div class="bg-white shadow-lg rounded-xl overflow-x-auto w-full">
      <table class="w-full text-base">
        <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 font-bold text-gray-700 text-center">ID</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">질문 제목</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">내용</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">작성자</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">작성일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">상태</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">작업</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="qna in pagedQnaList" :key="qna.id" :class="rowClass(qna) + ' border-b hover:bg-blue-50 transition cursor-pointer'" @click="goDetail(qna.id)">
          <td class="py-3 px-4 text-center font-mono">{{ qna.id }}</td>
          <td class="py-3 px-4 font-semibold">
            <router-link :to="`/admin/qna/${qna.id}`" class="hover:underline text-blue-700">{{ qna.title }}</router-link>
          </td>
          <td class="py-3 px-4">{{ qna.content && qna.content.length > 30 ? qna.content.slice(0, 30) + '...' : qna.content }}</td>
          <td class="py-3 px-4 text-center">{{ qna.username || qna.userName || qna.author || qna.memberName || '-' }}</td>
          <td class="py-3 px-4 text-center">{{ formatDate(qna.createdAt) }}</td>
          <td class="py-3 px-4 text-center">
            <span v-if="qna.deleted" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-red-100 text-red-500">삭제됨</span>
            <span v-else-if="!qna.visible" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-gray-200 text-gray-500">숨김</span>
            <span v-else class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-green-100 text-green-700">정상</span>
          </td>
          <td class="py-3 px-4">
            <div class="flex justify-center items-center gap-2">
              <router-link
                v-if="!qna.answer"
                :to="`/admin/qna/${qna.id}/answer`"
                class="px-4 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200 hover:bg-green-100 transition"
                @click.stop
              >답변</router-link>
              <router-link
                v-if="qna.answer"
                :to="`/admin/qna/${qna.id}/edit`"
                class="px-4 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition"
                @click.stop
              >답변수정</router-link>
              <button
                class="px-4 py-1 rounded bg-yellow-50 text-yellow-700 font-semibold border border-yellow-200 hover:bg-yellow-100 transition"
                @click.stop="handleHide(qna.id)"
              >숨김</button>
              <button
                class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition"
                @click.stop="handleDelete(qna.id)"
              >삭제</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="qnaList.length === 0" class="py-8 text-center text-gray-500">
        QnA 데이터가 없습니다.
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import SearchBar from '@/modules/ad/components/SearchBar.vue'

const qnaList = ref([])
const router = useRouter()
const searchKeyword = ref('')
const filteredQnaList = ref([])
const page = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(filteredQnaList.value.length / pageSize))
const pagedQnaList = computed(() =>
  filteredQnaList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const fetchQnaList = async () => {
  try {
    const res = await axios.get('/api/qna/admin')
    qnaList.value = res.data
    filterQna()
  } catch (e) {
    alert('QnA 목록을 불러올 수 없습니다.')
  }
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  filterQna()
}

const resetSearch = () => {
  searchKeyword.value = ''
  filterQna()
}

const filterQna = () => {
  if (!searchKeyword.value) {
    filteredQnaList.value = qnaList.value
    return
  }
  const keyword = searchKeyword.value.toLowerCase()
  filteredQnaList.value = qnaList.value.filter(qna => {
    return (
      (qna.title && qna.title.toLowerCase().includes(keyword)) ||
      (qna.content && qna.content.toLowerCase().includes(keyword)) ||
      (qna.username && qna.username.toLowerCase().includes(keyword)) ||
      (qna.answer && qna.answer.toLowerCase().includes(keyword))
    )
  })
}

const rowClass = (qna) => {
  if (qna.deleted) return 'bg-red-50 text-red-700'
  if (!qna.visible) return 'bg-gray-50 text-gray-500'
  return ''
}

const goDetail = (id) => {
  router.push(`/admin/qna/${id}`)
}

const handleHide = async (id) => {
  if (!confirm('정말 숨기시겠습니까?')) return
  try {
    await axios.patch(`/api/qna/admin/hide/${id}`)
    await fetchQnaList()
    alert('숨김 처리되었습니다.')
  } catch (e) {
    alert('숨김 처리에 실패했습니다.')
  }
}

const handleDelete = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await axios.delete(`/api/qna/admin/${id}`)
    await fetchQnaList()
    alert('삭제되었습니다.')
  } catch (e) {
    alert('삭제에 실패했습니다.')
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

onMounted(fetchQnaList)
watch(qnaList, filterQna)
</script> 