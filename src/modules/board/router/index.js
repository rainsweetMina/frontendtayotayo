import busFareRoutes from '../busFare/router'
import busCompanyRoutes from '../busCompany/router'
import busStopInfoRoutes from '../busStopInfo/router'

const boardRoutes = [
    ...busFareRoutes,
    ...busCompanyRoutes,
    ...busStopInfoRoutes,
]

export default boardRoutes