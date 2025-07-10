// stores/auth.js
import { defineStore } from 'pinia'
import api from '@/api/axiosInstance'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        id: null,
        role: null,
        username: null,
        userId: null,
        email: null,

        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,   // epoch(ms)
        isLoggedIn: false,
    }),

    getters: {
        hasValidToken: state => {
            if (!state.accessToken) return false
            if (!state.tokenExpiry) return false
            return Date.now() < state.tokenExpiry
        },
        isAdmin: state => state.role === 'ADMIN',
        isBus:   state => state.role === 'BUS',
        isUser:  state => state.role === 'USER',
    },

    actions: {
        /* ───────── 세션 동기화 ───────── */
        async syncSession() {
            this.restoreTokens()
            if (!this.hasValidToken) {
                this.logout()
                return
            }
            try {
                const { data } = await api.get('/api/user/info', { withCredentials: true })
                Object.assign(this, data, { isLoggedIn: true })
            } catch {
                this.logout()
            }
        },

        /* ───────── 로그인 성공 시 ───────── */
        login(payload) {
            console.log('[auth] login 호출됨:', {
                hasAccessToken: !!payload.accessToken,
                hasRefreshToken: !!payload.refreshToken,
                expiresIn: payload.expiresIn,
                userId: payload.userId,
                role: payload.role
            })
            
            this.setTokens(payload.accessToken, payload.refreshToken, payload.expiresIn)
            Object.assign(this, payload, { isLoggedIn: true })
            
            console.log('[auth] login 완료:', {
                accessToken: !!this.accessToken,
                refreshToken: !!this.refreshToken,
                isLoggedIn: this.isLoggedIn,
                role: this.role
            })
        },

        /* ───────── 토큰 저장 (만료 포함) ───────── */
        setTokens(accessToken, refreshToken, expiresIn = 3600) {
            console.log('[auth] setTokens 호출됨:', {
                accessToken: !!accessToken,
                refreshToken: !!refreshToken,
                expiresIn
            })
            
            this.accessToken  = accessToken
            this.refreshToken = refreshToken
            this.tokenExpiry  = Date.now() + expiresIn * 1000

            try {
                localStorage.setItem('accessToken',  accessToken ?? '')
                localStorage.setItem('refreshToken', refreshToken ?? '')
                localStorage.setItem('tokenExpiry',  String(this.tokenExpiry))
                console.log('[auth] localStorage 저장 성공')
            } catch (error) {
                console.error('[auth] localStorage 저장 실패:', error)
            }
            
            console.log('[auth] setTokens 완료:', {
                accessToken: !!this.accessToken,
                refreshToken: !!this.refreshToken,
                tokenExpiry: this.tokenExpiry
            })
        },

        /* ✅ LoginView 호환용 헬퍼 */
        setAccessToken(token, expiresIn = 3600) {
            // refreshToken 없이 accessToken만 갱신할 때 사용
            this.setTokens(token, this.refreshToken, expiresIn)
        },

        /* ───────── 토큰 복원 ───────── */
        restoreTokens() {
            this.accessToken  = localStorage.getItem('accessToken')
            this.refreshToken = localStorage.getItem('refreshToken')
            this.tokenExpiry  = Number(localStorage.getItem('tokenExpiry')) || null

            // 기존 'token' 키가 있으면 'accessToken'으로 마이그레이션 (호환성)
            const oldToken = localStorage.getItem('token')
            if (oldToken && !this.accessToken) {
                this.accessToken = oldToken
                localStorage.setItem('accessToken', oldToken)
                localStorage.removeItem('token')
                console.log('[auth] 기존 token을 accessToken으로 마이그레이션 완료')
            }
        },

        /* ───────── 로그아웃 ───────── */
        logout() {
            this.$reset()
            localStorage.removeItem('auth')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('tokenExpiry')
            // 기존 'token' 키도 제거 (호환성)
            localStorage.removeItem('token')
        },
    },

    /* persist 설정 (isLoggedIn만 선택 저장) */
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',
                storage: localStorage,
                paths: ['isLoggedIn'],
            },
        ],
    },
})
