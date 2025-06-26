<template>
  <div class="w-full px-0 py-8">
    <div class="flex justify-between items-center mb-8 px-8">
      <h2 class="text-3xl font-extrabold">등록된 광고 목록</h2>
      <router-link
          to="/admin/ad/create"
          class="px-6 py-2 bg-blue-600 text-white text-lg rounded-lg font-semibold shadow hover:bg-blue-700 transition"
      >광고 등록</router-link>
    </div>

    <!-- 검색바 -->
    <div class="mb-6">
      <SearchBar
        placeholder="제목, 광고회사, 상태 검색"
        @search="handleSearch"
        @reset="resetSearch"
      />
    </div>

    <!-- 필터 버튼들 -->
    <div class="mb-6 flex flex-wrap gap-3 px-8">
      <button 
        @click="setFilter('all')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        전체 ({{ adList.length }})
      </button>
      <button 
        @click="setFilter('scheduled')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'scheduled' 
            ? 'bg-yellow-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        예정 ({{ scheduledCount }})
      </button>
      <button 
        @click="setFilter('ongoing')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'ongoing' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        진행중 ({{ ongoingCount }})
      </button>
      <button 
        @click="setFilter('ending_soon')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'ending_soon' 
            ? 'bg-orange-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        종료임박 ({{ endingSoonCount }})
      </button>
      <button 
        @click="setFilter('ended')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          currentFilter === 'ended' 
            ? 'bg-gray-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        종료됨 ({{ endedCount }})
      </button>
    </div>

    <div class="bg-white shadow-lg rounded-xl overflow-x-auto w-full">
      <table class="w-full text-base">
        <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 font-bold text-gray-700 text-center">ID</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">이미지</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">제목</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">광고회사</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">상태</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">연장횟수</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">시작일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">종료일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">액션</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="ad in pagedAdList"
            :key="ad.id"
            class="border-b hover:bg-blue-50 transition cursor-pointer"
            @click="openDetail(ad)"
        >
          <td class="py-3 px-4 text-center font-mono">{{ ad.id }}</td>
          <td class="py-2 px-4 flex justify-center items-center">
            <img
                v-if="ad.imageUrl"
                :src="`${IMAGE_BASE_URL}/ad/${ad.imageUrl}`"
                alt="광고 이미지"
                class="w-80 h-20 object-cover rounded-lg shadow"
                style="min-width: 320px; min-height: 80px;"
            />
            <span v-else class="text-gray-400">-</span>
          </td>
          <td class="py-2 px-4 font-semibold truncate">{{ ad.title }}</td>
          <td class="py-2 px-4 text-center">{{ ad.companyName }}</td>
          <td class="py-2 px-4 text-center">
            <span
                :class="[
                'inline-block rounded-full px-3 py-1 text-sm font-bold',
                ad.status === 'ONGOING'
                  ? 'bg-green-100 text-green-700'
                  : ad.status === 'SCHEDULED'
                  ? 'bg-yellow-100 text-yellow-700'
                  : ad.status === 'ENDING_SOON'
                  ? 'bg-orange-100 text-orange-700'
                  : ad.status === 'ENDED'
                  ? 'bg-gray-200 text-gray-500'
                  : ad.status === 'DELETED'
                  ? 'bg-red-100 text-red-500'
                  : 'bg-gray-100 text-gray-400'
              ]"
            >
              {{ statusText(ad.status) }}
            </span>
          </td>
          <td class="py-2 px-4 text-center">{{ ad.extensionCount }}회</td>
          <td class="py-2 px-4 text-center">{{ formatDate(ad.startDateTime) }}</td>
          <td class="py-2 px-4 text-center">{{ formatDate(ad.endDateTime) }}</td>
          <td class="py-2 px-4">
            <div class="flex justify-center items-center gap-2">
              <button
                  class="px-4 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition"
                  @click.stop="goEdit(ad.id)"
              >수정</button>
              <button
                  class="px-4 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200 hover:bg-green-100 transition"
                  @click.stop="goExtend(ad.id)"
              >연장</button>
              <button
                  class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition"
                  @click.stop="handleDelete(ad.id)"
              >삭제</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      
      <!-- 검색 결과가 없을 때 -->
      <div v-if="filteredAdList.length === 0" class="py-8 text-center text-gray-500">
        <p v-if="searchKeyword">"{{ searchKeyword }}"에 대한 검색 결과가 없습니다.</p>
        <p v-else>등록된 광고가 없습니다.</p>
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

    <!-- 광고 상세 팝업 -->
    <div v-if="detailAd" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          @click="closeDetail"
          aria-label="닫기"
        >&times;</button>
        <img :src="`${IMAGE_BASE_URL}/ad/${detailAd.imageUrl}`" alt="광고" class="w-full rounded mb-4" />
        <div class="mb-2"><b>제목:</b> {{ detailAd.title }}</div>
        <div class="mb-2"><b>링크:</b> <a :href="detailAd.linkUrl" target="_blank" class="text-blue-600 underline">{{ detailAd.linkUrl }}</a></div>
        <div class="mb-2"><b>기간:</b> {{ formatDate(detailAd.startDateTime) }} ~ {{ formatDate(detailAd.endDateTime) }}</div>
        <div class="mb-2"><b>광고회사:</b> {{ detailAd.companyName }}</div>
        <div class="flex gap-2 mt-4">
          <button class="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" @click="goEdit(detailAd.id)">수정</button>
          <button class="px-4 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700" @click="goExtend(detailAd.id)">연장</button>
          <button class="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700" @click="handleDelete(detailAd.id)">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAds, deleteAd } from '@/modules/ad/api/adApi.js'
