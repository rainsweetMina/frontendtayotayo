import api from '@/api/axiosInstance.js'
// 광고회사 목록 (전체)
export async function fetchAdCompanies() {
    const res = await api.get('/api/ad-company')
    return res.data
}

// 광고회사 등록
export async function createAdCompany(data) {
    const res = await api.post('/api/ad-company', data)
    return res.data
}

// 광고회사 수정
export async function updateAdCompany(id, data) {
    const res = await api.put(`/api/ad-company/${id}`, data)
    return res.data
}

// 광고회사 삭제
export async function deleteAdCompany(id) {
    return api.delete(`/api/ad-company/${id}`)
}

// 광고 등록폼 드롭다운용 (id, companyName만)
export async function fetchAdCompanyDropdown() {
    const res = await api.get('/api/ad-company/dropdown')
    return res.data
}
