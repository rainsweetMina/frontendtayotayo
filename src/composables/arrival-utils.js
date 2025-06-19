import axios from 'axios'

export async function getSortedArrivalsFromApi(bsId) {
    const res = await axios.get('/api/bus/bus-arrival', { params: { bsId } })
    const body = res.data.body

    const items = Array.isArray(body?.items) ? body.items : body?.items ? [body.items] : []

    const routeMap = new Map()
    items.forEach(item => {
        const arrList = Array.isArray(item.arrList) ? item.arrList : [item.arrList]
        arrList.forEach(arr => {
            const existing = routeMap.get(item.routeNo)
            if (!existing || arr.arrTime < existing.arrTime) {
                routeMap.set(item.routeNo, { ...arr, routeNo: item.routeNo, updn: item.updn })
            }
        })
    })

    return [...routeMap.values()]
}
