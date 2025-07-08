import { publicApi } from '@/api/axiosInstance'

const LOST_API = '/api/lost';

export const getMyLostItems = () => publicApi.get(LOST_API);
export const getLostItem = (id) => publicApi.get(`${LOST_API}/${id}`);
export const createLostItem = (data) => publicApi.post(LOST_API, data);
export const updateLostItem = (id, data) => publicApi.put(`${LOST_API}/${id}`, data);
export const deleteLostItem = (id) => publicApi.delete(`${LOST_API}/${id}`);

export const getBusCompanies = () => publicApi.get('/api/companies');
export const getBusesByCompany = (companyId) => publicApi.get(`/api/companies/${companyId}/routes`);
// 모든 분실물 조회용 API (공개용)
export const getAllLostItems = () => publicApi.get('/api/lost/visible');
