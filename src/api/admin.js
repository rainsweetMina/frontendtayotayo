import api from '@/api/axiosInstance'

// 일주일간의 응답 시간 데이터 조회
export const getDashboardStats = async () => {
  try {
    const response = await api.get(`/api/admin/metrics/response-time`)
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
      const response = await api.get(`/api/admin/metrics/response-time/5min/3`)
      console.log('5분 단위 API 응답 시간 데이터 원본 응답:', response.data)
      
      // 원본 데이터가 있으면 그대로 반환
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (error) {
      console.error('5분 단위 API 응답 시간 데이터 조회 실패:', error);
      // 5분 단위 API가 실패하면 시간별 데이터로 폴백
      console.log('시간별 데이터로 폴백합니다.');
    }
    
    // 시간별 데이터 시도
    try {
      const response = await api.get(`/api/admin/metrics/response-time/hourly`)
      console.log('시간별 API 응답 시간 데이터 원본 응답:', response.data)
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
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
    const testData = [
      {date: '09:00', averageResponseTime: 60.5},
      {date: '09:05', averageResponseTime: 82.3},
      {date: '09:10', averageResponseTime: 95.1},
      {date: '09:15', averageResponseTime: 57.8},
      {date: '09:20', averageResponseTime: 85.2},
      {date: '09:25', averageResponseTime: 70.9},
      {date: '09:30', averageResponseTime: 50.4},
      {date: '09:35', averageResponseTime: 75.6},
      {date: '09:40', averageResponseTime: 90.3},
      {date: '09:45', averageResponseTime: 65.7}
    ];
    
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
    // XML 응답을 직접 처리하기 위해 responseType을 text로 설정
    const response = await api.get(`/api/admin/metrics/request-volume/hourly`, {
      responseType: 'text',
      transformResponse: [data => data] // 자동 변환 방지
    });
    
    console.log('요청 처리량 데이터 원본 응답:', response.data);
    
    // XML 응답인 경우 처리
    if (typeof response.data === 'string' && response.data.includes('<?xml')) {
      console.log('XML 형식 응답 감지, 수동 파싱 시도');
      
      try {
        // XML 응답을 수동으로 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const items = xmlDoc.getElementsByTagName('item');
        
        const result = [];
        for (let i = 0; i < items.length; i++) {
          const timeElement = items[i].getElementsByTagName('time')[0];
          const countElement = items[i].getElementsByTagName('count')[0];
          
          if (timeElement && countElement) {
            result.push({
              time: timeElement.textContent,
              count: parseInt(countElement.textContent) || 0
            });
          }
        }
        
        console.log('XML 파싱 결과:', result);
        return result;
      } catch (parseError) {
        console.error('XML 파싱 오류:', parseError);
        
        // 정규식으로 간단히 파싱 시도
        const timeMatches = response.data.match(/<time>([^<]+)<\/time>/g);
        const countMatches = response.data.match(/<count>([^<]+)<\/count>/g);
        
        if (timeMatches && countMatches && timeMatches.length === countMatches.length) {
          const result = [];
          
          for (let i = 0; i < timeMatches.length; i++) {
            const time = timeMatches[i].replace(/<time>|<\/time>/g, '');
            const count = parseInt(countMatches[i].replace(/<count>|<\/count>/g, '')) || 0;
            
            result.push({ time, count });
          }
          
          console.log('정규식 파싱 결과:', result);
          return result;
        }
      }
    }
    
    // JSON 응답 처리 시도
    try {
      const jsonData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      
      // XML이 JSON으로 변환된 형태 (List.item 구조)
      if (jsonData && jsonData.List && jsonData.List.item) {
        const items = Array.isArray(jsonData.List.item) ? jsonData.List.item : [jsonData.List.item];
        const result = items.map(item => ({
          time: item.time,
          count: parseInt(item.count) || 0
        }));
        console.log('List.item 구조 파싱 결과:', result);
        return result;
      }
      
      // 일반 JSON 배열 형식
      if (Array.isArray(jsonData)) {
        const result = jsonData.map(item => ({
          time: item.time || '',
          count: item.count || item.value || 0
        }));
        console.log('JSON 배열 파싱 결과:', result);
        return result;
      }
      
      console.warn('알 수 없는 JSON 응답 형식:', jsonData);
      return jsonData;
    } catch (jsonError) {
      console.error('JSON 파싱 오류:', jsonError);
    }
    
    console.warn('응답 데이터 파싱 실패, 원본 반환:', response.data);
    return [];
  } catch (error) {
    console.error('요청 처리량 데이터 조회 실패:', error)
    // 백엔드 API가 아직 없을 경우 샘플 데이터 반환
    return [
      { time: '20:00', count: 120 },
      { time: '21:00', count: 145 },
      { time: '22:00', count: 168 },
      { time: '23:00', count: 157 }
    ]
  }
}

/**
 * 에러 발생 건수 데이터를 가져옵니다.
 * @returns {Promise<Array>} 시간별 에러 발생 건수 데이터
 */
export const getErrorCounts = async () => {
  try {
    // XML 응답을 직접 처리하기 위해 responseType을 text로 설정
    const response = await api.get(`/api/admin/metrics/errors/hourly`, {
      responseType: 'text',
      transformResponse: [data => data] // 자동 변환 방지
    });
    
    console.log('에러 발생 건수 데이터 원본 응답:', response.data);
    
    // XML 응답인 경우 처리
    if (typeof response.data === 'string' && response.data.includes('<?xml')) {
      console.log('XML 형식 응답 감지, 수동 파싱 시도');
      
      try {
        // XML 응답을 수동으로 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const items = xmlDoc.getElementsByTagName('item');
        
        const result = [];
        for (let i = 0; i < items.length; i++) {
          const timeElement = items[i].getElementsByTagName('time')[0];
          const countElement = items[i].getElementsByTagName('count')[0];
          
          if (timeElement && countElement) {
            result.push({
              time: timeElement.textContent,
              count: parseInt(countElement.textContent) || 0
            });
          }
        }
        
        console.log('XML 파싱 결과:', result);
        return result;
      } catch (parseError) {
        console.error('XML 파싱 오류:', parseError);
        
        // 정규식으로 간단히 파싱 시도
        const timeMatches = response.data.match(/<time>([^<]+)<\/time>/g);
        const countMatches = response.data.match(/<count>([^<]+)<\/count>/g);
        
        if (timeMatches && countMatches && timeMatches.length === countMatches.length) {
          const result = [];
          
          for (let i = 0; i < timeMatches.length; i++) {
            const time = timeMatches[i].replace(/<time>|<\/time>/g, '');
            const count = parseInt(countMatches[i].replace(/<count>|<\/count>/g, '')) || 0;
            
            result.push({ time, count });
          }
          
          console.log('정규식 파싱 결과:', result);
          return result;
        }
      }
    }
    
    // JSON 응답 처리 시도
    try {
      const jsonData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      
      // XML이 JSON으로 변환된 형태 (List.item 구조)
      if (jsonData && jsonData.List && jsonData.List.item) {
        const items = Array.isArray(jsonData.List.item) ? jsonData.List.item : [jsonData.List.item];
        const result = items.map(item => ({
          time: item.time,
          count: parseInt(item.count) || 0
        }));
        console.log('List.item 구조 파싱 결과:', result);
        return result;
      }
      
      // 일반 JSON 배열 형식
      if (Array.isArray(jsonData)) {
        const result = jsonData.map(item => ({
          time: item.time || '',
          count: item.count || item.value || 0
        }));
        console.log('JSON 배열 파싱 결과:', result);
        return result;
      }
      
      console.warn('알 수 없는 JSON 응답 형식:', jsonData);
      return jsonData;
    } catch (jsonError) {
      console.error('JSON 파싱 오류:', jsonError);
    }
    
    console.warn('응답 데이터 파싱 실패, 원본 반환:', response.data);
    return [];
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
      const response = await api.get('/api/admin/stats/posts');
      
      // 백엔드에서 삭제된 항목 통계를 제공하지 않는 경우 추가 처리
      if (response.data) {
        // 직접 각 API를 호출하여 삭제된 항목을 제외한 통계로 수정
        try {
          // QnA 데이터 (deleted=true인 항목 제외)
          const qnaResponse = await api.get('/api/qna/admin');
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
          const adResponse = await api.get('/api/ad');
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
      const response = await api.get('/api/admin/monitoring/stats/posts');
      
      // 백엔드에서 제공하는 기본 통계가 있으면 사용
      if (response.data) {
        // 직접 각 API를 호출하여 삭제된 항목을 제외한 통계로 수정
        try {
          // QnA 데이터 (deleted=true인 항목 제외)
          const qnaResponse = await api.get('/api/qna/admin');
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
          const adResponse = await api.get('/api/ad');
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
    const noticesResponse = await api.get('/api/admin/notices');
    const notices = noticesResponse.data.content || noticesResponse.data || [];
    
    // QnA 데이터 (deleted=true인 항목 제외)
    const qnaResponse = await api.get('/api/qna/admin');
    const qnaList = qnaResponse.data || [];
    const activeQnaList = qnaList.filter(item => !item.deleted);
    
    // 광고 데이터 (status=DELETED인 항목 제외)
    const adResponse = await api.get('/api/ad');
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
    const response = await api.get('/api/admin/stats/users')
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
      const response = await api.head(url); // HEAD 요청으로 확인
      console.log(`✅ URL works: ${url}`, response.status);
      return url;
    } catch (error) {
      console.log(`❌ URL failed: ${url}`, error.response?.status);
    }
  }
  
  return null;
}; 

/**
 * 관리자 감사 로그를 가져옵니다.
 * @param {number} limit - 가져올 로그 개수 (기본값: 10)
 * @returns {Promise<Array>} 관리자 로그 목록
 */
export const getAdminLogs = async (limit = 10) => {
  try {
    const response = await api.get('/api/admin/logs', {
      params: { page: 0, size: limit }
    });
    
    console.log('관리자 로그 원본 응답:', response.data);
    
    // Page 객체에서 content 추출
    const logs = response.data.content || response.data || [];
    
    // user 활동 및 버스 회사 조회 로그 필터링
    const filteredLogs = logs.filter(log => {
      // user 활동 제외
      if (log.adminId &&
          (log.adminId.toLowerCase() === 'user' ||
              log.adminId.toLowerCase() === 'anonymoususer')) {
        return false;
      }

      // 버스 회사 조회 로그 제외
      if (log.action && log.target &&
          (log.action.includes('조회') || log.action.includes('확인') || log.action.includes('검색')) &&
          (log.target.includes('버스') || log.target.includes('Bus') ||
              log.target.includes('bus') || log.target.includes('BusCompany') ||
              log.target.includes('버스회사'))) {
        return false;
      }

      return true;
    });
    
    console.log('필터링된 관리자 로그:', filteredLogs);
    return filteredLogs;
  } catch (error) {
    console.error('관리자 로그 조회 중 오류 발생:', error);
    return [];
  }
}; 

/**
 * 시스템 로그 다운로드
 * @returns {Promise<Blob>} Excel 파일 Blob
 */
export const downloadSystemLogs = async () => {
  try {
    const response = await api.get('/api/admin/logs/download', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('시스템 로그 다운로드 실패:', error)
    throw error
  }
} 