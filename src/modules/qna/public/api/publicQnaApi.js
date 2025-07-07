// 공개 QnA용 API
import axios from '@/api/axiosInstance';

// 전체 QnA 목록 (공개, 페이징/검색 지원)
export function fetchAllQna(page = 0, keyword = '', field = 'title') {
  return api.get('/api/qna/page', {
    params: { page, keyword, field }
  });
}

export function fetchQnaDetail(id) {
  return api.get(`/api/qna/${id}`);
}

export function createQna(dto) {
  return api.post('/api/qna/mypage', dto);
}

export function updateQna(id, dto) {
  return api.post(`/api/qna/edit/${id}`, dto);
}

export function deleteQna(id) {
  return api.delete(`/api/qna/view/${id}`);
} 