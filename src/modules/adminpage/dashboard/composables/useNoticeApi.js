import axios from '@/api/axiosInstance';

export function useNoticeApi() {
  const getNotices = async (page = 0, pageSize = 10, searchType = '', searchKeyword = '') => {
    try {
      console.log(`API 요청: 페이지 ${page}, 사이즈 ${pageSize}, 검색타입: ${searchType}, 키워드: ${searchKeyword}`);
      
      const params = { page, size: pageSize };
      
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
      
      const response = await api.get('/api/admin/notices', { params });
      console.log('API 응답 구조:', {
        status: response.status,
        hasContent: response.data && response.data.content ? true : false,
        isArray: Array.isArray(response.data),
        dataType: typeof response.data
      });
      return response;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  };

  const getNoticeDetail = async (id) => {
    try {
      console.log('Fetching notice detail:', id);
      const response = await api.get(`/api/admin/notices/${id}`);
      console.log('Notice detail response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching notice detail:', error);
      throw error;
    }
  };

  const createNotice = async (formData) => {
    try {
      console.log('Creating notice...');
      
      // FormData 내용 확인 (디버깅용)
      console.log('FormData keys:');
      for (let key of formData.keys()) {
        console.log(`- ${key}`);
      }
      
      const response = await api.post('/api/admin/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      
      console.log('Create notice response:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating notice:', error);
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

  const updateNotice = async (id, formData) => {
    try {
      console.log('Updating notice:', id);
      
      // FormData 내용 확인 (디버깅용)
      console.log('Update FormData keys:');
      for (let key of formData.keys()) {
        console.log(`- ${key}`);
      }
      
      const response = await api.put(`/api/admin/notices/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30초 타임아웃 설정
      });
      
      console.log('Update notice response:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating notice:', error);
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

  const deleteNotice = async (id) => {
    try {
      console.log('Deleting notice:', id);
      const response = await api.delete(`/api/admin/notices/${id}`);
      console.log('Delete notice response:', response.data);
      return response;
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  };

  return {
    getNotices,
    getNoticeDetail,
    createNotice,
    updateNotice,
    deleteNotice
  };
} 