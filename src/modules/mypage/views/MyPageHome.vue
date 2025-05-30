<template>
  <div class="mypage">
    <h1>마이페이지</h1>

    <nav class="menu">
      <router-link to="/mypage/favorites">즐겨찾기</router-link>
      <div class="dropdown">
        <span class="dropdown-label">분실물 센터 ▾</span>
        <div class="dropdown-content">
          <router-link to="/mypage/lost">📝 분실물 신고</router-link>
          <router-link to="/mypage/found">📋 습득물 목록</router-link>
        </div>
      </div>
      <router-link to="/mypage/qna">질문/답변</router-link>
      <router-link to="/mypage/apikey-request">API 키 발급</router-link>
    </nav>

    <div v-if="user.name" class="user-info">
      <p>안녕하세요, <strong>{{ user.name }}</strong>님!</p>
      <p><strong>이메일:</strong> {{ user.email }}</p>
    </div>

    <div class="actions">
      <router-link to="/mypage/modify">정보 수정</router-link>
      <router-link to="/mypage/password">비밀번호 변경</router-link>
      <a href="/logout" class="logout-link">로그아웃</a>
      <router-link to="/mypage/withdraw" class="danger-link">회원 탈퇴</router-link>
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const { user } = useUserInfo()
</script>

<style scoped>
.mypage {
  max-width: 800px;
  margin: 40px auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.mypage h1 {
  font-size: 2rem;
  margin-bottom: 1.8rem;
  text-align: center;
  color: #2c3e50;
  border-bottom: 2px solid #4889cd;
  padding-bottom: 0.5rem;
}

.menu {
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  font-size: 1rem;
}

.menu a,
.menu .dropdown-label {
  color: #4889cd;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.menu a:hover,
.menu .dropdown-label:hover {
  color: #2877cd;
  text-decoration: underline;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-label {
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding: 10px 15px;
  min-width: 160px;
  top: 100%;
  left: 0;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  padding: 8px 0;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-content a:hover {
  background-color: #f2f2f2;
}

.user-info {
  background-color: #f9fbff;
  border: 1px solid #dbeaff;
  padding: 1.2rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.user-info p {
  margin: 0.3rem 0;
  font-size: 1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: flex-start;
}

.actions a {
  color: #4889cd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.actions a:hover {
  color: #2877cd;
  text-decoration: underline;
}

.actions a.logout-link {
  color: #e74c3c;
  font-weight: bold;
}

.actions a.danger-link {
  color: red;
  font-weight: bold;
}
</style>
