<template>
  <Menu as="div" class="relative">
    <MenuButton class="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none">
      <span class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        관리자 정보 ▾
      </span>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems 
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100"
      >
        <div class="px-4 py-2 text-sm text-gray-700">
          <div class="font-medium">로그인 정보</div>
          <div class="mt-1">{{ username }}</div>
        </div>
        <div class="px-4 py-2 text-sm text-gray-700">
          <div class="font-medium">권한</div>
          <div class="mt-1">관리자</div>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
        <button
          @click="handleLogout"
              :class="[
                active ? 'bg-gray-100 text-red-700' : 'text-red-700',
                'w-full text-left px-4 py-2 text-sm'
              ]"
        >
          로그아웃
        </button>
          </MenuItem>
      </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.username || '관리자')

const handleLogout = () => {
  authStore.logout()
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}

// 개발 환경에서만 로그 출력
const log = (message, data) => {
  if (import.meta.env.DEV) {
    console.log(message, data);
  }
};

// 사용 예시
log('메인 페이지: 공지사항 로드 시도...');

// localStorage를 활용한 검색 히스토리 관리
const searchHistory = ref([]);

// 검색 히스토리 로드
const loadSearchHistory = () => {
  const savedHistory = localStorage.getItem('searchHistory');
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory);
  }
};

// 검색 히스토리 저장
const saveSearchHistory = (keyword) => {
  if (!keyword || searchHistory.value.includes(keyword)) return;
  
  searchHistory.value.unshift(keyword);
  if (searchHistory.value.length > 4) {
    searchHistory.value.pop();
  }
  
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};

// 컴포넌트 마운트 시 히스토리 로드
onMounted(() => {
  loadSearchHistory();
  fetchNotices();
});

// 에러 상태 관리 추가
const errorMessages = ref({
  notices: '',
  busStops: '',
  specialService: ''
});

// 공지사항 로드 실패 시 사용자에게 표시
try {
  // API 호출 코드...
} catch (err) {
  console.error('공지사항 로드 실패:', err);
  errorMessages.value.notices = '공지사항을 불러오는데 실패했습니다.';
  // 목업 데이터 표시...
}

// 슬라이더 데이터 구조화
const sliderItems = ref([
  {
    id: 'notices',
    title: '공지사항',
    route: 'notices',
    content: computed(() => notices.value.length > 0 ? {
      title: notices.value[0].title,
      date: notices.value[0].date,
      action: () => viewNotice(notices.value[0].id)
    } : null)
  },
  {
    id: 'bus-stops',
    title: '정류소 신·이설<br>정보안내기 설치',
    route: 'bus-stops-update',
    content: {
      title: '시내버스 정류소<br>조정 안내(\'25.06.20. 시행)',
      date: '2025.05.27.'
    }
  },
  {
    id: 'special-service',
    title: '저상버스 대체안내',
    route: 'special-service',
    content: {
      title: '금일(6월 12일)<br>저상버스 3231호<br>(북구3번 노선)<br>대체운행 안내',
      date: '2025.06.12.'
    }
  }
]);
</script>