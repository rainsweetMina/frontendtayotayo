import axios from 'axios'

export const fetchQnaList = () => axios.get('/api/qna/admin')
export const fetchQnaDetail = (id) => axios.get(`/api/qna/${id}`)
export const hideQna = (id) => axios.patch(`/api/qna/admin/hide/${id}`)
export const deleteQna = (id) => axios.delete(`/api/qna/admin/${id}`)
export const answerQna = (id, dto) => axios.put(`/api/qna/${id}/answer`, dto)
// 필요시 추가 함수 작성 