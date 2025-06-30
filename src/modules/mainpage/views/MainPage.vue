<template>
  <div class="main-page">
    <!-- 상단 헤더 영역 -->
    <header class="main-header">
      <div class="bus-info-banner">
        <div class="bus-info-content">
          <div class="bus-icon">
            <img :src="mainBusImg" alt="버스 아이콘" class="bus-svg" />
          </div>
          <div class="banner-text">
            <h1 class="banner-title" style="white-space: pre-line;">   대구 버스</h1>
            <h2 class="banner-subtitle" style="white-space: pre-line;">통합 검색</h2>
            <p class="banner-description" style="white-space: pre-line;">　정류장·노선·도착 시간 한번에!</p>
          </div>
          <div class="bus-stop-icon">
            <img :src="busStopImg" alt="정류장 아이콘" class="bus-stop-img" />
          </div>
        </div>
      </div>
    </header>

    <!-- 검색 영역 - 별도 섹션으로 분리 -->
    <section class="search-section">
      <div class="search-container">
        <search-bar
          placeholder="정류소, 노선을 입력하세요."
          @search="handleSearch"
        />
        <div class="search-history" v-if="searchStore.recentSearches.length > 0">
          <div class="history-label">
            <span class="history-icon">🕒</span>
            <span>최근 검색 내역</span>
          </div>
          <div class="history-tags">
            <span v-for="(item, index) in searchStore.recentSearches" :key="index"
                  class="history-tag" @click="useHistoryItem(item)">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 메인 기능 영역 -->
    <section class="main-features">
      <div class="feature-buttons">
        <div class="feature-button" @click="navigateTo('bus-routes')">
          <div class="feature-icon">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <ellipse cx="36" cy="60" rx="20" ry="8" fill="#e6f0fa"/>
              <path d="M36 12C26.4 12 19 19.8 19 30c0 10.2 14.4 25.6 15 26.2.4.4 1 .4 1.4 0 .6-.6 15-16 15-26.2 0-10.2-7.4-18-17-18zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" fill="#1e73c9"/>
              <circle cx="36" cy="30" r="6" fill="white"/>
            </svg>
          </div>
          <span class="feature-text">지도 보기</span>
        </div>
        <div class="feature-button" @click="navigateTo('bus-schedule')">
          <div class="feature-icon">
            <img src="/src/assets/icons/bus-timetable.svg" alt="버스운행시간표">
          </div>
          <span class="feature-text">버스운행시간표</span>
        </div>
        <div class="feature-button" @click="navigateTo('special-service')">
          <div class="feature-icon">
            <img src="/src/assets/icons/special-service.svg" alt="저상버스 운행정보" class="special-service-icon">
          </div>
          <span class="feature-text">저상버스 운행정보</span>
        </div>
        <div class="feature-button" @click="navigateTo('bus-usage')">
          <div class="feature-icon">
            <!-- 돋보기(검색) SVG -->
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1e73c9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <span class="feature-text">습득물 조회</span>
        </div>
        <div class="feature-button" @click="navigateTo('announcement')">
          <div class="feature-icon">
            <!-- 분실/경고 SVG -->
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#1e73c9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="1.2" />
            </svg>
          </div>
          <span class="feature-text">분실물 신고</span>
        </div>
      </div>
    </section>

    <!-- 팝업 광고 -->
    <div
        v-if="showPopup && popupAd"
        class="fixed z-[9999] bg-white p-4 shadow-2xl rounded-xl w-[500px] cursor-move border-2 border-gray-200"
        :style="{ top: popupPosition.top + 'px', left: popupPosition.left + 'px' }"
        @mousedown="onPopupMouseDown"
    >
      <a :href="popupAd.linkUrl" target="_blank">
        <img
            :src="`${IMAGE_BASE_URL}/ad/${popupAd.imageUrl}`"
            alt="광고 이미지"
            class="w-full h-auto rounded"
        />
      </a>
      <div class="text-right mt-2 flex justify-end gap-4">
        <button @click="dismissToday" class="text-sm text-gray-500 hover:text-black">
          하루 동안 보지 않기
        </button>
        <button @click="closePopup" class="text-sm text-gray-500 hover:text-black">
          닫기
        </button>
      </div>
    </div>

    <!-- 슬라이더 영역 -->
    <section class="info-slider">
      <div class="slider-container">
        <div class="slider-track">
          <!-- 공지사항 -->
          <div class="slider-item" @click="navigateTo('notices')">
            <div class="slider-title">
              <h3>공지사항</h3>
              <span class="more-link">더보기</span>
            </div>
            <div class="notice-item" v-if="notices.length > 0" @click.stop="viewNotice(notices[0].id)">
              <div class="notice-content">
                <h4>{{ notices[0].title }}</h4>
                <p class="notice-date">{{ notices[0].date }}</p>
              </div>
            </div>
          </div>

          <!-- 저상버스 대체안내 -->
          <div class="slider-item" @click="navigateTo('lowfloorbus')">
            <div class="slider-title">
              <h3>저상버스 대체안내</h3>
              <span class="more-link">더보기</span>
            </div>
            <div v-if="lowFloorBuses.length > 0" class="update-info" @click.stop="viewLowFloorBus(lowFloorBuses[0].id)">
              <h4>{{ lowFloorBuses[0].title }}</h4>
              <p class="update-date">{{ lowFloorBuses[0].date }}</p>
            </div>
            <div v-else class="update-info">
              <h4>저상버스 대체안내 정보가 없습니다.</h4>
              <p class="update-date">-</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 앨범존 영역 -->
    <section class="album-zone">
      <h2 class="section-title">알림존</h2>
      <div class="album-container flex gap-6">
        <!-- 광고 캐러셀: 더 넓게 차지하도록 flex-grow 추가 -->
        <AlbumBannerCarousel :banners="banners" class="album-banner flex-grow" />
        <!-- 날씨 정보: 더 좁게 표시 -->
        <div class="album-banner weather-banner-container">
          <MainWeatherDisplay />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SearchBar from '../components/SearchBar.vue';
