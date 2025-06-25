import axios from '@/api/axiosInstance'

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
    // 5분 단위 데이터 시도 (최근 3시간)
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/metrics/response-time/5min/3`)
      console.log('5분 단위 API 응답 시간 데이터 원본 응답:', response.data)
      
      // 데이터 형식 변환 및 정렬
      if (Array.isArray(response.data) && response.data.length > 0) {
        const formattedData = response.data.map(item => {
          // 날짜 문자열을 Date 객체로 변환
          let timestamp;
          try {
            if (item.timestamp) {
              timestamp = new Date(item.timestamp).getTime();
            } else if (item.date) {
              timestamp = new Date(item.date).getTime();
            } else if (item.time || item.date) {
              // time이 HH:mm 형식인 경우 오늘 날짜와 결합
              const today = new Date();
              const timeStr = item.time || item.date;
              const [hours, minutes] = timeStr.split(':').map(Number);
              today.setHours(hours, minutes, 0, 0);
              timestamp = today.getTime();
            } else {
              // 타임스탬프가 없는 경우 현재 시간 사용
              timestamp = new Date().getTime();
            }
          } catch (error) {
            console.error('날짜 변환 오류:', error, item);
            timestamp = new Date().getTime();
          }
          
          // 응답 시간 값 추출
          let responseTime = 0;
          if (typeof item.averageResponseTime === 'number') {
            responseTime = item.averageResponseTime;
          } else if (typeof item.responseTime === 'number') {
            responseTime = item.responseTime;
          } else if (typeof item.value === 'number') {
            responseTime = item.value;
          }
          
          return {
            x: timestamp,
            y: responseTime
          };
        });
        
        // 유효한 데이터만 필터링 (NaN 제거)
        const validData = formattedData.filter(item => 
          !isNaN(item.x) && !isNaN(item.y) && item.x > 0
        );
        
        // 시간순 정렬
        validData.sort((a, b) => a.x - b.x);
        
        console.log('5분 단위 API 응답 시간 데이터 변환 결과:', validData);
        return validData;
      }
    } catch (error) {
      console.error('5분 단위 API 응답 시간 데이터 조회 실패:', error);
      // 5분 단위 API가 실패하면 시간별 데이터로 폴백
      console.log('시간별 데이터로 폴백합니다.');
    }
    
    // 시간별 데이터 시도
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/metrics/response-time/hourly`)
      console.log('시간별 API 응답 시간 데이터 원본 응답:', response.data)
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        const formattedData = response.data.map(item => {
          // 날짜 문자열을 Date 객체로 변환
          let timestamp;
          try {
            if (item.timestamp) {
              timestamp = new Date(item.timestamp).getTime();
            } else if (item.date) {
              timestamp = new Date(item.date).getTime();
            } else if (item.time || item.date) {
              // time이 HH:mm 형식인 경우 오늘 날짜와 결합
              const today = new Date();
              const timeStr = item.time || item.date;
              const [hours, minutes] = timeStr.split(':').map(Number);
              today.setHours(hours, minutes || 0, 0, 0);
              timestamp = today.getTime();
            } else {
              // 타임스탬프가 없는 경우 현재 시간 사용
              timestamp = new Date().getTime();
            }
          } catch (error) {
            console.error('날짜 변환 오류:', error, item);
            timestamp = new Date().getTime();
          }
          
          // 응답 시간 값 추출
          let responseTime = 0;
          if (typeof item.averageResponseTime === 'number') {
            responseTime = item.averageResponseTime;
          } else if (typeof item.responseTime === 'number') {
            responseTime = item.responseTime;
          } else if (typeof item.value === 'number') {
            responseTime = item.value;
          }
          
          return {
            x: timestamp,
            y: responseTime
          };
        });
        
        // 유효한 데이터만 필터링 (NaN 제거)
        const validData = formattedData.filter(item => 
          !isNaN(item.x) && !isNaN(item.y) && item.x > 0
        );
        
        // 시간순 정렬
        validData.sort((a, b) => a.x - b.x);
        
        console.log('시간별 API 응답 시간 데이터 변환 결과:', validData);
        return validData;
      }
    } catch (error) {
      console.error('시간별 API 응답 시간 데이터 조회 실패:', error);
      // 시간별 API도 실패하면 테스트 데이터 사용
    }
    
    // 모든 API가 실패하면 빈 배열 반환
    return []
  } catch (error) {
    console.error('API 응답 시간 데이터 조회 실패:', error)
    
    // 오류 발생 시 테스트 데이터 반환
    const now = new Date().getTime();
    const testData = [];
    
    for (let i = 0; i < 10; i++) {
      testData.push({
        x: now - (10 - i) * 60000, // 1분 간격
        y: Math.floor(Math.random() * 50) + 50 // 50-100ms 사이 랜덤 값
      });
    }
    
    console.log('API 응답 시간 테스트 데이터 생성:', testData);
    return testData;
  }
}

