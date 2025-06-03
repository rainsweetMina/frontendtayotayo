// src/modules/lostFound/api/foundAdmin.js
import axios from 'axios';

const ADMIN_FOUND_API = '/api/admin/found';
const BUS_COMPANY_API = '/api/bus-companies';
const BUS_ROUTE_API = '/api/bus-routes';

// ----------------------
// 습득물 관리 관련 API
// ----------------------

// 목록 조회 (검색 조건 포함)
export const getFoundItemsForAdmin = (params) =>
    axios.get(ADMIN_FOUND_API, { params });

// 등록
export const registerFoundItem = (dto) =>
    axios.post(ADMIN_FOUND_API, dto);

// 수정
export const updateFoundItem = (id, dto) =>
    axios.put(`${ADMIN_FOUND_API}/${id}`, dto);

// 삭제
export const deleteFoundItem = (id) =>
    axios.delete(`${ADMIN_FOUND_API}/${id}`);

// 숨김
export const hideFoundItem = (id) =>
    axios.patch(`${ADMIN_FOUND_API}/${id}/hide`);

// 매칭
export const matchFoundItem = (foundId, lostId) =>
    axios.post(`${ADMIN_FOUND_API}/${foundId}/match`, { lostId });


// ----------------------------
// 버스회사 및 노선 조회 API
// ----------------------------

// 전체 버스회사 목록 조회
export const getBusCompanies = () => axios.get('/api/companies');
export const getBusRoutesByCompany = (companyId) =>
    axios.get(`/api/companies/${companyId}/routes`);
