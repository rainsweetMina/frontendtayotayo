import axios from '@/api/axiosInstance';

export function useNoticeApi() {
  const getNotices = async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get('/api/admin/notices', {
        params: { page: page - 1, size: pageSize }
      });
      console.log('Fetched notices:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  };

  const getNoticeDetail = async (id) => {
    try {
      console.log('Fetching notice detail:', id);
      const response = await axios.get(`/api/admin/notices/${id}`);
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
      
      const response = await axios.post('/api/admin/notices', formData, {
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
      
      const response = await axios.put(`/api/admin/notices/${id}`, formData, {
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
      const response = await axios.delete(`/api/admin/notices/${id}`);
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