import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://localhost:8081'

// 일주일간의 응답 시간 데이터 조회
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/response-time`)
    return response.data
  } catch (error) {
    console.error('주간 API 응답 데이터 조회 실패:', error)
    throw error
  }
}

// 시간별 응답 시간 데이터 조회
export const getApiResponseTimes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/response-time/hourly`)
    console.log('API 응답 시간 데이터 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('API 응답 시간 데이터 조회 실패:', error)
    throw error
  }
} 

// 파일 다운로드 URL 테스트 함수
export const testFileDownloadUrls = async (noticeId) => {
  const testUrls = [
    `/api/admin/notices/${noticeId}/download`,
    `/api/admin/notices/download/${noticeId}`,
    `/api/admin/files/${noticeId}`,
    `/api/admin/notices/${noticeId}/file`,
    `/api/files/notice/${noticeId}`,
  ];
  
  console.log('Testing file download URLs for notice:', noticeId);
  
  for (const url of testUrls) {
    try {
      const response = await axios.head(url); // HEAD 요청으로 확인
      console.log(`✅ URL works: ${url}`, response.status);
      return url;
    } catch (error) {
      console.log(`❌ URL failed: ${url}`, error.response?.status);
    }
  }
  
  return null;
}; 