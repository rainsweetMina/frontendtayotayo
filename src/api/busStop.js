import api from './axiosInstance'

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://localhost:8081'

// 페이징과 검색이 적용된 전체 정류장 리스트 조회
export const getAllBusStops = async (keyword = '', page = 0, size = 10) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus/AllBusStop`, {
      params: { keyword, page, size }
    })
    return response.data
  } catch (error) {
    console.error('정류장 목록 조회 실패:', error)
    throw error
  }
}

// 정류장 상세 정보 조회
export const getBusStopDetail = async (bsId) => {
  try {
    const response = await api.get(`${BASE_URL}/api/bus/busStop`, {
      params: { bsId }
    })
    return response.data
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