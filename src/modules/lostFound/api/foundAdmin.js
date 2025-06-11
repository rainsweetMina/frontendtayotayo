import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
});

const ADMIN_FOUND_API = '/api/admin/found';

// ✅ 등록 (FormData 직접 받음)
export const registerFoundItem = (formData) => {
    return axiosInstance.post(ADMIN_FOUND_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// ✅ 수정 (FormData로 PUT)
export const updateFoundItem = (id, formData) => {
    console.log(`✅ 수정 API 호출: POST ${ADMIN_FOUND_API}/update/${id}`);

    const formDataCopy = new FormData();
    let hasImageFile = false;
    let dtoContent = null;

    for (let pair of formData.entries()) {
        formDataCopy.append(pair[0], pair[1]);
        if (pair[0] === 'image') {
            hasImageFile = true;
            console.log('이미지 파일 포함됨:', pair[1].name, pair[1].type, pair[1].size + ' bytes');
        } else if (pair[0] === 'dto') {
            const reader = new FileReader();
            reader.onload = () => {
                dtoContent = reader.result;
                console.log('dto 내용:', dtoContent);
            };
            reader.readAsText(pair[1]);
        }
    }

    console.log('이미지 파일 포함 여부:', hasImageFile ? '예' : '아니오');

    // ✅ 수정된 POST 요청
    return axiosInstance.post(`${ADMIN_FOUND_API}/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        },
        timeout: 30000
    }).catch(error => {
        console.error('API 오류 응답:', error.response?.data);
        console.error('API 오류 상태:', error.response?.status);
        console.error('API 오류 헤더:', error.response?.headers);

        if (error.response?.status === 500) {
            console.error('서버 내부 오류 발생. 서버 로그 확인 필요');
        }

        throw error;
    });
};


// 목록 조회
export const getFoundItemsForAdmin = (params) =>
    axiosInstance.get(ADMIN_FOUND_API, { params });

// 삭제
export const deleteFoundItem = (id) =>
    axiosInstance.delete(`${ADMIN_FOUND_API}/delete/${id}`);

// 숨김
export const hideFoundItem = (id) =>
    axiosInstance.patch(`${ADMIN_FOUND_API}/hide/${id}`);

// 매칭
export const matchFoundItem = (foundId, lostId) =>
    axiosInstance.patch(`${ADMIN_FOUND_API}/match/${foundId}`, null, {
        params: { lostItemId: lostId },
    });

// 버스회사 목록 조회
export const getBusCompanies = () =>
    axiosInstance.get('/api/companies');

// 버스 노선 조회
export const getBusRoutesByCompany = (companyId) =>
    axiosInstance.get(`/api/companies/${companyId}/routes`);
