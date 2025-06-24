import busFareRoutes from '../busFare/router'
import busCompanyRoutes from '../busCompany/router'
import busStopInfoRoutes from '../busStopInfo/router'
import busScheduleRoutes from '../busSchedule/router'

const boardRoutes = [
    ...busFareRoutes,
    ...busCompanyRoutes,
    ...busStopInfoRoutes,
    ...busScheduleRoutes,
]

export default boardRoutes