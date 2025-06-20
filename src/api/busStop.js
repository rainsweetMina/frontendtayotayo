import api from './axiosInstance'

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://localhost:8081'

// 페이징과 검색이 적용된 전체 정류장 리스트 조회
export const getAllBusStops = async (keyword = '', page = 0, size = 10) => {
  try {
    // page가 NaN인 경우 기본값 0으로 설정
    const validPage = isNaN(page) ? 0 : page;
    const validSize = isNaN(size) ? 10 : size;
    
    console.log('API 호출 파라미터:', { keyword, page: validPage, size: validSize });
    
    // 대량의 데이터를 요청하는 경우 서버에 부하가 가지 않도록 경고 로그 추가
    if (validSize > 1000) {
      console.warn(`대용량 데이터 요청: ${validSize}개의 정류장을 요청합니다. 서버 부하와 성능에 영향을 줄 수 있습니다.`);
    }
    
    const response = await api.get(`${BASE_URL}/api/bus/AllBusStop`, {
      params: { 
        keyword, 
        page: validPage, 
        size: validSize 
      },
      // 대량의 데이터를 요청하는 경우 타임아웃 시간 증가
      timeout: validSize > 1000 ? 30000 : 10000
    })
    
    // 응답 데이터 로깅 (대용량 데이터인 경우 일부만 로깅)
    if (response.data && response.data.content) {
      console.log(`정류장 목록 응답: 총 ${response.data.totalElements || response.data.content.length}개 정류장 중 ${response.data.content.length}개 로드됨`);
      if (response.data.content.length > 0) {
        console.log('정류장 목록 첫 번째 항목 원본:', response.data.content[0]);
      }
    } else {
      console.log('정류장 목록 원본 응답:', response.data);
    }
    
    // 데이터 형식 확인 및 가공
    const result = response.data;
    
    // 필요한 경우 데이터 구조 변환
    if (result.content && Array.isArray(result.content)) {
      // 대용량 데이터 처리 시 로깅 최소화
      const shouldLogDetails = result.content.length <= 100;
      
      if (shouldLogDetails && result.content.length > 0) {
        console.log('정류장 목록 첫 번째 항목 원본:', result.content[0]);
      }
      
      // 데이터 변환 최적화 (불필요한 로깅 제거)
      result.content = result.content.map(stop => {
        // 좌표 정보가 문자열이면 숫자로 변환 시도
        let xposValue = stop.xPos !== undefined ? stop.xPos : stop.xpos; // 대소문자 모두 확인
        let yposValue = stop.yPos !== undefined ? stop.yPos : stop.ypos; // 대소문자 모두 확인
        
        if (typeof xposValue === 'string' && xposValue.trim() !== '') {
          xposValue = parseFloat(xposValue);
        }
        
        if (typeof yposValue === 'string' && yposValue.trim() !== '') {
          yposValue = parseFloat(yposValue);
        }
        
        return {
          ...stop,
          // 일관된 필드명으로 통일 (소문자 버전)
          xpos: xposValue !== undefined && xposValue !== null ? xposValue : '',
          ypos: yposValue !== undefined && yposValue !== null ? yposValue : '',
          // 원본 필드도 유지
          xPos: xposValue !== undefined && xposValue !== null ? xposValue : '',
          yPos: yposValue !== undefined && yposValue !== null ? yposValue : ''
        };
      });
      
      if (shouldLogDetails && result.content.length > 0) {
        console.log('정류장 목록 첫 번째 항목 가공 후:', result.content[0]);
      }
    }
    
    return result;
  } catch (error) {
    console.error('정류장 목록 조회 실패:', error);
    throw error;
  }
}

// 정류장 상세 정보 조회
export const getBusStopDetail = async (bsId) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus/busStop`, {
      params: { bsId }
    })
    
    // 응답 데이터 로깅
    console.log('정류장 상세 정보 응답:', response.data)
    
    // 데이터 가공 - 필요한 필드가 없는 경우 기본값 설정
    const data = response.data || {}
    
    // 주소 정보 처리
    return {
      ...data,
      // 주소 정보 매핑 (백엔드 응답 구조에 따라 조정)
      sido: data.si_do || data.sido || data.city || '',
      gugun: data.gu_gun || data.gugun || data.gu || data.district || '',
      dong: data.eup_myeon_dong || data.dong || data.neighborhood || ''
    }
  } catch (error) {
    console.error('정류장 상세 정보 조회 실패:', error)
    throw error
  }
}

// 정류장 추가
export const addBusStop = async (busStopData) => {
  try {
    const response = await api.post(`${BASE_URL}/api/bus/addBusStop`, busStopData)
    return response.data
  } catch (error) {
    console.error('정류장 추가 실패:', error)
    throw error
  }
}

// 정류장 정보 수정
export const updateBusStop = async (bsId, busStopData) => {
  try {
    const response = await api.put(`${BASE_URL}/api/bus/updateStop/${bsId}`, busStopData)
    return response.data
  } catch (error) {
    console.error('정류장 정보 수정 실패:', error)
    throw error
  }
}

// 정류장 삭제
export const deleteBusStop = async (bsId) => {
  try {
    const response = await api.delete(`${BASE_URL}/api/bus/deleteBusStop`, {
      params: { bsId }
    })
    return response.data
  } catch (error) {
    console.error('정류장 삭제 실패:', error)
    throw error
  }
}

// 정류장에 오는 노선 조회
export const getRoutesForBusStop = async (bsId) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus/RouteByBS`, {
      params: { bsId }
    })
    return response.data
  } catch (error) {
    console.error('정류장 노선 조회 실패:', error)
    throw error
  }
}

// 정류장 검색 (키워드로 검색)
export const searchBusStops = async (keyword) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus/searchBS`, {
      params: { keyword }
    })
    return response.data
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    throw error
  }
}

// 구 목록 조회
export const getDistricts = async () => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus-info/districts`)
    return response.data
  } catch (error) {
    console.error('구 목록 조회 실패:', error)
    throw error
  }
}

// 동 목록 조회
export const getNeighborhoods = async (district) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus-info/neighborhoods`, {
      params: { district }
    })
    return response.data
  } catch (error) {
    console.error('동 목록 조회 실패:', error)
    throw error
  }
}

// 정류소 정보 조회 (구/동 기준)
export const searchBusStopsByDistrict = async (district, neighborhood) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus-info/search`, {
      params: { district, neighborhood }
    })
    return response.data
  } catch (error) {
    console.error('정류소 정보 조회 실패:', error)
    throw error
  }
}

// 노선 유형에 해당하는 노선 번호 목록 반환
export const getRouteNosByType = async (type) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus-info/route-nos`, {
      params: { type }
    })
    return response.data
  } catch (error) {
    console.error('노선 번호 목록 조회 실패:', error)
    throw error
  }
}

// 노선 번호로 정류소 목록 조회
export const getStopsByRouteNo = async (routeNo) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus-info/search-by-route`, {
      params: { routeNo }
    })
    return response.data
  } catch (error) {
    console.error('노선별 정류소 목록 조회 실패:', error)
    throw error
  }
} 