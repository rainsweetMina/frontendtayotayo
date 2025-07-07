<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">🔑 API 키 관리</h2>

      <!-- 🔍 검색 영역 -->
      <div class="mb-4">
        <input
            v-model="searchKeyword"
            type="text"
            placeholder="키 번호, 아이디 검색"
            class="border px-3 py-2 rounded w-64"
        />
      </div>

      <table class="w-full border border-gray-300 text-sm bg-white">
        <thead class="bg-gray-100 text-center">
        <tr>
          <th class="px-2 py-2 cursor-pointer" @click="toggleSort('id')">
            no <span v-if="sortKey === 'id'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th class="px-2 py-2">ID</th>
          <th class="px-2 py-2">API 키</th>
          <th class="px-2 py-2">상태</th>
          <th class="px-2 py-2">상태 변경</th>
          <th class="px-2 py-2">활성</th>
          <th class="px-2 py-2 cursor-pointer" @click="toggleSort('createdAt')">
            발급일 <span v-if="sortKey === 'createdAt'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th class="px-2 py-2">만료일</th>
          <th class="px-2 py-2">활성 전환</th>
          <th class="px-2 py-2">키 삭제</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="key in paginatedKeys"
            :key="key.id"
            class="text-center border-t text-sm"
        >
          <td class="px-2 py-2">{{ key.id }}</td>
          <td class="px-2 py-2">{{ key.userId }}</td>
          <td class="px-2 py-2">
            <span v-if="visibleKeys[key.id]">
              {{ key.apiKey }}
              <button @click="toggleVisibility(key.id)" class="ml-2 text-xs text-blue-600">숨기기</button>
            </span>
            <span v-else>
              {{ maskKey(key.apiKey) }}
              <button @click="toggleVisibility(key.id)" class="ml-2 text-xs text-blue-600">보기</button>
            </span>
          </td>

          <td class="px-2 py-2">{{ key.status }}</td>

          <td class="px-2 py-2">
            <select v-model="statusChanges[key.id]" class="border rounded px-2 py-1 text-xs">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
            <button
                class="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                @click="updateStatus(key.id)"
            >
              변경
            </button>
          </td>

          <td class="px-2 py-2">{{ key.active ? '✅' : '❌' }}</td>
          <td class="px-2 py-2">{{ formatDate(key.createdAt) }}</td>
          <td class="px-2 py-2">{{ formatDate(key.expiresAt) }}</td>

          <td class="px-2 py-2">
            <button
                class="px-2 py-1 bg-indigo-500 text-white rounded text-xs"
                @click="toggleActive(key.id, key.active)"
            >
              {{ key.active ? '비활성화' : '활성화' }}
            </button>
          </td>
          <td class="px-2 py-2">
            <button
                class="px-2 py-1 bg-red-500 text-white rounded text-xs"
                @click="deleteKey(key.id)"
            >
              삭제
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- ⏩ 페이지네이션 -->
      <div class="mt-4 flex justify-center items-center gap-2 text-sm">
        <button @click="currentPage = 0" :disabled="currentPage === 0"
                class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">처음
        </button>
        <button @click="currentPage--" :disabled="currentPage === 0"
                class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">이전
        </button>
        <button
            v-for="p in pagesToShow"
            :key="p"
            @click="currentPage = p"
            :class="[
              'px-3 py-1 rounded',
              p === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            ]"
        >{{ p + 1 }}
        </button>
        <button @click="currentPage++" :disabled="currentPage + 1 >= totalPages"
                class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">다음
        </button>
        <button @click="currentPage = totalPages - 1" :disabled="currentPage + 1 >= totalPages"
                class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">마지막
        </button>
      </div>
    </div>
    <BaseModal
        :show="modal.show"
        :message="modal.message"
        @close="modal.show = false"
    />
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import api from '@/api/axiosInstance'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'   /* ❶ */

