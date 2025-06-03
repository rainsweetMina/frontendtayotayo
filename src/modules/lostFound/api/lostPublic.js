import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  withCredentials: true,  // 쿠키/세션 정보 포함
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'  // CSRF 보호
  }
});

const LOST_API = '/api/lost';

export const getMyLostItems = () => axiosInstance.get(LOST_API);
export const getLostItem = (id) => axiosInstance.get(`${LOST_API}/${id}`);
export const createLostItem = (data) => axiosInstance.post(LOST_API, data);
export const updateLostItem = (id, data) => axiosInstance.put(`${LOST_API}/${id}`, data);
export const deleteLostItem = (id) => axiosInstance.delete(`${LOST_API}/${id}`);

export const getBusCompanies = () => axiosInstance.get('/api/companies');
export const getBusesByCompany = (companyId) => axiosInstance.get(`/api/companies/${companyId}/routes`);
// 모든 분실물 조회용 API (공개용)
export const getAllLostItems = () => axiosInstance.get('/api/lost/visible');
