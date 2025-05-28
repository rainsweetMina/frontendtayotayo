<template>
  <div class="mypage">
    <h1>마이페이지</h1>

    <!-- 메뉴 -->
    <nav class="menu">
      <strong>메뉴</strong><br />
      <router-link to="/mypage/favorites">즐겨찾기</router-link> |

      <div class="dropdown">
        <span class="dropdown-label">분실물 센터 ▾</span>
        <div class="dropdown-content">
          <router-link to="/mypage/lost">📝 분실물 신고</router-link>
          <router-link to="/mypage/found">📋 습득물 목록</router-link>
        </div>
      </div> |

      <router-link to="/mypage/qna">질문/답변</router-link> |
      <router-link to="/mypage/apikey-request">API 키 발급</router-link>
    </nav>

    <!-- 사용자 정보 -->
    <div v-if="user.name">
      <p>안녕하세요, <strong>{{ user.name }}</strong>님!</p>
      <p><strong>이메일:</strong> {{ user.email }}</p>
    </div>

    <hr />

    <router-link to="/mypage/modify">정보 수정</router-link><br />
    <router-link to="/mypage/password">비밀번호 변경</router-link><br />
    <a href="/logout">로그아웃</a><br />
    <router-link to="/mypage/withdraw" style="color: red; margin-top: 10px; display: inline-block;">회원 탈퇴</router-link>

    <router-view />
  </div>
</template>

<script setup>
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const { user } = useUserInfo()
</script>

<style scoped>
.mypage {
  padding: 20px;
  font-family: sans-serif;
}

.menu {
  margin-bottom: 20px;
}

.dropdown {
  display: inline-block;
  position: relative;
}

.dropdown-label {
  cursor: pointer;
  font-weight: bold;
}

.dropdown-content {
  display: none;
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  z-index: 1;
  padding: 5px;
  white-space: nowrap;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  display: block;
  text-decoration: none;
  color: black;
}

.dropdown-content a:hover {
  background-color: #f0f0f0;
}
</style>