// ───────────────────────────────────────
// 모달 상태 & 헬퍼
// ───────────────────────────────────────
const modal = reactive({
  show: false,
  message: ''
})

function openModal(msg) {
  modal.message = msg
  modal.show = true
}

// ───────────────────────────────────────
// API 키 관리 상태
// ───────────────────────────────────────
const apiKeys = ref([])
const statuses = ['APPROVED', 'PENDING', 'EXPIRED']
const statusChanges = ref({})
const visibleKeys = ref({})
const searchKeyword = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')

const pageSize = 10
const currentPage = ref(0)
const maxButtons = 5

const fetchApiKeys = async () => {
  try {
    const res = await api.get('/api/admin/apikey')
    apiKeys.value = res.data
    statusChanges.value = {}
    visibleKeys.value = {}
    res.data.forEach(key => {
      statusChanges.value[key.id] = key.status
      visibleKeys.value[key.id] = false
    })
  } catch (err) {
    console.error('❌ API 키 목록 로딩 실패:', err)
    openModal('API 키 목록을 불러오지 못했습니다.')
  }
}

const toggleVisibility = (id) => {
  visibleKeys.value[id] = !visibleKeys.value[id]
}

const maskKey = (key) => {
  if (!key) return ''
  return '*'.repeat(key.length - 4) + key.slice(-4)
}

const toggleActive = async (id, isActive) => {
  const action = isActive ? '비활성화' : '활성화'
  if (!confirm(`API 키를 ${action} 하시겠습니까?`)) return
  try {
    await api.put(`/api/admin/apikey/${id}/active`, {active: !isActive})
    openModal(`API 키 ID ${id}가 ${action}되었습니다.`)        /* ❸ */
    fetchApiKeys()
  } catch (err) {
    console.error('❌ 상태 전환 실패:', err)
    openModal('상태 전환 중 오류가 발생했습니다.')
  }
}

const updateStatus = async (id) => {
  const newStatus = statusChanges.value[id]
  try {
    await api.post(`/api/admin/apikey/${id}/status`, null, {
      params: {status: newStatus}
    })
    openModal(`API 키 ID ${id}의 상태가 ${newStatus}로 변경되었습니다.`)  /* ❸ */
    fetchApiKeys()
  } catch (err) {
    console.error('❌ 상태 변경 실패:', err)
    openModal('상태 변경 중 오류가 발생했습니다.')
  }
}

const deleteKey = async (id) => {
  if (!confirm(`API 키 ID ${id}를 삭제하시겠습니까?`)) return
  try {
    await api.delete(`/api/admin/apikey/${id}`)
    openModal(`✅ API 키 ID ${id}가 삭제되었습니다.`)          /* ❸ */
    fetchApiKeys()
  } catch (err) {
    console.error('❌ 삭제 실패:', err)
    openModal('삭제 중 오류가 발생했습니다.')
  }
}

const formatDate = (datetime) => {
  return new Date(datetime).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const filteredApiKeys = computed(() => {
  let result = apiKeys.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(k =>
        k.id.toString().includes(keyword) ||
        k.userId?.toLowerCase().includes(keyword)
    )
  }
  if (sortKey.value) {
    result = [...result].sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]
      if (sortKey.value === 'createdAt') {
        return sortOrder.value === 'asc'
            ? new Date(valA) - new Date(valB)
            : new Date(valB) - new Date(valA)
      }
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    })
  }
  return result
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredApiKeys.value.length / pageSize))
)

const paginatedKeys = computed(() => {
  const start = currentPage.value * pageSize
  return filteredApiKeys.value.slice(start, start + pageSize)
})

const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  let start = Math.max(0, cur - Math.floor(maxButtons / 2))
  let end = Math.min(total - 1, start + maxButtons - 1)
  if (end - start < maxButtons - 1) start = Math.max(0, end - maxButtons + 1)
  return Array.from({length: end - start + 1}, (_, i) => start + i)
})

onMounted(fetchApiKeys)
</script>