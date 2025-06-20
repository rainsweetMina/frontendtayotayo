import axios from 'axios'

// 광고회사 목록 (전체)
export async function fetchAdCompanies() {
    const res = await axios.get('/api/admin/ad-companies')
    return res.data
}

// 광고회사 단건 조회
export async function fetchAdCompany(id) {
    const res = await axios.get(`/api/admin/ad-companies/${id}`)
    return res.data
}

// 광고회사 등록
export async function createAdCompany(data) {
    const res = await axios.post('/api/admin/ad-companies', data)
    return res.data
}

// 광고회사 수정
export async function updateAdCompany(id, data) {
    const res = await axios.put(`/api/admin/ad-companies/${id}`, data)
    return res.data
}

// 광고회사 삭제
export async function deleteAdCompany(id) {
    return axios.delete(`/api/admin/ad-companies/${id}`)
}

// 광고 등록폼 드롭다운용 (id, companyName만)
export async function fetchAdCompanyDropdown() {
    const res = await axios.get('/api/ad-company/dropdown')

    return res.data
}
