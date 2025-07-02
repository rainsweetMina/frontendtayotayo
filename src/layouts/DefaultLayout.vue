<template>
  <div class="layout-wrapper">
    <!-- /bus/map 경로가 아닐 때만 헤더 보이기 -->
    <HeaderComponent v-if="route.path !== '/bus/map'"/>

    <!-- /bus/map 경로일 때만 사이드바, 토글 버튼 보이기 -->
    <div v-if="route.path === '/bus/map'">
      <div
          class="sidebar-wrapper d-flex flex-column border-end searchBox"
          :class="{ 'sidebar-hidden': !store.sidebarOpen }"
      >
        <BusSearchPage/>
      </div>

      <button
          class="sidebar-toggle-btn"
          :class="{ 'with-sidebar': store.sidebarOpen }"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
      >
        {{ store.sidebarOpen ? '<' : '>' }}
      </button>
    </div>

    <!-- 본문 -->
    <div class="main-content" :class="{ 'map-content': route.path === '/bus/map' }">
      <main>
        <slot/>
      </main>
    </div>

    <!-- 푸터 (adminpage 경로가 아니고 bus/map 경로가 아닐 때만 보이기) -->
    <footer v-if="!route.path.startsWith('/admin') && route.path !== '/bus/map'" class="main-footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-logo">
            <div class="footer-logo-text">
              <h3>대구 버스정보 타바요</h3>
              <p>Daegu Bus Information Tabayo</p>
            </div>
          </div>
          <div class="footer-links">
            <div class="footer-link-group">
              <h4>이용안내</h4>
              <ul>
                <li><router-link to="/terms">이용약관</router-link></li>
                <li><router-link to="/privacy">개인정보처리방침</router-link></li>
              </ul>
            </div>
            <div class="footer-link-group">
              <h4>고객지원</h4>
              <ul>
                <li><a href="/qna">문의하기</a></li>
                <li><a href="/qna">오류신고</a></li>
              </ul>
            </div>
            <div class="footer-link-group">
              <h4>관련사이트</h4>
              <ul>
                <li><a href="https://www.daegu.go.kr/index.do" target="_blank">대구광역시청</a></li>
                <li><a href="https://car.daegu.go.kr/" target="_blank">대구교통종합정보</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">© {{ currentYear }} 대구 버스정보시스템 타바요. All rights reserved.</p>
          <div class="footer-contact">
            <p>주소: 대구광역시 동구 동부로 108</p>
            <p>전화: 053-123-4567</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {useSearchStore} from '@/stores/searchStore'
import HeaderComponent from '/src/modules/adminpage/dashboard/components/Header/HeaderComponent.vue'
import BusSearchPage from '/src/modules/busSearch/views/BusSearchPage.vue'
import { ref } from 'vue'

const route = useRoute()
const store = useSearchStore()
const currentYear = ref(new Date().getFullYear())

// 사이드바 토글 함수
const toggleSidebar = () => {
  store.toggleSidebar(!store.sidebarOpen)
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.searchBox {
  position: fixed;
  z-index: 1000;
}

/* 사이드바 */
.sidebar-wrapper {
  width: 400px;
  background-color: #ffffff;
  color: black;
  overflow-y: auto;
  height: 100vh;
  scrollbar-width: none;
  transition: transform 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  top: 0;
  left: 0;
}

/* 상단 여백 */
.sidebar-top-spacer {
  height: 80px; /* 상단 검색창 높이만큼 여백 추가 */
}

.sidebar-wrapper::-webkit-scrollbar {
  display: none;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

/* 토글 버튼 */
.sidebar-toggle-btn {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  z-index: 9999; /* 최상단에 표시 */
  background-color: #ffffff;
  color: #333;
  border: none;
  padding: 0.5rem 0.75rem;
  font-size: 1.4rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: left 0.3s ease, background-color 0.2s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-btn.with-sidebar {
  left: 400px;
}

.sidebar-toggle-btn:hover {
  background-color: #f8f9fa;
}

/* 본문 영역 */
.main-content {
  padding: 100px;
  transition: margin-left 0.3s ease;
  padding-top: 80px; /* 헤더 높이만큼 상단 여백 추가 */
  flex: 1; /* 남은 공간을 모두 차지하도록 설정 */
  display: flex;
  flex-direction: column;
}

/* 지도 페이지 본문 - 여백 제거 */
.main-content.map-content {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
}

.main-content main {
  flex: 1; /* main 태그도 남은 공간을 모두 차지하도록 설정 */
}

.main-content.map-content main {
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
}

/* 푸터 영역 */
.main-footer {
  background-color: #1e2a3b;
  color: #fff;
  padding: 20px 0 10px;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.footer-logo-img {
  width: 40px;
  height: 40px;
  filter: brightness(0) invert(1);
  margin-right: 10px;
}

.footer-logo-text h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.footer-logo-text p {
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.7;
  color: #ffffff;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-link-group h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #fff;
}

.footer-link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link-group li {
  margin-bottom: 5px;
}

.footer-link-group a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.footer-link-group a:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.copyright {
  margin: 0 0 5px 0;
}

.footer-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.footer-contact p {
  margin: 0;
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
  }

  .footer-links {
    margin-top: 10px;
    gap: 15px;
  }

  .footer-link-group {
    flex: 0 0 calc(50% - 10px);
  }

  .footer-bottom {
    flex-direction: column;
  }

  .footer-contact {
    margin-top: 5px;
    flex-direction: column;
    gap: 3px;
  }
}

@media (max-width: 480px) {
  .main-footer {
    padding: 15px 0 8px;
  }

  .footer-top {
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .footer-links {
    flex-direction: row;
  }

  .footer-link-group {
    flex: 0 0 calc(50% - 8px);
  }

  .footer-link-group h4 {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  .footer-link-group a {
    font-size: 0.8rem;
  }

  .footer-logo-text h3 {
    font-size: 1rem;
  }

  .footer-logo-text p {
    font-size: 0.7rem;
  }
}
</style>