/**
 * 요청 처리량 데이터를 가져옵니다.
 * @returns {Promise<Array>} 시간별 요청 처리량 데이터
 */
export const getRequestVolume = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/request-volume/hourly`)
    console.log('요청 처리량 데이터 응답:', response.data)
    
    // XML 응답인 경우 처리 (List 형식의 데이터)
    if (response.data && typeof response.data === 'object' && response.data.List && response.data.List.item) {
      const items = Array.isArray(response.data.List.item) ? response.data.List.item : [response.data.List.item];
      return items.map(item => ({
        time: item.time,
        count: parseInt(item.count) || 0
      }));
    }
    
    return response.data
  } catch (error) {
    console.error('요청 처리량 데이터 조회 실패:', error)
    // 백엔드 API가 아직 없을 경우 샘플 데이터 반환
    return [
      { time: '09:00', count: 120 },
      { time: '10:00', count: 145 },
      { time: '11:00', count: 168 },
      { time: '12:00', count: 132 },
      { time: '13:00', count: 157 },
      { time: '14:00', count: 189 },
      { time: '15:00', count: 201 },
      { time: '16:00', count: 180 }
    ]
  }
}

/**
 * 에러 발생 건수 데이터를 가져옵니다.
 * @returns {Promise<Array>} 시간별 에러 발생 건수 데이터
 */
export const getErrorCounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/metrics/errors/hourly`)
    console.log('에러 발생 건수 데이터 응답:', response.data)
    
    // XML 응답인 경우 처리 (List 형식의 데이터)
    if (response.data && typeof response.data === 'object' && response.data.List && response.data.List.item) {
      const items = Array.isArray(response.data.List.item) ? response.data.List.item : [response.data.List.item];
      return items.map(item => ({
        time: item.time,
        count: parseInt(item.count) || 0
      }));
    }
    
    return response.data
  } catch (error) {
    console.error('에러 발생 건수 데이터 조회 실패:', error)
    // 백엔드 API가 아직 없을 경우 샘플 데이터 반환
    return [
      { time: '09:00', count: 3 },
      { time: '10:00', count: 2 },
      { time: '11:00', count: 5 },
      { time: '12:00', count: 1 },
      { time: '13:00', count: 4 },
      { time: '14:00', count: 2 },
      { time: '15:00', count: 3 },
      { time: '16:00', count: 2 }
    ]
  }
}

/**
 * 관리자 대시보드용 게시글 통계를 가져옵니다.
 * @returns {Promise<Object>} 게시글 통계 정보
 */
