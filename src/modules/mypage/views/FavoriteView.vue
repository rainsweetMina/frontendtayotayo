<template>
  <div class="favorite-search">
    <h2>⭐ 즐겨찾기 등록</h2>

    <input
        v-model="keyword"
        @keyup.enter="search"
        type="text"
        placeholder="노선명 또는 정류장명을 입력하세요"
    />
    <button @click="search">검색</button>

    <!-- 검색 결과 영역 -->
    <div class="search-result">
      <div v-if="busStops.length">
        <h3>📍 정류장 결과</h3>
        <ul>
          <li v-for="stop in busStops" :key="stop.bsId">
            {{ stop.bsNm }} (ID: {{ stop.bsId }})
            <button @click="addFavoriteStop(stop)">+ 즐겨찾기</button>
          </li>
        </ul>
      </div>

      <div v-if="busNumbers.length">
        <h3>🚌 버스 노선 결과</h3>
        <ul>
          <li v-for="route in busNumbers" :key="route.routeId">
            {{ route.routeNo }}번 ({{ route.stNm }} → {{ route.edNm }})
            <button @click="addFavoriteRoute(route)">+ 즐겨찾기</button>
          </li>
        </ul>
      </div>

      <div v-if="!busStops.length && !busNumbers.length && searched">
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>

    <!-- 등록된 즐겨찾기 영역 -->
    <div class="favorites-section">
      <!-- 📌 정류장 즐겨찾기 -->
      <div v-if="favoriteStops.length" class="favorites-block">
        <h3>📌 등록된 정류장 즐겨찾기</h3>
        <ul>
          <li
              v-for="stop in favoriteStops"
              :key="stop.bsId"
              @click="goToMap(stop.bsNm)"
              class="clickable-item"
          >
            {{ stop.bsNm }} (ID: {{ stop.bsId }})
            <button @click.stop="deleteFavoriteStop(stop.bsId)">❌ 삭제</button>
          </li>
        </ul>
      </div>

      <!-- 📌 노선 즐겨찾기 -->
      <div v-if="favoriteRoutes.length" class="favorites-block">
        <h3>📌 등록된 노선 즐겨찾기</h3>
        <ul>
          <li
              v-for="route in favoriteRoutes"
              :key="route.routeId"
              @click="goToMap(route.routeNo)"
              class="clickable-item"
          >
            {{ route.routeNo }}번 ({{ route.stNm }} → {{ route.edNm }})
            <button @click.stop="deleteFavoriteRoute(route.routeId)">❌ 삭제</button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <BaseModal :show="showModal" :message="modalMessage" @close="showModal = false" />

  <button class="back-button" @click="router.back()">← 마이페이지로 돌아가기</button>
</template>

<script setup>
import api from '@/api/axiosInstance'
import { ref, onMounted } from 'vue'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import { useRouter } from 'vue-router'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'

const router = useRouter()
const { user } = useUserInfo()

const keyword = ref('')
const busStops = ref([])
const busNumbers = ref([])
const searched = ref(false)

const favoriteStops = ref([])
const favoriteRoutes = ref([])

const showModal = ref(false)
const modalMessage = ref('')
const openModal = (msg) => {
  modalMessage.value = msg
  showModal.value = true
}

const search = async () => {
  if (!keyword.value.trim()) return

  try {
    const res = await api.get('/api/bus/searchBSorBN', {
      params: { keyword: keyword.value }
    })
    busStops.value = res.data.busStops
    busNumbers.value = res.data.busNumbers
    searched.value = true
  } catch (e) {
    console.error('❌ 검색 중 오류:', e)
  }
}

const fetchFavorites = async () => {
  try {
    const stopRes = await api.get('/api/mypage/favorite/bus-stop')
    favoriteStops.value = stopRes.data

    const routeRes = await api.get('/api/mypage/favorite/route')
    favoriteRoutes.value = routeRes.data
  } catch (e) {
    console.error('❌ 즐겨찾기 목록 불러오기 실패:', e)
  }
}

const addFavoriteStop = async (stop) => {
  try {
    await api.post('/api/mypage/favorite/bus-stop', { bsId: stop.bsId })
    openModal(`'${stop.bsNm}' 정류장이 즐겨찾기에 추가되었습니다.`)
    fetchFavorites()
  } catch (e) {
    console.error('❌ 정류장 즐겨찾기 실패:', e)
    openModal('추가에 실패했습니다.')
  }
}

function goToMap(stopName) {
  if (!stopName) return
  const keyword = encodeURIComponent(stopName)
  const url = `/bus/map?keyword=${keyword}`
  window.open(url, '_blank')
}

const addFavoriteRoute = async (route) => {
  try {
    await api.post('/api/mypage/favorite/route', { routeId: route.routeId })
    openModal(`'${route.routeNo}'번 노선이 즐겨찾기에 추가되었습니다.`)
    fetchFavorites()
  } catch (e) {
    console.error('❌ 노선 즐겨찾기 실패:', e)
    openModal('추가에 실패했습니다.')
  }
}

const deleteFavoriteStop = async (bsId) => {
  const confirmed = confirm('정말 해당 정류장을 즐겨찾기에서 삭제하시겠습니까?')
  if (!confirmed) return

  try {
    await api.delete(`/api/mypage/favorite/bus-stop/${bsId}`)
    favoriteStops.value = favoriteStops.value.filter(s => s.bsId !== bsId)
    openModal('정류장 즐겨찾기가 삭제되었습니다.')
  } catch (e) {
    console.error('❌ 정류장 즐겨찾기 삭제 실패:', e)
    openModal('삭제 실패')
  }
}

const deleteFavoriteRoute = async (routeId) => {
  const confirmed = confirm('정말 해당 노선을 즐겨찾기에서 삭제하시겠습니까?')
  if (!confirmed) return

  try {
    await api.delete(`/api/mypage/favorite/route/${routeId}`)
    favoriteRoutes.value = favoriteRoutes.value.filter(r => r.routeId !== routeId)
    openModal('노선 즐겨찾기가 삭제되었습니다.')
  } catch (e) {
    console.error('❌ 노선 즐겨찾기 삭제 실패:', e)
    openModal('삭제 실패')
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorite-search {
  max-width: 700px;
  margin: 30px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

input {
  padding: 10px;
  width: 60%;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 6px 12px;
  margin-left: 8px;
  border: none;
  border-radius: 6px;
  background-color: #4889cd;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #2877cd;
}

h3 {
  margin-top: 24px;
  color: #2c3e50;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.favorites-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.favorites-block {
  margin-bottom: 30px;
}

.back-button {
  background: none;
  color: #4889cd;
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  margin: 0 auto 10px auto; /* 가운데 정렬 + 하단 여백 */
  display: block;           /* 가운데 정렬 위해 block 설정 */
}
.back-button:hover {
  color: #2877cd;
}



.clickable-item {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-item:hover {
  background-color: #f2f2f2;
}

</style>
