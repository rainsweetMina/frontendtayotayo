<template>
  <div class="main-page">
    <!-- 상단 헤더 영역 -->
    <header class="main-header">
      <div class="header-content">
        <div class="header-center">
          <h1 class="title">대구 버스 정보</h1>
          <p class="subtitle">노선번호, 정류소명을 입력하세요</p>
        </div>
      </div>
    </header>
    
    <!-- 검색 영역 - 별도 섹션으로 분리 -->
    <section class="search-section">
      <div class="search-container">
        <search-bar 
          placeholder="예: 300, 반월당역 입력하세요" 
          @search="handleSearch"
        />
        <div class="search-highlight-text">
          <span class="highlight-icon">🔍</span>
          <span>대구 시내 버스 번호 또는 정류장 이름을 입력하면 자동으로 검색됩니다</span>
        </div>
      </div>
    </section>
    
    <!-- 메인 콘텐츠 영역 - 수직 레이아웃 -->
    <div class="main-content">
      <!-- 주요 기능 영역 -->
      <section class="features-section">
        <h2 class="section-title">주요 기능</h2>
        <div class="features-grid">
          <feature-button 
            v-for="feature in features" 
            :key="feature.id"
            :icon="feature.icon"
            :text="feature.text"
            @click="navigateTo(feature.route)"
          />
        </div>
      </section>
      
      <!-- 추가 정보 영역 -->
      <div class="additional-content">
        <!-- 공지사항 영역 -->
        <section class="notice-container">
          <div v-if="isLoading" class="notice-loading">
            <div class="loading-spinner"></div>
            <p>공지사항 로딩 중...</p>
          </div>
          <div v-else-if="error" class="notice-error">
            <p>{{ error }}</p>
          </div>
          <notice-section 
            v-else
            :notices="notices"
            @view-more="navigateTo('notices')"
            @view-notice="viewNotice"
          />
        </section>
        
        <!-- 바로가기 링크 영역 -->
        <section class="quick-links-section">
          <h3 class="quick-links-title">빠른 링크</h3>
          <div class="quick-links">
            <div class="quick-link" @click="navigateTo('bus-routes')">
              <span class="link-icon">🔗</span>
              <span class="link-text">노선 안내</span>
            </div>
            <div class="quick-link" @click="navigateTo('bus-map')">
              <span class="link-icon">🔗</span>
              <span class="link-text">버스 지도</span>
            </div>
            <div class="quick-link" @click="navigateTo('lost-found')">
              <span class="link-icon">🔗</span>
              <span class="link-text">분실물 센터</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SearchBar from '../components/SearchBar.vue';
import FeatureButton from '../components/FeatureButton.vue';
import NoticeSection from '../components/NoticeSection.vue';

const router = useRouter();

// 기능 메뉴 데이터
const features = ref([
  {
    id: 1,
    icon: '🚌',
    text: '노선 정보',
    route: 'bus-routes'
  },
  {
    id: 2,
    icon: '🚏',
    text: '정류소 정보',
    route: 'bus-stops'
  },
  {
    id: 3,
    icon: '🗺️',
    text: '버스 지도',
    route: 'bus-map'
  },
  {
    id: 4,
    icon: '🔍',
    text: '분실물 안내',
    route: 'lost-found'
  },
  {
    id: 5,
    icon: '📢',
    text: '공지사항',
    route: 'notices'
  },
  {
    id: 6,
    icon: '🕒',
    text: '운행 시간표',
    route: 'bus-timetable'
  }
]);

// 공지사항 데이터
const notices = ref([]);
const isLoading = ref(false);
const error = ref('');

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
  
  // 숫자로만 이루어져 있거나 숫자로 시작하는 경우 노선으로 간주
  if (/^\d+/.test(keyword)) {
    // 노선 검색
    router.push({ 
      path: '/bus/routes', 
      query: { keyword } 
    });
  } else {
    // 정류소 검색
    router.push({ 
      path: '/bus/stops', 
      query: { keyword } 
    });
  }
};