import SearchBar from '@/modules/ad/components/SearchBar.vue'

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL

const router = useRouter()
const adList = ref([])
const detailAd = ref(null)
const searchKeyword = ref('')
const currentFilter = ref('all')
const page = ref(1)
const pageSize = 10

const openDetail = (ad) => { detailAd.value = ad }
const closeDetail = () => { detailAd.value = null }

const fetchData = async () => {
  try {
    adList.value = (await fetchAds()).sort((a, b) => b.id - a.id)
  } catch (e) {
    alert('광고 목록을 불러올 수 없습니다.')
  }
}

// 검색 기능
const handleSearch = (keyword) => {
  searchKeyword.value = keyword
}

const resetSearch = () => {
  searchKeyword.value = ''
  currentFilter.value = 'all'
}

// 필터링된 광고 목록
const filteredAdList = computed(() => {
  let filtered = adList.value

  // 필터 적용
  switch (currentFilter.value) {
    case 'scheduled':
      filtered = filtered.filter(ad => ad.status === 'SCHEDULED')
      break
    case 'ongoing':
      filtered = filtered.filter(ad => ad.status === 'ONGOING')
      break
    case 'ending_soon':
      filtered = filtered.filter(ad => ad.status === 'ENDING_SOON')
      break
    case 'ended':
      filtered = filtered.filter(ad => ad.status === 'ENDED')
      break
    case 'all':
    default:
      // 전체는 필터링하지 않음
      break
  }

  // 검색어 적용
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(ad => 
      ad.title.toLowerCase().includes(keyword) ||
      ad.companyName.toLowerCase().includes(keyword) ||
      statusText(ad.status).toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 수정 버튼 클릭 이벤트
const goEdit = (id) => {
  router.push({ name: 'AdminAdEdit', params: { id } })
}
const goExtend = (id) => {
  router.push({ name: 'AdminAdExtend', params: { id } })
}
const handleDelete = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try { await deleteAd(id); await fetchData(); alert('삭제되었습니다.'); closeDetail(); }
  catch (e) { alert('삭제에 실패했습니다.') }
}

const statusText = (status) => {
  switch (status) {
    case 'SCHEDULED': return '예정'
    case 'ONGOING': return '진행중'
    case 'ENDING_SOON': return '종료임박'
    case 'ENDED': return '종료됨'
    case 'DELETED': return '삭제됨'
    default: return status
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

const totalPages = computed(() => Math.ceil(filteredAdList.value.length / pageSize))
const pagedAdList = computed(() =>
  filteredAdList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

// 필터별 개수 계산
const scheduledCount = computed(() => 
  adList.value.filter(ad => ad.status === 'SCHEDULED').length
)
const ongoingCount = computed(() => 
  adList.value.filter(ad => ad.status === 'ONGOING').length
)
const endingSoonCount = computed(() => 
  adList.value.filter(ad => ad.status === 'ENDING_SOON').length
)
const endedCount = computed(() => 
  adList.value.filter(ad => ad.status === 'ENDED').length
)

const setFilter = (filter) => {
  currentFilter.value = filter
  page.value = 1 // 필터 변경 시 첫 페이지로 이동
}

onMounted(fetchData)
</script>