import { useSearchStore } from '@/stores/searchStore';
import MainWeatherDisplay from '@/modules/mainpage/components/MainWeatherDisplay.vue';
import mainBusImg from '@/assets/images/mainbus.png';
import busStopImg from '@/assets/images/bus-stop.png';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL
import AlbumBannerCarousel from '@/modules/ad/views/ad/AlbumBannerCarousel.vue'

const banners = ref([])
const router = useRouter();
const searchStore = useSearchStore();

// 공지사항 데이터
const notices = ref([]);
// 저상버스 대체안내 데이터
const lowFloorBuses = ref([]);
const isLoading = ref(false);
const error = ref('');

const popupAd = ref(null)
const showPopup = ref(false)

// 팝업 위치 관리
const popupPosition = ref({ top: 0, left: 0 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const currentYear = ref(new Date().getFullYear());

const setInitialPopupPosition = () => {
  // 더 아래쪽, 더 좌측 위치로 초기화
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  popupPosition.value = {
    top: vh * 0.20,
    left: vw * 0.15 - 200 // 팝업 너비 400px 기준
  }
}

const onPopupMouseDown = (e) => {
  isDragging.value = true;
  dragOffset.value = {
    x: e.clientX - popupPosition.value.left,
    y: e.clientY - popupPosition.value.top
  }
  document.addEventListener('mousemove', onPopupMouseMove)
  document.addEventListener('mouseup', onPopupMouseUp)
}
const onPopupMouseMove = (e) => {
  if (!isDragging.value) return;
  popupPosition.value.left = e.clientX - dragOffset.value.x;
  popupPosition.value.top = e.clientY - dragOffset.value.y;
}
const onPopupMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onPopupMouseMove)
  document.removeEventListener('mouseup', onPopupMouseUp)
}

const fetchPopupAd = async () => {
  try {
    const res = await axios.get('https://localhost:8081/api/ad/popup')
    const ad = res.data
    const today = new Date().toISOString().split('T')[0]
    const dismissed = JSON.parse(localStorage.getItem('dismissedPopups') || '{}')

    if (!dismissed[`${today}_${ad.id}`]) {
      popupAd.value = ad
      showPopup.value = true
      await nextTick()
      setInitialPopupPosition()
    }
  } catch (e) {
    console.log('팝업 광고 없음 또는 오류:', e)
  }
}

const dismissToday = () => {
  const today = new Date().toISOString().split('T')[0]
  const dismissed = JSON.parse(localStorage.getItem('dismissedPopups') || '{}')
  dismissed[`${today}_${popupAd.value.id}`] = true
  localStorage.setItem('dismissedPopups', JSON.stringify(dismissed))
  showPopup.value = false
}

// ✅ 닫기 버튼 처리용 함수
const closePopup = () => {
  showPopup.value = false
}


