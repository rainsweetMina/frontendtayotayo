import axios from '@/config/axios';

export function useNoticeApi() {
  const getNotices = async (page = 1, size = 10) => {
    try {
      console.log('Fetching notices:', { page, size });
      const response = await axios.get(`/api/admin/notices`, {
        params: {
          page: page - 1,  // 백엔드는 0-based pagination
          size
        }
      });
      console.log('Notices response:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching notices:', error.response?.data || error.message);
      throw error;
    }
  };

  const getNoticeDetail = async (id) => {
    try {
      console.log('Fetching notice detail for id:', id);
      
      // 먼저 목록 API를 통해 단일 공지사항을 가져오는 방법 시도
      const response = await axios.get(`/api/admin/notices`, {
        params: {
          id: id  // 백엔드가 id 파라미터를 지원하는 경우
        }
      });
      
      // 응답에서 해당 ID의 공지사항 찾기
      if (Array.isArray(response.data)) {
        const notice = response.data.find(n => n.id === parseInt(id));
        if (notice) {
          return { data: notice };
        }
      }
      
      // 만약 위 방법이 실패하면 원래 엔드포인트 시도
      console.log('Trying direct endpoint...');
    return axios.get(`/api/admin/notices/${id}`);
    } catch (error) {
      console.error('Error fetching notice detail:', error);
      
      // 다른 가능한 엔드포인트들 시도
      try {
        console.log('Trying alternative endpoint /api/admin/notice/' + id);
        return axios.get(`/api/admin/notice/${id}`); // 단수형
      } catch (altError) {
        throw error; // 원래 에러를 반환
      }
    }
  };

  const createNotice = async (noticeData) => {
    try {
      console.log('Creating notice with data:', noticeData);
      const formData = new FormData();
      
      // notice 데이터를 JSON 문자열로 변환하고 Blob으로 만들어서 전송
      const noticeObj = {
        title: noticeData.title,
        author: noticeData.author || '관리자',
        content: noticeData.content,
        showPopup: noticeData.showPopup || false,
        popupStart: noticeData.showPopup && noticeData.popupStart ? noticeData.popupStart : null,
        popupEnd: noticeData.showPopup && noticeData.popupEnd ? noticeData.popupEnd : null
      };
      
      // JSON을 Blob으로 변환하여 Content-Type 명시
      const noticeBlob = new Blob([JSON.stringify(noticeObj)], { type: 'application/json' });
      formData.append('notice', noticeBlob);
      
      if (noticeData.file) {
        formData.append('files', noticeData.file); // 'file'이 아닌 'files'로 변경
      }

      // FormData 내용 확인
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post('/api/admin/notices', formData);
      console.log('Create notice response:', response.data);
      return response;
    } catch (error) {
      console.error('Error creating notice:', error.response?.data || error.message);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
      throw error;
    }
  };

  const updateNotice = async (id, noticeData) => {
    try {
      console.log('Updating notice:', { id, noticeData });
      const formData = new FormData();
      
      // notice 데이터를 JSON 문자열로 변환하고 Blob으로 만들어서 전송
      const noticeObj = {
        title: noticeData.title,
        author: "관리자", // 기본값으로 설정
        content: noticeData.content,
        showPopup: noticeData.showPopup || false,
        popupStart: noticeData.showPopup && noticeData.popupStart ? noticeData.popupStart : null,
        popupEnd: noticeData.showPopup && noticeData.popupEnd ? noticeData.popupEnd : null
      };
      
      // JSON을 Blob으로 변환하여 Content-Type 명시
      const noticeBlob = new Blob([JSON.stringify(noticeObj)], { type: 'application/json' });
      formData.append('notice', noticeBlob);
      
      if (noticeData.file) {
        formData.append('files', noticeData.file); // 'file'이 아닌 'files'로 변경
      }

      const response = await axios.put(`/api/admin/notices/${id}`, formData);
      console.log('Update notice response:', response.data);
      return response;
    } catch (error) {
      console.error('Error updating notice:', error.response?.data || error.message);
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
      console.error('Error deleting notice:', error.response?.data || error.message);
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