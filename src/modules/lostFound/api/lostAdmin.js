// src/modules/lostFound/api/lostAdmin.js

import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

const ADMIN_LOST_API = '/api/admin/lost';

// ✅ 분실물 목록 조회
export const getLostItemsForAdmin = (params) =>
    axiosInstance.get(ADMIN_LOST_API, { params });

// ✅ 분실물 상세 조회
export const getLostItemDetailForAdmin = (id) =>
    axiosInstance.get(`${ADMIN_LOST_API}/${id}`);

// ✅ 숨김 처리
export const hideLostItem = (id) =>
    axiosInstance.patch(`${ADMIN_LOST_API}/hide/${id}`);

// ✅ 삭제 처리 - 경로에서 /delete 제거!
export const deleteLostItem = (id) =>
    axiosInstance.delete(`${ADMIN_LOST_API}/${id}`);