// 공지사항 데이터 불러오기
const fetchNotices = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    console.log('메인 페이지: 공지사항 로드 시도...');

    // 실제 API 연동 시도
    try {
      // 일반 사용자용 공지사항 API로 변경
      const response = await axios.get('https://localhost:8081/api/public/notices');
      console.log('공지사항 API 응답:', response.data);

      // 서버에서 받은 공지사항 데이터 처리
      if (response.data && Array.isArray(response.data)) {
        // 일반 배열 형태로 응답이 오는 경우
        notices.value = response.data.map(notice => ({
          id: notice.id,
          title: notice.title,
          content: notice.content || '',
          date: formatDate(notice.createdAt || notice.createdDate)
        })).slice(0, 3); // 최근 3개만 표시
      } else if (response.data && response.data.content) {
        // 페이징된 응답 구조 처리
        notices.value = response.data.content.map(notice => ({
          id: notice.id,
          title: notice.title,
          content: notice.content || '',
          date: formatDate(notice.createdAt || notice.createdDate)
        })).slice(0, 3); // 최근 3개만 표시
      } else {
        // 기타 다른 형식인 경우 (단일 객체 등)
        console.log('응답 형식이 예상과 다릅니다. 목업 데이터 사용');
        throw new Error('응답 형식이 지원되지 않습니다.');
      }
    } catch (apiError) {
      console.log('API 호출 실패, 목업 데이터 사용:', apiError);
      throw apiError; // 상위 catch 블록으로 오류 전달
    }

  } catch (err) {
    console.error('공지사항 로드 실패:', err);
    console.error('응답 데이터:', err.response?.data);
    console.error('응답 상태:', err.response?.status);
    error.value = '공지사항을 불러오는데 실패했습니다.';

    // 에러 발생 시 목업 데이터 표시
    console.log('목업 공지사항 데이터 사용');
    notices.value = [
      {
        id: 1,
        title: '시스템 점검 안내',
        content: '시스템 점검으로 인해 일시적으로 서비스가 중단될 수 있습니다.',
        date: '2024.10.08'
      },
      {
        id: 2,
        title: '추석 연휴 시내버스 특별운행 안내',
        content: '추석 연휴 기간 동안 시내버스 특별 운행 일정을 안내드립니다.',
        date: '2024.08.30'
      },
      {
        id: 3,
        title: '버스 노선 변경 안내',
        content: '일부 버스 노선이 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
        date: '2024.07.15'
      }
    ];
  } finally {
    isLoading.value = false;
  }
};

// 저상버스 대체안내 데이터 불러오기
const fetchLowFloorBuses = async () => {
  try {
    console.log('메인 페이지: 저상버스 대체안내 로드 시도...');

    // 실제 API 연동 시도
    try {
      // 일반 사용자용 저상버스 대체안내 API 호출
      const response = await axios.get('https://localhost:8081/api/public/lowfloorbuses');
      console.log('저상버스 대체안내 API 응답:', response.data);

      // 서버에서 받은 저상버스 대체안내 데이터 처리
      if (response.data && Array.isArray(response.data)) {
        // 일반 배열 형태로 응답이 오는 경우
        lowFloorBuses.value = response.data.map(bus => ({
          id: bus.id,
          title: bus.title,
          content: bus.content || '',
          date: formatDate(bus.createdAt || bus.createdDate)
        })).slice(0, 1); // 최근 1개만 표시
      } else if (response.data && response.data.content) {
        // 페이징된 응답 구조 처리
        lowFloorBuses.value = response.data.content.map(bus => ({
          id: bus.id,
          title: bus.title,
          content: bus.content || '',
          date: formatDate(bus.createdAt || bus.createdDate)
        })).slice(0, 1); // 최근 1개만 표시
      } else {
        // 기타 다른 형식인 경우 (단일 객체 등)
        console.log('응답 형식이 예상과 다릅니다.');
        throw new Error('응답 형식이 지원되지 않습니다.');
      }
    } catch (apiError) {
      console.log('API 호출 실패:', apiError);
      throw apiError; // 상위 catch 블록으로 오류 전달
    }
  } catch (err) {
    console.error('저상버스 대체안내 로드 실패:', err);
    console.error('응답 데이터:', err.response?.data);
    console.error('응답 상태:', err.response?.status);

    // 에러 발생 시 목업 데이터 표시
    console.log('목업 저상버스 대체안내 데이터 사용');
    lowFloorBuses.value = [
      {
        id: 1,
        title: '금일(6월 12일) 저상버스 3231호(북구3번 노선) 대체운행 안내',
        content: '금일 저상버스 3231호 차량 정비로 인해 일반 버스로 대체 운행됩니다.',
        date: '2025.06.12'
      }
    ];
  }
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    // Intl.DateTimeFormat을 사용한 지역화된 날짜 포맷팅
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\s/g, '').replace(/\./g, '.');
  } catch (error) {
    // 에러 발생 시 간단한 포맷으로 변환
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  }
};

