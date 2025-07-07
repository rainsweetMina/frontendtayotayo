import api from '@/api/axiosInstance'

const FOUND_API = '/api/found';

// ✅ 1. 조건 검색용
export const searchFoundItems = (params) =>
    api.get(`${FOUND_API}/search`, { params });

// ✅ 2. 전체 목록 조회 (필터 없이)
export const getFoundItems = (params) =>
    api.get(FOUND_API, { params });

// ✅ 3. 단건 조회
export const getFoundItemById = (id) =>
    api.get(`${FOUND_API}/${id}`);

// ✅ 4. 버스회사 목록
export const getBusCompanies = () =>
    api.get('/api/companies');

// ✅ 5. 버스회사 ID 기반 노선 조회
export const getBusesByCompany = (companyId) =>
    api.get(`/api/companies/${companyId}/routes`);