export async function getPostsStats() {
  try {
    // 먼저 새 경로로 시도
    try {
      const response = await axios.get('/api/admin/stats/posts');
      
      // 백엔드에서 삭제된 항목 통계를 제공하지 않는 경우 추가 처리
      if (response.data) {
        // 직접 각 API를 호출하여 삭제된 항목을 제외한 통계로 수정
        try {
          // QnA 데이터 (deleted=true인 항목 제외)
          const qnaResponse = await axios.get('/api/qna/admin');
          const qnaList = qnaResponse.data || [];
          const activeQnaList = qnaList.filter(item => !item.deleted);
          
          // 오늘 날짜 기준으로 필터링
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // QnA 통계 재계산 (deleted=true 제외)
          const qnaTotal = activeQnaList.length;
          const qnaToday = activeQnaList.filter(qna => {
            const createdAt = new Date(qna.createdAt);
            return createdAt >= today;
          }).length;
          
          // 광고 데이터 (status=DELETED인 항목 제외)
          const adResponse = await axios.get('/api/ad');
          const adList = adResponse.data || [];
          const activeAdList = adList.filter(item => item.status !== 'DELETED');
          
          // 광고 통계 재계산 (status=DELETED 제외)
          const adsTotal = activeAdList.length;
          const adsToday = activeAdList.filter(ad => {
            const createdAt = new Date(ad.createdAt);
            return createdAt >= today;
          }).length;
          
          // 통계 데이터 업데이트
          response.data.qna.total = qnaTotal;
          response.data.qna.today = qnaToday;
          response.data.advertisements.total = adsTotal;
          response.data.advertisements.today = adsToday;
        } catch (err) {
          console.warn('통계 데이터 수정 중 오류 발생:', err);
        }
        
        return response.data;
      }
    } catch (error) {
      // 실패하면 기존 모니터링 경로로 시도
      const response = await axios.get('/api/admin/monitoring/stats/posts');
      
      // 백엔드에서 제공하는 기본 통계가 있으면 사용
      if (response.data) {
        // 직접 각 API를 호출하여 삭제된 항목을 제외한 통계로 수정
        try {
          // QnA 데이터 (deleted=true인 항목 제외)
          const qnaResponse = await axios.get('/api/qna/admin');
          const qnaList = qnaResponse.data || [];
          const activeQnaList = qnaList.filter(item => !item.deleted);
          
          // 오늘 날짜 기준으로 필터링
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // QnA 통계 재계산 (deleted=true 제외)
          const qnaTotal = activeQnaList.length;
          const qnaToday = activeQnaList.filter(qna => {
            const createdAt = new Date(qna.createdAt);
            return createdAt >= today;
          }).length;
          
          // 광고 데이터 (status=DELETED인 항목 제외)
          const adResponse = await axios.get('/api/ad');
          const adList = adResponse.data || [];
          const activeAdList = adList.filter(item => item.status !== 'DELETED');
          
          // 광고 통계 재계산 (status=DELETED 제외)
          const adsTotal = activeAdList.length;
          const adsToday = activeAdList.filter(ad => {
            const createdAt = new Date(ad.createdAt);
            return createdAt >= today;
          }).length;
          
          // 통계 데이터 업데이트
          response.data.qna.total = qnaTotal;
          response.data.qna.today = qnaToday;
          response.data.advertisements.total = adsTotal;
          response.data.advertisements.today = adsToday;
        } catch (err) {
          console.warn('통계 데이터 수정 중 오류 발생:', err);
        }
        
        return response.data;
      }
    }
    
    // 백엔드 API가 없거나 실패한 경우, 직접 각 API를 호출하여 통계 계산
    console.log('백엔드 통계 API 사용 불가, 개별 API 호출로 통계 계산 시작');
    
    // 공지사항 데이터
    const noticesResponse = await axios.get('/api/admin/notices');
    const notices = noticesResponse.data.content || noticesResponse.data || [];
    
    // QnA 데이터 (deleted=true인 항목 제외)
    const qnaResponse = await axios.get('/api/qna/admin');
    const qnaList = qnaResponse.data || [];
    const activeQnaList = qnaList.filter(item => !item.deleted);
    
    // 광고 데이터 (status=DELETED인 항목 제외)
    const adResponse = await axios.get('/api/ad');
    const adList = adResponse.data || [];
    const activeAdList = adList.filter(item => item.status !== 'DELETED');
    
    // 오늘 날짜 기준으로 필터링
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 공지사항 통계
    const noticesTotal = notices.length;
    const noticesToday = notices.filter(notice => {
      const createdAt = new Date(notice.createdAt);
      return createdAt >= today;
    }).length;
    
    // QnA 통계 (deleted=true 제외)
    const qnaTotal = activeQnaList.length;
    const qnaToday = activeQnaList.filter(qna => {
      const createdAt = new Date(qna.createdAt);
      return createdAt >= today;
    }).length;
    
    // 광고 통계 (status=DELETED 제외)
    const adsTotal = activeAdList.length;
    const adsToday = activeAdList.filter(ad => {
      const createdAt = new Date(ad.createdAt);
      return createdAt >= today;
    }).length;
    
    return {
      notices: { today: noticesToday, total: noticesTotal },
      qna: { today: qnaToday, total: qnaTotal },
      advertisements: { today: adsToday, total: adsTotal }
    };
  } catch (error) {
    console.error('게시글 통계 조회 중 오류 발생:', error);
    // 오류 발생 시 기본값 반환
    return {
      notices: { today: 0, total: 0 },
      qna: { today: 0, total: 0 },
      advertisements: { today: 0, total: 0 }
    };
  }
}

/**
 * 관리자 대시보드용 회원 통계를 가져옵니다.
 * @returns {Promise<Object>} 회원 통계 정보
 */
export const getUserStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats/users')
    console.log('회원 통계 원본 응답:', JSON.stringify(response.data))
    
    // 증가율이 10%로 고정되어 있는 경우를 처리
    if (response.data.increaseRate === 10 && response.data.newUsersToday === 0) {
      console.log('증가율 10%와 오늘 가입 0명 감지, 증가율을 0으로 수정')
      response.data.increaseRate = 0
    }
    
    console.log('회원 통계 수정 후:', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    console.error('회원 통계 조회 중 오류 발생:', error)
    // 기본 데이터 반환
    return {
      totalUsers: 1000,
      newUsersToday: 0,
      increaseRate: 0,
      usersByType: {
        USER: 850,
        BUS: 120,
        ADMIN: 30
      }
    }
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