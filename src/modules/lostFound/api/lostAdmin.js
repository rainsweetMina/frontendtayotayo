import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

const ADMIN_LOST_API = '/api/admin/lost';

// ✅ (1) 검색/필터 포함 목록 조회 (keyword 등 params)
export const getLostItemsForAdmin = (params) =>
    axiosInstance.get(ADMIN_LOST_API, { params });

// ✅ (2) 전체 목록만 조회 (파라미터 없이)
export const getAllLostItemsForAdmin = () =>
    axiosInstance.get(`${ADMIN_LOST_API}/list`);

// ✅ 상세 조회
export const getLostItemDetailForAdmin = (id) =>
    axiosInstance.get(`${ADMIN_LOST_API}/${id}`);

// ✅ 숨김 처리
export const hideLostItem = (id) =>
    axiosInstance.patch(`${ADMIN_LOST_API}/hide/${id}`);

// ✅ 삭제 처리
export const deleteLostItem = (id) =>
    axiosInstance.delete(`${ADMIN_LOST_API}/${id}`);
