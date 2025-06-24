import axios from "axios";

export async function fetchRouteStops(routeId) {
    const res = await axios.get(`/api/bus/route-stop-link?routeId=${routeId}`)
    return res.data // [{ seq: 1, bsNm: '...', bsId: '...' }, ...]
}

export async function fetchScheduleTable(routeId, direction, type) {
    const res = await axios.get('/api/bus/schedule', {
        params: { routeId, direction, type }
    })
    return res.data
}

export async function fetchRouteList() {
    const res = await axios.get('/api/bus/routes')
    return res.data.content  // 방어적으로 처리
}

export async function fetchRouteDirections(routeNo) {
    const res = await axios.get(`/api/bus/directions?routeNo=${routeNo}`)
    return res.data  // { type: 'routeNote' | 'moveDir', directions: [...] }
}

export async function fetchRouteIdByDirection(routeNo, direction, type) {
    const res = await axios.get('/api/route-id/resolve', {
        params: { routeNo, direction, type }
    });
    return res.data; // { routeId: '...' }
}
