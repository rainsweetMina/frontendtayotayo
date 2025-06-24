import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        id: null,
        role: null,
        username: null,
        userId: null,
        email: null,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        isAdmin: (state) => state.role === 'ADMIN',
        isUser: (state) => state.role === 'USER',
        isTokenExpired: (state) => {
            if (!state.tokenExpiry) return true;
            return new Date().getTime() > state.tokenExpiry;
        }
    },

    actions: {
        login({ id = null, role = null, username = '', userId = '', email = '', accessToken = null, refreshToken = null, expiresIn = 3600 }) {
            this.id = id;
            this.role = role;
            this.username = username;
            this.userId = userId;
            this.email = email;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            
            // 토큰 만료 시간 설정 (초 단위)
            if (expiresIn) {
                this.tokenExpiry = new Date().getTime() + (expiresIn * 1000);
            }
            
            // JWT 토큰을 localStorage에 저장
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            }
            
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        },

        setTokens(accessToken, refreshToken, expiresIn = 3600) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            
            // 토큰 만료 시간 설정 (초 단위)
            if (expiresIn) {
                this.tokenExpiry = new Date().getTime() + (expiresIn * 1000);
            }
            
            // localStorage에 토큰 저장
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
            } else {
                localStorage.removeItem('accessToken');
            }
            
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }
        },

        setAccessToken(token, expiresIn = 3600) {
            this.accessToken = token;
            
            // 토큰 만료 시간 설정 (초 단위)
            if (expiresIn) {
                this.tokenExpiry = new Date().getTime() + (expiresIn * 1000);
            }
            
            if (token) {
                localStorage.setItem('accessToken', token);
            } else {
                localStorage.removeItem('accessToken');
            }
        },

        logout(clearAll = true) {
            this.$reset();                         // ✅ Pinia 상태 초기화
            localStorage.removeItem('auth');       // ✅ persist 저장소도 함께 제거
            
            if (clearAll) {
                localStorage.removeItem('accessToken');  // ✅ accessToken 제거
                localStorage.removeItem('refreshToken'); // ✅ refreshToken 제거
            }
        },

        // 로컬 스토리지에서 토큰 복원
        restoreTokens() {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (accessToken) {
                this.accessToken = accessToken;
            }
            
            if (refreshToken) {
                this.refreshToken = refreshToken;
            }
        },

        init() {
            // 로컬 스토리지에서 토큰 복원
            this.restoreTokens();
            
            // 인증 상태 확인
            if (!this.accessToken) {
                this.logout(true);
            }
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',                         // ✅ 이 key 이름과 removeItem 대상 일치해야 함
                storage: localStorage,
                paths: ['id', 'role', 'username', 'userId', 'email', 'tokenExpiry']
                // 토큰은 별도로 localStorage에 저장하므로 여기서는 제외
            }
        ]
    }
})
