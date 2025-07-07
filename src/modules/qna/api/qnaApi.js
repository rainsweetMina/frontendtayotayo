import axios from 'axios'

export const fetchQnaList = () => api.get('/api/qna/admin')
export const fetchQnaDetail = (id) => api.get(`/api/qna/${id}`)
export const hideQna = (id) => api.patch(`/api/qna/admin/hide/${id}`)
export const deleteQna = (id) => api.delete(`/api/qna/admin/${id}`)
export const answerQna = (id, dto) => api.put(`/api/qna/${id}/answer`, dto)
// 필요시 추가 함수 작성 