const handleSearch = (searchData) => {
  const { keyword } = searchData;
  if (!keyword) return;

  // searchStore를 통해 검색어 저장
  searchStore.addToRecentSearches(keyword);

  // 버스 맵 페이지로 이동하면서 검색어 전달
  router.push({
    path: '/bus/map',
    query: { keyword }
  });
};

const useHistoryItem = (keyword) => {
  // searchStore에 검색어 추가
  searchStore.addToRecentSearches(keyword);

  // 히스토리 아이템으로 검색
  router.push({
    path: '/bus/map',
    query: { keyword }
  });
};

const navigateTo = (route) => {
  const routeMap = {
    'bus-routes': '/bus/map',
    'bus-stops': '/bus/stops',
    'bus-map': '/bus/map',
    'bus-schedule': '/schedule',
    'special-service': '/low-schedule',
    'bus-usage': '/found',
    'announcement': '/lost',
    'notices': '/notice',
    'lowfloorbus': '/lowfloorbus'
  };

  router.push(routeMap[route] || '/');
};

const viewNotice = (noticeId) => {
  // 공지사항 상세 페이지로 라우팅
  console.log(`공지사항 클릭: ID=${noticeId}`);
  router.push(`/notice/${noticeId}`);
};

const viewLowFloorBus = (busId) => {
  // 저상버스 대체안내 상세 페이지로 라우팅
  console.log(`저상버스 대체안내 클릭: ID=${busId}`);
  router.push(`/lowfloorbus/${busId}`);
};

const fetchBanners = async () => {
  try {
    // 진행중 광고만(공개용 API가 있다면 /api/ad/active, 없다면 /api/ad)
    const response = await axios.get('https://localhost:8081/api/ad/active')
    banners.value = response.data
  } catch (e) {
    banners.value = []
  }
}
const goToAdLink = (url) => {
  if (url) window.open(url, '_blank')
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  fetchNotices();
  fetchLowFloorBuses();
  fetchBanners();
  fetchPopupAd();

  // 로컬 스토리지에서 검색 히스토리 로드
  searchStore.loadRecentSearchesFromCache();
});
</script>

<style scoped>
/* 메인 페이지 스타일 */
.main-page {
  background-color: #f5f7fa;
  min-height: 100vh;
  overflow: hidden;
  padding-bottom: 120px;
}

/* 상단 헤더 영역 */
.main-header {
  width: 100%;
}

.bus-info-banner {
  background-color: #3095ff;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIzNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgb3BhY2l0eT0iLjE1IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIyMjAiIGN5PSIxODAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIzNTAiIGN5PSIxMjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI0ODAiIGN5PSIyMjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI2NDAiIGN5PSIxNTAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI4MDAiIGN5PSIyMjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI5MzAiIGN5PSIxMjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxMTAwIiBjeT0iODAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSIxMjUwIiBjeT0iMTgwIiByPSI4IiBmaWxsPSIjZmZmZmZmIi8+PGNpcmNsZSBjeD0iMTM1MCIgY3k9IjEwMCIgcj0iOCIgZmlsbD0iI2ZmZmZmZiIvPjxwYXRoIGQ9Ik0xMDAgODBMMjIwIDE4ME0yMjAgMTgwTDM1MCAxMjBNMzUwIDEyMEw0ODAgMjIwTTQ4MCAyMjBMNjQwIDE1ME02NDAgMTUwTDgwMCAyMjBNODAwIDIyMEw5MzAgMTIwTTkzMCAxMjBMMTEwMCA4ME0xMTAwIDgwTDEyNTAgMTgwTTEyNTAgMTgwTDEzNTAgMTAwIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMjIwIiBjeT0iMTgwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzUwIiBjeT0iMTIwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNDgwIiBjeT0iMjIwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iNjQwIiBjeT0iMTUwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iODAwIiBjeT0iMjIwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iOTMwIiBjeT0iMTIwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTEwMCIgY3k9IjgwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMTI1MCIgY3k9IjE4MCIgcj0iMTIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNSIvPjxjaXJjbGUgY3g9IjEzNTAiIGN5PSIxMDAiIHI9IjEyIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48L2c+PC9zdmc+');
  background-size: cover;
  background-position: center;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
}

.bus-info-content {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  z-index: 1;
  min-height: 300px;
  position: relative;
}

.bus-icon {
  flex: 1 1 0;
  display: flex;
  justify-content: flex-start;
}

.bus-svg {
  width: 300px;
  height: 300px;
  object-fit: contain;
}

.banner-text {
  flex: 2 1 0;
  position: static;
  left: auto;
  top: auto;
  transform: none;
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  letter-spacing: -1px;
  margin-left: 40px;
}

