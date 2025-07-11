// adApi.js (수정본)
import api from "@/api/axiosInstance.js";

// 광고 목록 조회
export async function fetchAds() {
    const res = await api.get('/api/ad')
    return res.data
}

// 광고 단건 조회
export async function fetchAd(id) {
    const res = await api.get(`/api/ad/${id}`)
    return res.data
}

// 광고 등록
export async function createAd(data) {
    console.log('🟡 data--post--->:', data);
    const res = await api.multipartPut('https://docs.yi.or.kr:8096/api/ad', data.dto, data.files, 'dto', 'image')
    return res.data
}

 // ({ url, dto, files, dtoKey = 'dto', fileKey = 'images' }) {

// 광고 수정
export async function updateAd(id, data) {
    console.log('🟡 data- put---->:', data);
    const res = await api.multipartPut(`https://docs.yi.or.kr:8096/api/ad/${id}`, data.dto, data.files, 'dto', 'image')
    return res.data
}

// 광고 삭제
export async function deleteAd(id) {
    return api.delete(`/api/ad/${id}`)
}

// 광고 연장
export async function extendAd(adId, newEndDateTime) {
    return await api.multipartPut(`/api/ad/${adId}/extend`, {
        newEndDateTime: newEndDateTime
    });
}


// 광고 연장, 통계 등은 백엔드 엔드포인트에 맞게 추가!