const navigateTo = (route) => {
  const routeMap = {
    'bus-routes': '/bus/routes',
    'bus-stops': '/bus/stops',
    'bus-map': '/bus/map',
    'lost-found': '/lost-found',
    'notices': '/notice', // 공지사항 목록 경로
    'bus-timetable': '/bus/timetable'
  };
  
  router.push(routeMap[route] || '/');
};

const viewNotice = (noticeId) => {
  // 공지사항 상세 페이지로 라우팅
  console.log(`공지사항 클릭: ID=${noticeId}`);
  router.push(`/notice/${noticeId}`);
};

// 컴포넌트 마운트 시 공지사항 데이터 로드
onMounted(() => {
  fetchNotices();
});
</script>

<style scoped>
.main-page {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  min-height: calc(100vh - 80px);
  background-color: #f9fafb;
}

/* 헤더 영역 스타일 */
.main-header {
  background-color: #2a7dc0;
  color: white;
  padding: 0;
  margin-bottom: 50px;
  background-image: linear-gradient(to right, #2a7dc0, #4a90c0);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1800px;
  margin: 0 auto;
  padding: 40px 50px;
}

.header-center {
  text-align: center;
  max-width: 800px;
}

.title {
  font-size: 3.8rem;
  margin-bottom: 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-align: center;
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin: 0 auto;
  text-align: center;
}

/* 검색 섹션 스타일 */
.search-section {
  margin-top: -25px;
  margin-bottom: 50px;
  position: relative;
  z-index: 10;
}

.search-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-highlight-text {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  background-color: rgba(42, 125, 192, 0.8);
  padding: 8px 20px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.highlight-icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.desktop-badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 20px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 메인 콘텐츠 영역 스타일 */
.main-content {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 50px 50px;
}

/* 섹션 제목 스타일 */
.section-title {
  font-size: 2rem;
  margin-bottom: 25px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background-color: #2a7dc0;
  border-radius: 2px;
}

/* 기능 버튼 영역 스타일 */
.features-section {
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

/* 추가 콘텐츠 영역 */
.additional-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

/* 공지사항 컨테이너 */
.notice-container {
  width: 100%;
}

/* 퀵 링크 영역 스타일 */
.quick-links-section {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  height: 100%;
}

.quick-links-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

.quick-links-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: #2a7dc0;
  border-radius: 2px;
}

.quick-links {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.quick-link {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.quick-link:hover {
  background-color: #e8f0f9;
  transform: translateX(5px);
  border-left-color: #2a7dc0;
}

.link-icon {
  margin-right: 15px;
  font-size: 1.3rem;
  color: #2a7dc0;
}

.link-text {
  font-weight: 500;
  color: #333;
  font-size: 1.1rem;
}

/* 태블릿 반응형 스타일 */
@media (max-width: 1200px) {
  .header-content {
    padding: 35px;
  }
  
  .main-content {
    padding: 0 40px 40px;
  }
  
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .additional-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .title {
    font-size: 3rem;
  }
  
  .search-container {
    max-width: 90%;
  }
}

/* 모바일 반응형 스타일 */
@media (max-width: 768px) {
  .header-content {
    padding: 30px 20px;
  }
  
  .main-content {
    padding: 0 20px 30px;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .search-section {
    margin-top: -15px;
  }
  
  .search-container {
    max-width: 100%;
    padding: 0 15px;
  }
  
  .search-highlight-text {
    max-width: 100%;
    font-size: 0.9rem;
    padding: 8px 15px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .additional-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* 공지사항 로딩 및 에러 스타일 */
.notice-loading, .notice-error {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 15px;
  border: 3px solid rgba(42, 125, 192, 0.1);
  border-radius: 50%;
  border-top-color: #2a7dc0;
  animation: spin 1s ease-in-out infinite;
}

.notice-error p {
  color: #e74c3c;
  font-weight: 500;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 