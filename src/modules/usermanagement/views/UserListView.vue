<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">👥 사용자 목록</h2>

    <!-- 검색 영역 -->
    <div class="mb-4 flex gap-2 flex-wrap">
      <input v-model="searchKeyword" type="text" placeholder="아이디, 이름, 이메일, 전화번호 검색"
             class="border rounded px-2 py-1 w-72" />
    </div>

    <table class="w-full border border-gray-300 text-sm bg-white">
      <thead class="bg-gray-100 text-center">
      <tr>
        <th v-for="col in columns" :key="col.key" class="px-2 py-2"
            :class="{ 'cursor-pointer': col.sortable }"
            @click="col.sortable && toggleSort(col.key)">
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
          <button class="ml-1 px-1 py-0.5 bg-blue-500 text-white rounded text-xs"
                  @click="changeRole(user.userId, selectedRoles[user.userId])">변경</button>
        </td>
        <td class="px-2 py-2">{{ user.withdraw ? '탈퇴' : '활성' }}</td>
        <td class="px-2 py-2">
          <button class="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  @click="withdrawUser(user.userId)">탈퇴</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- ⏩ 페이지네이션 -->
    <div class="mt-4 flex justify-center items-center gap-2 text-sm">
      <button @click="currentPage = 0" :disabled="currentPage === 0"
              class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">처음</button>
      <button @click="currentPage--" :disabled="currentPage === 0"
              class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">이전</button>
      <button v-for="p in pagesToShow" :key="p" @click="currentPage = p"
              :class="['px-3 py-1 rounded',
                       p === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200']">
        {{ p + 1 }}
      </button>
      <button @click="currentPage++" :disabled="currentPage + 1 >= totalPages"
              class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">다음</button>
      <button @click="currentPage = totalPages - 1" :disabled="currentPage + 1 >= totalPages"
              class="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">마지막</button>
    </div>

    <!-- ❷ BaseModal -->
    <BaseModal :show="modal.show" :message="modal.message" @close="modal.show = false" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import axios from '@/api/axiosInstance'
import { formatDate, formatDateOnly } from '@/utils/dateUtils'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'   // ❶

/* ── 모달 상태 & 헬퍼 ───────────────────────────── */
const modal = reactive({ show: false, message: '' })
function openModal(msg) {
  modal.message = msg
  modal.show = true
}

/* ── 사용자 목록 상태 ───────────────────────────── */
const users = ref([])
const selectedRoles = ref({})
const roles = ['USER', 'ADMIN', 'BUS']
const searchKeyword = ref('')
const sortKey   = ref('id')
const sortOrder = ref('asc')

const pageSize     = 10
const currentPage  = ref(0)
const maxButtons   = 5

const columns = [
  { label: '회원번호',   key: 'id',          sortable: true },
  { label: '아이디',     key: 'userId',      sortable: true },
  { label: '이름',       key: 'username',    sortable: true },
  { label: '이메일',     key: 'email',       sortable: false },
  { label: '전화번호',   key: 'phoneNumber', sortable: false },
  { label: '가입일',     key: 'signupDate',  sortable: true },
  { label: '최근 로그인', key: 'lastLoginAt',sortable: false },
  { label: '가입유형',   key: 'signupType',  sortable: true },
  { label: '권한',       key: 'role',        sortable: true },
  { label: '권한변경',   key: 'roleChange',  sortable: false },
  { label: '계정상태',   key: 'withdraw',    sortable: true },
  { label: '탈퇴처리',   key: 'withdrawAction', sortable: false },
]

const fetchUsers = async () => {
  try {
    const res = await api.get('/api/admin/user')
    users.value = res.data
    selectedRoles.value = {}
    res.data.forEach(u => (selectedRoles.value[u.userId] = u.role))
  } catch (err) {
    console.error('❌ 사용자 목록 로딩 실패:', err)
    openModal('사용자 목록을 불러오지 못했습니다.')
  }
}

/* ── 컴퓨티드 ─────────────────────────────────── */
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  const keyword = searchKeyword.value.toLowerCase()
  return users.value.filter(u =>
      u.userId.toLowerCase().includes(keyword) ||
      u.username.toLowerCase().includes(keyword) ||
      u.email.toLowerCase().includes(keyword) ||
      u.phoneNumber?.toLowerCase().includes(keyword)
  )
})

const sortedUsers = computed(() =>
    [...filteredUsers.value].sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      if (aVal === bVal) return 0
      return sortOrder.value === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })
)

const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedUsers.value.length / pageSize))
)

const paginatedUsers = computed(() => {
  const start = currentPage.value * pageSize
  return sortedUsers.value.slice(start, start + pageSize)
})

const pagesToShow = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  let start = Math.max(0, cur - Math.floor(maxButtons / 2))
  let end   = Math.min(total - 1, start + maxButtons - 1)
  if (end - start < maxButtons - 1) start = Math.max(0, end - maxButtons + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

/* ── 정렬 & 액션 ───────────────────────────────── */
const toggleSort = key => {
  if (sortKey.value === key) sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortOrder.value = 'asc' }
}

const changeRole = async (userId, newRole) => {
  try {
    await api.post(`/api/admin/user/${userId}/role`, null, { params: { role: newRole } })
    openModal(`${userId}님의 권한이 ${newRole}으로 변경되었습니다.`)           // ❸
    fetchUsers()
  } catch (err) {
    console.error('❌ 역할 변경 실패:', err)
    openModal('역할 변경 중 오류가 발생했습니다.')
  }
}

const withdrawUser = async userId => {
  const first  = confirm(`${userId}님을 탈퇴 처리하시겠습니까?`)
  if (!first) return
  const second = confirm(`정말로 ${userId}님을 탈퇴 처리할까요? 이 작업은 되돌릴 수 없습니다.`)
  if (!second) return
  try {
    await api.post(`/admin/users/${userId}/withdraw`)
    openModal(`${userId}님이 탈퇴 처리되었습니다.`)                         // ❸
    fetchUsers()
  } catch (err) {
    console.error('❌ 탈퇴 처리 실패:', err)
    openModal('탈퇴 처리 중 오류가 발생했습니다.')
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
th:hover { background-color: #f0f0f0; }
</style>
