import api from '@/api/axiosInstance.js'


const ADMIN_FOUND_API = '/api/admin/found';

// ✅ 습득물 목록(전체/검색) 조회 - SearchBar의 keyword 등 params 지원
export const getFoundItemsForAdmin = (params) =>
    api.get(ADMIN_FOUND_API, { params });

// ✅ 습득물 상세 조회
export const getFoundItemDetailForAdmin = (id) =>
    api.get(`${ADMIN_FOUND_API}/${id}`);

// ✅ 등록 (FormData)
export const registerFoundItem = (formData) =>
    api.post(ADMIN_FOUND_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

// ✅ 수정 (FormData)
export const updateFoundItem = (id, formData) =>
    api.post(`${ADMIN_FOUND_API}/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        },
        timeout: 30000
    });

// ✅ 삭제
export const deleteFoundItem = (id) =>
    api.delete(`${ADMIN_FOUND_API}/delete/${id}`);

// ✅ 숨김
export const hideFoundItem = (id) =>
    api.patch(`${ADMIN_FOUND_API}/hide/${id}`);

// ✅ 매칭
export const matchFoundItem = (foundId, lostId) =>
    api.patch(`${ADMIN_FOUND_API}/match/${foundId}`, null, {
        params: { lostItemId: lostId }
    });

// ✅ 버스회사 목록 조회
export const getBusCompanies = () =>
    api.get('/api/companies');

// ✅ 버스 노선 조회
export const getBusRoutesByCompany = (companyId) =>
    api.get(`/api/companies/${companyId}/routes`);
