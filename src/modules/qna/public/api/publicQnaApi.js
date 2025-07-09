// 공개 QnA용 API
import { publicApi } from '@/api/axiosInstance';

// 전체 QnA 목록 (공개, 페이징/검색 지원)
export function fetchAllQna(page = 0, keyword = '', field = 'title') {
  return publicApi.get('/api/qna/page', {
    params: { page, keyword, field }
  }).catch(error => {
    console.error('QnA 목록 조회 실패:', error);
    throw error;
  });
}

export function fetchQnaDetail(id) {
  return publicApi.get(`/api/qna/${id}`).catch(error => {
    console.error('QnA 상세 조회 실패:', error);
    throw error;
  });
}

export function createQna(dto) {
  return publicApi.post('/api/qna/mypage', dto);
}

export function updateQna(id, dto) {
  return publicApi.post(`/api/qna/edit/${id}`, dto);
}

export function deleteQna(id) {
  return publicApi.delete(`/api/qna/view/${id}`);
} 