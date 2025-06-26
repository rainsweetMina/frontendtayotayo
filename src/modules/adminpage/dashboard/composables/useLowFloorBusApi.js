import axios from '@/api/axiosInstance';

export function useLowFloorBusApi() {
  const getLowFloorBuses = async (page = 1, pageSize = 10, searchType = '', searchKeyword = '') => {
    try {
      console.log(`API 요청: 페이지 ${page}, 사이즈 ${pageSize}, 검색타입: ${searchType}, 키워드: ${searchKeyword}`);
      
      const params = { page: page - 1, size: pageSize };
      
      // 검색어가 있는 경우 검색 파라미터 추가
      if (searchKeyword && searchKeyword.trim() !== '') {
        if (searchType === 'title') {
          params.title = searchKeyword;
        } else if (searchType === 'content') {
          params.content = searchKeyword;
        } else {
          // 전체 검색인 경우
          params.keyword = searchKeyword;
        }
      }
      
      const response = await axios.get('/api/admin/lowfloorbuses', { params });
      console.log('API 응답 구조:', {
        status: response.status,
        hasContent: response.data && response.data.content ? true : false,
        isArray: Array.isArray(response.data),
        dataType: typeof response.data
      });
      return response;
    } catch (error) {
      console.error('Error fetching lowFloorBuses:', error);
      throw error;
    }
  };

  const getLowFloorBusDetail = async (id) => {
    try {
      console.log('Fetching lowFloorBus detail:', id);
      const response = await axios.get(`/api/admin/lowfloorbuses/${id}`);
      console.log('LowFloorBus detail response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching lowFloorBus detail:', error);
      throw error;
    }
  };

  const createLowFloorBus = async (formData) => {
    try {
      console.log('Creating lowFloorBus...');
      
      // FormData 내용 확인 (디버깅용)
      console.log('FormData keys:');
      for (let key of formData.keys()) {
        console.log(`- ${key}`);
      }
      
      const response = await axios.post('/api/admin/lowfloorbuses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      
      console.log('Create lowFloorBus response:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating lowFloorBus:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request made but no response received', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  };

  const updateLowFloorBus = async (id, formData) => {
    try {
      console.log('Updating lowFloorBus:', id);
      
      // FormData 내용 확인 (디버깅용)
      console.log('Update FormData keys:');
      for (let key of formData.keys()) {
        console.log(`- ${key}`);
      }
      
      const response = await axios.put(`/api/admin/lowfloorbuses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30초 타임아웃 설정
      });
      
      console.log('Update lowFloorBus response:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating lowFloorBus:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request made but no response received', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  };

  const deleteLowFloorBus = async (id) => {
    try {
      console.log('Deleting lowFloorBus:', id);
      const response = await axios.delete(`/api/admin/lowfloorbuses/${id}`);
      console.log('Delete lowFloorBus response:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting lowFloorBus:', error);
      throw error;
    }
  };

  return {
    getLowFloorBuses,
    getLowFloorBusDetail,
    createLowFloorBus,
    updateLowFloorBus,
    deleteLowFloorBus
  };
} 