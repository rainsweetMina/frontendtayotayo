import api from '@/api/axiosInstance'

const LOST_API = '/api/lost';

export const getMyLostItems = () => api.get(LOST_API);
export const getLostItem = (id) => api.get(`${LOST_API}/${id}`);
export const createLostItem = (data) => api.post(LOST_API, data);
export const updateLostItem = (id, data) => api.put(`${LOST_API}/${id}`, data);
export const deleteLostItem = (id) => api.delete(`${LOST_API}/${id}`);

export const getBusCompanies = () => api.get('/api/companies');
export const getBusesByCompany = (companyId) => api.get(`/api/companies/${companyId}/routes`);
// 모든 분실물 조회용 API (공개용)
export const getAllLostItems = () => api.get('/api/lost/visible');
