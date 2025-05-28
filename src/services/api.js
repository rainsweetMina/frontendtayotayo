import axios from 'axios'

const API_BASE = 'https://localhost:8094/api'

export async function getAllRoutes() {
    const res = await axios.get(`${API_BASE}/bus/routes`)
    console.log(res.data)
    return res.data.content
}

export async function getRouteStops(routeId) {
    const res = await axios.get(`${API_BASE}/bus/routes/${routeId}/stops`)
    return res.data.content
}
