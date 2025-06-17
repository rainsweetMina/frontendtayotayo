<template>
  <div class="p-6">
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

    <table class="w-full border border-gray-300">
      <thead class="bg-gray-100">
      <tr>
        <th class="px-4 py-2 cursor-pointer" @click="toggleSort('id')">
          no <span v-if="sortKey === 'id'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th class="px-4 py-2">ID</th>
        <th class="px-4 py-2">API 키</th>
        <th class="px-4 py-2">상태</th>
        <th class="px-4 py-2">상태 변경</th>
        <th class="px-4 py-2">활성</th>
        <th class="px-4 py-2 cursor-pointer" @click="toggleSort('createdAt')">
          발급일 <span v-if="sortKey === 'createdAt'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th class="px-4 py-2">만료일</th>
        <th class="px-4 py-2">활성 전환</th>
        <th class="px-4 py-2">키 삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="key in filteredApiKeys"
          :key="key.id"
          class="text-center border-t"
      >
        <td class="px-4 py-2">{{ key.id }}</td>
        <td class="px-4 py-2">{{ key.userId }}</td>
        <td class="px-4 py-2">
          <span v-if="visibleKeys[key.id]">
            {{ key.apiKey }}
            <button @click="toggleVisibility(key.id)" class="ml-2 text-sm text-blue-600">숨기기</button>
          </span>
          <span v-else>
            {{ maskKey(key.apiKey) }}
            <button @click="toggleVisibility(key.id)" class="ml-2 text-sm text-blue-600">보기</button>
          </span>
        </td>

        <td class="px-4 py-2">{{ key.status }}</td>

        <td class="px-4 py-2">
          <select v-model="statusChanges[key.id]" class="border rounded px-2 py-1">
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
          <button
              class="ml-2 px-2 py-1 bg-green-500 text-white rounded"
              @click="updateStatus(key.id)"
          >
            변경
          </button>
        </td>

        <td class="px-4 py-2">{{ key.active ? '✅' : '❌' }}</td>
        <td class="px-4 py-2">{{ formatDate(key.createdAt) }}</td>
        <td class="px-4 py-2">{{ formatDate(key.expiresAt) }}</td>

        <td class="px-4 py-2">
          <button
              class="px-2 py-1 bg-indigo-500 text-white rounded"
              @click="toggleActive(key.id, key.active)"
          >
            {{ key.active ? '비활성화' : '활성화' }}
          </button>
        </td>
        <td class="px-4 py-2">
          <button
              class="px-2 py-1 bg-red-500 text-white rounded"
              @click="deleteKey(key.id)"
          >
            삭제
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/api/axiosInstance'

const apiKeys = ref([])
const statuses = ['APPROVED', 'PENDING', 'EXPIRED']
const statusChanges = ref({})
const visibleKeys = ref({})
const searchKeyword = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')

const fetchApiKeys = async () => {
  try {
    const res = await axios.get('/api/admin/apikey')
    apiKeys.value = res.data

    statusChanges.value = {}
    visibleKeys.value = {}
    res.data.forEach(key => {
      statusChanges.value[key.id] = key.status
      visibleKeys.value[key.id] = false
    })
  } catch (err) {
    console.error('❌ API 키 목록 로딩 실패:', err)
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
    await axios.put(`/api/admin/apikey/${id}/active`, { active: !isActive })
    alert(`API 키 ID ${id}가 ${action}되었습니다.`)
    fetchApiKeys()
  } catch (err) {
    console.error('❌ 상태 전환 실패:', err)
  }
}

const updateStatus = async (id) => {
  const newStatus = statusChanges.value[id]
  try {
    await axios.post(`/api/admin/apikey/${id}/status`, null, {
      params: { status: newStatus }
    })
    alert(`API 키 ID ${id}의 상태가 ${newStatus}로 변경되었습니다.`)
    fetchApiKeys()
  } catch (err) {
    console.error('❌ 상태 변경 실패:', err)
  }
}

const deleteKey = async (id) => {
  if (!confirm(`API 키 ID ${id}를 삭제하시겠습니까?`)) return

  try {
    await axios.delete(`/api/admin/apikey/${id}`)
    alert(`✅ API 키 ID ${id}가 삭제되었습니다.`)
    fetchApiKeys()
  } catch (err) {
    console.error('❌ 삭제 실패:', err)
    alert('삭제 중 오류가 발생했습니다.')
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

  // 🔍 검색 필터
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(k =>
        k.id.toString().includes(keyword) ||
        k.userId?.toLowerCase().includes(keyword)
    )
  }

  // 🔃 정렬 필터
  if (sortKey.value) {
    result = [...result].sort((a, b) => {
      const valA = a[sortKey.value]
      const valB = b[sortKey.value]

      if (sortKey.value === 'createdAt') {
        return sortOrder.value === 'asc'
            ? new Date(valA) - new Date(valB)
            : new Date(valB) - new Date(valA)
      }

      return sortOrder.value === 'asc'
          ? valA - valB
          : valB - valA
    })
  }

  return result
})

onMounted(() => {
  fetchApiKeys()
})
</script>