.banner-subtitle {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 0 20px;
  line-height: 1.2;
  letter-spacing: -1px;
  margin-left: 40px;
}

.banner-description {
  font-size: 1.4rem;
  margin-top: 15px;
  font-weight: 300;
  opacity: 0.9;
  margin-left: 30px;
}

/* 검색 영역 */
.search-section {
  max-width: 1200px;
  margin: -50px auto 30px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.search-container {
  margin-bottom: 40px;
}

.search-history {
  background-color: white;
  border-radius: 0 0 8px 8px;
  padding: 10px 15px;
  margin-top: -5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.history-label {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 15px;
  font-weight: 500;
  color: #444;
}

.history-icon {
  margin-right: 5px;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  background-color: #f0f4fa;
  border: 1px solid #dbe4f0;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.history-tag:hover {
  background-color: #e0eaf8;
  border-color: #c0d0e8;
}

/* 메인 기능 영역 */
.main-features {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.feature-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.feature-button {
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 20px 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.feature-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px auto;
}

.feature-icon img {
  width: 60px;
  height: 60px;
}

.special-service-icon {
  width: 100px !important;
  height: 100px !important;
}

.new-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: #ff5252;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 3px;
  font-weight: bold;
}

.feature-text {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

/* 슬라이더 영역 */
.info-slider {
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.slider-container {
  overflow: hidden;
}

.slider-track {
  display: flex;
  gap: 20px;
}

.slider-item {
  flex: 1;
  min-width: calc(33.333% - 14px);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.slider-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.slider-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.slider-title h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.more-link {
  color: #1e73c9;
  font-size: 0.9rem;
}

.notice-item, .update-info {
  padding: 10px 0;
}

.notice-item h4, .update-info h4 {
  font-size: 1.1rem;
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.notice-date, .update-date {
  color: #888;
  font-size: 0.9rem;
}

/* 앨범존 영역 */
.album-zone {
  max-width: 1200px;
  margin: 0 auto 30px;
  padding: 0 20px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
}

.album-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.album-banner {
  flex: 1;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.album-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(90deg, rgba(30, 90, 170, 0.8) 0%, rgba(30, 90, 170, 0.4) 100%);
  color: white;
}

.banner-content h3 {
  font-size: 1rem;
  margin: 0 0 10px 0;
  font-weight: 400;
}

.banner-content h2 {
  font-size: 1.8rem;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.banner-content p {
  font-size: 1.2rem;
  margin: 0;
}

.banner-note {
  font-size: 0.9rem !important;
  margin-top: 15px !important;
  opacity: 0.8;
}

.weather-banner {
  background-color: #1e73c9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-content {
  text-align: center;
  color: white;
  padding: 20px;
  width: 100%;
}

.weather-content h3 {
  font-size: 1.3rem;
  margin: 0 0 15px 0;
}

.weather-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-icon {
  width: 100%;
  display: flex;
  justify-content: center;
}

.main-weather-display {
  font-size: 1.5rem !important;
  padding: 0.5rem 1rem !important;
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .feature-buttons {
    flex-wrap: wrap;
  }

  .feature-button {
    flex: 0 0 calc(33.333% - 10px);
    min-width: calc(33.333% - 10px);
  }

  .slider-track {
    flex-wrap: wrap;
  }

  .slider-item {
    flex: 0 0 calc(50% - 10px);
    min-width: calc(50% - 10px);
  }

  .album-container, .info-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 2.2rem;
  }
  .banner-subtitle {
    font-size: 1.5rem;
  }
  .banner-description {
    font-size: 1rem;
  }

  .feature-button {
    flex: 0 0 calc(50% - 8px);
    min-width: calc(50% - 8px);
  }

  .slider-item {
    flex: 0 0 100%;
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .banner-title {
    font-size: 1.5rem;
  }
  .banner-subtitle {
    font-size: 1.1rem;
  }
  .banner-description {
    font-size: 0.9rem;
  }

  .feature-button {
    flex: 0 0 100%;
    min-width: 100%;
  }

  .search-history {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-label {
    margin-bottom: 10px;
  }
}

/* 날씨 배너 컨테이너 스타일 */
.weather-banner-container {
  flex: 0 0 300px;
  max-width: 300px;
}

.feature-emoji {
  font-size: 2.5rem;
  display: block;
  line-height: 1;
}

.feature-icon.map-pin-bg {
  background: #1e73c9;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bus-stop-icon {
  flex: 1 1 0;
  display: flex;
  align-items: flex-end;
  margin-top: 30px;
  margin-right: 15px;
  justify-content: flex-end;
}

.bus-stop-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
}
</style>
