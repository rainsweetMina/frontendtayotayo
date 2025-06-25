<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">👥 사용자 목록</h2>

    <!-- 검색 영역 -->
    <div class="mb-4 flex gap-2 flex-wrap">
      <input v-model="searchKeyword" type="text" placeholder="아이디, 이름, 이메일, 전화번호 검색" class="border rounded px-2 py-1 w-72" />
    </div>

    <table class="w-full border border-gray-300 text-sm">
      <thead class="bg-gray-100 text-center">
      <tr>
        <th v-for="col in columns" :key="col.key" class="px-2 py-2" :class="{ 'cursor-pointer': col.sortable }" @click="col.sortable && toggleSort(col.key)">
          {{ col.label }}
          <span v-if="sortKey === col.key">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in paginatedUsers" :key="user.userId" class="text-center border-t">
        <td class="px-2 py-2">{{ user.id }}</td>
        <td class="px-2 py-2">{{ user.userId }}</td>
        <td class="px-2 py-2">{{ user.username }}</td>
        <td class="px-2 py-2">{{ user.email }}</td>
        <td class="px-2 py-2">{{ user.phoneNumber }}</td>
        <td class="px-2 py-2">{{ formatDateOnly(user.signupDate) }}</td>
        <td class="px-2 py-2">{{ formatDate(user.lastLoginAt) }}</td>
        <td class="px-2 py-2">{{ user.signupType }}</td>
        <td class="px-2 py-2">{{ user.role }}</td>
        <td class="px-2 py-2">
          <select v-model="selectedRoles[user.userId]" class="border rounded px-1 py-0.5 text-xs">
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
          <button class="ml-1 px-1 py-0.5 bg-blue-500 text-white rounded text-xs" @click="changeRole(user.userId, selectedRoles[user.userId])">변경</button>
        </td>
        <td class="px-2 py-2">{{ user.withdraw ? '탈퇴' : '활성' }}</td>
        <td class="px-2 py-2">
          <button class="px-2 py-1 bg-red-500 text-white rounded text-xs" @click="withdrawUser(user.userId)">탈퇴</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="mt-4 flex justify-center items-center gap-2">
      <button @click="currentPage--" :disabled="currentPage === 1" class="px-2">⬅</button>
      <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-2">➡</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/api/axiosInstance'
import { formatDate, formatDateOnly } from '@/utils/dateUtils'

const users = ref([])
const selectedRoles = ref({})
const roles = ['USER', 'ADMIN', 'BUS']
const searchKeyword = ref('')
const sortKey = ref('id')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = 10

const columns = [
  { label: '회원번호', key: 'id', sortable: true },
  { label: '아이디', key: 'userId', sortable: true },
  { label: '이름', key: 'username', sortable: true },
  { label: '이메일', key: 'email', sortable: false },
  { label: '전화번호', key: 'phoneNumber', sortable: false },
  { label: '가입일', key: 'signupDate', sortable: true },
  { label: '최근 로그인', key: 'lastLoginAt', sortable: false },
  { label: '가입유형', key: 'signupType', sortable: true },
  { label: '권한', key: 'role', sortable: true },
  { label: '권한변경', key: 'roleChange', sortable: false },
  { label: '계정상태', key: 'withdraw', sortable: true },
  { label: '탈퇴처리', key: 'withdrawAction', sortable: false },
]

const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/admin/user')
    users.value = res.data
    selectedRoles.value = {}
    res.data.forEach(user => {
      selectedRoles.value[user.userId] = user.role
    })
  } catch (err) {
    console.error('❌ 사용자 목록 로딩 실패:', err)
  }
}

const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  return users.value.filter(user => {
    const keyword = searchKeyword.value.toLowerCase()
    return (
        user.userId.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phoneNumber?.toLowerCase().includes(keyword)
    )
  })
})

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal === bVal) return 0
    if (sortOrder.value === 'asc') return aVal > bVal ? 1 : -1
    return aVal < bVal ? 1 : -1
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedUsers.value.slice(start, start + pageSize)
})

const totalPages = computed(() => {
  return Math.ceil(sortedUsers.value.length / pageSize)
})

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const changeRole = async (userId, newRole) => {
  try {
    await axios.post(`/api/admin/user/${userId}/role`, null, {
      params: { role: newRole }
    })
    alert(`${userId} 역할이 ${newRole}으로 변경되었습니다.`)
    fetchUsers()
  } catch (err) {
    console.error('❌ 역할 변경 실패:', err)
  }
}

const withdrawUser = async (userId) => {
  const first = confirm(`${userId}님을 탈퇴 처리하시겠습니까?`)
  if (!first) return
  const second = confirm(`정말로 ${userId}님을 탈퇴 처리할까요? 이 작업은 되돌릴 수 없습니다.`)
  if (!second) return
  try {
    await axios.post(`/admin/users/${userId}/withdraw`)
    alert(`${userId} 탈퇴 처리 완료`)
    fetchUsers()
  } catch (err) {
    console.error('❌ 탈퇴 처리 실패:', err)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
th:hover {
  background-color: #f0f0f0;
}
</style>