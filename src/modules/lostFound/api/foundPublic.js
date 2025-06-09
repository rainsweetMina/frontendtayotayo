import axios from 'axios';

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

const FOUND_API = '/api/found';

// ✅ 1. 조건 검색용
export const searchFoundItems = (params) =>
    axiosInstance.get(`${FOUND_API}/search`, { params });

// ✅ 2. 전체 목록 조회 (필터 없이)
export const getFoundItems = (params) =>
    axiosInstance.get(FOUND_API, { params });

// ✅ 3. 단건 조회
export const getFoundItemById = (id) =>
    axiosInstance.get(`${FOUND_API}/${id}`);

// ✅ 4. 버스회사 목록
export const getBusCompanies = () =>
    axiosInstance.get('/api/companies');

// ✅ 5. 버스회사 ID 기반 노선 조회
export const getBusesByCompany = (companyId) =>
    axiosInstance.get(`/api/companies/${companyId}/routes`);
